package com.andiantong.user.service.impl;

import com.andiantong.user.entity.User;
import com.andiantong.user.mapper.UserMapper;
import com.andiantong.user.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * 用户服务实现类
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Override
    @Transactional
    public User register(String phone, String password, String nickname) {
        // 检查手机号是否已注册
        User existUser = userMapper.findByPhone(phone);
        if (existUser != null) {
            throw new RuntimeException("手机号已注册");
        }

        // 创建用户
        User user = User.builder()
                .phone(phone)
                .password(passwordEncoder.encode(password))
                .nickname(nickname != null ? nickname : "用户" + phone.substring(7))
                .userType("user")
                .points(0)
                .memberLevel(0)
                .balance(0.0)
                .status(0)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        userMapper.insert(user);
        log.info("用户注册成功: {}", phone);

        return user;
    }

    @Override
    public String login(String phone, String password) {
        // 查询用户
        User user = userMapper.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 检查状态
        if (user.getStatus() != 0) {
            throw new RuntimeException("用户已被禁用");
        }

        // 更新登录时间
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);

        // 生成Token
        String token = generateToken(user);

        // 存入Redis
        redisTemplate.opsForValue().set("token:" + user.getId(), token, jwtExpiration, TimeUnit.MILLISECONDS);

        log.info("用户登录成功: {}", phone);
        return token;
    }

    @Override
    public String wechatLogin(String openId) {
        User user = userMapper.findByWechatOpenId(openId);
        if (user == null) {
            // 自动注册微信用户
            user = User.builder()
                    .wechatOpenId(openId)
                    .nickname("微信用户")
                    .userType("user")
                    .points(0)
                    .memberLevel(0)
                    .balance(0.0)
                    .status(0)
                    .createTime(LocalDateTime.now())
                    .updateTime(LocalDateTime.now())
                    .deleted(0)
                    .build();
            userMapper.insert(user);
            log.info("微信用户自动注册: {}", openId);
        }

        String token = generateToken(user);
        redisTemplate.opsForValue().set("token:" + user.getId(), token, jwtExpiration, TimeUnit.MILLISECONDS);

        return token;
    }

    @Override
    public User findById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public User findByPhone(String phone) {
        return userMapper.findByPhone(phone);
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
        return user;
    }

    @Override
    public User validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Long userId = claims.get("userId", Long.class);

            // 从Redis验证
            String storedToken = (String) redisTemplate.opsForValue().get("token:" + userId);
            if (storedToken == null || !storedToken.equals(token)) {
                return null;
            }

            return findById(userId);
        } catch (Exception e) {
            log.error("Token验证失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 生成JWT Token
     */
    private String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .subject(user.getPhone())
                .claim("userId", user.getId())
                .claim("userType", user.getUserType())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();
    }

}