package com.andiantong.user.vo;

import lombok.Data;

@Data
public class TokenRefreshVO {
    private String token;
    private String refreshToken;
    private Long expiresIn;
}
