package com.andiantong.user.service;

import com.andiantong.user.entity.User;

/**
 * 用户服务接口
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
public interface UserService {

    /**
     * 用户注册
     */
    User register(String phone, String password, String nickname);

    /**
     * 用户登录
     */
    String login(String phone, String password);

    /**
     * 微信登录
     */
    String wechatLogin(String openId);

    /**
     * 根据ID查询用户
     */
    User findById(Long id);

    /**
     * 根据手机号查询用户
     */
    User findByPhone(String phone);

    /**
     * 更新用户信息
     */
    User updateUser(User user);

    /**
     * 验证Token
     */
    User validateToken(String token);

}