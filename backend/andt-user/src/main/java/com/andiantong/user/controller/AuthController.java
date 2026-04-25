package com.andiantong.user.controller;

import com.andiantong.common.Result;
import com.andiantong.user.dto.*;
import com.andiantong.user.service.AuthService;
import com.andiantong.user.vo.LoginVO;
import com.andiantong.user.vo.TokenRefreshVO;
import com.andiantong.user.vo.UserBindInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * 发送验证码
     */
    @PostMapping("/code")
    public Result<Void> sendCode(@RequestBody SendCodeDTO dto) {
        authService.sendCode(dto);
        return Result.success();
    }
    
    /**
     * 手机号登录
     */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginDTO dto) {
        return Result.success(authService.login(dto));
    }
    
    /**
     * 手机号注册
     */
    @PostMapping("/register")
    public Result<LoginVO> register(@RequestBody RegisterDTO dto) {
        return Result.success(authService.register(dto));
    }
    
    /**
     * 微信登录（SDK预留）
     */
    @PostMapping("/wechat/login")
    public Result<LoginVO> wechatLogin(@RequestBody WechatLoginDTO dto) {
        return Result.success(authService.wechatLogin(dto.getCode()));
    }
    
    /**
     * 支付宝登录（SDK预留）
     */
    @PostMapping("/alipay/login")
    public Result<LoginVO> alipayLogin(@RequestBody AlipayLoginDTO dto) {
        return Result.success(authService.alipayLogin(dto.getAuthCode()));
    }
    
    /**
     * 绑定手机号
     */
    @PostMapping("/bind/phone")
    public Result<Void> bindPhone(@RequestBody BindPhoneDTO dto) {
        authService.bindPhone(dto);
        return Result.success();
    }
    
    /**
     * 绑定微信（SDK预留）
     */
    @PostMapping("/bind/wechat")
    public Result<Void> bindWechat(
            @RequestAttribute("userId") Long userId,
            @RequestBody BindWechatDTO dto) {
        authService.bindWechat(userId, dto.getCode());
        return Result.success();
    }
    
    /**
     * 绑定支付宝（SDK预留）
     */
    @PostMapping("/bind/alipay")
    public Result<Void> bindAlipay(
            @RequestAttribute("userId") Long userId,
            @RequestBody BindAlipayDTO dto) {
        authService.bindAlipay(userId, dto.getAuthCode());
        return Result.success();
    }
    
    /**
     * 解绑微信
     */
    @PostMapping("/unbind/wechat")
    public Result<Void> unbindWechat(@RequestAttribute("userId") Long userId) {
        authService.unbindWechat(userId);
        return Result.success();
    }
    
    /**
     * 解绑支付宝
     */
    @PostMapping("/unbind/alipay")
    public Result<Void> unbindAlipay(@RequestAttribute("userId") Long userId) {
        authService.unbindAlipay(userId);
        return Result.success();
    }
    
    /**
     * 获取用户绑定信息
     */
    @GetMapping("/bind/info")
    public Result<UserBindInfoVO> getBindInfo(@RequestAttribute("userId") Long userId) {
        return Result.success(authService.getBindInfo(userId));
    }
    
    /**
     * 刷新Token
     */
    @PostMapping("/refresh")
    public Result<TokenRefreshVO> refreshToken(@RequestBody RefreshTokenDTO dto) {
        return Result.success(authService.refreshToken(dto.getRefreshToken()));
    }
    
    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public Result<Void> logout(@RequestAttribute("userId") Long userId) {
        authService.logout(userId);
        return Result.success();
    }
}
