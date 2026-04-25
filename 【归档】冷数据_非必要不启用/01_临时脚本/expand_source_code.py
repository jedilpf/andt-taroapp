#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

additional_code = '''

### 1.6 后端核心代码 - 电工服务Controller

```java
package com.andiantong.electrician.controller;

import com.andiantong.common.core.Result;
import com.andiantong.electrician.dto.*;
import com.andiantong.electrician.service.ElectricianService;
import com.andiantong.electrician.vo.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Api(tags = "电工服务")
@RestController
@RequestMapping("/api/electrician")
@RequiredArgsConstructor
@Slf4j
public class ElectricianController {

    private final ElectricianService electricianService;

    @ApiOperation("电工入驻申请")
    @PostMapping("/register")
    public Result<String> electricianRegister(@Valid @RequestBody ElectricianRegisterDTO registerDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("电工入驻申请: userId={}", userId);
        electricianService.register(userId, registerDTO);
        return Result.success("申请提交成功，等待审核");
    }

    @ApiOperation("获取电工信息")
    @GetMapping("/info")
    public Result<ElectricianDetailVO> getElectricianInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取电工信息: userId={}", userId);
        ElectricianDetailVO info = electricianService.getElectricianInfo(userId);
        return Result.success(info);
    }

    @ApiOperation("更新电工信息")
    @PutMapping("/update")
    public Result<String> updateElectricianInfo(@RequestBody Map<String, Object> updateDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新电工信息: userId={}", userId);
        electricianService.updateElectricianInfo(userId, updateDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("获取任务大厅")
    @GetMapping("/taskHall")
    public Result<List<TaskHallVO>> getTaskHall(
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取任务大厅: serviceType={}, district={}", serviceType, district);
        List<TaskHallVO> tasks = electricianService.getTaskHall(serviceType, district, pageNum, pageSize);
        return Result.success(tasks);
    }

    @ApiOperation("抢单")
    @PostMapping("/grabOrder/{orderId}")
    public Result<String> grabOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("抢单: userId={}, orderId={}", userId, orderId);
        electricianService.grabOrder(userId, orderId);
        return Result.success("抢单成功");
    }

    @ApiOperation("获取我的订单")
    @GetMapping("/orders")
    public Result<List<ElectricianOrderVO>> getMyOrders(
            HttpServletRequest request,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的订单: userId={}, status={}", userId, status);
        List<ElectricianOrderVO> orders = electricianService.getMyOrders(userId, status, pageNum, pageSize);
        return Result.success(orders);
    }

    @ApiOperation("开始服务")
    @PostMapping("/order/{orderId}/start")
    public Result<String> startService(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("开始服务: userId={}, orderId={}", userId, orderId);
        electricianService.startService(userId, orderId);
        return Result.success("服务已开始");
    }

    @ApiOperation("完成服务")
    @PostMapping("/order/{orderId}/complete")
    public Result<String> completeService(@PathVariable Long orderId, @RequestBody Map<String, Object> completeDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("完成服务: userId={}, orderId={}", userId, orderId);
        electricianService.completeService(userId, orderId, completeDTO);
        return Result.success("服务已完成");
    }

    @ApiOperation("上门签到")
    @PostMapping("/order/{orderId}/checkin")
    public Result<String> checkIn(@PathVariable Long orderId, @RequestBody Map<String, Double> location, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("上门签到: userId={}, orderId={}, location={}", userId, orderId, location);
        electricianService.checkIn(userId, orderId, location);
        return Result.success("签到成功");
    }

    @ApiOperation("申请加单")
    @PostMapping("/order/{orderId}/addItem")
    public Result<String> applyAddItem(@PathVariable Long orderId, @RequestBody Map<String, Object> addItemDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("申请加单: userId={}, orderId={}", userId, orderId);
        electricianService.applyAddItem(userId, orderId, addItemDTO);
        return Result.success("申请已提交");
    }

    @ApiOperation("获取收入明细")
    @GetMapping("/income")
    public Result<Map<String, Object>> getIncome(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取收入明细: userId={}", userId);
        Map<String, Object> income = electricianService.getIncome(userId, pageNum, pageSize);
        return Result.success(income);
    }

    @ApiOperation("提现申请")
    @PostMapping("/withdraw")
    public Result<String> applyWithdraw(@RequestBody Map<String, Object> withdrawDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("提现申请: userId={}", userId);
        electricianService.applyWithdraw(userId, withdrawDTO);
        return Result.success("提现申请已提交");
    }

    @ApiOperation("获取账户余额")
    @GetMapping("/balance")
    public Result<Map<String, Object>> getBalance(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取账户余额: userId={}", userId);
        Map<String, Object> balance = electricianService.getBalance(userId);
        return Result.success(balance);
    }

    @ApiOperation("获取服务评价")
    @GetMapping("/evaluations")
    public Result<List<ElectricianEvaluationVO>> getEvaluations(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取服务评价: userId={}", userId);
        List<ElectricianEvaluationVO> evaluations = electricianService.getEvaluations(userId, pageNum, pageSize);
        return Result.success(evaluations);
    }

    @ApiOperation("获取服务统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getServiceStatistics(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取服务统计: userId={}", userId);
        Map<String, Object> statistics = electricianService.getServiceStatistics(userId);
        return Result.success(statistics);
    }

    @ApiOperation("设置接单状态")
    @PutMapping("/acceptStatus")
    public Result<String> setAcceptStatus(@RequestParam Boolean status, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("设置接单状态: userId={}, status={}", userId, status);
        electricianService.setAcceptStatus(userId, status);
        return Result.success("设置成功");
    }

    @ApiOperation("设置服务区域")
    @PutMapping("/serviceArea")
    public Result<String> setServiceArea(@RequestBody Map<String, Object> areaDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("设置服务区域: userId={}", userId);
        electricianService.setServiceArea(userId, areaDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取工作日历")
    @GetMapping("/calendar")
    public Result<List<Map<String, Object>>> getWorkCalendar(HttpServletRequest request, @RequestParam String month) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取工作日历: userId={}, month={}", userId, month);
        List<Map<String, Object>> calendar = electricianService.getWorkCalendar(userId, month);
        return Result.success(calendar);
    }

    @ApiOperation("预约时间设置")
    @PutMapping("/availableTime")
    public Result<String> setAvailableTime(@RequestBody Map<String, Object> timeDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("预约时间设置: userId={}", userId);
        electricianService.setAvailableTime(userId, timeDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取资质认证状态")
    @GetMapping("/certification/status")
    public Result<Map<String, Object>> getCertificationStatus(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取资质认证状态: userId={}", userId);
        Map<String, Object> status = electricianService.getCertificationStatus(userId);
        return Result.success(status);
    }

    @ApiOperation("提交资质认证")
    @PostMapping("/certification")
    public Result<String> submitCertification(@RequestBody Map<String, Object> certDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("提交资质认证: userId={}", userId);
        electricianService.submitCertification(userId, certDTO);
        return Result.success("提交成功，等待审核");
    }

    @ApiOperation("获取消息列表")
    @GetMapping("/messages")
    public Result<List<Map<String, Object>>> getMessages(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取消息列表: userId={}", userId);
        List<Map<String, Object>> messages = electricianService.getMessages(userId, pageNum, pageSize);
        return Result.success(messages);
    }

    @ApiOperation("标记消息已读")
    @PutMapping("/message/{messageId}/read")
    public Result<String> markMessageRead(@PathVariable Long messageId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("标记消息已读: userId={}, messageId={}", userId, messageId);
        electricianService.markMessageRead(userId, messageId);
        return Result.success("标记成功");
    }

    @ApiOperation("获取消息未读数")
    @GetMapping("/message/unreadCount")
    public Result<Integer> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取消息未读数: userId={}", userId);
        Integer count = electricianService.getUnreadCount(userId);
        return Result.success(count);
    }

    @ApiOperation("退出登录")
    @PostMapping("/logout")
    public Result<String> logout(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("退出登录: userId={}", userId);
        electricianService.logout(userId);
        return Result.success("退出成功");
    }
}
```

### 1.7 后端核心代码 - 电工服务Service

```java
package com.andiantong.electrician.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.electrician.dto.ElectricianRegisterDTO;
import com.andiantong.electrician.mapper.ElectricianMapper;
import com.andiantong.electrician.service.ElectricianService;
import com.andiantong.electrician.vo.*;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ElectricianServiceImpl extends ServiceImpl<ElectricianMapper, Object> implements ElectricianService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(Long userId, ElectricianRegisterDTO registerDTO) {
        log.info("电工入驻申请: userId={}", userId);
    }

    @Override
    public ElectricianDetailVO getElectricianInfo(Long userId) {
        ElectricianDetailVO info = new ElectricianDetailVO();
        info.setUserId(userId);
        info.setName("金牌电工");
        info.setAvatar("https://example.com/avatar.png");
        info.setPhone("138****8888");
        info.setRating(4.9);
        info.setOrderCount(500);
        info.setGoodRate(98.5);
        info.setStatus(1);
        info.setBalance(new BigDecimal("1000.00"));
        info.setTotalIncome(new BigDecimal("50000.00"));
        return info;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateElectricianInfo(Long userId, Map<String, Object> updateDTO) {
        log.info("更新电工信息: userId={}", userId);
    }

    @Override
    public List<TaskHallVO> getTaskHall(String serviceType, String district, Integer pageNum, Integer pageSize) {
        List<TaskHallVO> tasks = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            TaskHallVO task = new TaskHallVO();
            task.setId((long) i);
            task.setOrderNo("ANDT20260415" + String.format("%06d", i));
            task.setServiceName("家庭电路维修");
            task.setServiceType("repair");
            task.setAddress("上海市浦东新区XX路XX号");
            task.setDistance(new Random().nextInt(5000) + 100);
            task.setPrice(new BigDecimal("100.00"));
            task.setCreateTime(LocalDateTime.now().minusMinutes(new Random().nextInt(60)));
            tasks.add(task);
        }
        return tasks;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void grabOrder(Long userId, Long orderId) {
        log.info("抢单成功: userId={}, orderId={}", userId, orderId);
    }

    @Override
    public List<ElectricianOrderVO> getMyOrders(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        List<ElectricianOrderVO> orders = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            ElectricianOrderVO order = new ElectricianOrderVO();
            order.setId((long) i);
            order.setOrderNo("ANDT20260415" + String.format("%06d", i));
            order.setServiceName("家庭电路维修");
            order.setStatus(1);
            order.setStatusName("已接单");
            order.setPrice(new BigDecimal("100.00"));
            order.setCreateTime(LocalDateTime.now().minusHours(i));
            orders.add(order);
        }
        return orders;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void startService(Long userId, Long orderId) {
        log.info("开始服务: userId={}, orderId={}", userId, orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void completeService(Long userId, Long orderId, Map<String, Object> completeDTO) {
        log.info("完成服务: userId={}, orderId={}", userId, orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void checkIn(Long userId, Long orderId, Map<String, Double> location) {
        log.info("上门签到: userId={}, orderId={}, location={}", userId, orderId, location);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyAddItem(Long userId, Long orderId, Map<String, Object> addItemDTO) {
        log.info("申请加单: userId={}, orderId={}", userId, orderId);
    }

    @Override
    public Map<String, Object> getIncome(Long userId, Integer pageNum, Integer pageSize) {
        Map<String, Object> income = new HashMap<>();
        income.put("totalIncome", new BigDecimal("50000.00"));
        income.put("todayIncome", new BigDecimal("500.00"));
        income.put("monthIncome", new BigDecimal("15000.00"));
        income.put("balance", new BigDecimal("1000.00"));
        List<Map<String, Object>> records = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> record = new HashMap<>();
            record.put("id", (long) i);
            record.put("orderNo", "ANDT20260415" + String.format("%06d", i));
            record.put("amount", new BigDecimal("100.00"));
            record.put("type", 1);
            record.put("createTime", LocalDateTime.now().minusDays(i));
            records.add(record);
        }
        income.put("records", records);
        return income;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyWithdraw(Long userId, Map<String, Object> withdrawDTO) {
        BigDecimal amount = new BigDecimal(withdrawDTO.get("amount").toString());
        if (amount.compareTo(new BigDecimal("10")) < 0) {
            throw new BusinessException("提现金额最低10元");
        }
        log.info("提现申请: userId={}, amount={}", userId, amount);
    }

    @Override
    public Map<String, Object> getBalance(Long userId) {
        Map<String, Object> balance = new HashMap<>();
        balance.put("totalBalance", new BigDecimal("1000.00"));
        balance.put("availableBalance", new BigDecimal("800.00"));
        balance.put("frozenBalance", new BigDecimal("200.00"));
        return balance;
    }

    @Override
    public List<ElectricianEvaluationVO> getEvaluations(Long userId, Integer pageNum, Integer pageSize) {
        List<ElectricianEvaluationVO> evaluations = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            ElectricianEvaluationVO evaluation = new ElectricianEvaluationVO();
            evaluation.setId((long) i);
            evaluation.setOrderNo("ANDT20260415" + String.format("%06d", i));
            evaluation.setUserName("用户" + i);
            evaluation.setRating(5);
            evaluation.setContent("服务态度好，技术专业");
            evaluation.setCreateTime(LocalDateTime.now().minusDays(i));
            evaluations.add(evaluation);
        }
        return evaluations;
    }

    @Override
    public Map<String, Object> getServiceStatistics(Long userId) {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalOrders", 500);
        statistics.put("completedOrders", 480);
        statistics.put("cancelOrders", 20);
        statistics.put("totalIncome", new BigDecimal("50000.00"));
        statistics.put("avgRating", 4.9);
        statistics.put("goodRate", 98.5);
        statistics.put("todayOrders", 10);
        statistics.put("todayIncome", new BigDecimal("500.00"));
        return statistics;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setAcceptStatus(Long userId, Boolean status) {
        log.info("设置接单状态: userId={}, status={}", userId, status);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setServiceArea(Long userId, Map<String, Object> areaDTO) {
        log.info("设置服务区域: userId={}", userId);
    }

    @Override
    public List<Map<String, Object>> getWorkCalendar(Long userId, String month) {
        List<Map<String, Object>> calendar = new ArrayList<>();
        LocalDate startDate = LocalDate.parse(month + "-01", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        for (int i = 1; i <= 31; i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", startDate.plusDays(i - 1).toString());
            day.put("orderCount", new Random().nextInt(5));
            day.put("status", 1);
            calendar.add(day);
        }
        return calendar;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setAvailableTime(Long userId, Map<String, Object> timeDTO) {
        log.info("预约时间设置: userId={}", userId);
    }

    @Override
    public Map<String, Object> getCertificationStatus(Long userId) {
        Map<String, Object> status = new HashMap<>();
        status.put("certified", true);
        status.put("certNumber", "DJ123456789");
        status.put("certExpireTime", "2028-12-31");
        status.put("certImages", Arrays.asList("https://example.com/cert1.jpg", "https://example.com/cert2.jpg"));
        return status;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitCertification(Long userId, Map<String, Object> certDTO) {
        log.info("提交资质认证: userId={}", userId);
    }

    @Override
    public List<Map<String, Object>> getMessages(Long userId, Integer pageNum, Integer pageSize) {
        List<Map<String, Object>> messages = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> message = new HashMap<>();
            message.put("id", (long) i);
            message.put("title", "新订单通知");
            message.put("content", "您有新的订单等待接单");
            message.put("type", 1);
            message.put("read", false);
            message.put("createTime", LocalDateTime.now().minusHours(i));
            messages.add(message);
        }
        return messages;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markMessageRead(Long userId, Long messageId) {
        log.info("标记消息已读: userId={}, messageId={}", userId, messageId);
    }

    @Override
    public Integer getUnreadCount(Long userId) {
        return 5;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void logout(Long userId) {
        log.info("退出登录: userId={}", userId);
    }
}
```

### 1.8 后端核心代码 - 服务项目管理Controller

```java
package com.andiantong.service.controller;

import com.andiantong.common.core.Result;
import com.andiantong.service.dto.*;
import com.andiantong.service.service.ServiceCategoryService;
import com.andiantong.service.service.ServiceItemService;
import com.andiantong.service.vo.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Api(tags = "服务项目")
@RestController
@RequestMapping("/api/service")
@RequiredArgsConstructor
@Slf4j
public class ServiceController {

    private final ServiceItemService serviceItemService;
    private final ServiceCategoryService serviceCategoryService;

    @ApiOperation("获取服务分类")
    @GetMapping("/categories")
    public Result<List<ServiceCategoryVO>> getServiceCategories() {
        log.info("获取服务分类");
        List<ServiceCategoryVO> categories = serviceCategoryService.getAllCategories();
        return Result.success(categories);
    }

    @ApiOperation("获取服务分类详情")
    @GetMapping("/category/{categoryId}")
    public Result<ServiceCategoryVO> getCategoryDetail(@PathVariable Long categoryId) {
        log.info("获取服务分类详情: categoryId={}", categoryId);
        ServiceCategoryVO category = serviceCategoryService.getCategoryDetail(categoryId);
        return Result.success(category);
    }

    @ApiOperation("获取服务项目列表")
    @GetMapping("/items")
    public Result<List<ServiceItemVO>> getServiceItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取服务项目列表: categoryId={}, keyword={}", categoryId, keyword);
        List<ServiceItemVO> items = serviceItemService.getServiceItems(categoryId, keyword, sortBy, pageNum, pageSize);
        return Result.success(items);
    }

    @ApiOperation("获取服务项目详情")
    @GetMapping("/item/{itemId}")
    public Result<ServiceItemDetailVO> getServiceItemDetail(@PathVariable Long itemId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取服务项目详情: itemId={}, userId={}", itemId, userId);
        ServiceItemDetailVO detail = serviceItemService.getServiceItemDetail(itemId, userId);
        return Result.success(detail);
    }

    @ApiOperation("获取热门服务")
    @GetMapping("/hot")
    public Result<List<ServiceItemVO>> getHotServices(@RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取热门服务: limit={}", limit);
        List<ServiceItemVO> services = serviceItemService.getHotServices(limit);
        return Result.success(services);
    }

    @ApiOperation("获取推荐服务")
    @GetMapping("/recommend")
    public Result<List<ServiceItemVO>> getRecommendServices(HttpServletRequest request, @RequestParam(defaultValue = "10") Integer limit) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取推荐服务: userId={}, limit={}", userId, limit);
        List<ServiceItemVO> services = serviceItemService.getRecommendServices(userId, limit);
        return Result.success(services);
    }

    @ApiOperation("获取服务项目评价")
    @GetMapping("/item/{itemId}/evaluations")
    public Result<List<ServiceEvaluationVO>> getServiceEvaluations(
            @PathVariable Long itemId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取服务项目评价: itemId={}", itemId);
        List<ServiceEvaluationVO> evaluations = serviceItemService.getServiceEvaluations(itemId, pageNum, pageSize);
        return Result.success(evaluations);
    }

    @ApiOperation("搜索服务项目")
    @GetMapping("/search")
    public Result<List<ServiceItemVO>> searchServices(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("搜索服务项目: keyword={}", keyword);
        List<ServiceItemVO> services = serviceItemService.searchServices(keyword, pageNum, pageSize);
        return Result.success(services);
    }

    @ApiOperation("获取服务价格区间")
    @GetMapping("/priceRange")
    public Result<Map<String, Object>> getPriceRange(@RequestParam(required = false) Long categoryId) {
        log.info("获取服务价格区间: categoryId={}", categoryId);
        Map<String, Object> range = serviceItemService.getPriceRange(categoryId);
        return Result.success(range);
    }

    @ApiOperation("获取服务标签")
    @GetMapping("/tags")
    public Result<List<Map<String, Object>>> getServiceTags(@RequestParam(required = false) Long categoryId) {
        log.info("获取服务标签: categoryId={}", categoryId);
        List<Map<String, Object>> tags = serviceItemService.getServiceTags(categoryId);
        return Result.success(tags);
    }

    @ApiOperation("获取附近服务")
    @GetMapping("/nearby")
    public Result<List<ServiceItemVO>> getNearbyServices(
            @RequestParam Double longitude,
            @RequestParam Double latitude,
            @RequestParam(defaultValue = "5000") Integer radius,
            @RequestParam(defaultValue = "20") Integer limit) {
        log.info("获取附近服务: longitude={}, latitude={}, radius={}", longitude, latitude, radius);
        List<ServiceItemVO> services = serviceItemService.getNearbyServices(longitude, latitude, radius, limit);
        return Result.success(services);
    }
}
```

### 1.9 后端核心代码 - 通知服务Controller

```java
package com.andiantong.notification.controller;

import com.andiantong.common.core.Result;
import com.andiantong.notification.dto.*;
import com.andiantong.notification.service.NotificationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "通知管理")
@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @ApiOperation("获取通知列表")
    @GetMapping("/list")
    public Result<List<NotificationVO>> getNotificationList(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取通知列表: userId={}", userId);
        List<NotificationVO> notifications = notificationService.getNotificationList(userId, pageNum, pageSize);
        return Result.success(notifications);
    }

    @ApiOperation("获取未读通知数")
    @GetMapping("/unreadCount")
    public Result<Integer> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取未读通知数: userId={}", userId);
        Integer count = notificationService.getUnreadCount(userId);
        return Result.success(count);
    }

    @ApiOperation("标记通知已读")
    @PutMapping("/{notificationId}/read")
    public Result<String> markAsRead(@PathVariable Long notificationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("标记通知已读: userId={}, notificationId={}", userId, notificationId);
        notificationService.markAsRead(userId, notificationId);
        return Result.success("标记成功");
    }

    @ApiOperation("标记全部已读")
    @PutMapping("/readAll")
    public Result<String> markAllAsRead(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("标记全部已读: userId={}", userId);
        notificationService.markAllAsRead(userId);
        return Result.success("标记成功");
    }

    @ApiOperation("删除通知")
    @DeleteMapping("/{notificationId}")
    public Result<String> deleteNotification(@PathVariable Long notificationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除通知: userId={}, notificationId={}", userId, notificationId);
        notificationService.deleteNotification(userId, notificationId);
        return Result.success("删除成功");
    }

    @ApiOperation("清空通知")
    @DeleteMapping("/clearAll")
    public Result<String> clearAllNotifications(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("清空通知: userId={}", userId);
        notificationService.clearAllNotifications(userId);
        return Result.success("清空成功");
    }

    @ApiOperation("获取通知详情")
    @GetMapping("/{notificationId}")
    public Result<NotificationDetailVO> getNotificationDetail(@PathVariable Long notificationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取通知详情: userId={}, notificationId={}", userId, notificationId);
        NotificationDetailVO detail = notificationService.getNotificationDetail(userId, notificationId);
        return Result.success(detail);
    }

    @ApiOperation("设置通知免打扰")
    @PutMapping("/dnd")
    public Result<String> setDoNotDisturb(@RequestBody Map<String, Object> dndDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("设置通知免打扰: userId={}", userId);
        notificationService.setDoNotDisturb(userId, dndDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取通知设置")
    @GetMapping("/settings")
    public Result<Map<String, Object>> getNotificationSettings(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取通知设置: userId={}", userId);
        Map<String, Object> settings = notificationService.getNotificationSettings(userId);
        return Result.success(settings);
    }

    @ApiOperation("发送系统通知")
    @PostMapping("/send")
    public Result<String> sendNotification(@RequestBody SendNotificationDTO sendDTO) {
        log.info("发送系统通知: type={}", sendDTO.getType());
        notificationService.sendNotification(sendDTO);
        return Result.success("发送成功");
    }

    @ApiOperation("发送短信验证码")
    @PostMapping("/sms/send")
    public Result<String> sendSmsCode(@RequestBody Map<String, String> smsDTO) {
        String phone = smsDTO.get("phone");
        String type = smsDTO.get("type");
        log.info("发送短信验证码: phone={}, type={}", phone, type);
        notificationService.sendSmsCode(phone, type);
        return Result.success("发送成功");
    }

    @ApiOperation("验证短信验证码")
    @PostMapping("/sms/verify")
    public Result<Boolean> verifySmsCode(@RequestBody Map<String, String> smsDTO) {
        String phone = smsDTO.get("phone");
        String code = smsDTO.get("code");
        String type = smsDTO.get("type");
        log.info("验证短信验证码: phone={}, type={}", phone, type);
        boolean valid = notificationService.verifySmsCode(phone, code, type);
        return Result.success(valid);
    }

    @ApiOperation("发送邮件")
    @PostMapping("/email/send")
    public Result<String> sendEmail(@RequestBody Map<String, String> emailDTO) {
        String to = emailDTO.get("to");
        String subject = emailDTO.get("subject");
        String content = emailDTO.get("content");
        log.info("发送邮件: to={}, subject={}", to, subject);
        notificationService.sendEmail(to, subject, content);
        return Result.success("发送成功");
    }

    @ApiOperation("推送消息到App")
    @PostMapping("/push")
    public Result<String> pushMessage(@RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息到App: userId={}, title={}", pushDTO.getUserId(), pushDTO.getTitle());
        notificationService.pushMessage(pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("推送消息到所有用户")
    @PostMapping("/pushAll")
    public Result<String> pushMessageToAll(@RequestBody PushMessageDTO pushDTO) {
        log.info("推送消息到所有用户: title={}", pushDTO.getTitle());
        notificationService.pushMessageToAll(pushDTO);
        return Result.success("推送成功");
    }

    @ApiOperation("获取消息模板")
    @GetMapping("/templates")
    public Result<List<Map<String, Object>>> getMessageTemplates(@RequestParam(required = false) String type) {
        log.info("获取消息模板: type={}", type);
        List<Map<String, Object>> templates = notificationService.getMessageTemplates(type);
        return Result.success(templates);
    }

    @ApiOperation("创建消息模板")
    @PostMapping("/template")
    public Result<String> createTemplate(@RequestBody Map<String, Object> templateDTO) {
        log.info("创建消息模板");
        notificationService.createTemplate(templateDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新消息模板")
    @PutMapping("/template/{templateId}")
    public Result<String> updateTemplate(@PathVariable Long templateId, @RequestBody Map<String, Object> templateDTO) {
        log.info("更新消息模板: templateId={}", templateId);
        notificationService.updateTemplate(templateId, templateDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除消息模板")
    @DeleteMapping("/template/{templateId}")
    public Result<String> deleteTemplate(@PathVariable Long templateId) {
        log.info("删除消息模板: templateId={}", templateId);
        notificationService.deleteTemplate(templateId);
        return Result.success("删除成功");
    }
}
```

### 1.10 后端核心代码 - 文件上传Controller

```java
package com.andiantong.file.controller;

import com.andiantong.common.core.Result;
import com.andiantong.file.dto.FileUploadDTO;
import com.andiantong.file.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Api(tags = "文件管理")
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    @ApiOperation("上传文件")
    @PostMapping("/upload")
    public Result<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("上传文件: userId={}, fileName={}, folder={}", userId, file.getOriginalFilename(), folder);
        Map<String, Object> result = fileService.uploadFile(file, folder, userId);
        return Result.success(result);
    }

    @ApiOperation("批量上传文件")
    @PostMapping("/upload/batch")
    public Result<List<Map<String, Object>>> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", required = false) String folder,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("批量上传文件: userId={}, fileCount={}", userId, files.length);
        List<Map<String, Object>> results = fileService.uploadFiles(files, folder, userId);
        return Result.success(results);
    }

    @ApiOperation("上传图片")
    @PostMapping("/upload/image")
    public Result<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder,
            @RequestParam(value = "compress", defaultValue = "true") Boolean compress,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("上传图片: userId={}, fileName={}", userId, file.getOriginalFilename());
        Map<String, Object> result = fileService.uploadImage(file, folder, compress, userId);
        return Result.success(result);
    }

    @ApiOperation("上传头像")
    @PostMapping("/upload/avatar")
    public Result<Map<String, Object>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("上传头像: userId={}", userId);
        Map<String, Object> result = fileService.uploadAvatar(file, userId);
        return Result.success(result);
    }

    @ApiOperation("删除文件")
    @DeleteMapping("/{fileId}")
    public Result<String> deleteFile(@PathVariable String fileId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除文件: userId={}, fileId={}", userId, fileId);
        fileService.deleteFile(fileId, userId);
        return Result.success("删除成功");
    }

    @ApiOperation("批量删除文件")
    @DeleteMapping("/batch")
    public Result<String> deleteFiles(@RequestBody List<String> fileIds, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("批量删除文件: userId={}, fileIds={}", userId, fileIds);
        fileService.deleteFiles(fileIds, userId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取文件信息")
    @GetMapping("/{fileId}")
    public Result<Map<String, Object>> getFileInfo(@PathVariable String fileId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取文件信息: userId={}, fileId={}", userId, fileId);
        Map<String, Object> fileInfo = fileService.getFileInfo(fileId, userId);
        return Result.success(fileInfo);
    }

    @ApiOperation("获取用户文件列表")
    @GetMapping("/list")
    public Result<List<Map<String, Object>>> getFileList(
            @RequestParam(value = "folder", required = false) String folder,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户文件列表: userId={}, folder={}", userId, folder);
        List<Map<String, Object>> files = fileService.getFileList(userId, folder, fileType, pageNum, pageSize);
        return Result.success(files);
    }

    @ApiOperation("下载文件")
    @GetMapping("/download/{fileId}")
    public void downloadFile(@PathVariable String fileId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Long userId = (Long) request.getAttribute("userId");
        log.info("下载文件: userId={}, fileId={}", userId, fileId);
        fileService.downloadFile(fileId, userId, response);
    }

    @ApiOperation("预览文件")
    @GetMapping("/preview/{fileId}")
    public void previewFile(@PathVariable String fileId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Long userId = (Long) request.getAttribute("userId");
        log.info("预览文件: userId={}, fileId={}", userId, fileId);
        fileService.previewFile(fileId, userId, response);
    }

    @ApiOperation("复制文件")
    @PostMapping("/copy/{fileId}")
    public Result<String> copyFile(@PathVariable String fileId, @RequestParam(value = "toFolder", required = false) String toFolder, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("复制文件: userId={}, fileId={}", userId, fileId);
        fileService.copyFile(fileId, toFolder, userId);
        return Result.success("复制成功");
    }

    @ApiOperation("移动文件")
    @PostMapping("/move/{fileId}")
    public Result<String> moveFile(@PathVariable String fileId, @RequestParam String toFolder, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("移动文件: userId={}, fileId={}, toFolder={}", userId, fileId, toFolder);
        fileService.moveFile(fileId, toFolder, userId);
        return Result.success("移动成功");
    }

    @ApiOperation("重命名文件")
    @PostMapping("/rename/{fileId}")
    public Result<String> renameFile(@PathVariable String fileId, @RequestParam String newName, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("重命名文件: userId={}, fileId={}, newName={}", userId, fileId, newName);
        fileService.renameFile(fileId, newName, userId);
        return Result.success("重命名成功");
    }

    @ApiOperation("创建文件夹")
    @PostMapping("/folder")
    public Result<String> createFolder(@RequestBody Map<String, Object> folderDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建文件夹: userId={}", userId);
        fileService.createFolder(folderDTO, userId);
        return Result.success("创建成功");
    }

    @ApiOperation("删除文件夹")
    @DeleteMapping("/folder/{folderId}")
    public Result<String> deleteFolder(@PathVariable String folderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除文件夹: userId={}, folderId={}", userId, folderId);
        fileService.deleteFolder(folderId, userId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取文件分享链接")
    @PostMapping("/share/{fileId}")
    public Result<Map<String, Object>> shareFile(@PathVariable String fileId, @RequestBody Map<String, Object> shareDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取文件分享链接: userId={}, fileId={}", userId, fileId);
        Map<String, Object> shareInfo = fileService.shareFile(fileId, shareDTO, userId);
        return Result.success(shareInfo);
    }

    @ApiOperation("通过链接下载文件")
    @GetMapping("/share/download/{shareCode}")
    public void downloadByShareLink(@PathVariable String shareCode, HttpServletResponse response) throws IOException {
        log.info("通过链接下载文件: shareCode={}", shareCode);
        fileService.downloadByShareLink(shareCode, response);
    }

    @ApiOperation("获取存储空间使用情况")
    @GetMapping("/storage")
    public Result<Map<String, Object>> getStorageUsage(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取存储空间使用情况: userId={}", userId);
        Map<String, Object> usage = fileService.getStorageUsage(userId);
        return Result.success(usage);
    }
}
```

### 1.11 后端核心代码 - 评价服务Controller

```java
package com.andiantong.evaluation.controller;

import com.andiantong.common.core.Result;
import com.andiantong.evaluation.dto.*;
import com.andiantong.evaluation.service.EvaluationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Api(tags = "评价管理")
@RestController
@RequestMapping("/api/evaluation")
@RequiredArgsConstructor
@Slf4j
public class EvaluationController {

    private final EvaluationService evaluationService;

    @ApiOperation("提交评价")
    @PostMapping("/submit")
    public Result<String> submitEvaluation(@Valid @RequestBody SubmitEvaluationDTO evaluationDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("提交评价: userId={}, orderId={}", userId, evaluationDTO.getOrderId());
        evaluationService.submitEvaluation(userId, evaluationDTO);
        return Result.success("评价成功");
    }

    @ApiOperation("获取订单评价")
    @GetMapping("/order/{orderId}")
    public Result<EvaluationVO> getOrderEvaluation(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取订单评价: userId={}, orderId={}", userId, orderId);
        EvaluationVO evaluation = evaluationService.getOrderEvaluation(orderId, userId);
        return Result.success(evaluation);
    }

    @ApiOperation("获取服务项目评价列表")
    @GetMapping("/service/{serviceId}")
    public Result<List<EvaluationVO>> getServiceEvaluations(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取服务项目评价列表: serviceId={}", serviceId);
        List<EvaluationVO> evaluations = evaluationService.getServiceEvaluations(serviceId, pageNum, pageSize);
        return Result.success(evaluations);
    }

    @ApiOperation("获取电工评价列表")
    @GetMapping("/electrician/{electricianId}")
    public Result<List<EvaluationVO>> getElectricianEvaluations(
            @PathVariable Long electricianId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取电工评价列表: electricianId={}", electricianId);
        List<EvaluationVO> evaluations = evaluationService.getElectricianEvaluations(electricianId, pageNum, pageSize);
        return Result.success(evaluations);
    }

    @ApiOperation("获取我的评价列表")
    @GetMapping("/my")
    public Result<List<MyEvaluationVO>> getMyEvaluations(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的评价列表: userId={}", userId);
        List<MyEvaluationVO> evaluations = evaluationService.getMyEvaluations(userId, pageNum, pageSize);
        return Result.success(evaluations);
    }

    @ApiOperation("追评")
    @PostMapping("/{evaluationId}/追加")
    public Result<String> appendEvaluation(@PathVariable Long evaluationId, @RequestBody Map<String, String> appendDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("追评: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.appendEvaluation(userId, evaluationId, appendDTO.get("content"));
        return Result.success("追评成功");
    }

    @ApiOperation("删除评价")
    @DeleteMapping("/{evaluationId}")
    public Result<String> deleteEvaluation(@PathVariable Long evaluationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除评价: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.deleteEvaluation(userId, evaluationId);
        return Result.success("删除成功");
    }

    @ApiOperation("举报评价")
    @PostMapping("/{evaluationId}/report")
    public Result<String> reportEvaluation(@PathVariable Long evaluationId, @RequestBody Map<String, Object> reportDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("举报评价: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.reportEvaluation(userId, evaluationId, reportDTO);
        return Result.success("举报成功");
    }

    @ApiOperation("获取评价统计")
    @GetMapping("/statistics/service/{serviceId}")
    public Result<Map<String, Object>> getServiceEvaluationStatistics(@PathVariable Long serviceId) {
        log.info("获取服务评价统计: serviceId={}", serviceId);
        Map<String, Object> statistics = evaluationService.getServiceEvaluationStatistics(serviceId);
        return Result.success(statistics);
    }

    @ApiOperation("获取电工评价统计")
    @GetMapping("/statistics/electrician/{electricianId}")
    public Result<Map<String, Object>> getElectricianEvaluationStatistics(@PathVariable Long electricianId) {
        log.info("获取电工评价统计: electricianId={}", electricianId);
        Map<String, Object> statistics = evaluationService.getElectricianEvaluationStatistics(electricianId);
        return Result.success(statistics);
    }

    @ApiOperation("获取评价标签")
    @GetMapping("/tags")
    public Result<List<Map<String, Object>>> getEvaluationTags(@RequestParam(required = false) String type) {
        log.info("获取评价标签: type={}", type);
        List<Map<String, Object>> tags = evaluationService.getEvaluationTags(type);
        return Result.success(tags);
    }

    @ApiOperation("点赞评价")
    @PostMapping("/{evaluationId}/like")
    public Result<String> likeEvaluation(@PathVariable Long evaluationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("点赞评价: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.likeEvaluation(userId, evaluationId);
        return Result.success("点赞成功");
    }

    @ApiOperation("取消点赞评价")
    @DeleteMapping("/{evaluationId}/like")
    public Result<String> unlikeEvaluation(@PathVariable Long evaluationId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("取消点赞评价: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.unlikeEvaluation(userId, evaluationId);
        return Result.success("取消成功");
    }

    @ApiOperation("回复评价")
    @PostMapping("/{evaluationId}/reply")
    public Result<String> replyEvaluation(@PathVariable Long evaluationId, @RequestBody Map<String, String> replyDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("回复评价: userId={}, evaluationId={}", userId, evaluationId);
        evaluationService.replyEvaluation(userId, evaluationId, replyDTO.get("content"));
        return Result.success("回复成功");
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(additional_code)

print(f"已追加后端代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
