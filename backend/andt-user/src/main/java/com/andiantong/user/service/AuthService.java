package com.andiantong.user.service;

import com.andiantong.user.dto.*;
import com.andiantong.user.vo.LoginVO;
import com.andiantong.user.vo.TokenRefreshVO;
import com.andiantong.user.vo.UserBindInfoVO;

public interface AuthService {
    
    /**
     * 发送验证码
     */
    void sendCode(SendCodeDTO dto);
    
    /**
     * 手机号登录
     */
    LoginVO login(LoginDTO dto);
    
    /**
     * 手机号注册
     */
    LoginVO register(RegisterDTO dto);
    
    /**
     * 微信登录（SDK预留）
     */
    LoginVO wechatLogin(String code);
    
    /**
     * 支付宝登录（SDK预留）
     */
    LoginVO alipayLogin(String authCode);
    
    /**
     * 绑定手机号
     */
    void bindPhone(BindPhoneDTO dto);
    
    /**
     * 绑定微信（SDK预留）
     */
    void bindWechat(Long userId, String code);
    
    /**
     * 绑定支付宝（SDK预留）
     */
    void bindAlipay(Long userId, String authCode);
    
    /**
     * 解绑微信
     */
    void unbindWechat(Long userId);
    
    /**
     * 解绑支付宝
     */
    void unbindAlipay(Long userId);
    
    /**
     * 获取用户绑定信息
     */
    UserBindInfoVO getBindInfo(Long userId);
    
    /**
     * 刷新Token
     */
    TokenRefreshVO refreshToken(String refreshToken);
    
    /**
     * 退出登录
     */
    void logout(Long userId);
}
