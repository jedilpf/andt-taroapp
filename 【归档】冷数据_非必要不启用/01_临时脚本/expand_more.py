#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

more_code = '''

## 第四部分：后端补充代码

### 4.1 后端核心代码 - 系统配置管理

```java
package com.andiantong.system.controller;

import com.andiantong.common.core.Result;
import com.andiantong.system.dto.*;
import com.andiantong.system.service.SystemConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "系统配置")
@RestController
@RequestMapping("/api/system/config")
@RequiredArgsConstructor
@Slf4j
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @ApiOperation("获取系统配置")
    @GetMapping
    public Result<Map<String, Object>> getSystemConfig() {
        log.info("获取系统配置");
        Map<String, Object> config = systemConfigService.getSystemConfig();
        return Result.success(config);
    }

    @ApiOperation("更新系统配置")
    @PutMapping
    public Result<String> updateSystemConfig(@RequestBody Map<String, Object> configDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新系统配置: userId={}", userId);
        systemConfigService.updateSystemConfig(configDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("获取Banner列表")
    @GetMapping("/banner/list")
    public Result<List<Map<String, Object>>> getBannerList(@RequestParam(required = false) String position) {
        log.info("获取Banner列表: position={}", position);
        List<Map<String, Object>> banners = systemConfigService.getBannerList(position);
        return Result.success(banners);
    }

    @ApiOperation("添加Banner")
    @PostMapping("/banner")
    public Result<String> addBanner(@RequestBody Map<String, Object> bannerDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("添加Banner: userId={}", userId);
        systemConfigService.addBanner(bannerDTO);
        return Result.success("添加成功");
    }

    @ApiOperation("更新Banner")
    @PutMapping("/banner/{bannerId}")
    public Result<String> updateBanner(@PathVariable Long bannerId, @RequestBody Map<String, Object> bannerDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新Banner: userId={}, bannerId={}", userId, bannerId);
        systemConfigService.updateBanner(bannerId, bannerDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除Banner")
    @DeleteMapping("/banner/{bannerId}")
    public Result<String> deleteBanner(@PathVariable Long bannerId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除Banner: userId={}, bannerId={}", userId, bannerId);
        systemConfigService.deleteBanner(bannerId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取公告列表")
    @GetMapping("/announcement/list")
    public Result<List<Map<String, Object>>> getAnnouncementList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取公告列表");
        List<Map<String, Object>> announcements = systemConfigService.getAnnouncementList(pageNum, pageSize);
        return Result.success(announcements);
    }

    @ApiOperation("获取公告详情")
    @GetMapping("/announcement/{announcementId}")
    public Result<Map<String, Object>> getAnnouncementDetail(@PathVariable Long announcementId) {
        log.info("获取公告详情: announcementId={}", announcementId);
        Map<String, Object> announcement = systemConfigService.getAnnouncementDetail(announcementId);
        return Result.success(announcement);
    }

    @ApiOperation("发布公告")
    @PostMapping("/announcement")
    public Result<String> addAnnouncement(@RequestBody Map<String, Object> announcementDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("发布公告: userId={}", userId);
        systemConfigService.addAnnouncement(announcementDTO);
        return Result.success("发布成功");
    }

    @ApiOperation("更新公告")
    @PutMapping("/announcement/{announcementId}")
    public Result<String> updateAnnouncement(@PathVariable Long announcementId, @RequestBody Map<String, Object> announcementDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新公告: userId={}, announcementId={}", userId, announcementId);
        systemConfigService.updateAnnouncement(announcementId, announcementDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除公告")
    @DeleteMapping("/announcement/{announcementId}")
    public Result<String> deleteAnnouncement(@PathVariable Long announcementId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除公告: userId={}, announcementId={}", userId, announcementId);
        systemConfigService.deleteAnnouncement(announcementId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取首页弹窗")
    @GetMapping("/popup")
    public Result<Map<String, Object>> getPopup() {
        log.info("获取首页弹窗");
        Map<String, Object> popup = systemConfigService.getPopup();
        return Result.success(popup);
    }

    @ApiOperation("设置首页弹窗")
    @PostMapping("/popup")
    public Result<String> setPopup(@RequestBody Map<String, Object> popupDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("设置首页弹窗: userId={}", userId);
        systemConfigService.setPopup(popupDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取版本信息")
    @GetMapping("/version/{platform}")
    public Result<Map<String, Object>> getVersionInfo(@PathVariable String platform) {
        log.info("获取版本信息: platform={}", platform);
        Map<String, Object> versionInfo = systemConfigService.getVersionInfo(platform);
        return Result.success(versionInfo);
    }

    @ApiOperation("检查更新")
    @GetMapping("/version/check")
    public Result<Map<String, Object>> checkVersionUpdate(@RequestParam String version, @RequestParam String platform) {
        log.info("检查更新: version={}, platform={}", version, platform);
        Map<String, Object> updateInfo = systemConfigService.checkVersionUpdate(version, platform);
        return Result.success(updateInfo);
    }

    @ApiOperation("获取关于我们")
    @GetMapping("/about")
    public Result<Map<String, Object>> getAbout() {
        log.info("获取关于我们");
        Map<String, Object> about = systemConfigService.getAbout();
        return Result.success(about);
    }

    @ApiOperation("更新关于我们")
    @PutMapping("/about")
    public Result<String> updateAbout(@RequestBody Map<String, Object> aboutDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新关于我们: userId={}", userId);
        systemConfigService.updateAbout(aboutDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("获取用户协议")
    @GetMapping("/agreement/{type}")
    public Result<Map<String, Object>> getAgreement(@PathVariable String type) {
        log.info("获取用户协议: type={}", type);
        Map<String, Object> agreement = systemConfigService.getAgreement(type);
        return Result.success(agreement);
    }

    @ApiOperation("更新用户协议")
    @PutMapping("/agreement/{type}")
    public Result<String> updateAgreement(@PathVariable String type, @RequestBody Map<String, Object> agreementDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新用户协议: userId={}, type={}", userId, type);
        systemConfigService.updateAgreement(type, agreementDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("获取隐私政策")
    @GetMapping("/privacy")
    public Result<Map<String, Object>> getPrivacyPolicy() {
        log.info("获取隐私政策");
        Map<String, Object> privacy = systemConfigService.getPrivacyPolicy();
        return Result.success(privacy);
    }

    @ApiOperation("更新隐私政策")
    @PutMapping("/privacy")
    public Result<String> updatePrivacyPolicy(@RequestBody Map<String, Object> privacyDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新隐私政策: userId={}", userId);
        systemConfigService.updatePrivacyPolicy(privacyDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("获取帮助中心分类")
    @GetMapping("/help/categories")
    public Result<List<Map<String, Object>>> getHelpCategories() {
        log.info("获取帮助中心分类");
        List<Map<String, Object>> categories = systemConfigService.getHelpCategories();
        return Result.success(categories);
    }

    @ApiOperation("获取帮助中心文章列表")
    @GetMapping("/help/articles")
    public Result<List<Map<String, Object>>> getHelpArticles(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取帮助中心文章列表: categoryId={}", categoryId);
        List<Map<String, Object>> articles = systemConfigService.getHelpArticles(categoryId, pageNum, pageSize);
        return Result.success(articles);
    }

    @ApiOperation("获取帮助中心文章详情")
    @GetMapping("/help/article/{articleId}")
    public Result<Map<String, Object>> getHelpArticleDetail(@PathVariable Long articleId) {
        log.info("获取帮助中心文章详情: articleId={}", articleId);
        Map<String, Object> article = systemConfigService.getHelpArticleDetail(articleId);
        return Result.success(article);
    }

    @ApiOperation("搜索帮助中心文章")
    @GetMapping("/help/search")
    public Result<List<Map<String, Object>>> searchHelpArticles(@RequestParam String keyword) {
        log.info("搜索帮助中心文章: keyword={}", keyword);
        List<Map<String, Object>> articles = systemConfigService.searchHelpArticles(keyword);
        return Result.success(articles);
    }
}
```

### 4.2 后端核心代码 - 统计报表Controller

```java
package com.andiantong.statistics.controller;

import com.andiantong.common.core.Result;
import com.andiantong.statistics.dto.*;
import com.andiantong.statistics.service.StatisticsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Api(tags = "数据统计")
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {

    private final StatisticsService statisticsService;

    @ApiOperation("获取运营概览")
    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取运营概览: userId={}", userId);
        Map<String, Object> overview = statisticsService.getOverview(userId);
        return Result.success(overview);
    }

    @ApiOperation("获取订单统计")
    @GetMapping("/order")
    public Result<Map<String, Object>> getOrderStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String groupBy) {
        log.info("获取订单统计: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> statistics = statisticsService.getOrderStatistics(startDate, endDate, groupBy);
        return Result.success(statistics);
    }

    @ApiOperation("获取用户统计")
    @GetMapping("/user")
    public Result<Map<String, Object>> getUserStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取用户统计: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> statistics = statisticsService.getUserStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取收入统计")
    @GetMapping("/income")
    public Result<Map<String, Object>> getIncomeStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String groupBy) {
        log.info("获取收入统计: startDate={}, endDate={}", startDate, endDate);
        Map<String, Object> statistics = statisticsService.getIncomeStatistics(startDate, endDate, groupBy);
        return Result.success(statistics);
    }

    @ApiOperation("获取服务项目销量排行")
    @GetMapping("/service/ranking")
    public Result<Map<String, Object>> getServiceRanking(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取服务项目销量排行: limit={}", limit);
        Map<String, Object> ranking = statisticsService.getServiceRanking(startDate, endDate, limit);
        return Result.success(ranking);
    }

    @ApiOperation("获取电工业绩排行")
    @GetMapping("/electrician/ranking")
    public Result<Map<String, Object>> getElectricianRanking(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取电工业绩排行: limit={}", limit);
        Map<String, Object> ranking = statisticsService.getElectricianRanking(startDate, endDate, limit);
        return Result.success(ranking);
    }

    @ApiOperation("获取区域订单分布")
    @GetMapping("/order/region")
    public Result<Map<String, Object>> getOrderRegionDistribution(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取区域订单分布");
        Map<String, Object> distribution = statisticsService.getOrderRegionDistribution(startDate, endDate);
        return Result.success(distribution);
    }

    @ApiOperation("获取订单状态分布")
    @GetMapping("/order/status")
    public Result<Map<String, Object>> getOrderStatusDistribution(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取订单状态分布");
        Map<String, Object> distribution = statisticsService.getOrderStatusDistribution(startDate, endDate);
        return Result.success(distribution);
    }

    @ApiOperation("获取用户增长趋势")
    @GetMapping("/user/trend")
    public Result<Map<String, Object>> getUserGrowthTrend(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取用户增长趋势: days={}", days);
        Map<String, Object> trend = statisticsService.getUserGrowthTrend(startDate, endDate, days);
        return Result.success(trend);
    }

    @ApiOperation("获取订单增长趋势")
    @GetMapping("/order/trend")
    public Result<Map<String, Object>> getOrderGrowthTrend(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取订单增长趋势: days={}", days);
        Map<String, Object> trend = statisticsService.getOrderGrowthTrend(startDate, endDate, days);
        return Result.success(trend);
    }

    @ApiOperation("获取收入增长趋势")
    @GetMapping("/income/trend")
    public Result<Map<String, Object>> getIncomeGrowthTrend(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取收入增长趋势: days={}", days);
        Map<String, Object> trend = statisticsService.getIncomeGrowthTrend(startDate, endDate, days);
        return Result.success(trend);
    }

    @ApiOperation("获取转化率分析")
    @GetMapping("/conversion")
    public Result<Map<String, Object>> getConversionAnalysis(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取转化率分析");
        Map<String, Object> analysis = statisticsService.getConversionAnalysis(startDate, endDate);
        return Result.success(analysis);
    }

    @ApiOperation("获取留存率分析")
    @GetMapping("/retention")
    public Result<Map<String, Object>> getRetentionAnalysis(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "30") Integer days) {
        log.info("获取留存率分析: days={}", days);
        Map<String, Object> analysis = statisticsService.getRetentionAnalysis(startDate, endDate, days);
        return Result.success(analysis);
    }

    @ApiOperation("获取活跃用户统计")
    @GetMapping("/active/user")
    public Result<Map<String, Object>> getActiveUserStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "7") Integer days) {
        log.info("获取活跃用户统计: days={}", days);
        Map<String, Object> statistics = statisticsService.getActiveUserStatistics(startDate, endDate, days);
        return Result.success(statistics);
    }

    @ApiOperation("获取新增用户统计")
    @GetMapping("/new/user")
    public Result<Map<String, Object>> getNewUserStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取新增用户统计");
        Map<String, Object> statistics = statisticsService.getNewUserStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取订单转化漏斗")
    @GetMapping("/funnel")
    public Result<Map<String, Object>> getOrderFunnel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取订单转化漏斗");
        Map<String, Object> funnel = statisticsService.getOrderFunnel(startDate, endDate);
        return Result.success(funnel);
    }

    @ApiOperation("获取服务项目访问统计")
    @GetMapping("/service/visit")
    public Result<Map<String, Object>> getServiceVisitStatistics(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取服务项目访问统计: serviceId={}", serviceId);
        Map<String, Object> statistics = statisticsService.getServiceVisitStatistics(serviceId, startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取电工评分统计")
    @GetMapping("/electrician/rating")
    public Result<Map<String, Object>> getElectricianRatingStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取电工评分统计");
        Map<String, Object> statistics = statisticsService.getElectricianRatingStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取优惠券使用统计")
    @GetMapping("/coupon/usage")
    public Result<Map<String, Object>> getCouponUsageStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取优惠券使用统计");
        Map<String, Object> statistics = statisticsService.getCouponUsageStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取退款统计")
    @GetMapping("/refund")
    public Result<Map<String, Object>> getRefundStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取退款统计");
        Map<String, Object> statistics = statisticsService.getRefundStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("获取客服响应统计")
    @GetMapping("/service/response")
    public Result<Map<String, Object>> getServiceResponseStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取客服响应统计");
        Map<String, Object> statistics = statisticsService.getServiceResponseStatistics(startDate, endDate);
        return Result.success(statistics);
    }

    @ApiOperation("导出订单报表")
    @GetMapping("/export/order")
    public void exportOrderReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer status,
            javax.servlet.http.HttpServletResponse response) {
        log.info("导出订单报表: startDate={}, endDate={}", startDate, endDate);
        statisticsService.exportOrderReport(startDate, endDate, status, response);
    }

    @ApiOperation("导出收入报表")
    @GetMapping("/export/income")
    public void exportIncomeReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            javax.servlet.http.HttpServletResponse response) {
        log.info("导出收入报表: startDate={}, endDate={}", startDate, endDate);
        statisticsService.exportIncomeReport(startDate, endDate, response);
    }
}
```

### 4.3 后端核心代码 - 优惠券管理Controller

```java
package com.andiantong.coupon.controller;

import com.andiantong.common.core.Result;
import com.andiantong.coupon.dto.*;
import com.andiantong.coupon.service.CouponService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Api(tags = "优惠券管理")
@RestController
@RequestMapping("/api/coupon")
@RequiredArgsConstructor
@Slf4j
public class CouponController {

    private final CouponService couponService;

    @ApiOperation("获取优惠券列表")
    @GetMapping("/list")
    public Result<List<CouponVO>> getCouponList(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取优惠券列表: status={}", status);
        List<CouponVO> coupons = couponService.getCouponList(status, pageNum, pageSize);
        return Result.success(coupons);
    }

    @ApiOperation("获取用户可领取优惠券")
    @GetMapping("/available")
    public Result<List<CouponVO>> getAvailableCoupons(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户可领取优惠券: userId={}", userId);
        List<CouponVO> coupons = couponService.getAvailableCoupons(userId);
        return Result.success(coupons);
    }

    @ApiOperation("获取用户已领取优惠券")
    @GetMapping("/my")
    public Result<List<MyCouponVO>> getMyCoupons(
            HttpServletRequest request,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户已领取优惠券: userId={}, status={}", userId, status);
        List<MyCouponVO> coupons = couponService.getMyCoupons(userId, status, pageNum, pageSize);
        return Result.success(coupons);
    }

    @ApiOperation("领取优惠券")
    @PostMapping("/receive/{couponId}")
    public Result<String> receiveCoupon(@PathVariable Long couponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取优惠券: userId={}, couponId={}", userId, couponId);
        couponService.receiveCoupon(userId, couponId);
        return Result.success("领取成功");
    }

    @ApiOperation("使用优惠券")
    @PostMapping("/use/{userCouponId}")
    public Result<String> useCoupon(@PathVariable Long userCouponId, @RequestBody Map<String, Object> useDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("使用优惠券: userId={}, userCouponId={}", userId, userCouponId);
        couponService.useCoupon(userId, userCouponId, useDTO);
        return Result.success("使用成功");
    }

    @ApiOperation("退还优惠券")
    @PostMapping("/return/{userCouponId}")
    public Result<String> returnCoupon(@PathVariable Long userCouponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("退还优惠券: userId={}, userCouponId={}", userId, userCouponId);
        couponService.returnCoupon(userId, userCouponId);
        return Result.success("退还成功");
    }

    @ApiOperation("删除用户优惠券")
    @DeleteMapping("/{userCouponId}")
    public Result<String> deleteUserCoupon(@PathVariable Long userCouponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除用户优惠券: userId={}, userCouponId={}", userId, userCouponId);
        couponService.deleteUserCoupon(userId, userCouponId);
        return Result.success("删除成功");
    }

    @ApiOperation("创建优惠券")
    @PostMapping
    public Result<String> createCoupon(@Valid @RequestBody CreateCouponDTO couponDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建优惠券: userId={}", userId);
        couponService.createCoupon(couponDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新优惠券")
    @PutMapping("/{couponId}")
    public Result<String> updateCoupon(@PathVariable Long couponId, @RequestBody UpdateCouponDTO couponDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新优惠券: userId={}, couponId={}", userId, couponId);
        couponService.updateCoupon(couponId, couponDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除优惠券")
    @DeleteMapping("/{couponId}")
    public Result<String> deleteCoupon(@PathVariable Long couponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除优惠券: userId={}, couponId={}", userId, couponId);
        couponService.deleteCoupon(couponId);
        return Result.success("删除成功");
    }

    @ApiOperation("发布优惠券")
    @PostMapping("/publish/{couponId}")
    public Result<String> publishCoupon(@PathVariable Long couponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("发布优惠券: userId={}, couponId={}", userId, couponId);
        couponService.publishCoupon(couponId);
        return Result.success("发布成功");
    }

    @ApiOperation("终止优惠券")
    @PostMapping("/terminate/{couponId}")
    public Result<String> terminateCoupon(@PathVariable Long couponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("终止优惠券: userId={}, couponId={}", userId, couponId);
        couponService.terminateCoupon(couponId);
        return Result.success("终止成功");
    }

    @ApiOperation("批量发放优惠券")
    @PostMapping("/batch/send")
    public Result<String> batchSendCoupon(@RequestBody BatchSendCouponDTO batchSendDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("批量发放优惠券: userId={}", userId);
        couponService.batchSendCoupon(batchSendDTO);
        return Result.success("发放成功");
    }

    @ApiOperation("发放新人优惠券")
    @PostMapping("/send/newbie")
    public Result<String> sendNewbieCoupon(@RequestBody Map<String, Object> dto, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("发放新人优惠券: userId={}", userId);
        couponService.sendNewbieCoupon(userId);
        return Result.success("发放成功");
    }

    @ApiOperation("获取优惠券详情")
    @GetMapping("/{couponId}")
    public Result<CouponDetailVO> getCouponDetail(@PathVariable Long couponId) {
        log.info("获取优惠券详情: couponId={}", couponId);
        CouponDetailVO detail = couponService.getCouponDetail(couponId);
        return Result.success(detail);
    }

    @ApiOperation("获取优惠券领取记录")
    @GetMapping("/{couponId}/records")
    public Result<List<CouponRecordVO>> getCouponRecords(
            @PathVariable Long couponId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取优惠券领取记录: couponId={}", couponId);
        List<CouponRecordVO> records = couponService.getCouponRecords(couponId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("获取优惠券使用记录")
    @GetMapping("/{couponId}/usage")
    public Result<List<CouponUsageVO>> getCouponUsage(
            @PathVariable Long couponId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取优惠券使用记录: couponId={}", couponId);
        List<CouponUsageVO> usages = couponService.getCouponUsage(couponId, pageNum, pageSize);
        return Result.success(usages);
    }

    @ApiOperation("计算订单优惠")
    @PostMapping("/calculate")
    public Result<Map<String, Object>> calculateDiscount(@RequestBody CalculateDiscountDTO calculateDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("计算订单优惠: userId={}", userId);
        Map<String, Object> result = couponService.calculateDiscount(userId, calculateDTO);
        return Result.success(result);
    }

    @ApiOperation("获取优惠券统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getCouponStatistics(@RequestParam(required = false) Long couponId) {
        log.info("获取优惠券统计: couponId={}", couponId);
        Map<String, Object> statistics = couponService.getCouponStatistics(couponId);
        return Result.success(statistics);
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(more_code)

print(f"已追加更多代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
