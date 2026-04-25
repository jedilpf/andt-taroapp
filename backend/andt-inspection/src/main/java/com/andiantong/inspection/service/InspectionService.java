package com.andiantong.inspection.service;

import com.andiantong.inspection.entity.InspectionItem;
import com.andiantong.inspection.entity.InspectionOrder;
import com.andiantong.inspection.entity.InspectionQuota;
import com.andiantong.inspection.entity.InspectionReport;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface InspectionService extends IService<InspectionOrder> {

    /**
     * 检查用户检测资格
     */
    InspectionQuota checkQuota(Long userId);

    /**
     * 创建检测订单
     */
    InspectionOrder createOrder(Long userId, InspectionOrder order);

    /**
     * 获取用户订单列表
     */
    List<InspectionOrder> getUserOrders(Long userId);

    /**
     * 获取订单详情
     */
    InspectionOrder getOrderDetail(Long orderId);

    /**
     * 取消订单
     */
    void cancelOrder(Long orderId);

    /**
     * 获取待接单列表
     */
    List<InspectionOrder> getPendingOrders();

    /**
     * 接单
     */
    void acceptOrder(Long orderId, Long electricianId);

    /**
     * 到达确认
     */
    void arriveOrder(Long orderId);

    /**
     * 开始检测
     */
    void startInspection(Long orderId);

    /**
     * 更新订单状态
     */
    void updateOrderStatus(Long orderId, String status);

    /**
     * 提交检测报告
     */
    void submitReport(Long orderId, InspectionReport report, List<InspectionItem> items);

    /**
     * 获取检测报告
     */
    InspectionReport getReport(Long orderId);
}
