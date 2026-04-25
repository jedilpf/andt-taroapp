package com.andiantong.user.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String phone;
    private String code;
    private String username;
    private String avatar;
}
