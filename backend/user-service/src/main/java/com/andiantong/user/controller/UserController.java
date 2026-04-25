package com.andiantong.user.controller;

import com.andiantong.user.entity.User;
import com.andiantong.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 用户注册
     * POST /user/register
     */
    @PostMapping("/register")
    public Result<Map<String, Object>> register(
            @RequestParam String phone,
            @RequestParam String password,
            @RequestParam(required = false) String nickname) {

        try {
            User user = userService.register(phone, password, nickname);
            String token = userService.login(phone, password);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getId());
            data.put("token", token);
            data.put("nickname", user.getNickname());

            return Result.success(data);
        } catch (Exception e) {
            log.error("注册失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 用户登录
     * POST /user/login
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(
            @RequestParam String phone,
            @RequestParam String password) {

        try {
            String token = userService.login(phone, password);
            User user = userService.findByPhone(phone);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getId());
            data.put("token", token);
            data.put("nickname", user.getNickname());
            data.put("avatar", user.getAvatar());
            data.put("userType", user.getUserType());

            return Result.success(data);
        } catch (Exception e) {
            log.error("登录失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 微信登录
     * POST /user/wechat-login
     */
    @PostMapping("/wechat-login")
    public Result<Map<String, Object>> wechatLogin(@RequestParam String openId) {
        try {
            String token = userService.wechatLogin(openId);
            User user = userService.findByWechatOpenId(openId);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getId());
            data.put("token", token);
            data.put("nickname", user.getNickname());

            return Result.success(data);
        } catch (Exception e) {
            log.error("微信登录失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取用户信息
     * GET /user/info/{userId}
     */
    @GetMapping("/info/{userId}")
    public Result<User> getUserInfo(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user != null) {
            user.setPassword(null); // 不返回密码
            return Result.success(user);
        }
        return Result.error("用户不存在");
    }

    /**
     * 更新用户信息
     * PUT /user/update
     */
    @PutMapping("/update")
    public Result<User> updateUser(@RequestBody User user) {
        try {
            User updated = userService.updateUser(user);
            updated.setPassword(null);
            return Result.success(updated);
        } catch (Exception e) {
            log.error("更新失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 验证Token
     * POST /user/validate-token
     */
    @PostMapping("/validate-token")
    public Result<User> validateToken(@RequestParam String token) {
        User user = userService.validateToken(token);
        if (user != null) {
            user.setPassword(null);
            return Result.success(user);
        }
        return Result.error("Token无效或已过期");
    }

}