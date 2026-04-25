#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

final_code = '''

### 4.6 后端核心代码 - 消息推送管理

```java
package com.andiantong.push.controller;

import com.andiantong.common.core.Result;
import com.andiantong.push.dto.*;
import com.andiantong.push.service.PushService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "消息推送")
@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
@Slf4j
public class PushController {

    private final PushService pushService;

    @ApiOperation("推送消息给用户")
    @PostMapping("/user/{userId}")
    public Result<String> pushToUser(@PathVariable Long userId, @RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息给用户: userId={}", userId);
        pushService.pushToUser(userId, pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("推送消息给所有用户")
    @PostMapping("/all")
    public Result<String> pushToAll(@RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息给所有用户");
        pushService.pushToAll(pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("推送消息给指定用户列表")
    @PostMapping("/users")
    public Result<String> pushToUsers(@RequestBody PushToUsersDTO pushDTO) {
        log.info("推送消息给指定用户列表: userCount={}", pushDTO.getUserIds().size());
        pushService.pushToUsers(pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("推送消息给指定标签用户")
    @PostMapping("/tag/{tag}")
    public Result<String> pushToTag(@PathVariable String tag, @RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息给指定标签用户: tag={}", tag);
        pushService.pushToTag(tag, pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("推送消息给指定别名用户")
    @PostMapping("/alias/{alias}")
    public Result<String> pushToAlias(@PathVariable String alias, @RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息给指定别名用户: alias={}", alias);
        pushService.pushToAlias(alias, pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("根据registrationId推送消息")
    @PostMapping("/registration/{registrationId}")
    public Result<String> pushByRegistrationId(@PathVariable String registrationId, @RequestBody PushMessageDTO pushDTO) {
        log.info("根据registrationId推送消息: registrationId={}", registrationId);
        pushService.pushByRegistrationId(registrationId, pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("查询推送记录")
    @GetMapping("/records")
    public Result<List<PushRecordVO>> getPushRecords(
            @RequestParam(required = false) String pushType,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("查询推送记录");
        List<PushRecordVO> records = pushService.getPushRecords(pushType, userId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("查询推送详情")
    @GetMapping("/record/{recordId}")
    public Result<PushRecordDetailVO> getPushRecordDetail(@PathVariable Long recordId) {
        log.info("查询推送详情: recordId={}", recordId);
        PushRecordDetailVO detail = pushService.getPushRecordDetail(recordId);
        return Result.success(detail);
    }

    @ApiOperation("获取推送统计")
    @GetMapping("/statistics/{recordId}")
    public Result<Map<String, Object>> getPushStatistics(@PathVariable Long recordId) {
        log.info("获取推送统计: recordId={}", recordId);
        Map<String, Object> statistics = pushService.getPushStatistics(recordId);
        return Result.success(statistics);
    }

    @ApiOperation("取消推送")
    @DeleteMapping("/{msgId}")
    public Result<String> cancelPush(@PathVariable String msgId) {
        log.info("取消推送: msgId={}", msgId);
        pushService.cancelPush(msgId);
        return Result.success("取消成功");
    }

    @ApiOperation("获取设备列表")
    @GetMapping("/devices")
    public Result<List<DeviceVO>> getDeviceList(
            @RequestParam(required = false) String platform,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取设备列表: platform={}", platform);
        List<DeviceVO> devices = pushService.getDeviceList(platform, pageNum, pageSize);
        return Result.success(devices);
    }

    @ApiOperation("绑定设备")
    @PostMapping("/device/bind")
    public Result<String> bindDevice(@RequestBody DeviceBindDTO deviceDTO) {
        log.info("绑定设备: userId={}, registrationId={}", deviceDTO.getUserId(), deviceDTO.getRegistrationId());
        pushService.bindDevice(deviceDTO);
        return Result.success("绑定成功");
    }

    @ApiOperation("解绑设备")
    @PostMapping("/device/unbind")
    public Result<String> unbindDevice(@RequestBody DeviceBindDTO deviceDTO) {
        log.info("解绑设备: userId={}, registrationId={}", deviceDTO.getUserId(), deviceDTO.getRegistrationId());
        pushService.unbindDevice(deviceDTO);
        return Result.success("解绑成功");
    }

    @ApiOperation("获取用户设备信息")
    @GetMapping("/device/{userId}")
    public Result<List<DeviceVO>> getUserDevices(@PathVariable Long userId) {
        log.info("获取用户设备信息: userId={}", userId);
        List<DeviceVO> devices = pushService.getUserDevices(userId);
        return Result.success(devices);
    }

    @ApiOperation("设置设备别名")
    @PostMapping("/device/alias")
    public Result<String> setDeviceAlias(@RequestBody Map<String, String> params) {
        String registrationId = params.get("registrationId");
        String alias = params.get("alias");
        log.info("设置设备别名: registrationId={}, alias={}", registrationId, alias);
        pushService.setDeviceAlias(registrationId, alias);
        return Result.success("设置成功");
    }

    @ApiOperation("删除设备别名")
    @DeleteMapping("/device/alias/{alias}")
    public Result<String> deleteDeviceAlias(@PathVariable String alias) {
        log.info("删除设备别名: alias={}", alias);
        pushService.deleteDeviceAlias(alias);
        return Result.success("删除成功");
    }

    @ApiOperation("获取标签列表")
    @GetMapping("/tags")
    public Result<List<Map<String, Object>>> getTagList() {
        log.info("获取标签列表");
        List<Map<String, Object>> tags = pushService.getTagList();
        return Result.success(tags);
    }

    @ApiOperation("创建标签")
    @PostMapping("/tag")
    public Result<String> createTag(@RequestBody Map<String, String> params) {
        String tagName = params.get("tagName");
        log.info("创建标签: tagName={}", tagName);
        pushService.createTag(tagName);
        return Result.success("创建成功");
    }

    @ApiOperation("删除标签")
    @DeleteMapping("/tag/{tag}")
    public Result<String> deleteTag(@PathVariable String tag) {
        log.info("删除标签: tag={}", tag);
        pushService.deleteTag(tag);
        return Result.success("删除成功");
    }

    @ApiOperation("给用户添加标签")
    @PostMapping("/user/{userId}/tag/{tag}")
    public Result<String> addUserTag(@PathVariable Long userId, @PathVariable String tag) {
        log.info("给用户添加标签: userId={}, tag={}", userId, tag);
        pushService.addUserTag(userId, tag);
        return Result.success("添加成功");
    }

    @ApiOperation("删除用户标签")
    @DeleteMapping("/user/{userId}/tag/{tag}")
    public Result<String> removeUserTag(@PathVariable Long userId, @PathVariable String tag) {
        log.info("删除用户标签: userId={}, tag={}", userId, tag);
        pushService.removeUserTag(userId, tag);
        return Result.success("删除成功");
    }

    @ApiOperation("获取用户标签")
    @GetMapping("/user/{userId}/tags")
    public Result<List<String>> getUserTags(@PathVariable Long userId) {
        log.info("获取用户标签: userId={}", userId);
        List<String> tags = pushService.getUserTags(userId);
        return Result.success(tags);
    }

    @ApiOperation("获取每日推送配额")
    @GetMapping("/quota/daily")
    public Result<Map<String, Object>> getDailyQuota() {
        log.info("获取每日推送配额");
        Map<String, Object> quota = pushService.getDailyQuota();
        return Result.success(quota);
    }

    @ApiOperation("获取推送模板列表")
    @GetMapping("/templates")
    public Result<List<PushTemplateVO>> getPushTemplates() {
        log.info("获取推送模板列表");
        List<PushTemplateVO> templates = pushService.getPushTemplates();
        return Result.success(templates);
    }

    @ApiOperation("创建推送模板")
    @PostMapping("/template")
    public Result<String> createPushTemplate(@RequestBody PushTemplateDTO templateDTO) {
        log.info("创建推送模板: name={}", templateDTO.getName());
        pushService.createPushTemplate(templateDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新推送模板")
    @PutMapping("/template/{templateId}")
    public Result<String> updatePushTemplate(@PathVariable Long templateId, @RequestBody PushTemplateDTO templateDTO) {
        log.info("更新推送模板: templateId={}", templateId);
        pushService.updatePushTemplate(templateId, templateDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除推送模板")
    @DeleteMapping("/template/{templateId}")
    public Result<String> deletePushTemplate(@PathVariable Long templateId) {
        log.info("删除推送模板: templateId={}", templateId);
        pushService.deletePushTemplate(templateId);
        return Result.success("删除成功");
    }

    @ApiOperation("使用模板推送")
    @PostMapping("/template/{templateId}/push")
    public Result<String> pushByTemplate(@PathVariable Long templateId, @RequestBody Map<String, Object> params) {
        log.info("使用模板推送: templateId={}", templateId);
        pushService.pushByTemplate(templateId, params);
        return Result.success("推送成功");
    }

    @ApiOperation("获取用户消息状态")
    @GetMapping("/user/{userId}/status")
    public Result<Map<String, Object>> getUserPushStatus(@PathVariable Long userId) {
        log.info("获取用户消息状态: userId={}", userId);
        Map<String, Object> status = pushService.getUserPushStatus(userId);
        return Result.success(status);
    }

    @ApiOperation("设置用户消息免打扰")
    @PostMapping("/user/{userId}/dnd")
    public Result<String> setUserDnd(@PathVariable Long userId, @RequestBody Map<String, Object> dndDTO) {
        log.info("设置用户消息免打扰: userId={}", userId);
        pushService.setUserDnd(userId, dndDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取推送报告")
    @GetMapping("/report/{recordId}")
    public Result<Map<String, Object>> getPushReport(@PathVariable Long recordId) {
        log.info("获取推送报告: recordId={}", recordId);
        Map<String, Object> report = pushService.getPushReport(recordId);
        return Result.success(report);
    }

    @ApiOperation("获取推送汇总报告")
    @GetMapping("/report/summary")
    public Result<Map<String, Object>> getPushSummaryReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取推送汇总报告");
        Map<String, Object> report = pushService.getPushSummaryReport(startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("获取推送趋势数据")
    @GetMapping("/report/trend")
    public Result<Map<String, Object>> getPushTrendReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取推送趋势数据: days={}", days);
        Map<String, Object> report = pushService.getPushTrendReport(startDate, endDate, days);
        return Result.success(report);
    }

    @ApiOperation("获取用户消息列表")
    @GetMapping("/user/{userId}/messages")
    public Result<List<UserPushMessageVO>> getUserMessages(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取用户消息列表: userId={}", userId);
        List<UserPushMessageVO> messages = pushService.getUserMessages(userId, pageNum, pageSize);
        return Result.success(messages);
    }

    @ApiOperation("标记消息已读")
    @PutMapping("/user/{userId}/message/{messageId}/read")
    public Result<String> markMessageRead(@PathVariable Long userId, @PathVariable Long messageId) {
        log.info("标记消息已读: userId={}, messageId={}", userId, messageId);
        pushService.markMessageRead(userId, messageId);
        return Result.success("标记成功");
    }

    @ApiOperation("删除用户消息")
    @DeleteMapping("/user/{userId}/message/{messageId}")
    public Result<String> deleteUserMessage(@PathVariable Long userId, @PathVariable Long messageId) {
        log.info("删除用户消息: userId={}, messageId={}", userId, messageId);
        pushService.deleteUserMessage(userId, messageId);
        return Result.success("删除成功");
    }

    @ApiOperation("清空用户消息")
    @DeleteMapping("/user/{userId}/messages")
    public Result<String> clearUserMessages(@PathVariable Long userId) {
        log.info("清空用户消息: userId={}", userId);
        pushService.clearUserMessages(userId);
        return Result.success("清空成功");
    }

    @ApiOperation("获取未读消息数")
    @GetMapping("/user/{userId}/unread/count")
    public Result<Integer> getUnreadCount(@PathVariable Long userId) {
        log.info("获取未读消息数: userId={}", userId);
        Integer count = pushService.getUnreadCount(userId);
        return Result.success(count);
    }

    @ApiOperation("标记全部已读")
    @PutMapping("/user/{userId}/messages/read/all")
    public Result<String> markAllMessagesRead(@PathVariable Long userId) {
        log.info("标记全部已读: userId={}", userId);
        pushService.markAllMessagesRead(userId);
        return Result.success("标记成功");
    }

    @ApiOperation("获取消息详情")
    @GetMapping("/user/{userId}/message/{messageId}")
    public Result<UserPushMessageVO> getMessageDetail(@PathVariable Long userId, @PathVariable Long messageId) {
        log.info("获取消息详情: userId={}, messageId={}", userId, messageId);
        UserPushMessageVO detail = pushService.getMessageDetail(userId, messageId);
        return Result.success(detail);
    }

    @ApiOperation("测试推送")
    @PostMapping("/test")
    public Result<String> testPush(@RequestBody Map<String, Object> params) {
        String userId = params.get("userId").toString();
        String title = params.get("title").toString();
        String content = params.get("content").toString();
        log.info("测试推送: userId={}", userId);
        pushService.testPush(userId, title, content);
        return Result.success("推送成功");
    }

    @ApiOperation("获取消息中心配置")
    @GetMapping("/config")
    public Result<Map<String, Object>> getPushConfig() {
        log.info("获取消息中心配置");
        Map<String, Object> config = pushService.getPushConfig();
        return Result.success(config);
    }

    @ApiOperation("更新消息中心配置")
    @PutMapping("/config")
    public Result<String> updatePushConfig(@RequestBody Map<String, Object> configDTO) {
        log.info("更新消息中心配置");
        pushService.updatePushConfig(configDTO);
        return Result.success("更新成功");
    }
}
```

### 4.7 后端核心代码 - 工单管理Controller

```java
package com.andiantong.workorder.controller;

import com.andiantong.common.core.Result;
import com.andiantong.workorder.dto.*;
import com.andiantong.workorder.service.WorkOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "工单管理")
@RestController
@RequestMapping("/api/workorder")
@RequiredArgsConstructor
@Slf4j
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @ApiOperation("创建工单")
    @PostMapping
    public Result<Long> createWorkOrder(@RequestBody CreateWorkOrderDTO workOrderDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建工单: userId={}", userId);
        Long workOrderId = workOrderService.createWorkOrder(userId, workOrderDTO);
        return Result.success(workOrderId);
    }

    @ApiOperation("获取工单列表")
    @GetMapping("/list")
    public Result<List<WorkOrderVO>> getWorkOrderList(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取工单列表: status={}, type={}", status, type);
        List<WorkOrderVO> workOrders = workOrderService.getWorkOrderList(status, type, pageNum, pageSize);
        return Result.success(workOrders);
    }

    @ApiOperation("获取我的工单列表")
    @GetMapping("/my")
    public Result<List<WorkOrderVO>> getMyWorkOrders(
            HttpServletRequest request,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的工单列表: userId={}", userId);
        List<WorkOrderVO> workOrders = workOrderService.getMyWorkOrders(userId, status, pageNum, pageSize);
        return Result.success(workOrders);
    }

    @ApiOperation("获取工单详情")
    @GetMapping("/{workOrderId}")
    public Result<WorkOrderDetailVO> getWorkOrderDetail(@PathVariable Long workOrderId) {
        log.info("获取工单详情: workOrderId={}", workOrderId);
        WorkOrderDetailVO detail = workOrderService.getWorkOrderDetail(workOrderId);
        return Result.success(detail);
    }

    @ApiOperation("更新工单")
    @PutMapping("/{workOrderId}")
    public Result<String> updateWorkOrder(@PathVariable Long workOrderId, @RequestBody UpdateWorkOrderDTO workOrderDTO) {
        log.info("更新工单: workOrderId={}", workOrderId);
        workOrderService.updateWorkOrder(workOrderId, workOrderDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("分配工单")
    @PostMapping("/{workOrderId}/assign")
    public Result<String> assignWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, Object> assignDTO) {
        Long userId = (Long) assignDTO.get("assigneeId");
        log.info("分配工单: workOrderId={}, assigneeId={}", workOrderId, userId);
        workOrderService.assignWorkOrder(workOrderId, userId);
        return Result.success("分配成功");
    }

    @ApiOperation("接受工单")
    @PostMapping("/{workOrderId}/accept")
    public Result<String> acceptWorkOrder(@PathVariable Long workOrderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("接受工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.acceptWorkOrder(workOrderId, userId);
        return Result.success("接受成功");
    }

    @ApiOperation("开始处理工单")
    @PostMapping("/{workOrderId}/start")
    public Result<String> startWorkOrder(@PathVariable Long workOrderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("开始处理工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.startWorkOrder(workOrderId, userId);
        return Result.success("开始成功");
    }

    @ApiOperation("处理工单")
    @PostMapping("/{workOrderId}/process")
    public Result<String> processWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, Object> processDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("处理工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.processWorkOrder(workOrderId, userId, processDTO);
        return Result.success("处理成功");
    }

    @ApiOperation("完成工单")
    @PostMapping("/{workOrderId}/complete")
    public Result<String> completeWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, Object> completeDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("完成工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.completeWorkOrder(workOrderId, userId, completeDTO);
        return Result.success("完成成功");
    }

    @ApiOperation("关闭工单")
    @PostMapping("/{workOrderId}/close")
    public Result<String> closeWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, Object> closeDTO) {
        log.info("关闭工单: workOrderId={}", workOrderId);
        workOrderService.closeWorkOrder(workOrderId, closeDTO);
        return Result.success("关闭成功");
    }

    @ApiOperation("取消工单")
    @PostMapping("/{workOrderId}/cancel")
    public Result<String> cancelWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, String> cancelDTO) {
        String reason = cancelDTO.get("reason");
        log.info("取消工单: workOrderId={}, reason={}", workOrderId, reason);
        workOrderService.cancelWorkOrder(workOrderId, reason);
        return Result.success("取消成功");
    }

    @ApiOperation("转派工单")
    @PostMapping("/{workOrderId}/transfer")
    public Result<String> transferWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, Object> transferDTO) {
        Long newAssigneeId = Long.parseLong(transferDTO.get("newAssigneeId").toString());
        log.info("转派工单: workOrderId={}, newAssigneeId={}", workOrderId, newAssigneeId);
        workOrderService.transferWorkOrder(workOrderId, newAssigneeId);
        return Result.success("转派成功");
    }

    @ApiOperation("催办工单")
    @PostMapping("/{workOrderId}/urge")
    public Result<String> urgeWorkOrder(@PathVariable Long workOrderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("催办工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.urgeWorkOrder(workOrderId, userId);
        return Result.success("催办成功");
    }

    @ApiOperation("获取工单处理记录")
    @GetMapping("/{workOrderId}/records")
    public Result<List<WorkOrderRecordVO>> getWorkOrderRecords(@PathVariable Long workOrderId) {
        log.info("获取工单处理记录: workOrderId={}", workOrderId);
        List<WorkOrderRecordVO> records = workOrderService.getWorkOrderRecords(workOrderId);
        return Result.success(records);
    }

    @ApiOperation("获取工单统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getWorkOrderStatistics() {
        log.info("获取工单统计");
        Map<String, Object> statistics = workOrderService.getWorkOrderStatistics();
        return Result.success(statistics);
    }

    @ApiOperation("获取待处理工单数量")
    @GetMapping("/pending/count")
    public Result<Integer> getPendingCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取待处理工单数量: userId={}", userId);
        Integer count = workOrderService.getPendingCount(userId);
        return Result.success(count);
    }

    @ApiOperation("获取我的工单统计")
    @GetMapping("/my/statistics")
    public Result<Map<String, Object>> getMyWorkOrderStatistics(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的工单统计: userId={}", userId);
        Map<String, Object> statistics = workOrderService.getMyWorkOrderStatistics(userId);
        return Result.success(statistics);
    }

    @ApiOperation("获取工单类型列表")
    @GetMapping("/types")
    public Result<List<Map<String, Object>>> getWorkOrderTypes() {
        log.info("获取工单类型列表");
        List<Map<String, Object>> types = workOrderService.getWorkOrderTypes();
        return Result.success(types);
    }

    @ApiOperation("获取工单优先级列表")
    @GetMapping("/priorities")
    public Result<List<Map<String, Object>>> getWorkOrderPriorities() {
        log.info("获取工单优先级列表");
        List<Map<String, Object>> priorities = workOrderService.getWorkOrderPriorities();
        return Result.success(priorities);
    }

    @ApiOperation("评论工单")
    @PostMapping("/{workOrderId}/comment")
    public Result<String> commentWorkOrder(@PathVariable Long workOrderId, @RequestBody Map<String, String> commentDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String content = commentDTO.get("content");
        log.info("评论工单: workOrderId={}, userId={}", workOrderId, userId);
        workOrderService.commentWorkOrder(workOrderId, userId, content);
        return Result.success("评论成功");
    }

    @ApiOperation("获取工单评论")
    @GetMapping("/{workOrderId}/comments")
    public Result<List<WorkOrderCommentVO>> getWorkOrderComments(@PathVariable Long workOrderId) {
        log.info("获取工单评论: workOrderId={}", workOrderId);
        List<WorkOrderCommentVO> comments = workOrderService.getWorkOrderComments(workOrderId);
        return Result.success(comments);
    }

    @ApiOperation("附件上传")
    @PostMapping("/{workOrderId}/attachment")
    public Result<String> uploadAttachment(@PathVariable Long workOrderId, @RequestBody Map<String, String> attachmentDTO) {
        String fileUrl = attachmentDTO.get("fileUrl");
        String fileName = attachmentDTO.get("fileName");
        log.info("附件上传: workOrderId={}, fileName={}", workOrderId, fileName);
        workOrderService.uploadAttachment(workOrderId, fileUrl, fileName);
        return Result.success("上传成功");
    }

    @ApiOperation("获取工单附件列表")
    @GetMapping("/{workOrderId}/attachments")
    public Result<List<Map<String, Object>>> getWorkOrderAttachments(@PathVariable Long workOrderId) {
        log.info("获取工单附件列表: workOrderId={}", workOrderId);
        List<Map<String, Object>> attachments = workOrderService.getWorkOrderAttachments(workOrderId);
        return Result.success(attachments);
    }

    @ApiOperation("删除工单附件")
    @DeleteMapping("/{workOrderId}/attachment/{attachmentId}")
    public Result<String> deleteAttachment(@PathVariable Long workOrderId, @PathVariable Long attachmentId) {
        log.info("删除工单附件: workOrderId={}, attachmentId={}", workOrderId, attachmentId);
        workOrderService.deleteAttachment(workOrderId, attachmentId);
        return Result.success("删除成功");
    }

    @ApiOperation("导出工单")
    @GetMapping("/export")
    public void exportWorkOrders(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            javax.servlet.http.HttpServletResponse response) {
        log.info("导出工单");
        workOrderService.exportWorkOrders(status, type, startDate, endDate, response);
    }

    @ApiOperation("批量分配工单")
    @PostMapping("/batch/assign")
    public Result<String> batchAssignWorkOrders(@RequestBody Map<String, Object> batchDTO) {
        List<Long> workOrderIds = (List<Long>) batchDTO.get("workOrderIds");
        Long assigneeId = Long.parseLong(batchDTO.get("assigneeId").toString());
        log.info("批量分配工单: workOrderIds={}, assigneeId={}", workOrderIds.size(), assigneeId);
        workOrderService.batchAssignWorkOrders(workOrderIds, assigneeId);
        return Result.success("分配成功");
    }

    @ApiOperation("批量更新工单状态")
    @PostMapping("/batch/updateStatus")
    public Result<String> batchUpdateStatus(@RequestBody Map<String, Object> batchDTO) {
        List<Long> workOrderIds = (List<Long>) batchDTO.get("workOrderIds");
        Integer status = Integer.parseInt(batchDTO.get("status").toString());
        log.info("批量更新工单状态: workOrderIds={}, status={}", workOrderIds.size(), status);
        workOrderService.batchUpdateStatus(workOrderIds, status);
        return Result.success("更新成功");
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(final_code)

print(f"已追加最终代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
