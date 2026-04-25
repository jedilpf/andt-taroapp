package com.andiantong.user.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.user.dto.*;
import com.andiantong.user.entity.SmsCode;
import com.andiantong.user.entity.User;
import com.andiantong.user.mapper.SmsCodeMapper;
import com.andiantong.user.mapper.UserMapper;
import com.andiantong.user.service.AuthService;
import com.andiantong.user.service.JwtTokenService;
import com.andiantong.user.vo.LoginVO;
import com.andiantong.user.vo.TokenRefreshVO;
import com.andiantong.user.vo.UserBindInfoVO;
import com.andiantong.user.vo.UserInfoVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl extends ServiceImpl<UserMapper, User> implements AuthService {
    
    private final UserMapper userMapper;
    private final SmsCodeMapper smsCodeMapper;
    private final JwtTokenService jwtTokenService;
    
    // TODO: 接入第三方SDK
    // private final WechatSdkService wechatSdkService;
    // private final AlipaySdkService alipaySdkService;
    
    @Override
    public void sendCode(SendCodeDTO dto) {
        // 生成6位验证码
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // 保存验证码
        SmsCode smsCode = new SmsCode();
        smsCode.setPhone(dto.getPhone());
        smsCode.setCode(code);
        smsCode.setType(dto.getType());
        smsCode.setExpireTime(LocalDateTime.now().plusMinutes(5));
        smsCode.setCreateTime(LocalDateTime.now());
        smsCode.setUsed(false);
        smsCodeMapper.insert(smsCode);
        
        // TODO: 调用短信服务发送验证码
        log.info("向手机号 {} 发送验证码: {}", dto.getPhone(), code);
    }
    
    @Override
    @Transactional
    public LoginVO login(LoginDTO dto) {
        // 验证验证码
        verifyCode(dto.getPhone(), dto.getCode(), "login");
        
        // 查询用户
        User user = userMapper.selectByPhone(dto.getPhone());
        boolean isNewUser = false;
        
        if (user == null) {
            // 新用户自动注册
            user = new User();
            user.setPhone(dto.getPhone());
            user.setUsername("用户" + dto.getPhone().substring(7));
            user.setRole("user");
            user.setStatus(1);
            user.setCreateTime(LocalDateTime.now());
            userMapper.insert(user);
            isNewUser = true;
        }
        
        // 更新登录信息
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);
        
        // 生成Token
        return generateLoginVO(user, isNewUser);
    }
    
    @Override
    @Transactional
    public LoginVO register(RegisterDTO dto) {
        // 验证验证码
        verifyCode(dto.getPhone(), dto.getCode(), "register");
        
        // 检查手机号是否已注册
        User existUser = userMapper.selectByPhone(dto.getPhone());
        if (existUser != null) {
            throw new BusinessException("手机号已注册");
        }
        
        // 创建用户
        User user = new User();
        user.setPhone(dto.getPhone());
        user.setUsername(dto.getUsername() != null ? dto.getUsername() : "用户" + dto.getPhone().substring(7));
        user.setAvatar(dto.getAvatar());
        user.setRole("user");
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        userMapper.insert(user);
        
        return generateLoginVO(user, true);
    }
    
    @Override
    public LoginVO wechatLogin(String code) {
        // TODO: 调用微信SDK获取openid和用户信息
        // WechatUserInfo wxUser = wechatSdkService.getUserInfo(code);
        // String openId = wxUser.getOpenId();
        
        // 模拟实现
        String openId = "wx_" + UUID.randomUUID().toString().replace("-", "");
        
        User user = userMapper.selectByWechatOpenId(openId);
        
        if (user == null) {
            // 未绑定用户，需要绑定手机号
            LoginVO vo = new LoginVO();
            vo.setNeedBindPhone(true);
            vo.setOpenId(openId);
            return vo;
        }
        
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);
        
        return generateLoginVO(user, false);
    }
    
    @Override
    public LoginVO alipayLogin(String authCode) {
        // TODO: 调用支付宝SDK获取openid和用户信息
        // AlipayUserInfo aliUser = alipaySdkService.getUserInfo(authCode);
        // String openId = aliUser.getUserId();
        
        // 模拟实现
        String openId = "ali_" + UUID.randomUUID().toString().replace("-", "");
        
        User user = userMapper.selectByAlipayOpenId(openId);
        
        if (user == null) {
            // 未绑定用户，需要绑定手机号
            LoginVO vo = new LoginVO();
            vo.setNeedBindPhone(true);
            vo.setOpenId(openId);
            return vo;
        }
        
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);
        
        return generateLoginVO(user, false);
    }
    
    @Override
    @Transactional
    public void bindPhone(BindPhoneDTO dto) {
        // 验证验证码
        verifyCode(dto.getPhone(), dto.getCode(), "bind");
        
        User user = userMapper.selectByPhone(dto.getPhone());
        
        if (user == null) {
            // 创建新用户并绑定
            user = new User();
            user.setPhone(dto.getPhone());
            user.setUsername("用户" + dto.getPhone().substring(7));
            user.setRole("user");
            user.setStatus(1);
            user.setCreateTime(LocalDateTime.now());
        }
        
        // 绑定第三方账号
        if ("wechat".equals(dto.getBindType())) {
            user.setWechatOpenId(dto.getOpenId());
            user.setWechatBindTime(LocalDateTime.now());
        } else if ("alipay".equals(dto.getBindType())) {
            user.setAlipayOpenId(dto.getOpenId());
            user.setAlipayBindTime(LocalDateTime.now());
        }
        
        if (user.getId() == null) {
            userMapper.insert(user);
        } else {
            userMapper.updateById(user);
        }
    }
    
    @Override
    @Transactional
    public void bindWechat(Long userId, String code) {
        // TODO: 调用微信SDK获取openid
        // String openId = wechatSdkService.getOpenId(code);
        String openId = "wx_" + UUID.randomUUID().toString().replace("-", "");
        
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setWechatOpenId(openId);
        user.setWechatBindTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void bindAlipay(Long userId, String authCode) {
        // TODO: 调用支付宝SDK获取openid
        // String openId = alipaySdkService.getUserId(authCode);
        String openId = "ali_" + UUID.randomUUID().toString().replace("-", "");
        
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setAlipayOpenId(openId);
        user.setAlipayBindTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void unbindWechat(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 检查是否还有其他登录方式
        if (user.getPhone() == null && user.getAlipayOpenId() == null) {
            throw new BusinessException("至少需要保留一种登录方式");
        }
        
        user.setWechatOpenId(null);
        user.setWechatUnionId(null);
        user.setWechatNickname(null);
        user.setWechatAvatar(null);
        user.setWechatBindTime(null);
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void unbindAlipay(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 检查是否还有其他登录方式
        if (user.getPhone() == null && user.getWechatOpenId() == null) {
            throw new BusinessException("至少需要保留一种登录方式");
        }
        
        user.setAlipayOpenId(null);
        user.setAlipayNickname(null);
        user.setAlipayAvatar(null);
        user.setAlipayBindTime(null);
        userMapper.updateById(user);
    }
    
    @Override
    public UserBindInfoVO getBindInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        UserBindInfoVO vo = new UserBindInfoVO();
        vo.setPhone(user.getPhone());
        vo.setWechatBound(user.getWechatOpenId() != null);
        vo.setAlipayBound(user.getAlipayOpenId() != null);
        
        if (user.getWechatOpenId() != null) {
            UserBindInfoVO.WechatInfo wechatInfo = new UserBindInfoVO.WechatInfo();
            wechatInfo.setNickname(user.getWechatNickname());
            wechatInfo.setAvatar(user.getWechatAvatar());
            wechatInfo.setBindTime(user.getWechatBindTime());
            vo.setWechatInfo(wechatInfo);
        }
        
        if (user.getAlipayOpenId() != null) {
            UserBindInfoVO.AlipayInfo alipayInfo = new UserBindInfoVO.AlipayInfo();
            alipayInfo.setNickname(user.getAlipayNickname());
            alipayInfo.setAvatar(user.getAlipayAvatar());
            alipayInfo.setBindTime(user.getAlipayBindTime());
            vo.setAlipayInfo(alipayInfo);
        }
        
        return vo;
    }
    
    @Override
    public TokenRefreshVO refreshToken(String refreshToken) {
        // 验证refresh token
        Long userId = jwtTokenService.validateRefreshToken(refreshToken);
        if (userId == null) {
            throw new BusinessException("登录已过期，请重新登录");
        }
        
        User user = userMapper.selectById(userId);
        if (user == null || user.getStatus() != 1) {
            throw new BusinessException("用户不存在或已被禁用");
        }
        
        // 生成新的token
        String newToken = jwtTokenService.generateToken(userId);
        String newRefreshToken = jwtTokenService.generateRefreshToken(userId);
        
        TokenRefreshVO vo = new TokenRefreshVO();
        vo.setToken(newToken);
        vo.setRefreshToken(newRefreshToken);
        vo.setExpiresIn(7200L); // 2小时
        
        return vo;
    }
    
    @Override
    public void logout(Long userId) {
        // TODO: 将token加入黑名单或清除缓存
        jwtTokenService.invalidateToken(userId);
    }
    
    private void verifyCode(String phone, String code, String type) {
        SmsCode smsCode = smsCodeMapper.selectLatestByPhoneAndType(phone, type);
        
        if (smsCode == null) {
            throw new BusinessException("验证码不存在");
        }
        
        if (smsCode.getUsed()) {
            throw new BusinessException("验证码已使用");
        }
        
        if (smsCode.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new BusinessException("验证码已过期");
        }
        
        if (!smsCode.getCode().equals(code)) {
            throw new BusinessException("验证码错误");
        }
        
        // 标记验证码已使用
        smsCode.setUsed(true);
        smsCodeMapper.updateById(smsCode);
    }
    
    private LoginVO generateLoginVO(User user, boolean isNewUser) {
        String token = jwtTokenService.generateToken(user.getId());
        String refreshToken = jwtTokenService.generateRefreshToken(user.getId());
        
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setRefreshToken(refreshToken);
        vo.setExpiresIn(7200L); // 2小时
        vo.setNewUser(isNewUser);
        vo.setNeedBindPhone(false);
        
        UserInfoVO userInfo = new UserInfoVO();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setPhone(user.getPhone());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setRole(user.getRole());
        userInfo.setStatus(user.getStatus());
        userInfo.setCreateTime(user.getCreateTime());
        
        vo.setUserInfo(userInfo);
        
        return vo;
    }
}
