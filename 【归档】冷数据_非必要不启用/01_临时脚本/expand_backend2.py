#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

more_backend = '''

### 4.4 后端核心代码 - 营销活动Controller

```java
package com.andiantong.marketing.controller;

import com.andiantong.common.core.Result;
import com.andiantong.marketing.dto.*;
import com.andiantong.marketing.service.MarketingService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "营销活动")
@RestController
@RequestMapping("/api/marketing")
@RequiredArgsConstructor
@Slf4j
public class MarketingController {

    private final MarketingService marketingService;

    @ApiOperation("获取活动列表")
    @GetMapping("/activity/list")
    public Result<List<ActivityVO>> getActivityList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取活动列表: status={}", status);
        List<ActivityVO> activities = marketingService.getActivityList(status, pageNum, pageSize);
        return Result.success(activities);
    }

    @ApiOperation("获取进行中的活动")
    @GetMapping("/activity/ongoing")
    public Result<List<ActivityVO>> getOngoingActivities() {
        log.info("获取进行中的活动");
        List<ActivityVO> activities = marketingService.getOngoingActivities();
        return Result.success(activities);
    }

    @ApiOperation("获取活动详情")
    @GetMapping("/activity/{activityId}")
    public Result<ActivityDetailVO> getActivityDetail(@PathVariable Long activityId) {
        log.info("获取活动详情: activityId={}", activityId);
        ActivityDetailVO detail = marketingService.getActivityDetail(activityId);
        return Result.success(detail);
    }

    @ApiOperation("参与活动")
    @PostMapping("/activity/{activityId}/join")
    public Result<String> joinActivity(@PathVariable Long activityId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("参与活动: userId={}, activityId={}", userId, activityId);
        marketingService.joinActivity(userId, activityId);
        return Result.success("参与成功");
    }

    @ApiOperation("获取我的活动")
    @GetMapping("/activity/my")
    public Result<List<MyActivityVO>> getMyActivities(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的活动: userId={}", userId);
        List<MyActivityVO> activities = marketingService.getMyActivities(userId);
        return Result.success(activities);
    }

    @ApiOperation("获取活动排行榜")
    @GetMapping("/activity/{activityId}/ranking")
    public Result<Map<String, Object>> getActivityRanking(
            @PathVariable Long activityId,
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取活动排行榜: activityId={}, limit={}", activityId, limit);
        Map<String, Object> ranking = marketingService.getActivityRanking(activityId, limit);
        return Result.success(ranking);
    }

    @ApiOperation("分享活动")
    @PostMapping("/activity/{activityId}/share")
    public Result<String> shareActivity(@PathVariable Long activityId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("分享活动: userId={}, activityId={}", userId, activityId);
        marketingService.shareActivity(userId, activityId);
        return Result.success("分享成功");
    }

    @ApiOperation("创建秒杀活动")
    @PostMapping("/seckill")
    public Result<String> createSeckillActivity(@RequestBody SeckillActivityDTO activityDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建秒杀活动: userId={}", userId);
        marketingService.createSeckillActivity(activityDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("获取秒杀场次")
    @GetMapping("/seckill/sessions")
    public Result<List<Map<String, Object>>> getSeckillSessions() {
        log.info("获取秒杀场次");
        List<Map<String, Object>> sessions = marketingService.getSeckillSessions();
        return Result.success(sessions);
    }

    @ApiOperation("获取秒杀商品列表")
    @GetMapping("/seckill/products")
    public Result<List<Map<String, Object>>> getSeckillProducts(
            @RequestParam Long sessionId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取秒杀商品列表: sessionId={}", sessionId);
        List<Map<String, Object>> products = marketingService.getSeckillProducts(sessionId, pageNum, pageSize);
        return Result.success(products);
    }

    @ApiOperation("抢购秒杀商品")
    @PostMapping("/seckill/{productId}/grab")
    public Result<String> grabSeckillProduct(@PathVariable Long productId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("抢购秒杀商品: userId={}, productId={}", userId, productId);
        marketingService.grabSeckillProduct(userId, productId);
        return Result.success("抢购成功");
    }

    @ApiOperation("获取我的秒杀订单")
    @GetMapping("/seckill/orders")
    public Result<List<Map<String, Object>>> getSeckillOrders(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的秒杀订单: userId={}", userId);
        List<Map<String, Object>> orders = marketingService.getSeckillOrders(userId);
        return Result.success(orders);
    }

    @ApiOperation("创建拼团活动")
    @PostMapping("/groupon")
    public Result<String> createGrouponActivity(@RequestBody GrouponActivityDTO activityDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建拼团活动: userId={}", userId);
        marketingService.createGrouponActivity(activityDTO, userId);
        return Result.success("创建成功");
    }

    @ApiOperation("参与拼团")
    @PostMapping("/groupon/{groupId}/join")
    public Result<String> joinGroupon(@PathVariable Long groupId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("参与拼团: userId={}, groupId={}", userId, groupId);
        marketingService.joinGroupon(userId, groupId);
        return Result.success("参与成功");
    }

    @ApiOperation("获取拼团详情")
    @GetMapping("/groupon/{groupId}")
    public Result<Map<String, Object>> getGrouponDetail(@PathVariable Long groupId) {
        log.info("获取拼团详情: groupId={}", groupId);
        Map<String, Object> detail = marketingService.getGrouponDetail(groupId);
        return Result.success(detail);
    }

    @ApiOperation("获取我的拼团")
    @GetMapping("/groupon/my")
    public Result<List<Map<String, Object>>> getMyGroupons(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的拼团: userId={}", userId);
        List<Map<String, Object>> groupons = marketingService.getMyGroupons(userId);
        return Result.success(groupons);
    }

    @ApiOperation("开团")
    @PostMapping("/groupon/{activityId}/start")
    public Result<Map<String, Object>> startGroupon(@PathVariable Long activityId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("开团: userId={}, activityId={}", userId, activityId);
        Map<String, Object> result = marketingService.startGroupon(userId, activityId);
        return Result.success(result);
    }

    @ApiOperation("获取砍价活动列表")
    @GetMapping("/bargain/activities")
    public Result<List<Map<String, Object>>> getBargainActivities() {
        log.info("获取砍价活动列表");
        List<Map<String, Object>> activities = marketingService.getBargainActivities();
        return Result.success(activities);
    }

    @ApiOperation("发起砍价")
    @PostMapping("/bargain/{activityId}/start")
    public Result<Map<String, Object>> startBargain(@PathVariable Long activityId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("发起砍价: userId={}, activityId={}", userId, activityId);
        Map<String, Object> result = marketingService.startBargain(userId, activityId);
        return Result.success(result);
    }

    @ApiOperation("帮好友砍价")
    @PostMapping("/bargain/{bargainId}/help")
    public Result<Map<String, Object>> helpBargain(@PathVariable Long bargainId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("帮好友砍价: userId={}, bargainId={}", userId, bargainId);
        Map<String, Object> result = marketingService.helpBargain(userId, bargainId);
        return Result.success(result);
    }

    @ApiOperation("获取砍价详情")
    @GetMapping("/bargain/{bargainId}")
    public Result<Map<String, Object>> getBargainDetail(@PathVariable Long bargainId) {
        log.info("获取砍价详情: bargainId={}", bargainId);
        Map<String, Object> detail = marketingService.getBargainDetail(bargainId);
        return Result.success(detail);
    }

    @ApiOperation("获取我的砍价")
    @GetMapping("/bargain/my")
    public Result<List<Map<String, Object>>> getMyBargains(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的砍价: userId={}", userId);
        List<Map<String, Object>> bargains = marketingService.getMyBargains(userId);
        return Result.success(bargains);
    }

    @ApiOperation("获取积分商品列表")
    @GetMapping("/points/mall")
    public Result<List<Map<String, Object>>> getPointsMallProducts(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取积分商品列表");
        List<Map<String, Object>> products = marketingService.getPointsMallProducts(pageNum, pageSize);
        return Result.success(products);
    }

    @ApiOperation("兑换积分商品")
    @PostMapping("/points/mall/{productId}/exchange")
    public Result<String> exchangePointsProduct(@PathVariable Long productId, @RequestBody Map<String, Object> exchangeDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("兑换积分商品: userId={}, productId={}", userId, productId);
        marketingService.exchangePointsProduct(userId, productId, exchangeDTO);
        return Result.success("兑换成功");
    }

    @ApiOperation("获取签到配置")
    @GetMapping("/signin/config")
    public Result<Map<String, Object>> getSignInConfig() {
        log.info("获取签到配置");
        Map<String, Object> config = marketingService.getSignInConfig();
        return Result.success(config);
    }

    @ApiOperation("签到")
    @PostMapping("/signin")
    public Result<Map<String, Object>> signIn(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("签到: userId={}", userId);
        Map<String, Object> result = marketingService.signIn(userId);
        return Result.success(result);
    }

    @ApiOperation("获取签到记录")
    @GetMapping("/signin/records")
    public Result<List<Map<String, Object>>> getSignInRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "30") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取签到记录: userId={}", userId);
        List<Map<String, Object>> records = marketingService.getSignInRecords(userId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("获取连续签到奖励")
    @GetMapping("/signin/rewards")
    public Result<List<Map<String, Object>>> getSignInRewards() {
        log.info("获取连续签到奖励");
        List<Map<String, Object>> rewards = marketingService.getSignInRewards();
        return Result.success(rewards);
    }

    @ApiOperation("领取连续签到奖励")
    @PostMapping("/signin/reward/{days}")
    public Result<String> receiveSignInReward(@PathVariable Integer days, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取连续签到奖励: userId={}, days={}", userId, days);
        marketingService.receiveSignInReward(userId, days);
        return Result.success("领取成功");
    }

    @ApiOperation("获取邀请奖励配置")
    @GetMapping("/invite/config")
    public Result<Map<String, Object>> getInviteConfig() {
        log.info("获取邀请奖励配置");
        Map<String, Object> config = marketingService.getInviteConfig();
        return Result.success(config);
    }

    @ApiOperation("邀请好友")
    @PostMapping("/invite")
    public Result<Map<String, Object>> inviteFriend(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("邀请好友: userId={}", userId);
        Map<String, Object> result = marketingService.inviteFriend(userId);
        return Result.success(result);
    }

    @ApiOperation("绑定邀请关系")
    @PostMapping("/invite/bind")
    public Result<String> bindInviteRelation(@RequestBody Map<String, String> bindDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String inviteCode = bindDTO.get("inviteCode");
        log.info("绑定邀请关系: userId={}, inviteCode={}", userId, inviteCode);
        marketingService.bindInviteRelation(userId, inviteCode);
        return Result.success("绑定成功");
    }

    @ApiOperation("获取邀请好友列表")
    @GetMapping("/invite/friends")
    public Result<List<Map<String, Object>>> getInviteFriends(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取邀请好友列表: userId={}", userId);
        List<Map<String, Object>> friends = marketingService.getInviteFriends(userId);
        return Result.success(friends);
    }

    @ApiOperation("获取邀请奖励")
    @GetMapping("/invite/rewards")
    public Result<Map<String, Object>> getInviteRewards(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取邀请奖励: userId={}", userId);
        Map<String, Object> rewards = marketingService.getInviteRewards(userId);
        return Result.success(rewards);
    }

    @ApiOperation("获取任务列表")
    @GetMapping("/task/list")
    public Result<List<Map<String, Object>>> getTaskList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取任务列表: userId={}", userId);
        List<Map<String, Object>> tasks = marketingService.getTaskList(userId);
        return Result.success(tasks);
    }

    @ApiOperation("领取任务奖励")
    @PostMapping("/task/{taskId}/reward")
    public Result<String> receiveTaskReward(@PathVariable Long taskId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取任务奖励: userId={}, taskId={}", userId, taskId);
        marketingService.receiveTaskReward(userId, taskId);
        return Result.success("领取成功");
    }

    @ApiOperation("获取每日任务")
    @GetMapping("/task/daily")
    public Result<List<Map<String, Object>>> getDailyTasks(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取每日任务: userId={}", userId);
        List<Map<String, Object>> tasks = marketingService.getDailyTasks(userId);
        return Result.success(tasks);
    }

    @ApiOperation("获取新手任务")
    @GetMapping("/task/newbie")
    public Result<List<Map<String, Object>>> getNewbieTasks(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取新手任务: userId={}", userId);
        List<Map<String, Object>> tasks = marketingService.getNewbieTasks(userId);
        return Result.success(tasks);
    }

    @ApiOperation("完成任务")
    @PostMapping("/task/{taskId}/complete")
    public Result<String> completeTask(@PathVariable Long taskId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("完成任务: userId={}, taskId={}", userId, taskId);
        marketingService.completeTask(userId, taskId);
        return Result.success("完成成功");
    }
}
```

### 4.5 后端核心代码 - 数据字典管理

```java
package com.andiantong.dict.controller;

import com.andiantong.common.core.Result;
import com.andiantong.dict.dto.*;
import com.andiantong.dict.service.DataDictService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Api(tags = "数据字典")
@RestController
@RequestMapping("/api/dict")
@RequiredArgsConstructor
@Slf4j
public class DataDictController {

    private final DataDictService dataDictService;

    @ApiOperation("获取字典类型列表")
    @GetMapping("/type/list")
    public Result<List<DictTypeVO>> getDictTypeList() {
        log.info("获取字典类型列表");
        List<DictTypeVO> types = dataDictService.getDictTypeList();
        return Result.success(types);
    }

    @ApiOperation("获取字典类型详情")
    @GetMapping("/type/{dictTypeId}")
    public Result<DictTypeVO> getDictTypeDetail(@PathVariable Long dictTypeId) {
        log.info("获取字典类型详情: dictTypeId={}", dictTypeId);
        DictTypeVO detail = dataDictService.getDictTypeDetail(dictTypeId);
        return Result.success(detail);
    }

    @ApiOperation("新增字典类型")
    @PostMapping("/type")
    public Result<String> addDictType(@RequestBody DictTypeDTO dictTypeDTO) {
        log.info("新增字典类型: name={}", dictTypeDTO.getName());
        dataDictService.addDictType(dictTypeDTO);
        return Result.success("新增成功");
    }

    @ApiOperation("修改字典类型")
    @PutMapping("/type/{dictTypeId}")
    public Result<String> updateDictType(@PathVariable Long dictTypeId, @RequestBody DictTypeDTO dictTypeDTO) {
        log.info("修改字典类型: dictTypeId={}", dictTypeId);
        dataDictService.updateDictType(dictTypeId, dictTypeDTO);
        return Result.success("修改成功");
    }

    @ApiOperation("删除字典类型")
    @DeleteMapping("/type/{dictTypeId}")
    public Result<String> deleteDictType(@PathVariable Long dictTypeId) {
        log.info("删除字典类型: dictTypeId={}", dictTypeId);
        dataDictService.deleteDictType(dictTypeId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取字典数据列表")
    @GetMapping("/data/list")
    public Result<List<DictDataVO>> getDictDataList(@RequestParam String dictType) {
        log.info("获取字典数据列表: dictType={}", dictType);
        List<DictDataVO> dataList = dataDictService.getDictDataList(dictType);
        return Result.success(dataList);
    }

    @ApiOperation("获取字典数据详情")
    @GetMapping("/data/{dictDataId}")
    public Result<DictDataVO> getDictDataDetail(@PathVariable Long dictDataId) {
        log.info("获取字典数据详情: dictDataId={}", dictDataId);
        DictDataVO detail = dataDictService.getDictDataDetail(dictDataId);
        return Result.success(detail);
    }

    @ApiOperation("新增字典数据")
    @PostMapping("/data")
    public Result<String> addDictData(@RequestBody DictDataDTO dictDataDTO) {
        log.info("新增字典数据: label={}", dictDataDTO.getLabel());
        dataDictService.addDictData(dictDataDTO);
        return Result.success("新增成功");
    }

    @ApiOperation("修改字典数据")
    @PutMapping("/data/{dictDataId}")
    public Result<String> updateDictData(@PathVariable Long dictDataId, @RequestBody DictDataDTO dictDataDTO) {
        log.info("修改字典数据: dictDataId={}", dictDataId);
        dataDictService.updateDictData(dictDataId, dictDataDTO);
        return Result.success("修改成功");
    }

    @ApiOperation("删除字典数据")
    @DeleteMapping("/data/{dictDataId}")
    public Result<String> deleteDictData(@PathVariable Long dictDataId) {
        log.info("删除字典数据: dictDataId={}", dictDataId);
        dataDictService.deleteDictData(dictDataId);
        return Result.success("删除成功");
    }

    @ApiOperation("导出字典数据")
    @GetMapping("/export")
    public void exportDictData(@RequestParam String dictType, javax.servlet.http.HttpServletResponse response) {
        log.info("导出字典数据: dictType={}", dictType);
        dataDictService.exportDictData(dictType, response);
    }

    @ApiOperation("导入字典数据")
    @PostMapping("/import")
    public Result<String> importDictData(@RequestBody Map<String, Object> importData) {
        log.info("导入字典数据");
        dataDictService.importDictData(importData);
        return Result.success("导入成功");
    }

    @ApiOperation("刷新字典缓存")
    @PostMapping("/refresh")
    public Result<String> refreshDictCache() {
        log.info("刷新字典缓存");
        dataDictService.refreshDictCache();
        return Result.success("刷新成功");
    }

    @ApiOperation("根据字典类型查询字典数据")
    @GetMapping("/query")
    public Result<List<Map<String, Object>>> queryByDictType(@RequestParam String dictType) {
        log.info("根据字典类型查询字典数据: dictType={}", dictType);
        List<Map<String, Object>> dataList = dataDictService.queryByDictType(dictType);
        return Result.success(dataList);
    }

    @ApiOperation("根据字典标签查询字典值")
    @GetMapping("/value")
    public Result<String> getDictValue(@RequestParam String dictType, @RequestParam String dictLabel) {
        log.info("根据字典标签查询字典值: dictType={}, dictLabel={}", dictType, dictLabel);
        String dictValue = dataDictService.getDictValue(dictType, dictLabel);
        return Result.success(dictValue);
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(more_backend)

print(f"已追加后端代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
