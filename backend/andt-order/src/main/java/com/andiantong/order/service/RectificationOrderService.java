package com.andiantong.order.service;

import com.andiantong.order.dto.CreateRectificationDTO;
import com.andiantong.order.entity.RectificationOrder;
import com.andiantong.order.vo.RectificationOrderVO;
import com.andiantong.common.vo.PageResult;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface RectificationOrderService extends IService<RectificationOrder> {

    /**
     * 创建整改订单
     */
    RectificationOrderVO createOrder(CreateRectificationDTO dto);

    /**
     * 获取订单详情
     */
    RectificationOrderVO getOrderDetail(Long id);

    /**
     * 获取用户订单列表（分页）
     */
    PageResult<RectificationOrderVO> getUserOrders(Long userId, Integer page, Integer pageSize);

    /**
     * 根据检测报告获取订单列表
     */
    List<RectificationOrderVO> getReportOrders(Long reportId);

    /**
     * 获取电工任务列表
     */
    List<RectificationOrderVO> getElectricianTasks(Long electricianId);

    /**
     * 确认订单（状态 -> CONFIRMED）
     */
    void confirmOrder(Long id);

    /**
     * 开始施工（状态 -> IN_PROGRESS）
     */
    void startOrder(Long id);

    /**
     * 完成施工（状态 -> COMPLETED）
     */
    void completeOrder(Long id);

    /**
     * 支付订单（状态 -> PAID）
     */
    void payOrder(Long id);

    /**
     * 更新订单状态
     */
    void updateStatus(Long id, String status);

    /**
     * 分配电工
     */
    void assignElectrician(Long id, Long electricianId);

    /**
     * 取消订单（仅限PENDING状态）
     */
    void cancelOrder(Long id);
}
