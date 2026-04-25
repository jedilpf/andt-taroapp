#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

extra_code = '''

### 4.8 后端核心代码 - 区域管理Controller

```java
package com.andiantong.region.controller;

import com.andiantong.common.core.Result;
import com.andiantong.region.dto.*;
import com.andiantong.region.service.RegionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Api(tags = "区域管理")
@RestController
@RequestMapping("/api/region")
@RequiredArgsConstructor
@Slf4j
public class RegionController {

    private final RegionService regionService;

    @ApiOperation("获取省份列表")
    @GetMapping("/provinces")
    public Result<List<RegionVO>> getProvinces() {
        log.info("获取省份列表");
        List<RegionVO> provinces = regionService.getProvinces();
        return Result.success(provinces);
    }

    @ApiOperation("获取城市列表")
    @GetMapping("/cities/{provinceCode}")
    public Result<List<RegionVO>> getCities(@PathVariable String provinceCode) {
        log.info("获取城市列表: provinceCode={}", provinceCode);
        List<RegionVO> cities = regionService.getCities(provinceCode);
        return Result.success(cities);
    }

    @ApiOperation("获取区县列表")
    @GetMapping("/districts/{cityCode}")
    public Result<List<RegionVO>> getDistricts(@PathVariable String cityCode) {
        log.info("获取区县列表: cityCode={}", cityCode);
        List<RegionVO> districts = regionService.getDistricts(cityCode);
        return Result.success(districts);
    }

    @ApiOperation("获取街道列表")
    @GetMapping("/streets/{districtCode}")
    public Result<List<RegionVO>> getStreets(@PathVariable String districtCode) {
        log.info("获取街道列表: districtCode={}", districtCode);
        List<RegionVO> streets = regionService.getStreets(districtCode);
        return Result.success(streets);
    }

    @ApiOperation("根据code获取区域信息")
    @GetMapping("/info/{code}")
    public Result<RegionVO> getRegionInfo(@PathVariable String code) {
        log.info("根据code获取区域信息: code={}", code);
        RegionVO region = regionService.getRegionInfo(code);
        return Result.success(region);
    }

    @ApiOperation("获取完整区域信息")
    @GetMapping("/full/{code}")
    public Result<Map<String, Object>> getFullRegionInfo(@PathVariable String code) {
        log.info("获取完整区域信息: code={}", code);
        Map<String, Object> regionInfo = regionService.getFullRegionInfo(code);
        return Result.success(regionInfo);
    }

    @ApiOperation("获取所有区域列表")
    @GetMapping("/all")
    public Result<List<RegionVO>> getAllRegions() {
        log.info("获取所有区域列表");
        List<RegionVO> regions = regionService.getAllRegions();
        return Result.success(regions);
    }

    @ApiOperation("搜索区域")
    @GetMapping("/search")
    public Result<List<RegionVO>> searchRegions(@RequestParam String keyword) {
        log.info("搜索区域: keyword={}", keyword);
        List<RegionVO> regions = regionService.searchRegions(keyword);
        return Result.success(regions);
    }

    @ApiOperation("根据经纬度获取区域信息")
    @GetMapping("/location")
    public Result<Map<String, Object>> getRegionByLocation(@RequestParam Double longitude, @RequestParam Double latitude) {
        log.info("根据经纬度获取区域信息: longitude={}, latitude={}", longitude, latitude);
        Map<String, Object> regionInfo = regionService.getRegionByLocation(longitude, latitude);
        return Result.success(regionInfo);
    }

    @ApiOperation("获取区域树形结构")
    @GetMapping("/tree")
    public Result<List<Map<String, Object>>> getRegionTree() {
        log.info("获取区域树形结构");
        List<Map<String, Object>> tree = regionService.getRegionTree();
        return Result.success(tree);
    }

    @ApiOperation("获取热门城市")
    @GetMapping("/hot")
    public Result<List<RegionVO>> getHotCities() {
        log.info("获取热门城市");
        List<RegionVO> cities = regionService.getHotCities();
        return Result.success(cities);
    }

    @ApiOperation("设置热门城市")
    @PostMapping("/hot/{cityCode}")
    public Result<String> setHotCity(@PathVariable String cityCode) {
        log.info("设置热门城市: cityCode={}", cityCode);
        regionService.setHotCity(cityCode);
        return Result.success("设置成功");
    }

    @ApiOperation("取消热门城市")
    @DeleteMapping("/hot/{cityCode}")
    public Result<String> removeHotCity(@PathVariable String cityCode) {
        log.info("取消热门城市: cityCode={}", cityCode);
        regionService.removeHotCity(cityCode);
        return Result.success("取消成功");
    }

    @ApiOperation("获取区域服务电价")
    @GetMapping("/price/{code}")
    public Result<Map<String, Object>> getRegionElectricPrice(@PathVariable String code) {
        log.info("获取区域服务电价: code={}", code);
        Map<String, Object> price = regionService.getRegionElectricPrice(code);
        return Result.success(price);
    }

    @ApiOperation("设置区域服务电价")
    @PostMapping("/price/{code}")
    public Result<String> setRegionElectricPrice(@PathVariable String code, @RequestBody Map<String, Object> priceDTO) {
        log.info("设置区域服务电价: code={}", code);
        regionService.setRegionElectricPrice(code, priceDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取区域电工数量")
    @GetMapping("/electrician/count/{code}")
    public Result<Integer> getElectricianCount(@PathVariable String code) {
        log.info("获取区域电工数量: code={}", code);
        Integer count = regionService.getElectricianCount(code);
        return Result.success(count);
    }

    @ApiOperation("获取区域订单数量")
    @GetMapping("/order/count/{code}")
    public Result<Integer> getOrderCount(@PathVariable String code) {
        log.info("获取区域订单数量: code={}", code);
        Integer count = regionService.getOrderCount(code);
        return Result.success(count);
    }

    @ApiOperation("获取区域订单分布")
    @GetMapping("/order/distribution")
    public Result<List<Map<String, Object>>> getOrderDistribution() {
        log.info("获取区域订单分布");
        List<Map<String, Object>> distribution = regionService.getOrderDistribution();
        return Result.success(distribution);
    }

    @ApiOperation("获取服务覆盖区域列表")
    @GetMapping("/service/areas")
    public Result<List<RegionVO>> getServiceAreas() {
        log.info("获取服务覆盖区域列表");
        List<RegionVO> areas = regionService.getServiceAreas();
        return Result.success(areas);
    }

    @ApiOperation("添加服务覆盖区域")
    @PostMapping("/service/area")
    public Result<String> addServiceArea(@RequestBody Map<String, Object> areaDTO) {
        log.info("添加服务覆盖区域");
        regionService.addServiceArea(areaDTO);
        return Result.success("添加成功");
    }

    @ApiOperation("移除服务覆盖区域")
    @DeleteMapping("/service/area/{code}")
    public Result<String> removeServiceArea(@PathVariable String code) {
        log.info("移除服务覆盖区域: code={}", code);
        regionService.removeServiceArea(code);
        return Result.success("移除成功");
    }

    @ApiOperation("检查区域是否在服务范围内")
    @GetMapping("/service/check/{code}")
    public Result<Boolean> checkServiceArea(@PathVariable String code) {
        log.info("检查区域是否在服务范围内: code={}", code);
        Boolean inService = regionService.checkServiceArea(code);
        return Result.success(inService);
    }

    @ApiOperation("获取配送时效")
    @GetMapping("/delivery/time/{code}")
    public Result<Map<String, Object>> getDeliveryTime(@PathVariable String code) {
        log.info("获取配送时效: code={}", code);
        Map<String, Object> deliveryTime = regionService.getDeliveryTime(code);
        return Result.success(deliveryTime);
    }

    @ApiOperation("设置配送时效")
    @PostMapping("/delivery/time/{code}")
    public Result<String> setDeliveryTime(@PathVariable String code, @RequestBody Map<String, Object> timeDTO) {
        log.info("设置配送时效: code={}", code);
        regionService.setDeliveryTime(code, timeDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取区域评分")
    @GetMapping("/rating/{code}")
    public Result<Map<String, Object>> getRegionRating(@PathVariable String code) {
        log.info("获取区域评分: code={}", code);
        Map<String, Object> rating = regionService.getRegionRating(code);
        return Result.success(rating);
    }

    @ApiOperation("获取区域统计")
    @GetMapping("/statistics/{code}")
    public Result<Map<String, Object>> getRegionStatistics(@PathVariable String code) {
        log.info("获取区域统计: code={}", code);
        Map<String, Object> statistics = regionService.getRegionStatistics(code);
        return Result.success(statistics);
    }

    @ApiOperation("导出区域数据")
    @GetMapping("/export")
    public void exportRegions(javax.servlet.http.HttpServletResponse response) {
        log.info("导出区域数据");
        regionService.exportRegions(response);
    }

    @ApiOperation("导入区域数据")
    @PostMapping("/import")
    public Result<String> importRegions(@RequestBody List<Map<String, Object>> regions) {
        log.info("导入区域数据: count={}", regions.size());
        regionService.importRegions(regions);
        return Result.success("导入成功");
    }

    @ApiOperation("同步区域数据")
    @PostMapping("/sync")
    public Result<String> syncRegionData() {
        log.info("同步区域数据");
        regionService.syncRegionData();
        return Result.success("同步成功");
    }

    @ApiOperation("获取区域配置")
    @GetMapping("/config/{code}")
    public Result<Map<String, Object>> getRegionConfig(@PathVariable String code) {
        log.info("获取区域配置: code={}", code);
        Map<String, Object> config = regionService.getRegionConfig(code);
        return Result.success(config);
    }

    @ApiOperation("设置区域配置")
    @PostMapping("/config/{code}")
    public Result<String> setRegionConfig(@PathVariable String code, @RequestBody Map<String, Object> configDTO) {
        log.info("设置区域配置: code={}", code);
        regionService.setRegionConfig(code, configDTO);
        return Result.success("设置成功");
    }
}
```

### 4.9 后端核心代码 - 客服管理Controller

```java
package com.andiantong.customer.service.controller;

import com.andiantong.common.core.Result;
import com.andiantong.customer.service.dto.*;
import com.andiantong.customer.service.service.CustomerServiceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "客服管理")
@RestController
@RequestMapping("/api/customer/service")
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceController {

    private final CustomerServiceService customerServiceService;

    @ApiOperation("获取客服列表")
    @GetMapping("/list")
    public Result<List<CustomerServiceVO>> getCustomerServiceList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取客服列表: status={}", status);
        List<CustomerServiceVO> list = customerServiceService.getCustomerServiceList(status, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("获取在线客服")
    @GetMapping("/online")
    public Result<List<CustomerServiceVO>> getOnlineCustomerServices() {
        log.info("获取在线客服");
        List<CustomerServiceVO> list = customerServiceService.getOnlineCustomerServices();
        return Result.success(list);
    }

    @ApiOperation("获取客服详情")
    @GetMapping("/{customerServiceId}")
    public Result<CustomerServiceVO> getCustomerServiceDetail(@PathVariable Long customerServiceId) {
        log.info("获取客服详情: customerServiceId={}", customerServiceId);
        CustomerServiceVO detail = customerServiceService.getCustomerServiceDetail(customerServiceId);
        return Result.success(detail);
    }

    @ApiOperation("添加客服")
    @PostMapping
    public Result<String> addCustomerService(@RequestBody AddCustomerServiceDTO customerServiceDTO) {
        log.info("添加客服: name={}", customerServiceDTO.getName());
        customerServiceService.addCustomerService(customerServiceDTO);
        return Result.success("添加成功");
    }

    @ApiOperation("更新客服信息")
    @PutMapping("/{customerServiceId}")
    public Result<String> updateCustomerService(@PathVariable Long customerServiceId, @RequestBody UpdateCustomerServiceDTO customerServiceDTO) {
        log.info("更新客服信息: customerServiceId={}", customerServiceId);
        customerServiceService.updateCustomerService(customerServiceId, customerServiceDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除客服")
    @DeleteMapping("/{customerServiceId}")
    public Result<String> deleteCustomerService(@PathVariable Long customerServiceId) {
        log.info("删除客服: customerServiceId={}", customerServiceId);
        customerServiceService.deleteCustomerService(customerServiceId);
        return Result.success("删除成功");
    }

    @ApiOperation("设置客服状态")
    @PutMapping("/{customerServiceId}/status")
    public Result<String> setCustomerServiceStatus(@PathVariable Long customerServiceId, @RequestBody Map<String, Integer> statusDTO) {
        Integer status = statusDTO.get("status");
        log.info("设置客服状态: customerServiceId={}, status={}", customerServiceId, status);
        customerServiceService.setCustomerServiceStatus(customerServiceId, status);
        return Result.success("设置成功");
    }

    @ApiOperation("获取会话列表")
    @GetMapping("/conversation/list")
    public Result<List<ConversationVO>> getConversationList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取会话列表: status={}", status);
        List<ConversationVO> list = customerServiceService.getConversationList(status, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("获取会话详情")
    @GetMapping("/conversation/{conversationId}")
    public Result<ConversationDetailVO> getConversationDetail(@PathVariable Long conversationId) {
        log.info("获取会话详情: conversationId={}", conversationId);
        ConversationDetailVO detail = customerServiceService.getConversationDetail(conversationId);
        return Result.success(detail);
    }

    @ApiOperation("创建会话")
    @PostMapping("/conversation")
    public Result<Long> createConversation(@RequestBody CreateConversationDTO conversationDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建会话: userId={}", userId);
        Long conversationId = customerServiceService.createConversation(userId, conversationDTO);
        return Result.success(conversationId);
    }

    @ApiOperation("结束会话")
    @PostMapping("/conversation/{conversationId}/end")
    public Result<String> endConversation(@PathVariable Long conversationId) {
        log.info("结束会话: conversationId={}", conversationId);
        customerServiceService.endConversation(conversationId);
        return Result.success("结束成功");
    }

    @ApiOperation("转接会话")
    @PostMapping("/conversation/{conversationId}/transfer")
    public Result<String> transferConversation(@PathVariable Long conversationId, @RequestBody Map<String, Long> transferDTO) {
        Long toCustomerServiceId = transferDTO.get("toCustomerServiceId");
        log.info("转接会话: conversationId={}, toCustomerServiceId={}", conversationId, toCustomerServiceId);
        customerServiceService.transferConversation(conversationId, toCustomerServiceId);
        return Result.success("转接成功");
    }

    @ApiOperation("获取消息列表")
    @GetMapping("/message/list")
    public Result<List<MessageVO>> getMessageList(
            @RequestParam Long conversationId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "50") Integer pageSize) {
        log.info("获取消息列表: conversationId={}", conversationId);
        List<MessageVO> messages = customerServiceService.getMessageList(conversationId, pageNum, pageSize);
        return Result.success(messages);
    }

    @ApiOperation("发送消息")
    @PostMapping("/message/send")
    public Result<String> sendMessage(@RequestBody SendMessageDTO messageDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("发送消息: userId={}", userId);
        customerServiceService.sendMessage(userId, messageDTO);
        return Result.success("发送成功");
    }

    @ApiOperation("撤回消息")
    @PostMapping("/message/{messageId}/recall")
    public Result<String> recallMessage(@PathVariable Long messageId) {
        log.info("撤回消息: messageId={}", messageId);
        customerServiceService.recallMessage(messageId);
        return Result.success("撤回成功");
    }

    @ApiOperation("删除消息")
    @DeleteMapping("/message/{messageId}")
    public Result<String> deleteMessage(@PathVariable Long messageId) {
        log.info("删除消息: messageId={}", messageId);
        customerServiceService.deleteMessage(messageId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取未读消息数")
    @GetMapping("/message/unread/count")
    public Result<Integer> getUnreadMessageCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取未读消息数: userId={}", userId);
        Integer count = customerServiceService.getUnreadMessageCount(userId);
        return Result.success(count);
    }

    @ApiOperation("标记消息已读")
    @PostMapping("/message/read")
    public Result<String> markMessagesRead(@RequestBody List<Long> messageIds) {
        log.info("标记消息已读: count={}", messageIds.size());
        customerServiceService.markMessagesRead(messageIds);
        return Result.success("标记成功");
    }

    @ApiOperation("获取历史消息")
    @GetMapping("/message/history")
    public Result<List<MessageVO>> getMessageHistory(
            @RequestParam Long conversationId,
            @RequestParam Long beforeMessageId,
            @RequestParam(defaultValue = "20") Integer limit) {
        log.info("获取历史消息: conversationId={}, beforeMessageId={}", conversationId, beforeMessageId);
        List<MessageVO> messages = customerServiceService.getMessageHistory(conversationId, beforeMessageId, limit);
        return Result.success(messages);
    }

    @ApiOperation("获取快捷回复列表")
    @GetMapping("/quick/reply/list")
    public Result<List<QuickReplyVO>> getQuickReplyList() {
        log.info("获取快捷回复列表");
        List<QuickReplyVO> list = customerServiceService.getQuickReplyList();
        return Result.success(list);
    }

    @ApiOperation("添加快捷回复")
    @PostMapping("/quick/reply")
    public Result<String> addQuickReply(@RequestBody QuickReplyDTO quickReplyDTO) {
        log.info("添加快捷回复: content={}", quickReplyDTO.getContent());
        customerServiceService.addQuickReply(quickReplyDTO);
        return Result.success("添加成功");
    }

    @ApiOperation("更新快捷回复")
    @PutMapping("/quick/reply/{replyId}")
    public Result<String> updateQuickReply(@PathVariable Long replyId, @RequestBody QuickReplyDTO quickReplyDTO) {
        log.info("更新快捷回复: replyId={}", replyId);
        customerServiceService.updateQuickReply(replyId, quickReplyDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除快捷回复")
    @DeleteMapping("/quick/reply/{replyId}")
    public Result<String> deleteQuickReply(@PathVariable Long replyId) {
        log.info("删除快捷回复: replyId={}", replyId);
        customerServiceService.deleteQuickReply(replyId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取评价列表")
    @GetMapping("/evaluation/list")
    public Result<List<EvaluationVO>> getEvaluationList(
            @RequestParam(required = false) Long customerServiceId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取评价列表: customerServiceId={}", customerServiceId);
        List<EvaluationVO> list = customerServiceService.getEvaluationList(customerServiceId, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("获取客服统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getCustomerServiceStatistics() {
        log.info("获取客服统计");
        Map<String, Object> statistics = customerServiceService.getCustomerServiceStatistics();
        return Result.success(statistics);
    }

    @ApiOperation("获取会话统计")
    @GetMapping("/conversation/statistics")
    public Result<Map<String, Object>> getConversationStatistics(
            @RequestParam(required = false) Long customerServiceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取会话统计");
        Map<String, Object> statistics = customerServiceService.getConversationStatistics(customerServiceId, startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取响应时间统计")
    @GetMapping("/response/time")
    public Result<Map<String, Object>> getResponseTimeStatistics(
            @RequestParam(required = false) Long customerServiceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取响应时间统计");
        Map<String, Object> statistics = customerServiceService.getResponseTimeStatistics(customerServiceId, startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取满意度统计")
    @GetMapping("/satisfaction")
    public Result<Map<String, Object>> getSatisfactionStatistics(
            @RequestParam(required = false) Long customerServiceId) {
        log.info("获取满意度统计");
        Map<String, Object> statistics = customerServiceService.getSatisfactionStatistics(customerServiceId);
        return Result.success(statistics);
    }

    @ApiOperation("获取在线客服数量")
    @GetMapping("/online/count")
    public Result<Integer> getOnlineCustomerServiceCount() {
        log.info("获取在线客服数量");
        Integer count = customerServiceService.getOnlineCustomerServiceCount();
        return Result.success(count);
    }

    @ApiOperation("获取等待会话数量")
    @GetMapping("/waiting/count")
    public Result<Integer> getWaitingConversationCount() {
        log.info("获取等待会话数量");
        Integer count = customerServiceService.getWaitingConversationCount();
        return Result.success(count);
    }

    @ApiOperation("获取客服工作量统计")
    @GetMapping("/workload/{customerServiceId}")
    public Result<Map<String, Object>> getCustomerServiceWorkload(@PathVariable Long customerServiceId) {
        log.info("获取客服工作量统计: customerServiceId={}", customerServiceId);
        Map<String, Object> workload = customerServiceService.getCustomerServiceWorkload(customerServiceId);
        return Result.success(workload);
    }

    @ApiOperation("分配会话")
    @PostMapping("/conversation/{conversationId}/assign")
    public Result<String> assignConversation(@PathVariable Long conversationId, @RequestBody Map<String, Long> assignDTO) {
        Long customerServiceId = assignDTO.get("customerServiceId");
        log.info("分配会话: conversationId={}, customerServiceId={}", conversationId, customerServiceId);
        customerServiceService.assignConversation(conversationId, customerServiceId);
        return Result.success("分配成功");
    }

    @ApiOperation("获取会话评分")
    @GetMapping("/conversation/{conversationId}/evaluation")
    public Result<EvaluationVO> getConversationEvaluation(@PathVariable Long conversationId) {
        log.info("获取会话评分: conversationId={}", conversationId);
        EvaluationVO evaluation = customerServiceService.getConversationEvaluation(conversationId);
        return Result.success(evaluation);
    }

    @ApiOperation("评价会话")
    @PostMapping("/conversation/{conversationId}/evaluate")
    public Result<String> evaluateConversation(@PathVariable Long conversationId, @RequestBody Map<String, Object> evaluationDTO) {
        log.info("评价会话: conversationId={}", conversationId);
        customerServiceService.evaluateConversation(conversationId, evaluationDTO);
        return Result.success("评价成功");
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(extra_code)

print(f"已追加额外代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
