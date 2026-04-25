package com.andiantong.user.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.user.entity.User;
import com.andiantong.user.mapper.UserMapper;
import com.andiantong.user.service.UserService;
import com.andiantong.user.vo.UserInfoVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;

    @Override
    public UserInfoVO getUserInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        UserInfoVO vo = new UserInfoVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setPhone(user.getPhone());
        vo.setAvatar(user.getAvatar());
        vo.setRole(user.getRole());
        vo.setStatus(user.getStatus());
        vo.setCreateTime(user.getCreateTime());

        return vo;
    }

    @Override
    public UserInfoVO updateUserInfo(Long userId, String username, String avatar) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (username != null) {
            user.setUsername(username);
        }
        if (avatar != null) {
            user.setAvatar(avatar);
        }

        userMapper.updateById(user);

        return getUserInfo(userId);
    }

    @Override
    public User getByPhone(String phone) {
        return userMapper.selectByPhone(phone);
    }
}
