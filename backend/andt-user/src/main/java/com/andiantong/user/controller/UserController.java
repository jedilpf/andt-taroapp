package com.andiantong.user.controller;

import com.andiantong.common.Result;
import com.andiantong.user.dto.UpdateUserInfoDTO;
import com.andiantong.user.service.UserService;
import com.andiantong.user.vo.UserInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public Result<UserInfoVO> getUserInfo(@RequestAttribute("userId") Long userId) {
        return Result.success(userService.getUserInfo(userId));
    }

    /**
     * 更新用户信息
     */
    @PostMapping("/update")
    public Result<UserInfoVO> updateUserInfo(
            @RequestAttribute("userId") Long userId,
            @RequestBody UpdateUserInfoDTO dto) {
        return Result.success(userService.updateUserInfo(userId, dto.getUsername(), dto.getAvatar()));
    }
}
