package com.andiantong.user.service;

import com.andiantong.user.entity.User;
import com.andiantong.user.vo.UserInfoVO;
import com.baomidou.mybatisplus.extension.service.IService;

public interface UserService extends IService<User> {

    /**
     * 获取用户信息
     */
    UserInfoVO getUserInfo(Long userId);

    /**
     * 更新用户信息
     */
    UserInfoVO updateUserInfo(Long userId, String username, String avatar);

    /**
     * 根据手机号查询用户
     */
    User getByPhone(String phone);
}
