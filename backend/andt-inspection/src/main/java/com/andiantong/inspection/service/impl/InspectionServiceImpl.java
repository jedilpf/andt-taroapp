package com.andiantong.inspection.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.common.utils.OrderNoGenerator;
import com.andiantong.inspection.entity.InspectionItem;
import com.andiantong.inspection.entity.InspectionOrder;
import com.andiantong.inspection.entity.InspectionQuota;
import com.andiantong.inspection.entity.InspectionReport;
import com.andiantong.inspection.mapper.InspectionItemMapper;
import com.andiantong.inspection.mapper.InspectionOrderMapper;
import com.andiantong.inspection.mapper.InspectionQuotaMapper;
import com.andiantong.inspection.mapper.InspectionReportMapper;
import com.andiantong.inspection.service.InspectionService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InspectionServiceImpl extends ServiceImpl<InspectionOrderMapper, InspectionOrder> implements InspectionService {

    private final InspectionOrderMapper orderMapper;
    private final InspectionQuotaMapper quotaMapper;
    private final InspectionReportMapper reportMapper;
    private final InspectionItemMapper itemMapper;

    @Override
    public InspectionQuota checkQuota(Long userId) {
        InspectionQuota quota = quotaMapper.selectByUserId(userId);
        if (quota == null) {
            // 初始化用户资格
            quota = new InspectionQuota();
            quota.setUserId(userId);
            quota.setQuotaType("first_free");
            quota.setTotalCount(1);
            quota.setUsedCount(0);
            quota.setRemainingCount(1);
            quotaMapper.insert(quota);
        }
        return quota;
    }

    @Override
    @Transactional
    public InspectionOrder createOrder(Long userId, InspectionOrder order) {
        // 检查资格
        InspectionQuota quota = checkQuota(userId);

        // 生成订单号
        order.setOrderNo(OrderNoGenerator.generateInspectionOrderNo());
        order.setUserId(userId);
        order.setStatus("PENDING");

        // 判断是否免费
        if (quota.getRemainingCount() > 0) {
            order.setIsFree(true);
            order.setPrice(BigDecimal.ZERO);

            // 更新资格
            quota.setUsedCount(quota.getUsedCount() + 1);
            quota.setRemainingCount(quota.getRemainingCount() - 1);
            quotaMapper.updateById(quota);
        } else {
            order.setIsFree(false);
            order.setPrice(new BigDecimal("199.00"));
        }

        orderMapper.insert(order);
        return order;
    }

    @Override
    public List<InspectionOrder> getUserOrders(Long userId) {
        LambdaQueryWrapper<InspectionOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InspectionOrder::getUserId, userId)
               .orderByDesc(InspectionOrder::getCreateTime);
        return orderMapper.selectList(wrapper);
    }

    @Override
    public InspectionOrder getOrderDetail(Long orderId) {
        return orderMapper.selectById(orderId);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!"PENDING".equals(order.getStatus())) {
            throw new BusinessException("订单状态不允许取消");
        }
        order.setStatus("CANCELLED");
        orderMapper.updateById(order);
    }

    @Override
    public List<InspectionOrder> getPendingOrders() {
        LambdaQueryWrapper<InspectionOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InspectionOrder::getStatus, "PENDING")
               .orderByDesc(InspectionOrder::getCreateTime);
        return orderMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void acceptOrder(Long orderId, Long electricianId) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!"PENDING".equals(order.getStatus())) {
            throw new BusinessException("订单已被接单");
        }

        order.setElectricianId(electricianId);
        order.setStatus("ACCEPTED");
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void arriveOrder(Long orderId) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!"ACCEPTED".equals(order.getStatus())) {
            throw new BusinessException("订单状态不正确");
        }
        order.setStatus("ARRIVED");
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void startInspection(Long orderId) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!"ARRIVED".equals(order.getStatus())) {
            throw new BusinessException("订单状态不正确");
        }
        order.setStatus("IN_PROGRESS");
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        order.setStatus(status);
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void submitReport(Long orderId, InspectionReport report, List<InspectionItem> items) {
        InspectionOrder order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }

        // 生成报告编号
        report.setReportNo(OrderNoGenerator.generateReportNo());
        report.setOrderId(orderId);
        report.setUserId(order.getUserId());
        report.setElectricianId(order.getElectricianId());
        report.setReportTime(LocalDateTime.now());

        reportMapper.insert(report);

        // 保存检测项
        if (items != null && !items.isEmpty()) {
            for (InspectionItem item : items) {
                item.setReportId(report.getId());
                itemMapper.insert(item);
            }
        }

        // 更新订单状态
        order.setStatus("COMPLETED");
        order.setReportId(report.getId());
        orderMapper.updateById(order);
    }

    @Override
    public InspectionReport getReport(Long orderId) {
        LambdaQueryWrapper<InspectionReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InspectionReport::getOrderId, orderId);
        return reportMapper.selectOne(wrapper);
    }
}
