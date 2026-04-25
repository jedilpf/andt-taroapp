package com.andiantong.inspection.controller;

import com.andiantong.common.Result;
import com.andiantong.common.dto.PageDTO;
import com.andiantong.common.vo.PageResult;
import com.andiantong.inspection.entity.InspectionOrder;
import com.andiantong.inspection.entity.InspectionQuota;
import com.andiantong.inspection.entity.InspectionReport;
import com.andiantong.inspection.service.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspection")
@RequiredArgsConstructor
public class InspectionController {

    private final InspectionService inspectionService;

    @GetMapping("/quota")
    public Result<InspectionQuota> checkQuota(@RequestAttribute("userId") Long userId) {
        return Result.success(inspectionService.checkQuota(userId));
    }

    @PostMapping("/create")
    public Result<InspectionOrder> createOrder(
            @RequestAttribute("userId") Long userId,
            @RequestBody InspectionOrder order) {
        return Result.success(inspectionService.createOrder(userId, order));
    }

    @GetMapping("/list")
    public Result<PageResult<InspectionOrder>> getOrderList(
            @RequestAttribute("userId") Long userId,
            PageDTO pageDTO) {
        List<InspectionOrder> list = inspectionService.getUserOrders(userId);
        return Result.success(PageResult.of(list, (long) list.size(), pageDTO.getPage(), pageDTO.getPageSize()));
    }

    @GetMapping("/{id}")
    public Result<InspectionOrder> getOrderDetail(@PathVariable Long id) {
        return Result.success(inspectionService.getOrderDetail(id));
    }

    @PostMapping("/cancel/{id}")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        inspectionService.cancelOrder(id);
        return Result.success();
    }

    @GetMapping("/report/{orderId}")
    public Result<InspectionReport> getReport(@PathVariable Long orderId) {
        return Result.success(inspectionService.getReport(orderId));
    }
}
