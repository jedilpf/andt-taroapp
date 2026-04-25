package com.andiantong.user.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtTokenService {

    @Value("${jwt.secret:andiantong-secret-key-for-jwt-token-generation}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration:86400000}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private Long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "access");
        return createToken(claims, userId, accessTokenExpiration);
    }

    public String generateAccessToken(Long userId) {
        return generateToken(userId);
    }

    public String generateRefreshToken(Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "refresh");
        return createToken(claims, userId, refreshTokenExpiration);
    }

    private String createToken(Map<String, Object> claims, Long userId, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Long validateRefreshToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String tokenType = claims.get("tokenType", String.class);
            if (!"refresh".equals(tokenType)) {
                return null;
            }

            return Long.valueOf(claims.getSubject());
        } catch (Exception e) {
            return null;
        }
    }

    public void invalidateToken(Long userId) {
        // TODO: 将token加入黑名单或清除缓存
    }

    public Long getAccessTokenExpiration() {
        return accessTokenExpiration / 1000;
    }

    public Long getRefreshTokenExpiration() {
        return refreshTokenExpiration / 1000;
    }
}
