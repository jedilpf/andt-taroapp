#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

section5 = '''

### 5.1 后端核心代码 - 报表中心Controller

```java
package com.andiantong.report.controller;

import com.andiantong.common.core.Result;
import com.andiantong.report.dto.*;
import com.andiantong.report.service.ReportService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Api(tags = "报表中心")
@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    @ApiOperation("获取日报表")
    @GetMapping("/daily")
    public Result<Map<String, Object>> getDailyReport(@RequestParam String date) {
        log.info("获取日报表: date={}", date);
        Map<String, Object> report = reportService.getDailyReport(date);
        return Result.success(report);
    }

    @ApiOperation("获取周报表")
    @GetMapping("/weekly")
    public Result<Map<String, Object>> getWeeklyReport(@RequestParam String startDate, @RequestParam String endDate) {
        log.info("获取周报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getWeeklyReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取月报表")
    @GetMapping("/monthly")
    public Result<Map<String, Object>> getMonthlyReport(@RequestParam Integer year, @RequestParam Integer month) {
        log.info("获取月报表: year={}, month={}", year, month);
        Map<String, Object> report = reportService.getMonthlyReport(year, month);
        return Result.success(report);
    }

    @ApiOperation("获取年度报表")
    @GetMapping("/yearly")
    public Result<Map<String, Object>> getYearlyReport(@RequestParam Integer year) {
        log.info("获取年度报表: year={}", year);
        Map<String, Object> report = reportService.getYearlyReport(year);
        return Result.success(report);
    }

    @ApiOperation("获取订单报表")
    @GetMapping("/order")
    public Result<Map<String, Object>> getOrderReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer status) {
        log.info("获取订单报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getOrderReport(startDate, endDate, status);
        return Result.success(report);
    }

    @ApiOperation("获取收入报表")
    @GetMapping("/income")
    public Result<Map<String, Object>> getIncomeReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取收入报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getIncomeReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取用户报表")
    @GetMapping("/user")
    public Result<Map<String, Object>> getUserReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取用户报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getUserReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取服务报表")
    @GetMapping("/service")
    public Result<Map<String, Object>> getServiceReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取服务报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getServiceReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取电工报表")
    @GetMapping("/electrician")
    public Result<Map<String, Object>> getElectricianReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取电工报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getElectricianReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取退款报表")
    @GetMapping("/refund")
    public Result<Map<String, Object>> getRefundReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取退款报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getRefundReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取投诉报表")
    @GetMapping("/complaint")
    public Result<Map<String, Object>> getComplaintReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取投诉报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getComplaintReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取财务报表")
    @GetMapping("/financial")
    public Result<Map<String, Object>> getFinancialReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取财务报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getFinancialReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取库存报表")
    @GetMapping("/inventory")
    public Result<Map<String, Object>> getInventoryReport() {
        log.info("获取库存报表");
        Map<String, Object> report = reportService.getInventoryReport();
        return Result.success(report);
    }

    @ApiOperation("获取营销报表")
    @GetMapping("/marketing")
    public Result<Map<String, Object>> getMarketingReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取营销报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getMarketingReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取转化率报表")
    @GetMapping("/conversion")
    public Result<Map<String, Object>> getConversionReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取转化率报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getConversionReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取渠道报表")
    @GetMapping("/channel")
    public Result<Map<String, Object>> getChannelReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取渠道报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getChannelReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取区域报表")
    @GetMapping("/region")
    public Result<Map<String, Object>> getRegionReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取区域报表: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> report = reportService.getRegionReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取时报表")
    @GetMapping("/hourly")
    public Result<List<Map<String, Object>>> getHourlyReport(@RequestParam String date) {
        log.info("获取时报表: date={}", date);
        List<Map<String, Object>> report = reportService.getHourlyReport(date);
        return Result.success(report);
    }

    @ApiOperation("导出订单报表")
    @GetMapping("/export/order")
    public void exportOrderReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer status,
            HttpServletResponse response) {
        log.info("导出订单报表: startDate={}, endDate={}", startDate, endDate);
        reportService.exportOrderReport(startDate, endDate, status, response);
    }

    @ApiOperation("导出收入报表")
    @GetMapping("/export/income")
    public void exportIncomeReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        log.info("导出收入报表: startDate={}, endDate={}", startDate, endDate);
        reportService.exportIncomeReport(startDate, endDate, response);
    }

    @ApiOperation("导出用户报表")
    @GetMapping("/export/user")
    public void exportUserReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        log.info("导出用户报表: startDate={}, endDate={}", startDate, endDate);
        reportService.exportUserReport(startDate, endDate, response);
    }

    @ApiOperation("导出财务报表")
    @GetMapping("/export/financial")
    public void exportFinancialReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        log.info("导出财务报表: startDate={}, endDate={}", startDate, endDate);
        reportService.exportFinancialReport(startDate, endDate, response);
    }

    @ApiOperation("生成日报表定时任务")
    @PostMapping("/task/daily")
    public Result<String> generateDailyReport() {
        log.info("生成日报表定时任务");
        reportService.generateDailyReport();
        return Result.success("生成成功");
    }

    @ApiOperation("生成周报表定时任务")
    @PostMapping("/task/weekly")
    public Result<String> generateWeeklyReport() {
        log.info("生成周报表定时任务");
        reportService.generateWeeklyReport();
        return Result.success("生成成功");
    }

    @ApiOperation("生成月报表定时任务")
    @PostMapping("/task/monthly")
    public Result<String> generateMonthlyReport() {
        log.info("生成月报表定时任务");
        reportService.generateMonthlyReport();
        return Result.success("生成成功");
    }

    @ApiOperation("获取报表模板列表")
    @GetMapping("/template/list")
    public Result<List<ReportTemplateVO>> getReportTemplateList() {
        log.info("获取报表模板列表");
        List<ReportTemplateVO> templates = reportService.getReportTemplateList();
        return Result.success(templates);
    }

    @ApiOperation("创建报表模板")
    @PostMapping("/template")
    public Result<String> createReportTemplate(@RequestBody CreateReportTemplateDTO templateDTO) {
        log.info("创建报表模板: name={}", templateDTO.getName());
        reportService.createReportTemplate(templateDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新报表模板")
    @PutMapping("/template/{templateId}")
    public Result<String> updateReportTemplate(@PathVariable Long templateId, @RequestBody UpdateReportTemplateDTO templateDTO) {
        log.info("更新报表模板: templateId={}", templateId);
        reportService.updateReportTemplate(templateId, templateDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除报表模板")
    @DeleteMapping("/template/{templateId}")
    public Result<String> deleteReportTemplate(@PathVariable Long templateId) {
        log.info("删除报表模板: templateId={}", templateId);
        reportService.deleteReportTemplate(templateId);
        return Result.success("删除成功");
    }

    @ApiOperation("使用模板生成报表")
    @PostMapping("/generate/{templateId}")
    public Result<String> generateReportByTemplate(@PathVariable Long templateId, @RequestBody GenerateReportDTO generateDTO) {
        log.info("使用模板生成报表: templateId={}", templateId);
        reportService.generateReportByTemplate(templateId, generateDTO);
        return Result.success("生成成功");
    }

    @ApiOperation("获取自定义报表")
    @GetMapping("/custom")
    public Result<Map<String, Object>> getCustomReport(@RequestBody CustomReportDTO customReportDTO) {
        log.info("获取自定义报表");
        Map<String, Object> report = reportService.getCustomReport(customReportDTO);
        return Result.success(report);
    }

    @ApiOperation("保存自定义报表")
    @PostMapping("/custom/save")
    public Result<String> saveCustomReport(@RequestBody SaveCustomReportDTO saveDTO) {
        log.info("保存自定义报表: name={}", saveDTO.getName());
        reportService.saveCustomReport(saveDTO);
        return Result.success("保存成功");
    }

    @ApiOperation("获取已保存的自定义报表")
    @GetMapping("/custom/list")
    public Result<List<CustomReportVO>> getCustomReportList() {
        log.info("获取已保存的自定义报表");
        List<CustomReportVO> reports = reportService.getCustomReportList();
        return Result.success(reports);
    }

    @ApiOperation("删除自定义报表")
    @DeleteMapping("/custom/{reportId}")
    public Result<String> deleteCustomReport(@PathVariable Long reportId) {
        log.info("删除自定义报表: reportId={}", reportId);
        reportService.deleteCustomReport(reportId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取实时数据")
    @GetMapping("/realtime")
    public Result<Map<String, Object>> getRealtimeData() {
        log.info("获取实时数据");
        Map<String, Object> data = reportService.getRealtimeData();
        return Result.success(data);
    }

    @ApiOperation("获取今日概览")
    @GetMapping("/today/overview")
    public Result<Map<String, Object>> getTodayOverview() {
        log.info("获取今日概览");
        Map<String, Object> overview = reportService.getTodayOverview();
        return Result.success(overview);
    }

    @ApiOperation("获取关键指标")
    @GetMapping("/kpi")
    public Result<Map<String, Object>> getKeyPerformanceIndicators() {
        log.info("获取关键指标");
        Map<String, Object> kpi = reportService.getKeyPerformanceIndicators();
        return Result.success(kpi);
    }

    @ApiOperation("设置关键指标告警")
    @PostMapping("/kpi/alert")
    public Result<String> setKpiAlert(@RequestBody SetKpiAlertDTO alertDTO) {
        log.info("设置关键指标告警");
        reportService.setKpiAlert(alertDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取仪表盘配置")
    @GetMapping("/dashboard/config")
    public Result<DashboardConfigVO> getDashboardConfig() {
        log.info("获取仪表盘配置");
        DashboardConfigVO config = reportService.getDashboardConfig();
        return Result.success(config);
    }

    @ApiOperation("保存仪表盘配置")
    @PostMapping("/dashboard/config")
    public Result<String> saveDashboardConfig(@RequestBody SaveDashboardConfigDTO configDTO) {
        log.info("保存仪表盘配置");
        reportService.saveDashboardConfig(configDTO);
        return Result.success("保存成功");
    }

    @ApiOperation("获取趋势数据")
    @GetMapping("/trend")
    public Result<List<Map<String, Object>>> getTrendData(
            @RequestParam String metric,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取趋势数据: metric={}, days={}", metric, days);
        List<Map<String, Object>> trend = reportService.getTrendData(metric, days);
        return Result.success(trend);
    }

    @ApiOperation("获取对比数据")
    @GetMapping("/comparison")
    public Result<Map<String, Object>> getComparisonData(
            @RequestParam String metric,
            @RequestParam String startDate1,
            @RequestParam String endDate1,
            @RequestParam String startDate2,
            @RequestParam String endDate2) {
        log.info("获取对比数据: metric={}", metric);
        Map<String, Object> comparison = reportService.getComparisonData(metric, startDate1, endDate1, startDate2, endDate2);
        return Result.success(comparison);
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(section5)

print(f"已追加代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
