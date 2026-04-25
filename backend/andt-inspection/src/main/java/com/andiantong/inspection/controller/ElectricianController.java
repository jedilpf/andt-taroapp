package com.andiantong.inspection.controller;

import com.andiantong.common.Result;
import com.andiantong.common.dto.PageDTO;
import com.andiantong.common.vo.PageResult;
import com.andiantong.inspection.entity.InspectionOrder;
import com.andiantong.inspection.entity.InspectionReport;
import com.andiantong.inspection.service.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/electrician")
@RequiredArgsConstructor
public class ElectricianController {

    private final InspectionService inspectionService;

    @GetMapping("/pending")
    public Result<PageResult<InspectionOrder>> getPendingOrders(PageDTO pageDTO) {
        List<InspectionOrder> list = inspectionService.getPendingOrders();
        return Result.success(PageResult.of(list, (long) list.size(), pageDTO.getPage(), pageDTO.getPageSize()));
    }

    @PostMapping("/accept/{id}")
    public Result<Void> acceptOrder(
            @RequestAttribute("userId") Long electricianId,
            @PathVariable Long id) {
        inspectionService.acceptOrder(id, electricianId);
        return Result.success();
    }

    @PostMapping("/arrive/{id}")
    public Result<Void> arriveOrder(@PathVariable Long id) {
        inspectionService.arriveOrder(id);
        return Result.success();
    }

    @PostMapping("/start/{id}")
    public Result<Void> startInspection(@PathVariable Long id) {
        inspectionService.startInspection(id);
        return Result.success();
    }

    @PostMapping("/report")
    public Result<Void> submitReport(
            @RequestAttribute("userId") Long electricianId,
            @RequestBody SubmitReportRequest request) {
        inspectionService.submitReport(request.getOrderId(), request.getReport(), request.getItems());
        return Result.success();
    }

    @GetMapping("/tasks")
    public Result<PageResult<InspectionOrder>> getMyTasks(
            @RequestAttribute("userId") Long electricianId,
            PageDTO pageDTO) {
        List<InspectionOrder> list = inspectionService.list(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<InspectionOrder>()
                        .eq(InspectionOrder::getElectricianId, electricianId)
                        .orderByDesc(InspectionOrder::getCreateTime)
        );
        return Result.success(PageResult.of(list, (long) list.size(), pageDTO.getPage(), pageDTO.getPageSize()));
    }

    @lombok.Data
    public static class SubmitReportRequest {
        private Long orderId;
        private InspectionReport report;
        private List<com.andiantong.inspection.entity.InspectionItem> items;
    }
}
