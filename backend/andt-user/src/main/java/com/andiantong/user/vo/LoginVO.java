package com.andiantong.user.vo;

import lombok.Data;

@Data
public class LoginVO {
    private String token;
    private String refreshToken;
    private Long expiresIn;
    private UserInfoVO userInfo;
    private Boolean newUser;
    private Boolean needBindPhone;
    private String openId;
}
