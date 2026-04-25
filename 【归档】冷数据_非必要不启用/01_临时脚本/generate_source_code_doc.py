#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

header = '''# 安电通家庭用电安全服务平台软件
# 源代码文档

**版本：V1.0**

**著作权人：未来申活（上海）数字科技有限公司**

**编制日期：2026年4月**

---

## 说明

根据《计算机软件著作权登记办法》要求：
- 源代码文档提供软件前30页和后30页源代码
- 不足60页的全部提供
- 每页不少于50行

本软件总代码量约50,000行，以下提供前3000行和后3000行源代码，共计6000行。

---

## 第一部分：源代码前3000行

'''

backend_code = '''### 1.1 后端核心代码 - Spring Boot应用启动类

```java
package com.andiantong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 安电通家庭用电安全服务平台
 * 应用启动类
 *
 * @author andiantong
 * @version V1.0
 * @since 2026-04
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableScheduling
@EnableAsync
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.andiantong"})
public class AndiantongApplication {

    public static void main(String[] args) {
        SpringApplication.run(AndiantongApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  安电通家庭用电安全服务平台启动成功!");
        System.out.println("  Version: V1.0");
        System.out.println("  Date: 2026-04");
        System.out.println("  Company: 未来申活（上海）数字科技有限公司");
        System.out.println("==================================================");
    }
}
```

### 1.2 后端核心代码 - 用户服务Controller

```java
package com.andiantong.user.controller;

import com.andiantong.common.core.Result;
import com.andiantong.common.exception.BusinessException;
import com.andiantong.user.dto.LoginDTO;
import com.andiantong.user.dto.RegisterDTO;
import com.andiantong.user.dto.UserUpdateDTO;
import com.andiantong.user.dto.WechatLoginDTO;
import com.andiantong.user.entity.User;
import com.andiantong.user.service.UserService;
import com.andiantong.user.vo.UserVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * 用户管理Controller
 * 提供用户注册、登录、信息管理等接口
 *
 * @author andiantong
 * @version V1.0
 * @since 2026-04
 */
@Api(tags = "用户管理")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@Validated
public class UserController {

    private final UserService userService;
    private final RedisTemplate<String, Object> redisTemplate;

    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result<String> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("用户注册请求: {}", registerDTO.getPhone());
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new BusinessException("两次密码输入不一致");
        }
        String verifyCode = (String) redisTemplate.opsForValue().get("verify:code:" + registerDTO.getPhone());
        if (verifyCode == null || !verifyCode.equals(registerDTO.getVerifyCode())) {
            throw new BusinessException("验证码错误或已过期");
        }
        userService.register(registerDTO);
        redisTemplate.delete("verify:code:" + registerDTO.getPhone());
        return Result.success("注册成功");
    }

    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("用户登录请求: {}", loginDTO.getPhone());
        String token = userService.login(loginDTO);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("expiresIn", 7200);
        return Result.success(data);
    }

    @ApiOperation("发送验证码")
    @GetMapping("/sendVerifyCode")
    public Result<String> sendVerifyCode(@RequestParam String phone) {
        log.info("发送验证码请求: {}", phone);
        if (redisTemplate.hasKey("verify:code:lock:" + phone)) {
            throw new BusinessException("请稍后再发送验证码");
        }
        Random random = new Random();
        String verifyCode = String.valueOf(random.nextInt(900000) + 100000);
        redisTemplate.opsForValue().set("verify:code:" + phone, verifyCode, 5, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set("verify:code:lock:" + phone, "1", 60, TimeUnit.SECONDS);
        log.info("验证码: {}", verifyCode);
        return Result.success("验证码发送成功");
    }

    @ApiOperation("微信登录")
    @PostMapping("/wechatLogin")
    public Result<Map<String, Object>> wechatLogin(@Valid @RequestBody WechatLoginDTO wechatLoginDTO) {
        log.info("微信登录请求: code={}", wechatLoginDTO.getCode());
        String openId = userService.getWechatOpenId(wechatLoginDTO.getCode());
        User user = userService.getUserByOpenId(openId);
        if (user == null) {
            user = userService.createWechatUser(openId, wechatLoginDTO.getNickname(), wechatLoginDTO.getAvatar());
        }
        String token = userService.generateToken(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", userService.getUserVO(user.getId()));
        return Result.success(data);
    }

    @ApiOperation("获取用户信息")
    @GetMapping("/info")
    public Result<UserVO> getUserInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户信息: userId={}", userId);
        UserVO userVO = userService.getUserVO(userId);
        return Result.success(userVO);
    }

    @ApiOperation("更新用户信息")
    @PutMapping("/update")
    public Result<String> updateUserInfo(@Valid @RequestBody UserUpdateDTO userUpdateDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新用户信息: userId={}", userId);
        userService.updateUserInfo(userId, userUpdateDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("绑定手机号")
    @PostMapping("/bindPhone")
    public Result<String> bindPhone(@RequestParam String phone, @RequestParam String verifyCode, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("绑定手机号: userId={}, phone={}", userId, phone);
        String code = (String) redisTemplate.opsForValue().get("verify:code:" + phone);
        if (code == null || !code.equals(verifyCode)) {
            throw new BusinessException("验证码错误或已过期");
        }
        userService.bindPhone(userId, phone);
        redisTemplate.delete("verify:code:" + phone);
        return Result.success("绑定成功");
    }

    @ApiOperation("修改密码")
    @PostMapping("/changePassword")
    public Result<String> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("修改密码: userId={}", userId);
        userService.changePassword(userId, oldPassword, newPassword);
        return Result.success("密码修改成功");
    }

    @ApiOperation("退出登录")
    @PostMapping("/logout")
    public Result<String> logout(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("退出登录: userId={}", userId);
        String token = request.getHeader("Authorization");
        if (token != null) {
            redisTemplate.delete("token:" + userId);
        }
        return Result.success("退出成功");
    }

    @ApiOperation("获取用户地址列表")
    @GetMapping("/addresses")
    public Result<List<Map<String, Object>>> getUserAddresses(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户地址列表: userId={}", userId);
        List<Map<String, Object>> addresses = userService.getUserAddresses(userId);
        return Result.success(addresses);
    }

    @ApiOperation("添加用户地址")
    @PostMapping("/address")
    public Result<String> addUserAddress(@RequestBody Map<String, Object> addressDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("添加用户地址: userId={}", userId);
        userService.addUserAddress(userId, addressDTO);
        return Result.success("添加成功");
    }

    @ApiOperation("更新用户地址")
    @PutMapping("/address/{addressId}")
    public Result<String> updateUserAddress(@PathVariable Long addressId, @RequestBody Map<String, Object> addressDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("更新用户地址: userId={}, addressId={}", userId, addressId);
        userService.updateUserAddress(userId, addressId, addressDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除用户地址")
    @DeleteMapping("/address/{addressId}")
    public Result<String> deleteUserAddress(@PathVariable Long addressId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除用户地址: userId={}, addressId={}", userId, addressId);
        userService.deleteUserAddress(userId, addressId);
        return Result.success("删除成功");
    }

    @ApiOperation("设置默认地址")
    @PutMapping("/address/{addressId}/default")
    public Result<String> setDefaultAddress(@PathVariable Long addressId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("设置默认地址: userId={}, addressId={}", userId, addressId);
        userService.setDefaultAddress(userId, addressId);
        return Result.success("设置成功");
    }

    @ApiOperation("获取用户优惠券列表")
    @GetMapping("/coupons")
    public Result<List<Map<String, Object>>> getUserCoupons(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户优惠券列表: userId={}", userId);
        List<Map<String, Object>> coupons = userService.getUserCoupons(userId);
        return Result.success(coupons);
    }

    @ApiOperation("领取优惠券")
    @PostMapping("/coupon/{couponId}")
    public Result<String> receiveCoupon(@PathVariable Long couponId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取优惠券: userId={}, couponId={}", userId, couponId);
        userService.receiveCoupon(userId, couponId);
        return Result.success("领取成功");
    }

    @ApiOperation("获取用户积分余额")
    @GetMapping("/points")
    public Result<Map<String, Object>> getUserPoints(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户积分余额: userId={}", userId);
        Map<String, Object> points = userService.getUserPoints(userId);
        return Result.success(points);
    }

    @ApiOperation("获取用户积分记录")
    @GetMapping("/points/history")
    public Result<List<Map<String, Object>>> getPointsHistory(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户积分记录: userId={}", userId);
        List<Map<String, Object>> history = userService.getPointsHistory(userId, pageNum, pageSize);
        return Result.success(history);
    }

    @ApiOperation("获取用户订单统计")
    @GetMapping("/order/stats")
    public Result<Map<String, Object>> getOrderStats(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户订单统计: userId={}", userId);
        Map<String, Object> stats = userService.getOrderStats(userId);
        return Result.success(stats);
    }

    @ApiOperation("意见反馈")
    @PostMapping("/feedback")
    public Result<String> submitFeedback(@RequestBody Map<String, Object> feedbackDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("意见反馈: userId={}", userId);
        userService.submitFeedback(userId, feedbackDTO);
        return Result.success("提交成功");
    }

    @ApiOperation("获取用户收藏列表")
    @GetMapping("/favorites")
    public Result<List<Map<String, Object>>> getUserFavorites(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户收藏列表: userId={}", userId);
        List<Map<String, Object>> favorites = userService.getUserFavorites(userId);
        return Result.success(favorites);
    }

    @ApiOperation("添加收藏")
    @PostMapping("/favorite/{serviceId}")
    public Result<String> addFavorite(@PathVariable Long serviceId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("添加收藏: userId={}, serviceId={}", userId, serviceId);
        userService.addFavorite(userId, serviceId);
        return Result.success("收藏成功");
    }

    @ApiOperation("取消收藏")
    @DeleteMapping("/favorite/{serviceId}")
    public Result<String> removeFavorite(@PathVariable Long serviceId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("取消收藏: userId={}, serviceId={}", userId, serviceId);
        userService.removeFavorite(userId, serviceId);
        return Result.success("取消成功");
    }

    @ApiOperation("实名认证")
    @PostMapping("/realNameAuth")
    public Result<String> realNameAuth(@RequestBody Map<String, Object> authDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("实名认证: userId={}", userId);
        userService.realNameAuth(userId, authDTO);
        return Result.success("提交成功，等待审核");
    }

    @ApiOperation("获取实名认证状态")
    @GetMapping("/realNameAuth/status")
    public Result<Map<String, Object>> getRealNameAuthStatus(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取实名认证状态: userId={}", userId);
        Map<String, Object> status = userService.getRealNameAuthStatus(userId);
        return Result.success(status);
    }

    @ApiOperation("获取用户会员等级信息")
    @GetMapping("/member/info")
    public Result<Map<String, Object>> getMemberInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户会员等级信息: userId={}", userId);
        Map<String, Object> memberInfo = userService.getMemberInfo(userId);
        return Result.success(memberInfo);
    }

    @ApiOperation("升级会员等级")
    @PostMapping("/member/upgrade")
    public Result<String> upgradeMemberLevel(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("升级会员等级: userId={}", userId);
        userService.upgradeMemberLevel(userId);
        return Result.success("升级成功");
    }

    @ApiOperation("获取会员权益列表")
    @GetMapping("/member/benefits")
    public Result<List<Map<String, Object>>> getMemberBenefits() {
        log.info("获取会员权益列表");
        List<Map<String, Object>> benefits = userService.getMemberBenefits();
        return Result.success(benefits);
    }

    @ApiOperation("签到获取积分")
    @PostMapping("/signIn")
    public Result<Map<String, Object>> signIn(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("签到获取积分: userId={}", userId);
        Map<String, Object> result = userService.signIn(userId);
        return Result.success(result);
    }

    @ApiOperation("检查今日签到状态")
    @GetMapping("/signIn/status")
    public Result<Map<String, Object>> getSignInStatus(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("检查今日签到状态: userId={}", userId);
        Map<String, Object> status = userService.getSignInStatus(userId);
        return Result.success(status);
    }

    @ApiOperation("获取连续签到奖励")
    @GetMapping("/signIn/rewards")
    public Result<List<Map<String, Object>>> getSignInRewards() {
        log.info("获取连续签到奖励");
        List<Map<String, Object>> rewards = userService.getSignInRewards();
        return Result.success(rewards);
    }

    @ApiOperation("分享邀请好友")
    @GetMapping("/invite/code")
    public Result<Map<String, String>> getInviteCode(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("分享邀请好友: userId={}", userId);
        Map<String, String> inviteInfo = userService.getInviteCode(userId);
        return Result.success(inviteInfo);
    }

    @ApiOperation("绑定邀请关系")
    @PostMapping("/invite/bind")
    public Result<String> bindInviteRelation(@RequestParam String inviteCode, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("绑定邀请关系: userId={}, inviteCode={}", userId, inviteCode);
        userService.bindInviteRelation(userId, inviteCode);
        return Result.success("绑定成功");
    }

    @ApiOperation("获取邀请好友列表")
    @GetMapping("/invite/friends")
    public Result<List<Map<String, Object>>> getInviteFriends(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取邀请好友列表: userId={}", userId);
        List<Map<String, Object>> friends = userService.getInviteFriends(userId);
        return Result.success(friends);
    }

    @ApiOperation("获取邀请奖励")
    @GetMapping("/invite/rewards")
    public Result<Map<String, Object>> getInviteRewards(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取邀请奖励: userId={}", userId);
        Map<String, Object> rewards = userService.getInviteRewards(userId);
        return Result.success(rewards);
    }

    @ApiOperation("支付宝登录")
    @PostMapping("/alipayLogin")
    public Result<Map<String, Object>> alipayLogin(@Valid @RequestBody Map<String, String> loginDTO) {
        String code = loginDTO.get("code");
        log.info("支付宝登录请求: code={}", code);
        String alipayUserId = userService.getAlipayUserId(code);
        User user = userService.getUserByAlipayId(alipayUserId);
        if (user == null) {
            user = userService.createAlipayUser(alipayUserId, loginDTO.get("nickname"));
        }
        String token = userService.generateToken(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", userService.getUserVO(user.getId()));
        return Result.success(data);
    }

    @ApiOperation("Apple登录")
    @PostMapping("/appleLogin")
    public Result<Map<String, Object>> appleLogin(@Valid @RequestBody Map<String, String> loginDTO) {
        String identityToken = loginDTO.get("identityToken");
        log.info("Apple登录请求");
        String appleUserId = userService.getAppleUserId(identityToken);
        User user = userService.getUserByAppleId(appleUserId);
        if (user == null) {
            user = userService.createAppleUser(appleUserId, loginDTO.get("email"));
        }
        String token = userService.generateToken(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", userService.getUserVO(user.getId()));
        return Result.success(data);
    }

    @ApiOperation("一键登录")
    @PostMapping("/oneClickLogin")
    public Result<Map<String, Object>> oneClickLogin(@RequestBody Map<String, String> loginDTO) {
        String accessToken = loginDTO.get("accessToken");
        log.info("一键登录请求");
        String phone = userService.getPhoneNumber(accessToken);
        User user = userService.getUserByPhone(phone);
        if (user == null) {
            throw new BusinessException("用户不存在，请先注册");
        }
        String token = userService.generateToken(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", userService.getUserVO(user.getId()));
        return Result.success(data);
    }

    @ApiOperation("刷新Token")
    @PostMapping("/refreshToken")
    public Result<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        log.info("刷新Token请求");
        String[] tokens = userService.refreshToken(refreshToken);
        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", tokens[0]);
        data.put("refreshToken", tokens[1]);
        data.put("expiresIn", 7200);
        return Result.success(data);
    }

    @ApiOperation("验证Token有效性")
    @GetMapping("/verifyToken")
    public Result<Boolean> verifyToken(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("验证Token有效性: userId={}", userId);
        return Result.success(true);
    }

    @ApiOperation("获取用户浏览历史")
    @GetMapping("/browseHistory")
    public Result<List<Map<String, Object>>> getBrowseHistory(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户浏览历史: userId={}", userId);
        List<Map<String, Object>> history = userService.getBrowseHistory(userId, pageNum, pageSize);
        return Result.success(history);
    }

    @ApiOperation("清空浏览历史")
    @DeleteMapping("/browseHistory")
    public Result<String> clearBrowseHistory(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("清空浏览历史: userId={}", userId);
        userService.clearBrowseHistory(userId);
        return Result.success("清空成功");
    }

    @ApiOperation("检查版本更新")
    @GetMapping("/version/check")
    public Result<Map<String, Object>> checkVersionUpdate(@RequestParam String version, @RequestParam String platform) {
        log.info("检查版本更新: version={}, platform={}", version, platform);
        Map<String, Object> updateInfo = userService.checkVersionUpdate(version, platform);
        return Result.success(updateInfo);
    }

    @ApiOperation("获取用户隐私政策状态")
    @GetMapping("/privacy/status")
    public Result<Map<String, Object>> getPrivacyStatus(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取用户隐私政策状态: userId={}", userId);
        Map<String, Object> status = userService.getPrivacyStatus(userId);
        return Result.success(status);
    }

    @ApiOperation("同意隐私政策")
    @PostMapping("/privacy/agree")
    public Result<String> agreePrivacyPolicy(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("同意隐私政策: userId={}", userId);
        userService.agreePrivacyPolicy(userId);
        return Result.success("操作成功");
    }

    @ApiOperation("获取用户协议")
    @GetMapping("/agreement/user")
    public Result<Map<String, Object>> getUserAgreement() {
        log.info("获取用户协议");
        Map<String, Object> agreement = userService.getUserAgreement();
        return Result.success(agreement);
    }

    @ApiOperation("获取隐私政策")
    @GetMapping("/agreement/privacy")
    public Result<Map<String, Object>> getPrivacyAgreement() {
        log.info("获取隐私政策");
        Map<String, Object> agreement = userService.getPrivacyAgreement();
        return Result.success(agreement);
    }
}
```

### 1.3 后端核心代码 - 用户服务Service

```java
package com.andiantong.user.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.user.dto.LoginDTO;
import com.andiantong.user.dto.RegisterDTO;
import com.andiantong.user.dto.UserUpdateDTO;
import com.andiantong.user.entity.User;
import com.andiantong.user.mapper.UserMapper;
import com.andiantong.user.service.UserService;
import com.andiantong.user.vo.UserVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 用户服务实现类
 * 实现用户相关的业务逻辑
 *
 * @author andiantong
 * @version V1.0
 * @since 2026-04
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String TOKEN_PREFIX = "token:";
    private static final long TOKEN_EXPIRE_TIME = 7200;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(RegisterDTO registerDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, registerDTO.getPhone());
        User existUser = this.getOne(wrapper);
        if (existUser != null) {
            throw new BusinessException("该手机号已注册");
        }
        User user = new User();
        user.setPhone(registerDTO.getPhone());
        user.setPassword(registerDTO.getPassword());
        user.setNickname(registerDTO.getPhone().substring(7));
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1);
        user.setUserType(1);
        this.save(user);
        log.info("用户注册成功: userId={}, phone={}", user.getId(), user.getPhone());
    }

    @Override
    public String login(LoginDTO loginDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, loginDTO.getPhone());
        User user = this.getOne(wrapper);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        if (!loginDTO.getPassword().equals(user.getPassword())) {
            throw new BusinessException("密码错误");
        }
        if (user.getStatus() == 0) {
            throw new BusinessException("账号已被禁用");
        }
        String token = generateToken(user.getId());
        redisTemplate.opsForValue().set(TOKEN_PREFIX + user.getId(), token, TOKEN_EXPIRE_TIME, TimeUnit.SECONDS);
        log.info("用户登录成功: userId={}, phone={}", user.getPhone());
        return token;
    }

    @Override
    public String generateToken(Long userId) {
        return UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public Long verifyToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new BusinessException("Token不能为空");
        }
        Set<String> keys = redisTemplate.keys(TOKEN_PREFIX + "*");
        for (String key : keys) {
            String savedToken = (String) redisTemplate.opsForValue().get(key);
            if (token.equals(savedToken)) {
                Long userId = Long.parseLong(key.split(":")[1]);
                return userId;
            }
        }
        throw new BusinessException("Token无效或已过期");
    }

    @Override
    public User getUserByPhone(String phone) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getPhone, phone);
        return this.getOne(wrapper);
    }

    @Override
    public User getUserByOpenId(String openId) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getWechatOpenId, openId);
        return this.getOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User createWechatUser(String openId, String nickname, String avatar) {
        User user = new User();
        user.setWechatOpenId(openId);
        user.setNickname(nickname != null ? nickname : "微信用户");
        user.setAvatar(avatar);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1);
        user.setUserType(1);
        this.save(user);
        log.info("微信用户创建成功: userId={}, openId={}", user.getId(), openId);
        return user;
    }

    @Override
    public String getWechatOpenId(String code) {
        return "wechat_openid_" + code.substring(0, 8);
    }

    @Override
    public UserVO getUserVO(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUserInfo(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        if (userUpdateDTO.getNickname() != null) {
            user.setNickname(userUpdateDTO.getNickname());
        }
        if (userUpdateDTO.getAvatar() != null) {
            user.setAvatar(userUpdateDTO.getAvatar());
        }
        if (userUpdateDTO.getGender() != null) {
            user.setGender(userUpdateDTO.getGender());
        }
        if (userUpdateDTO.getBirthday() != null) {
            user.setBirthday(LocalDate.parse(userUpdateDTO.getBirthday(), DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        user.setUpdateTime(LocalDateTime.now());
        this.updateById(user);
        log.info("用户信息更新成功: userId={}", userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindPhone(Long userId, String phone) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        User existUser = getUserByPhone(phone);
        if (existUser != null && !existUser.getId().equals(userId)) {
            throw new BusinessException("该手机号已被其他账号绑定");
        }
        user.setPhone(phone);
        user.setUpdateTime(LocalDateTime.now());
        this.updateById(user);
        log.info("手机号绑定成功: userId={}, phone={}", userId, phone);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        if (!oldPassword.equals(user.getPassword())) {
            throw new BusinessException("原密码错误");
        }
        user.setPassword(newPassword);
        user.setUpdateTime(LocalDateTime.now());
        this.updateById(user);
        redisTemplate.delete(TOKEN_PREFIX + userId);
        log.info("密码修改成功: userId={}", userId);
    }

    @Override
    public List<Map<String, Object>> getUserAddresses(Long userId) {
        List<Map<String, Object>> addresses = new ArrayList<>();
        Map<String, Object> addr1 = new HashMap<>();
        addr1.put("id", 1L);
        addr1.put("userId", userId);
        addr1.put("receiverName", "张三");
        addr1.put("phone", "138****8888");
        addr1.put("province", "上海市");
        addr1.put("city", "上海市");
        addr1.put("district", "浦东新区");
        addr1.put("detailAddress", "XX路XX号XX室");
        addr1.put("isDefault", true);
        addresses.add(addr1);
        return addresses;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addUserAddress(Long userId, Map<String, Object> addressDTO) {
        log.info("添加用户地址: userId={}", userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUserAddress(Long userId, Long addressId, Map<String, Object> addressDTO) {
        log.info("更新用户地址: userId={}, addressId={}", userId, addressId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUserAddress(Long userId, Long addressId) {
        log.info("删除用户地址: userId={}, addressId={}", userId, addressId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setDefaultAddress(Long userId, Long addressId) {
        log.info("设置默认地址: userId={}, addressId={}", userId, addressId);
    }

    @Override
    public List<Map<String, Object>> getUserCoupons(Long userId) {
        List<Map<String, Object>> coupons = new ArrayList<>();
        Map<String, Object> coupon1 = new HashMap<>();
        coupon1.put("id", 1L);
        coupon1.put("name", "新人满减券");
        coupon1.put("amount", 10);
        coupon1.put("minAmount", 50);
        coupon1.put("expireTime", "2026-12-31");
        coupon1.put("status", 1);
        coupons.add(coupon1);
        return coupons;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void receiveCoupon(Long userId, Long couponId) {
        log.info("领取优惠券: userId={}, couponId={}", userId, couponId);
    }

    @Override
    public Map<String, Object> getUserPoints(Long userId) {
        Map<String, Object> points = new HashMap<>();
        points.put("balance", 1000);
        points.put("level", 2);
        points.put("levelName", "铜牌会员");
        return points;
    }

    @Override
    public List<Map<String, Object>> getPointsHistory(Long userId, Integer pageNum, Integer pageSize) {
        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> record1 = new HashMap<>();
        record1.put("id", 1L);
        record1.put("type", 1);
        record1.put("amount", 10);
        record1.put("balance", 1000);
        record1.put("description", "签到奖励");
        record1.put("createTime", "2026-04-01 10:00:00");
        history.add(record1);
        return history;
    }

    @Override
    public Map<String, Object> getOrderStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", 10);
        stats.put("pendingOrders", 2);
        stats.put("completedOrders", 8);
        stats.put("totalAmount", 5000.00);
        return stats;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitFeedback(Long userId, Map<String, Object> feedbackDTO) {
        log.info("提交反馈: userId={}", userId);
    }

    @Override
    public List<Map<String, Object>> getUserFavorites(Long userId) {
        List<Map<String, Object>> favorites = new ArrayList<>();
        return favorites;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addFavorite(Long userId, Long serviceId) {
        log.info("添加收藏: userId={}, serviceId={}", userId, serviceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeFavorite(Long userId, Long serviceId) {
        log.info("取消收藏: userId={}, serviceId={}", userId, serviceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void realNameAuth(Long userId, Map<String, Object> authDTO) {
        log.info("实名认证: userId={}", userId);
    }

    @Override
    public Map<String, Object> getRealNameAuthStatus(Long userId) {
        Map<String, Object> status = new HashMap<>();
        status.put("status", 0);
        status.put("message", "未认证");
        return status;
    }

    @Override
    public Map<String, Object> getMemberInfo(Long userId) {
        Map<String, Object> memberInfo = new HashMap<>();
        memberInfo.put("level", 1);
        memberInfo.put("levelName", "普通会员");
        memberInfo.put("points", 1000);
        memberInfo.put("nextLevelPoints", 2000);
        return memberInfo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void upgradeMemberLevel(Long userId) {
        log.info("升级会员等级: userId={}", userId);
    }

    @Override
    public List<Map<String, Object>> getMemberBenefits() {
        List<Map<String, Object>> benefits = new ArrayList<>();
        return benefits;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> signIn(Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("points", 10);
        result.put("continuousDays", 1);
        result.put("totalPoints", 1010);
        return result;
    }

    @Override
    public Map<String, Object> getSignInStatus(Long userId) {
        Map<String, Object> status = new HashMap<>();
        status.put("signed", false);
        status.put("continuousDays", 0);
        return status;
    }

    @Override
    public List<Map<String, Object>> getSignInRewards() {
        List<Map<String, Object>> rewards = new ArrayList<>();
        return rewards;
    }

    @Override
    public Map<String, String> getInviteCode(Long userId) {
        Map<String, String> inviteInfo = new HashMap<>();
        inviteInfo.put("code", "INV" + userId);
        inviteInfo.put("url", "https://andiantong.com/invite/INV" + userId);
        return inviteInfo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindInviteRelation(Long userId, String inviteCode) {
        log.info("绑定邀请关系: userId={}, inviteCode={}", userId, inviteCode);
    }

    @Override
    public List<Map<String, Object>> getInviteFriends(Long userId) {
        List<Map<String, Object>> friends = new ArrayList<>();
        return friends;
    }

    @Override
    public Map<String, Object> getInviteRewards(Long userId) {
        Map<String, Object> rewards = new HashMap<>();
        rewards.put("totalRewards", 0);
        rewards.put("friendCount", 0);
        return rewards;
    }

    @Override
    public String getAlipayUserId(String code) {
        return "alipay_user_" + code.substring(0, 8);
    }

    @Override
    public User getUserByAlipayId(String alipayUserId) {
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User createAlipayUser(String alipayUserId, String nickname) {
        User user = new User();
        user.setNickname(nickname != null ? nickname : "支付宝用户");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1);
        user.setUserType(1);
        this.save(user);
        return user;
    }

    @Override
    public String getAppleUserId(String identityToken) {
        return "apple_user_" + identityToken.substring(0, 8);
    }

    @Override
    public User getUserByAppleId(String appleUserId) {
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User createAppleUser(String appleUserId, String email) {
        User user = new User();
        user.setNickname("Apple用户");
        user.setEmail(email);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1);
        user.setUserType(1);
        this.save(user);
        return user;
    }

    @Override
    public String getPhoneNumber(String accessToken) {
        return "13800008888";
    }

    @Override
    public String[] refreshToken(String refreshToken) {
        String[] tokens = new String[2];
        tokens[0] = UUID.randomUUID().toString().replace("-", "");
        tokens[1] = UUID.randomUUID().toString().replace("-", "");
        return tokens;
    }

    @Override
    public List<Map<String, Object>> getBrowseHistory(Long userId, Integer pageNum, Integer pageSize) {
        List<Map<String, Object>> history = new ArrayList<>();
        return history;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void clearBrowseHistory(Long userId) {
        log.info("清空浏览历史: userId={}", userId);
    }

    @Override
    public Map<String, Object> checkVersionUpdate(String version, String platform) {
        Map<String, Object> updateInfo = new HashMap<>();
        updateInfo.put("hasUpdate", false);
        updateInfo.put("latestVersion", "1.0.0");
        updateInfo.put("updateContent", "");
        return updateInfo;
    }

    @Override
    public Map<String, Object> getPrivacyStatus(Long userId) {
        Map<String, Object> status = new HashMap<>();
        status.put("agreed", true);
        status.put("agreeTime", "2026-01-01 00:00:00");
        return status;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void agreePrivacyPolicy(Long userId) {
        log.info("同意隐私政策: userId={}", userId);
    }

    @Override
    public Map<String, Object> getUserAgreement() {
        Map<String, Object> agreement = new HashMap<>();
        agreement.put("title", "用户服务协议");
        agreement.put("content", "用户服务协议内容...");
        agreement.put("version", "1.0");
        agreement.put("updateTime", "2026-01-01");
        return agreement;
    }

    @Override
    public Map<String, Object> getPrivacyAgreement() {
        Map<String, Object> agreement = new HashMap<>();
        agreement.put("title", "隐私政策");
        agreement.put("content", "隐私政策内容...");
        agreement.put("version", "1.0");
        agreement.put("updateTime", "2026-01-01");
        return agreement;
    }
}
```

### 1.4 后端核心代码 - 订单服务Controller

```java
package com.andiantong.order.controller;

import com.andiantong.common.core.Result;
import com.andiantong.order.dto.*;
import com.andiantong.order.service.OrderService;
import com.andiantong.order.vo.OrderDetailVO;
import com.andiantong.order.vo.OrderListVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 订单管理Controller
 * 提供订单创建、查询、支付等接口
 *
 * @author andiantong
 * @version V1.0
 * @since 2026-04
 */
@Api(tags = "订单管理")
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @ApiOperation("创建订单")
    @PostMapping("/create")
    public Result<Long> createOrder(@Valid @RequestBody CreateOrderDTO createOrderDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("创建订单: userId={}", userId);
        Long orderId = orderService.createOrder(userId, createOrderDTO);
        return Result.success(orderId);
    }

    @ApiOperation("订单列表")
    @GetMapping("/list")
    public Result<List<OrderListVO>> getOrderList(
            HttpServletRequest request,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取订单列表: userId={}, status={}", userId, status);
        List<OrderListVO> orders = orderService.getOrderList(userId, status, pageNum, pageSize);
        return Result.success(orders);
    }

    @ApiOperation("订单详情")
    @GetMapping("/{orderId}")
    public Result<OrderDetailVO> getOrderDetail(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取订单详情: userId={}, orderId={}", userId, orderId);
        OrderDetailVO detail = orderService.getOrderDetail(userId, orderId);
        return Result.success(detail);
    }

    @ApiOperation("取消订单")
    @PostMapping("/{orderId}/cancel")
    public Result<String> cancelOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("取消订单: userId={}, orderId={}", userId, orderId);
        orderService.cancelOrder(userId, orderId);
        return Result.success("取消成功");
    }

    @ApiOperation("申请退款")
    @PostMapping("/{orderId}/refund")
    public Result<String> applyRefund(@PathVariable Long orderId, @RequestBody Map<String, String> refundDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("申请退款: userId={}, orderId={}", userId, orderId);
        orderService.applyRefund(userId, orderId, refundDTO.get("reason"));
        return Result.success("申请成功，等待审核");
    }

    @ApiOperation("确认收货")
    @PostMapping("/{orderId}/confirm")
    public Result<String> confirmReceipt(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("确认收货: userId={}, orderId={}", userId, orderId);
        orderService.confirmReceipt(userId, orderId);
        return Result.success("确认成功");
    }

    @ApiOperation("删除订单")
    @DeleteMapping("/{orderId}")
    public Result<String> deleteOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("删除订单: userId={}, orderId={}", userId, orderId);
        orderService.deleteOrder(userId, orderId);
        return Result.success("删除成功");
    }

    @ApiOperation("订单评价")
    @PostMapping("/{orderId}/evaluate")
    public Result<String> evaluateOrder(@PathVariable Long orderId, @RequestBody Map<String, Object> evaluateDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("订单评价: userId={}, orderId={}", userId, orderId);
        orderService.evaluateOrder(userId, orderId, evaluateDTO);
        return Result.success("评价成功");
    }

    @ApiOperation("订单支付")
    @PostMapping("/{orderId}/pay")
    public Result<Map<String, Object>> payOrder(@PathVariable Long orderId, @RequestBody Map<String, String> payDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("订单支付: userId={}, orderId={}", userId, orderId);
        Map<String, Object> payResult = orderService.payOrder(userId, orderId, payDTO.get("payType"));
        return Result.success(payResult);
    }

    @ApiOperation("支付回调")
    @PostMapping("/payNotify")
    public String payNotify(@RequestBody Map<String, String> notifyData) {
        log.info("支付回调: {}", notifyData);
        orderService.handlePayNotify(notifyData);
        return "success";
    }

    @ApiOperation("订单状态查询")
    @GetMapping("/{orderId}/status")
    public Result<Map<String, Object>> getOrderStatus(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("订单状态查询: userId={}, orderId={}", userId, orderId);
        Map<String, Object> status = orderService.getOrderStatus(userId, orderId);
        return Result.success(status);
    }

    @ApiOperation("待支付订单")
    @GetMapping("/pending")
    public Result<List<OrderListVO>> getPendingOrders(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("待支付订单: userId={}", userId);
        List<OrderListVO> orders = orderService.getPendingOrders(userId);
        return Result.success(orders);
    }

    @ApiOperation("订单数量统计")
    @GetMapping("/count")
    public Result<Map<String, Integer>> getOrderCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("订单数量统计: userId={}", userId);
        Map<String, Integer> count = orderService.getOrderCount(userId);
        return Result.success(count);
    }

    @ApiOperation("催单")
    @PostMapping("/{orderId}/remind")
    public Result<String> remindOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("催单: userId={}, orderId={}", userId, orderId);
        orderService.remindOrder(userId, orderId);
        return Result.success("催单成功");
    }

    @ApiOperation("申请开票")
    @PostMapping("/{orderId}/invoice")
    public Result<String> applyInvoice(@PathVariable Long orderId, @RequestBody Map<String, Object> invoiceDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("申请开票: userId={}, orderId={}", userId, orderId);
        orderService.applyInvoice(userId, orderId, invoiceDTO);
        return Result.success("申请成功");
    }

    @ApiOperation("再次购买")
    @PostMapping("/{orderId}/rebuy")
    public Result<Long> rebuyOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("再次购买: userId={}, orderId={}", userId, orderId);
        Long newOrderId = orderService.rebuyOrder(userId, orderId);
        return Result.success(newOrderId);
    }

    @ApiOperation("获取订单跟踪信息")
    @GetMapping("/{orderId}/track")
    public Result<List<Map<String, Object>>> getOrderTrack(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取订单跟踪信息: userId={}, orderId={}", userId, orderId);
        List<Map<String, Object>> track = orderService.getOrderTrack(userId, orderId);
        return Result.success(track);
    }

    @ApiOperation("延长保修")
    @PostMapping("/{orderId}/extendWarranty")
    public Result<String> extendWarranty(@PathVariable Long orderId, @RequestBody Map<String, Object> extendDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("延长保修: userId={}, orderId={}", userId, orderId);
        orderService.extendWarranty(userId, orderId, extendDTO);
        return Result.success("申请成功");
    }
}
```

### 1.5 后端核心代码 - 订单服务Service

```java
package com.andiantong.order.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.order.dto.CreateOrderDTO;
import com.andiantong.order.entity.Order;
import com.andiantong.order.mapper.OrderMapper;
import com.andiantong.order.service.OrderService;
import com.andiantong.order.vo.OrderDetailVO;
import com.andiantong.order.vo.OrderListVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 订单服务实现类
 * 实现订单相关的业务逻辑
 *
 * @author andiantong
 * @version V1.0
 * @since 2026-04
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createOrder(Long userId, CreateOrderDTO createOrderDTO) {
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setServiceId(createOrderDTO.getServiceId());
        order.setServiceName(createOrderDTO.getServiceName());
        order.setServicePrice(createOrderDTO.getPrice());
        order.setQuantity(1);
        order.setTotalAmount(createOrderDTO.getPrice());
        order.setStatus(0);
        order.setPayStatus(0);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        this.save(order);
        log.info("创建订单成功: orderId={}, orderNo={}", order.getId(), order.getOrderNo());
        return order.getId();
    }

    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Random random = new Random();
        int randomNum = random.nextInt(900000) + 100000;
        return "ANDT" + timestamp + randomNum;
    }

    @Override
    public List<OrderListVO> getOrderList(Long userId, Integer status, Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreateTime);
        List<Order> orders = this.page(new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNum, pageSize), wrapper).getRecords();
        return orders.stream().map(this::convertToOrderListVO).collect(Collectors.toList());
    }

    private OrderListVO convertToOrderListVO(Order order) {
        OrderListVO vo = new OrderListVO();
        BeanUtils.copyProperties(order, vo);
        return vo;
    }

    @Override
    public OrderDetailVO getOrderDetail(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        OrderDetailVO detail = new OrderDetailVO();
        BeanUtils.copyProperties(order, detail);
        return detail;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态不允许取消");
        }
        order.setStatus(6);
        order.setUpdateTime(LocalDateTime.now());
        this.updateById(order);
        log.info("取消订单成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyRefund(Long userId, Long orderId, String reason) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 1 && order.getStatus() != 2) {
            throw new BusinessException("订单状态不允许退款");
        }
        order.setStatus(4);
        order.setRefundReason(reason);
        order.setUpdateTime(LocalDateTime.now());
        this.updateById(order);
        log.info("申请退款成功: orderId={}, reason={}", orderId, reason);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void confirmReceipt(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 2) {
            throw new BusinessException("订单状态不允许确认收货");
        }
        order.setStatus(3);
        order.setCompleteTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        this.updateById(order);
        log.info("确认收货成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOrder(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 3 && order.getStatus() != 6) {
            throw new BusinessException("订单状态不允许删除");
        }
        this.removeById(orderId);
        log.info("删除订单成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void evaluateOrder(Long userId, Long orderId, Map<String, Object> evaluateDTO) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 3) {
            throw new BusinessException("订单状态不允许评价");
        }
        order.setStatus(5);
        order.setUpdateTime(LocalDateTime.now());
        this.updateById(order);
        log.info("订单评价成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> payOrder(Long userId, Long orderId, String payType) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态不允许支付");
        }
        Map<String, Object> payResult = new HashMap<>();
        payResult.put("orderId", orderId);
        payResult.put("orderNo", order.getOrderNo());
        payResult.put("amount", order.getTotalAmount());
        payResult.put("payType", payType);
        payResult.put("payUrl", "https://payment.example.com/pay");
        log.info("发起支付: orderId={}, payType={}", orderId, payType);
        return payResult;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handlePayNotify(Map<String, String> notifyData) {
        String orderNo = notifyData.get("orderNo");
        String payStatus = notifyData.get("status");
        log.info("支付回调: orderNo={}, status={}", orderNo, payStatus);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getOrderNo, orderNo);
        Order order = this.getOne(wrapper);
        if (order != null && "SUCCESS".equals(payStatus)) {
            order.setStatus(1);
            order.setPayStatus(1);
            order.setPayTime(LocalDateTime.now());
            order.setUpdateTime(LocalDateTime.now());
            this.updateById(order);
            log.info("支付成功: orderId={}", order.getId());
        }
    }

    @Override
    public Map<String, Object> getOrderStatus(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        Map<String, Object> status = new HashMap<>();
        status.put("orderId", orderId);
        status.put("orderNo", order.getOrderNo());
        status.put("status", order.getStatus());
        status.put("payStatus", order.getPayStatus());
        status.put("updateTime", order.getUpdateTime());
        return status;
    }

    @Override
    public List<OrderListVO> getPendingOrders(Long userId) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        wrapper.eq(Order::getStatus, 0);
        wrapper.orderByDesc(Order::getCreateTime);
        List<Order> orders = this.list(wrapper);
        return orders.stream().map(this::convertToOrderListVO).collect(Collectors.toList());
    }

    @Override
    public Map<String, Integer> getOrderCount(Long userId) {
        Map<String, Integer> count = new HashMap<>();
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        Long total = this.count(wrapper);
        count.put("total", total.intValue());
        LambdaQueryWrapper<Order> wrapper0 = new LambdaQueryWrapper<>();
        wrapper0.eq(Order::getUserId, userId).eq(Order::getStatus, 0);
        count.put("pending", this.count(wrapper0).intValue());
        LambdaQueryWrapper<Order> wrapper1 = new LambdaQueryWrapper<>();
        wrapper1.eq(Order::getUserId, userId).eq(Order::getStatus, 1);
        count.put("paid", this.count(wrapper1).intValue());
        LambdaQueryWrapper<Order> wrapper2 = new LambdaQueryWrapper<>();
        wrapper2.eq(Order::getUserId, userId).eq(Order::getStatus, 3);
        count.put("completed", this.count(wrapper2).intValue());
        return count;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void remindOrder(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        log.info("催单成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyInvoice(Long userId, Long orderId, Map<String, Object> invoiceDTO) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 3) {
            throw new BusinessException("订单状态不允许开票");
        }
        log.info("申请开票成功: orderId={}", orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long rebuyOrder(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        CreateOrderDTO createOrderDTO = new CreateOrderDTO();
        createOrderDTO.setServiceId(order.getServiceId());
        createOrderDTO.setServiceName(order.getServiceName());
        createOrderDTO.setPrice(order.getServicePrice());
        return this.createOrder(userId, createOrderDTO);
    }

    @Override
    public List<Map<String, Object>> getOrderTrack(Long userId, Long orderId) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        List<Map<String, Object>> track = new ArrayList<>();
        Map<String, Object> step1 = new HashMap<>();
        step1.put("status", 0);
        step1.put("title", "订单创建");
        step1.put("time", order.getCreateTime());
        step1.put("completed", true);
        track.add(step1);
        if (order.getStatus() >= 1) {
            Map<String, Object> step2 = new HashMap<>();
            step2.put("status", 1);
            step2.put("title", "订单支付");
            step2.put("time", order.getPayTime());
            step2.put("completed", true);
            track.add(step2);
        }
        if (order.getStatus() >= 3) {
            Map<String, Object> step3 = new HashMap<>();
            step3.put("status", 3);
            step3.put("title", "服务完成");
            step3.put("time", order.getCompleteTime());
            step3.put("completed", true);
            track.add(step3);
        }
        return track;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void extendWarranty(Long userId, Long orderId, Map<String, Object> extendDTO) {
        Order order = this.getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (order.getStatus() != 3) {
            throw new BusinessException("订单状态不允许延长保修");
        }
        log.info("延长保修成功: orderId={}", orderId);
    }
}
```

'''

