package com.andiantong.order.controller;

import com.andiantong.common.Result;
import com.andiantong.common.vo.PageResult;
import com.andiantong.order.dto.CreateRectificationDTO;
import com.andiantong.order.service.RectificationOrderService;
import com.andiantong.order.vo.RectificationOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rectification")
@RequiredArgsConstructor
public class RectificationController {

    private final RectificationOrderService rectificationOrderService;

    @PostMapping("/create")
    public Result<RectificationOrderVO> createOrder(@RequestBody CreateRectificationDTO dto) {
        return Result.success(rectificationOrderService.createOrder(dto));
    }

    @GetMapping("/list")
    public Result<PageResult<RectificationOrderVO>> getUserOrders(
            @RequestAttribute("userId") Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(rectificationOrderService.getUserOrders(userId, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<RectificationOrderVO> getOrderDetail(@PathVariable Long id) {
        return Result.success(rectificationOrderService.getOrderDetail(id));
    }

    @GetMapping("/report/{reportId}")
    public Result<List<RectificationOrderVO>> getReportOrders(@PathVariable Long reportId) {
        return Result.success(rectificationOrderService.getReportOrders(reportId));
    }

    @PostMapping("/confirm/{id}")
    public Result<Void> confirmOrder(@PathVariable Long id) {
        rectificationOrderService.confirmOrder(id);
        return Result.success();
    }

    @PostMapping("/start/{id}")
    public Result<Void> startOrder(@PathVariable Long id) {
        rectificationOrderService.startOrder(id);
        return Result.success();
    }

    @PostMapping("/complete/{id}")
    public Result<Void> completeOrder(@PathVariable Long id) {
        rectificationOrderService.completeOrder(id);
        return Result.success();
    }

    @PostMapping("/pay/{id}")
    public Result<Void> payOrder(@PathVariable Long id) {
        rectificationOrderService.payOrder(id);
        return Result.success();
    }

    @PostMapping("/cancel/{id}")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        rectificationOrderService.cancelOrder(id);
        return Result.success();
    }
}
