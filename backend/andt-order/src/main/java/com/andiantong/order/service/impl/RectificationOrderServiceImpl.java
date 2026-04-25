package com.andiantong.order.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.common.utils.OrderNoGenerator;
import com.andiantong.common.vo.PageResult;
import com.andiantong.order.dto.CreateRectificationDTO;
import com.andiantong.order.entity.RectificationOrder;
import com.andiantong.order.mapper.RectificationOrderMapper;
import com.andiantong.order.service.RectificationOrderService;
import com.andiantong.order.vo.RectificationOrderVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RectificationOrderServiceImpl extends ServiceImpl<RectificationOrderMapper, RectificationOrder> implements RectificationOrderService {

    private final RectificationOrderMapper orderMapper;

    @Override
    @Transactional
    public RectificationOrderVO createOrder(CreateRectificationDTO dto) {
        log.info("创建整改订单, inspectionReportId={}, userId={}", dto.getInspectionReportId(), dto.getUserId());

        RectificationOrder order = new RectificationOrder();
        order.setOrderNo(OrderNoGenerator.generateRectificationNo());
        order.setInspectionReportId(dto.getInspectionReportId());
        order.setUserId(dto.getUserId());
        order.setMaterials(dto.getMaterials());
        order.setStatus("PENDING");

        // 设置金额
        BigDecimal materialAmount = dto.getMaterialAmount() != null ? dto.getMaterialAmount() : BigDecimal.ZERO;
        BigDecimal laborAmount = dto.getLaborAmount() != null ? dto.getLaborAmount() : BigDecimal.ZERO;
        BigDecimal pointsDiscount = dto.getPointsDiscount() != null ? dto.getPointsDiscount() : BigDecimal.ZERO;

        order.setMaterialAmount(materialAmount);
        order.setLaborAmount(laborAmount);
        order.setPointsDiscount(pointsDiscount);

        // 计算总金额和实付金额
        BigDecimal totalAmount = materialAmount.add(laborAmount);
        BigDecimal finalAmount = totalAmount.subtract(pointsDiscount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        order.setTotalAmount(totalAmount);
        order.setFinalAmount(finalAmount);

        orderMapper.insert(order);
        log.info("整改订单创建成功, orderNo={}", order.getOrderNo());

        return convertToVO(order);
    }

    @Override
    public RectificationOrderVO getOrderDetail(Long id) {
        RectificationOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        return convertToVO(order);
    }

    @Override
    public PageResult<RectificationOrderVO> getUserOrders(Long userId, Integer page, Integer pageSize) {
        List<RectificationOrder> allOrders = orderMapper.selectByUserId(userId);
        List<RectificationOrderVO> voList = allOrders.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        // 手动分页
        int total = voList.size();
        int fromIndex = (page - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, total);
        List<RectificationOrderVO> pageList = fromIndex < total
                ? voList.subList(fromIndex, toIndex)
                : List.of();

        return PageResult.of(pageList, (long) total, page, pageSize);
    }

    @Override
    public List<RectificationOrderVO> getReportOrders(Long reportId) {
        List<RectificationOrder> orders = orderMapper.selectByReportId(reportId);
        return orders.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public List<RectificationOrderVO> getElectricianTasks(Long electricianId) {
        List<RectificationOrder> orders = orderMapper.selectByElectricianId(electricianId);
        return orders.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void confirmOrder(Long id) {
        updateStatusWithGuard(id, "PENDING", "CONFIRMED", "订单状态不允许确认，当前状态需为PENDING");
        log.info("整改订单已确认, id={}", id);
    }

    @Override
    @Transactional
    public void startOrder(Long id) {
        updateStatusWithGuard(id, "CONFIRMED", "IN_PROGRESS", "订单状态不允许开始施工，当前状态需为CONFIRMED");
        log.info("整改订单开始施工, id={}", id);
    }

    @Override
    @Transactional
    public void completeOrder(Long id) {
        updateStatusWithGuard(id, "IN_PROGRESS", "COMPLETED", "订单状态不允许完成，当前状态需为IN_PROGRESS");
        log.info("整改订单施工完成, id={}", id);
    }

    @Override
    @Transactional
    public void payOrder(Long id) {
        updateStatusWithGuard(id, "COMPLETED", "PAID", "订单状态不允许支付，当前状态需为COMPLETED");
        log.info("整改订单已支付, id={}", id);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, String status) {
        RectificationOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        order.setStatus(status);
        orderMapper.updateById(order);
        log.info("整改订单状态更新, id={}, status={}", id, status);
    }

    @Override
    @Transactional
    public void assignElectrician(Long id, Long electricianId) {
        RectificationOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        order.setElectricianId(electricianId);
        orderMapper.updateById(order);
        log.info("整改订单分配电工, id={}, electricianId={}", id, electricianId);
    }

    @Override
    @Transactional
    public void cancelOrder(Long id) {
        RectificationOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!"PENDING".equals(order.getStatus())) {
            throw new BusinessException("仅待确认状态的订单可以取消");
        }
        order.setStatus("CANCELLED");
        orderMapper.updateById(order);
        log.info("整改订单已取消, id={}", id);
    }

    /**
     * 带状态守卫的状态更新
     */
    private void updateStatusWithGuard(Long id, String expectedStatus, String targetStatus, String errorMsg) {
        RectificationOrder order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!expectedStatus.equals(order.getStatus())) {
            throw new BusinessException(errorMsg);
        }
        order.setStatus(targetStatus);
        orderMapper.updateById(order);
    }

    /**
     * 实体转VO
     */
    private RectificationOrderVO convertToVO(RectificationOrder order) {
        RectificationOrderVO vo = new RectificationOrderVO();
        vo.setId(order.getId());
        vo.setOrderNo(order.getOrderNo());
        vo.setInspectionReportId(order.getInspectionReportId());
        vo.setUserId(order.getUserId());
        vo.setElectricianId(order.getElectricianId());
        vo.setMaterials(order.getMaterials());
        vo.setMaterialAmount(order.getMaterialAmount());
        vo.setLaborAmount(order.getLaborAmount());
        vo.setTotalAmount(order.getTotalAmount());
        vo.setPointsDiscount(order.getPointsDiscount());
        vo.setFinalAmount(order.getFinalAmount());
        vo.setStatus(order.getStatus());
        vo.setCreateTime(order.getCreateTime());
        vo.setUpdateTime(order.getUpdateTime());
        return vo;
    }
}
