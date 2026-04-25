package com.andiantong.user.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserInfoVO {
    private Long id;
    private String username;
    private String phone;
    private String avatar;
    private String role;
    private Integer status;
    private LocalDateTime createTime;
}