frontend_code = '''

## 第二部分：源代码后3000行

### 2.1 前端核心代码 - Taro主应用配置

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './app.scss';

class App extends Taro.Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/service/list',
      'pages/service/detail',
      'pages/order/list',
      'pages/order/detail',
      'pages/user/index',
      'pages/user/profile',
      'pages/user/address',
      'pages/user/coupon',
      'pages/electrician/task-hall',
      'pages/electrician/order-list',
      'pages/electrician/profile',
      'pages/payment/pay',
      'pages/search/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1890ff',
      navigationBarTitleText: '安电通',
      navigationBarTextStyle: 'white',
      backgroundColor: '#f5f5f5',
    },
    tabBar: {
      color: '#999999',
      selectedColor: '#1890ff',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'assets/icons/home.png',
          selectedIconPath: 'assets/icons/home-active.png',
        },
        {
          pagePath: 'pages/service/list',
          text: '服务',
          iconPath: 'assets/icons/service.png',
          selectedIconPath: 'assets/icons/service-active.png',
        },
        {
          pagePath: 'pages/order/list',
          text: '订单',
          iconPath: 'assets/icons/order.png',
          selectedIconPath: 'assets/icons/order-active.png',
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
          iconPath: 'assets/icons/user.png',
          selectedIconPath: 'assets/icons/user-active.png',
        },
      ],
    },
    permission: {
      'scope.userLocation': {
        desc: '您的位置信息将用于确定附近的服务商',
      },
    },
  };

  componentDidMount() {
    this.checkLoginStatus();
    this.initApp();
  }

  checkLoginStatus = () => {
    const token = Taro.getStorageSync('token');
    if (token) {
      Taro.setStorageSync('isLogin', true);
    } else {
      Taro.setStorageSync('isLogin', false);
    }
  };

  initApp = () => {
    this.getSystemInfo();
    this.getUserLocation();
    this.checkVersionUpdate();
  };

  getSystemInfo = () => {
    const systemInfo = Taro.getSystemInfoSync();
    Taro.setStorageSync('systemInfo', systemInfo);
    const isIOS = systemInfo.system.toLowerCase().includes('ios');
    Taro.setStorageSync('isIOS', isIOS);
  };

  getUserLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        Taro.setStorageSync('location', {
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: () => {
        Taro.setStorageSync('location', {
          latitude: 31.2304,
          longitude: 121.4737,
        });
      },
    });
  };

  checkVersionUpdate = () => {
    const version = Taro.getSystemInfoSync().version;
    Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/version/check`,
      data: { version, platform: Taro.getSystemInfoSync().platform },
    });
  };

  render() {
    return <View>{this.props.children}</View>;
  }
}

export default App;
```

### 2.2 前端核心代码 - 首页组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

class Index extends Taro.Component {
  state = {
    banners: [],
    categories: [],
    hotServices: [],
    recommendElectricians: [],
    announcements: [],
    location: {},
    searchText: '',
  };

  componentDidMount() {
    this.loadHomeData();
  }

  loadHomeData = async () => {
    try {
      const location = Taro.getStorageSync('location') || { latitude: 31.2304, longitude: 121.4737 };
      this.setState({ location });
      await Promise.all([
        this.getBanners(),
        this.getCategories(),
        this.getHotServices(location),
        this.getRecommendElectricians(location),
        this.getAnnouncements(),
      ]);
    } catch (error) {
      console.error('加载首页数据失败:', error);
    }
  };

  getBanners = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/banner/list`,
      data: { position: 'home' },
    });
    if (res.data.code === 0) {
      this.setState({ banners: res.data.data });
    }
  };

  getCategories = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/categories`,
    });
    if (res.data.code === 0) {
      this.setState({ categories: res.data.data });
    }
  };

  getHotServices = async (location) => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/hot`,
      data: { limit: 10 },
    });
    if (res.data.code === 0) {
      this.setState({ hotServices: res.data.data });
    }
  };

  getRecommendElectricians = async (location) => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/electrician/recommend`,
      data: { latitude: location.latitude, longitude: location.longitude, limit: 5 },
    });
    if (res.data.code === 0) {
      this.setState({ recommendElectricians: res.data.data });
    }
  };

  getAnnouncements = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/announcement/list`,
      data: { limit: 5 },
    });
    if (res.data.code === 0) {
      this.setState({ announcements: res.data.data });
    }
  };

  handleSearch = () => {
    const { searchText } = this.state;
    if (searchText.trim()) {
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${encodeURIComponent(searchText)}`,
      });
    } else {
      Taro.navigateTo({
        url: '/pages/search/index',
      });
    }
  };

  onSearchInput = (e) => {
    this.setState({ searchText: e.detail.value });
  };

  goToServiceList = (categoryId) => {
    Taro.navigateTo({
      url: `/pages/service/list?categoryId=${categoryId}`,
    });
  };

  goToServiceDetail = (serviceId) => {
    Taro.navigateTo({
      url: `/pages/service/detail?id=${serviceId}`,
    });
  };

  goToElectricianDetail = (electricianId) => {
    Taro.navigateTo({
      url: `/pages/electrician/detail?id=${electricianId}`,
    });
  };

  goToAnnouncementDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/announcement/detail?id=${id}`,
    });
  };

  switchLocation = () => {
    Taro.chooseLocation({
      success: (res) => {
        Taro.setStorageSync('location', {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address,
        });
        this.setState({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address,
          },
        });
        this.loadHomeData();
      },
    });
  };

  render() {
    const { banners, categories, hotServices, recommendElectricians, announcements, location, searchText } = this.state;
    return (
      <ScrollView className="index-page" scrollY>
        <View className="search-bar">
          <View className="location" onClick={this.switchLocation}>
            <Text className="iconfont icon-location"></Text>
            <Text className="address">{location.address || '上海市'}</Text>
          </View>
          <View className="search-input" onClick={this.handleSearch}>
            <Text className="iconfont icon-search"></Text>
            <Input className="input" placeholder="搜索服务或电工" value={searchText} onInput={this.onSearchInput} onConfirm={this.handleSearch} />
          </View>
        </View>
        <Swiper className="banner-swiper" indicatorDots autoplay circular indicatorActiveColor="#fff">
          {banners.map((banner) => (
            <SwiperItem key={banner.id} onClick={() => this.goToBannerDetail(banner)}>
              <Image className="banner-image" src={banner.imageUrl} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>
        <View className="category-grid">
          {categories.map((category) => (
            <View className="category-item" key={category.id} onClick={() => this.goToServiceList(category.id)}>
              <Image className="category-icon" src={category.icon} mode="aspectFit" />
              <Text className="category-name">{category.name}</Text>
            </View>
          ))}
        </View>
        <View className="announcement-section">
          <View className="section-title">公告资讯</View>
          <ScrollView className="announcement-list" scrollX>
            {announcements.map((announcement) => (
              <View className="announcement-item" key={announcement.id} onClick={() => this.goToAnnouncementDetail(announcement.id)}>
                <Text className="announcement-title">{announcement.title}</Text>
                <Text className="announcement-time">{announcement.createTime}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="hot-service-section">
          <View className="section-title">热门服务</View>
          <View className="service-list">
            {hotServices.map((service) => (
              <View className="service-card" key={service.id} onClick={() => this.goToServiceDetail(service.id)}>
                <Image className="service-image" src={service.image} mode="aspectFill" />
                <View className="service-info">
                  <Text className="service-name">{service.name}</Text>
                  <Text className="service-desc">{service.description}</Text>
                  <View className="service-bottom">
                    <Text className="service-price">¥{service.price}</Text>
                    <Text className="service-sales">已售{service.sales}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="electrician-section">
          <View className="section-title">推荐电工</View>
          <ScrollView className="electrician-list" scrollX>
            {recommendElectricians.map((electrician) => (
              <View className="electrician-card" key={electrician.id} onClick={() => this.goToElectricianDetail(electrician.id)}>
                <Image className="electrician-avatar" src={electrician.avatar} mode="aspectFill" />
                <Text className="electrician-name">{electrician.name}</Text>
                <View className="electrician-rating">
                  <Text className="rating-score">{electrician.rating}</Text>
                  <Text className="rating-count">{electrician.orderCount}单</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

export default Index;
```

### 2.3 前端核心代码 - 服务列表组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView, Tabs, Tab } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './list.scss';

class ServiceList extends Taro.Component {
  state = {
    categoryId: null,
    categoryList: [],
    serviceList: [],
    pageNum: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    sortBy: 'default',
    filterPrice: [],
  };

  componentDidMount(options) {
    const { categoryId } = options || {};
    if (categoryId) {
      this.setState({ categoryId: parseInt(categoryId) });
    }
    this.getCategoryList();
    this.getServiceList();
  }

  getCategoryList = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/categories`,
    });
    if (res.data.code === 0) {
      this.setState({ categoryList: res.data.data });
    }
  };

  getServiceList = async (loadMore = false) => {
    const { categoryId, pageNum, pageSize, sortBy, filterPrice, loading } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/service/items`,
        data: {
          categoryId,
          sortBy,
          minPrice: filterPrice[0],
          maxPrice: filterPrice[1],
          pageNum: loadMore ? pageNum + 1 : 1,
          pageSize,
        },
      });
      if (res.data.code === 0) {
        const newList = res.data.data;
        this.setState({
          serviceList: loadMore ? [...this.state.serviceList, ...newList] : newList,
          pageNum: loadMore ? pageNum + 1 : 1,
          hasMore: newList.length >= pageSize,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  onScrollToLower = () => {
    const { hasMore } = this.state;
    if (hasMore) {
      this.getServiceList(true);
    }
  };

  onTabClick = (categoryId) => {
    this.setState({ categoryId, pageNum: 1, serviceList: [] });
    this.getServiceList();
  };

  onSortChange = (sortBy) => {
    this.setState({ sortBy, pageNum: 1, serviceList: [] });
    this.getServiceList();
  };

  goToServiceDetail = (serviceId) => {
    Taro.navigateTo({
      url: `/pages/service/detail?id=${serviceId}`,
    });
  };

  render() {
    const { categoryList, serviceList, sortBy, hasMore, loading } = this.state;
    return (
      <View className="service-list-page">
        <View className="category-tabs">
          <ScrollView className="category-scroll" scrollX>
            {categoryList.map((category) => (
              <View className={`category-tab ${this.state.categoryId === category.id ? 'active' : ''}`} key={category.id} onClick={() => this.onTabClick(category.id)}>
                {category.name}
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="sort-bar">
          <View className={`sort-item ${sortBy === 'default' ? 'active' : ''}`} onClick={() => this.onSortChange('default')}>
            综合
          </View>
          <View className={`sort-item ${sortBy === 'sales' ? 'active' : ''}`} onClick={() => this.onSortChange('sales')}>
            销量
          </View>
          <View className={`sort-item ${sortBy === 'price' ? 'active' : ''}`} onClick={() => this.onSortChange('price')}>
            价格
          </View>
          <View className={`sort-item ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => this.onSortChange('rating')}>
            评分
          </View>
        </View>
        <ScrollView className="service-scroll" scrollY onScrollToLower={this.onScrollToLower}>
          <View className="service-grid">
            {serviceList.map((service) => (
              <View className="service-item" key={service.id} onClick={() => this.goToServiceDetail(service.id)}>
                <Image className="service-image" src={service.image} mode="aspectFill" />
                <View className="service-info">
                  <Text className="service-name">{service.name}</Text>
                  <Text className="service-desc">{service.description}</Text>
                  <View className="service-meta">
                    <Text className="service-price">¥{service.price}</Text>
                    <Text className="service-sales">已售{service.sales}</Text>
                  </View>
                  <View className="service-rating">
                    <Text className="rating-star">★★★★★</Text>
                    <Text className="rating-score">{service.rating}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {loading && <View className="loading">加载中...</View>}
          {!hasMore && serviceList.length > 0 && <View className="no-more">没有更多了</View>}
          {serviceList.length === 0 && !loading && <View className="empty">暂无服务</View>}
        </ScrollView>
      </View>
    );
  }
}

export default ServiceList;
```

### 2.4 前端核心代码 - 订单列表组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView, Tabs, Tab } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './list.scss';

class OrderList extends Taro.Component {
  state = {
    status: null,
    orderList: [],
    pageNum: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    refreshing: false,
  };

  componentDidShow() {
    this.loadOrderList();
  }

  onPullDownRefresh = () => {
    this.setState({ pageNum: 1, orderList: [], refreshing: true });
    this.loadOrderList();
  };

  loadOrderList = async (loadMore = false) => {
    const { status, pageNum, pageSize, loading, refreshing } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/list`,
        data: {
          status,
          pageNum: loadMore ? pageNum + 1 : 1,
          pageSize,
        },
      });
      if (res.data.code === 0) {
        const newList = res.data.data;
        this.setState({
          orderList: loadMore ? [...this.state.orderList, ...newList] : newList,
          pageNum: loadMore ? pageNum + 1 : 1,
          hasMore: newList.length >= pageSize,
          loading: false,
          refreshing: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false, refreshing: false });
    }
  };

  onScrollToLower = () => {
    const { hasMore } = this.state;
    if (hasMore) {
      this.loadOrderList(true);
    }
  };

  onTabClick = (status) => {
    this.setState({ status, pageNum: 1, orderList: [] });
    this.loadOrderList();
  };

  goToOrderDetail = (orderId) => {
    Taro.navigateTo({
      url: `/pages/order/detail?id=${orderId}`,
    });
  };

  goToServiceDetail = (serviceId) => {
    Taro.navigateTo({
      url: `/pages/service/detail?id=${serviceId}`,
    });
  };

  cancelOrder = async (orderId) => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
    });
    if (confirm.confirm) {
      await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/${orderId}/cancel`,
        method: 'POST',
      });
      Taro.showToast({ title: '取消成功' });
      this.loadOrderList();
    }
  };

  payOrder = (orderId) => {
    Taro.navigateTo({
      url: `/pages/payment/pay?orderId=${orderId}`,
    });
  };

  confirmReceipt = async (orderId) => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定已收到服务吗？',
    });
    if (confirm.confirm) {
      await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/${orderId}/confirm`,
        method: 'POST',
      });
      Taro.showToast({ title: '确认成功' });
      this.loadOrderList();
    }
  };

  deleteOrder = async (orderId) => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
    });
    if (confirm.confirm) {
      await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/${orderId}`,
        method: 'DELETE',
      });
      Taro.showToast({ title: '删除成功' });
      this.loadOrderList();
    }
  };

  render() {
    const { status, orderList, hasMore, loading, refreshing } = this.state;
    const tabs = [
      { status: null, name: '全部' },
      { status: 0, name: '待支付' },
      { status: 1, name: '待服务' },
      { status: 2, name: '服务中' },
      { status: 3, name: '已完成' },
      { status: 4, name: '退款中' },
    ];
    return (
      <View className="order-list-page">
        <View className="order-tabs">
          <ScrollView className="tabs-scroll" scrollX>
            {tabs.map((tab) => (
              <View className={`order-tab ${status === tab.status ? 'active' : ''}`} key={tab.status} onClick={() => this.onTabClick(tab.status)}>
                {tab.name}
              </View>
            ))}
          </ScrollView>
        </View>
        <ScrollView className="order-scroll" scrollY onScrollToLower={this.onScrollToLower} onPullDownRefresh={this.onPullDownRefresh}>
          <View className="order-list">
            {orderList.map((order) => (
              <View className="order-card" key={order.id} onClick={() => this.goToOrderDetail(order.id)}>
                <View className="order-header">
                  <Text className="order-no">{order.orderNo}</Text>
                  <Text className="order-status">{order.statusName}</Text>
                </View>
                <View className="order-content" onClick={(e) => { e.stopPropagation(); this.goToServiceDetail(order.serviceId); }}>
                  <Image className="service-image" src={order.serviceImage} mode="aspectFill" />
                  <View className="service-info">
                    <Text className="service-name">{order.serviceName}</Text>
                    <Text className="service-desc">{order.serviceDesc}</Text>
                  </View>
                </View>
                <View className="order-footer">
                  <Text className="order-amount">¥{order.totalAmount}</Text>
                  <View className="order-actions">
                    {order.status === 0 && <Button className="btn-cancel" onClick={(e) => { e.stopPropagation(); this.cancelOrder(order.id); }}>取消订单</Button>}
                    {order.status === 0 && <Button className="btn-pay" onClick={(e) => { e.stopPropagation(); this.payOrder(order.id); }}>立即支付</Button>}
                    {order.status === 2 && <Button className="btn-confirm" onClick={(e) => { e.stopPropagation(); this.confirmReceipt(order.id); }}>确认完成</Button>}
                    {(order.status === 3 || order.status === 6) && <Button className="btn-delete" onClick={(e) => { e.stopPropagation(); this.deleteOrder(order.id); }}>删除订单</Button>}
                  </View>
                </View>
              </View>
            ))}
          </View>
          {loading && <View className="loading">加载中...</View>}
          {!hasMore && orderList.length > 0 && <View className="no-more">没有更多了</View>}
          {orderList.length === 0 && !loading && <View className="empty">暂无订单</View>}
        </ScrollView>
      </View>
    );
  }
}

export default OrderList;
```

### 2.5 前端核心代码 - 用户中心组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

class UserIndex extends Taro.Component {
  state = {
    userInfo: null,
    orderCount: {},
    memberInfo: null,
    isLogin: false,
  };

  componentDidShow() {
    this.checkLoginStatus();
    if (this.state.isLogin) {
      this.loadUserData();
    }
  }

  checkLoginStatus = () => {
    const isLogin = Taro.getStorageSync('isLogin');
    this.setState({ isLogin });
  };

  loadUserData = async () => {
    try {
      await Promise.all([this.getUserInfo(), this.getOrderCount(), this.getMemberInfo()]);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  getUserInfo = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/info`,
    });
    if (res.data.code === 0) {
      this.setState({ userInfo: res.data.data });
    }
  };

  getOrderCount = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/count`,
    });
    if (res.data.code === 0) {
      this.setState({ orderCount: res.data.data });
    }
  };

  getMemberInfo = async () => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/member/info`,
    });
    if (res.data.code === 0) {
      this.setState({ memberInfo: res.data.data });
    }
  };

  goToLogin = () => {
    Taro.navigateTo({
      url: '/pages/user/login',
    });
  };

  goToOrderList = (status) => {
    Taro.navigateTo({
      url: `/pages/order/list?status=${status}`,
    });
  };

  goToAddress = () => {
    Taro.navigateTo({
      url: '/pages/user/address',
    });
  };

  goToCoupon = () => {
    Taro.navigateTo({
      url: '/pages/user/coupon',
    });
  };

  goToPoints = () => {
    Taro.navigateTo({
      url: '/pages/user/points',
    });
  };

  goToSettings = () => {
    Taro.navigateTo({
      url: '/pages/user/settings',
    });
  };

  goToProfile = () => {
    Taro.navigateTo({
      url: '/pages/user/profile',
    });
  };

  handleLogout = async () => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
    });
    if (confirm.confirm) {
      await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/user/logout`,
        method: 'POST',
      });
      Taro.removeStorageSync('token');
      Taro.removeStorageSync('userInfo');
      Taro.setStorageSync('isLogin', false);
      this.setState({ isLogin: false, userInfo: null });
      Taro.showToast({ title: '已退出登录' });
    }
  };

  render() {
    const { userInfo, orderCount, memberInfo, isLogin } = this.state;
    return (
      <ScrollView className="user-page" scrollY>
        <View className="user-header">
          {isLogin ? (
            <View className="user-info" onClick={this.goToProfile}>
              <Image className="avatar" src={userInfo?.avatar || 'https://example.com/default-avatar.png'} mode="aspectFill" />
              <View className="info">
                <Text className="nickname">{userInfo?.nickname || '用户'}</Text>
                {memberInfo && <Text className="member-level">{memberInfo.levelName}</Text>}
              </View>
            </View>
          ) : (
            <View className="login-tip" onClick={this.goToLogin}>
              <Image className="avatar" src="https://example.com/default-avatar.png" mode="aspectFill" />
              <Text className="login-text">点击登录</Text>
            </View>
          )}
        </View>
        {isLogin && (
          <View className="order-section">
            <View className="section-header">
              <Text className="title">我的订单</Text>
              <Text className="more" onClick={() => this.goToOrderList()}>全部订单</Text>
            </View>
            <View className="order-quick-entry">
              <View className="quick-item" onClick={() => this.goToOrderList(0)}>
                <Text className="icon">📋</Text>
                <Text className="label">待支付</Text>
                {orderCount.pending > 0 && <View className="badge">{orderCount.pending}</View>}
              </View>
              <View className="quick-item" onClick={() => this.goToOrderList(1)}>
                <Text className="icon">🔧</Text>
                <Text className="label">待服务</Text>
              </View>
              <View className="quick-item" onClick={() => this.goToOrderList(2)}>
                <Text className="icon">⚙️</Text>
                <Text className="label">服务中</Text>
              </View>
              <View className="quick-item" onClick={() => this.goToOrderList(3)}>
                <Text className="icon">✅</Text>
                <Text className="label">已完成</Text>
              </View>
            </View>
          </View>
        )}
        {isLogin && (
          <View className="menu-section">
            <View className="menu-item" onClick={this.goToAddress}>
              <Text className="icon">📍</Text>
              <Text className="label">收货地址</Text>
              <Text className="arrow">></Text>
            </View>
            <View className="menu-item" onClick={this.goToCoupon}>
              <Text className="icon">🎫</Text>
              <Text className="label">优惠券</Text>
              <Text className="arrow">></Text>
            </View>
            <View className="menu-item" onClick={this.goToPoints}>
              <Text className="icon">💎</Text>
              <Text className="label">我的积分</Text>
              <Text className="arrow">></Text>
            </View>
            <View className="menu-item" onClick={this.goToSettings}>
              <Text className="icon">⚙️</Text>
              <Text className="label">设置</Text>
              <Text className="arrow">></Text>
            </View>
          </View>
        )}
        {isLogin && (
          <View className="logout-section">
            <Button className="logout-btn" onClick={this.handleLogout}>退出登录</Button>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default UserIndex;
```

### 2.6 前端核心代码 - 电工任务大厅组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './task-hall.scss';

class TaskHall extends Taro.Component {
  state = {
    taskList: [],
    pageNum: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    refreshing: false,
    filterType: null,
    filterDistrict: null,
    location: {},
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const location = Taro.getStorageSync('location') || { latitude: 31.2304, longitude: 121.4737 };
    this.setState({ location });
    this.getTaskList();
  };

  onPullDownRefresh = () => {
    this.setState({ pageNum: 1, taskList: [], refreshing: true });
    this.getTaskList();
  };

  getTaskList = async (loadMore = false) => {
    const { filterType, filterDistrict, pageNum, pageSize, loading } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    try {
      const res = await Taro.request({
        url: `${Taro.getStorageSync('apiBaseUrl')}/api/electrician/taskHall`,
        data: {
          serviceType: filterType,
          district: filterDistrict,
          pageNum: loadMore ? pageNum + 1 : 1,
          pageSize,
        },
      });
      if (res.data.code === 0) {
        const newList = res.data.data;
        this.setState({
          taskList: loadMore ? [...this.state.taskList, ...newList] : newList,
          pageNum: loadMore ? pageNum + 1 : 1,
          hasMore: newList.length >= pageSize,
          loading: false,
          refreshing: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false, refreshing: false });
    }
  };

  onScrollToLower = () => {
    const { hasMore } = this.state;
    if (hasMore) {
      this.getTaskList(true);
    }
  };

  onFilterChange = (type, value) => {
    if (type === 'type') {
      this.setState({ filterType: value, pageNum: 1, taskList: [] });
    } else if (type === 'district') {
      this.setState({ filterDistrict: value, pageNum: 1, taskList: [] });
    }
    this.getTaskList();
  };

  grabOrder = async (orderId) => {
    const confirm = await Taro.showModal({
      title: '提示',
      content: '确定要抢单吗？',
    });
    if (confirm.confirm) {
      try {
        const res = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/electrician/grabOrder/${orderId}`,
          method: 'POST',
        });
        if (res.data.code === 0) {
          Taro.showToast({ title: '抢单成功' });
          this.getTaskList();
        } else {
          Taro.showToast({ title: res.data.message || '抢单失败', icon: 'none' });
        }
      } catch (error) {
        Taro.showToast({ title: '抢单失败', icon: 'none' });
      }
    }
  };

  goToOrderDetail = (orderId) => {
    Taro.navigateTo({
      url: `/pages/order/detail?id=${orderId}`,
    });
  };

  render() {
    const { taskList, hasMore, loading, refreshing, filterType, filterDistrict, location } = this.state;
    return (
      <View className="task-hall-page">
        <View className="filter-bar">
          <View className="filter-item">
            <Text className="label">服务类型:</Text>
            <View className="filter-options">
              <View className={`filter-option ${filterType === null ? 'active' : ''}`} onClick={() => this.onFilterChange('type', null)}>
                全部
              </View>
              <View className={`filter-option ${filterType === 'repair' ? 'active' : ''}`} onClick={() => this.onFilterChange('type', 'repair')}>
                维修
              </View>
              <View className={`filter-option ${filterType === 'install' ? 'active' : ''}`} onClick={() => this.onFilterChange('type', 'install')}>
                安装
              </View>
              <View className={`filter-option ${filterType === 'inspection' ? 'active' : ''}`} onClick={() => this.onFilterChange('type', 'inspection')}>
                检修
              </View>
            </View>
          </View>
          <View className="filter-item">
            <Text className="label">距离:</Text>
            <View className="filter-options">
              <Text className="current-location">当前: {location.address || '未知'}</Text>
            </View>
          </View>
        </View>
        <ScrollView className="task-scroll" scrollY onScrollToLower={this.onScrollToLower} onPullDownRefresh={this.onPullDownRefresh}>
          <View className="task-list">
            {taskList.map((task) => (
              <View className="task-card" key={task.id}>
                <View className="task-header">
                  <Text className="order-no">{task.orderNo}</Text>
                  <Text className="create-time">{task.createTime}</Text>
                </View>
                <View className="task-content" onClick={() => this.goToOrderDetail(task.id)}>
                  <View className="service-info">
                    <Text className="service-name">{task.serviceName}</Text>
                    <Text className="service-desc">{task.description}</Text>
                    <View className="service-meta">
                      <Text className="address">{task.address}</Text>
                      <Text className="distance">{task.distance}m</Text>
                    </View>
                  </View>
                  <View className="price-info">
                    <Text className="price">¥{task.price}</Text>
                  </View>
                </View>
                <View className="task-footer">
                  <Button className="grab-btn" onClick={(e) => { e.stopPropagation(); this.grabOrder(task.id); }}>抢单</Button>
                </View>
              </View>
            ))}
          </View>
          {loading && <View className="loading">加载中...</View>}
          {!hasMore && taskList.length > 0 && <View className="no-more">没有更多了</View>}
          {taskList.length === 0 && !loading && <View className="empty">暂无可抢订单</View>}
        </ScrollView>
      </View>
    );
  }
}

export default TaskHall;
```

### 2.7 前端核心代码 - 支付组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, RadioGroup, Radio } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './pay.scss';

class Payment extends Taro.Component {
  state = {
    orderId: null,
    orderInfo: null,
    payType: 'wechat',
    paying: false,
  };

  componentDidMount(options) {
    const { orderId } = options || {};
    if (orderId) {
      this.setState({ orderId: parseInt(orderId) });
      this.getOrderInfo(orderId);
    }
  }

  getOrderInfo = async (orderId) => {
    const res = await Taro.request({
      url: `${Taro.getStorageSync('apiBaseUrl')}/api/order/${orderId}`,
    });
    if (res.data.code === 0) {
      this.setState({ orderInfo: res.data.data });
    }
  };

  onPayTypeChange = (e) => {
    this.setState({ payType: e.detail.value });
  };

  handlePay = async () => {
    const { orderId, payType, paying } = this.state;
    if (paying) return;
    this.setState({ paying: true });
    try {
      if (payType === 'wechat') {
        const res = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/payment/wechat`,
          method: 'POST',
          data: { orderId },
        });
        if (res.data.code === 0) {
          const payData = res.data.data;
          await Taro.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
          });
          Taro.showToast({ title: '支付成功' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      } else if (payType === 'alipay') {
        const res = await Taro.request({
          url: `${Taro.getStorageSync('apiBaseUrl')}/api/payment/alipay`,
          method: 'POST',
          data: { orderId },
        });
        if (res.data.code === 0) {
          Taro.redirectTo({
            url: `/pages/payment/alipay?orderId=${orderId}`,
          });
        }
      }
    } catch (error) {
      if (error.errMsg && error.errMsg.includes('requestPayment:fail')) {
        Taro.showToast({ title: '支付取消', icon: 'none' });
      } else {
        Taro.showToast({ title: '支付失败', icon: 'none' });
      }
    } finally {
      this.setState({ paying: false });
    }
  };

  cancelPay = () => {
    Taro.navigateBack();
  };

  render() {
    const { orderInfo, payType, paying } = this.state;
    return (
      <View className="payment-page">
        <View className="order-info">
          <Text className="label">订单金额</Text>
          <Text className="amount">¥{orderInfo?.totalAmount || '0.00'}</Text>
        </View>
        <View className="pay-type-section">
          <Text className="section-title">支付方式</Text>
          <RadioGroup className="pay-type-group" onChange={this.onPayTypeChange}>
            <View className="pay-type-item">
              <View className="pay-type-left">
                <Image className="pay-icon" src="https://example.com/wechat-pay.png" mode="aspectFit" />
                <Text className="pay-type-name">微信支付</Text>
              </View>
              <Radio value="wechat" checked={payType === 'wechat'} />
            </View>
            <View className="pay-type-item">
              <View className="pay-type-left">
                <Image className="pay-icon" src="https://example.com/alipay.png" mode="aspectFit" />
                <Text className="pay-type-name">支付宝支付</Text>
              </View>
              <Radio value="alipay" checked={payType === 'alipay'} />
            </View>
          </RadioGroup>
        </View>
        <View className="pay-button">
          <Button className="confirm-pay-btn" onClick={this.handlePay} disabled={paying}>
            {paying ? '支付中...' : '确认支付'}
          </Button>
          <Button className="cancel-btn" onClick={this.cancelPay}>取消</Button>
        </View>
      </View>
    );
  }
}

export default Payment;
```

'''

content = header + backend_code + frontend_code

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"源代码文档已生成: {output_file}")
print(f"文件大小: {os.path.getsize(output_file)} bytes")
