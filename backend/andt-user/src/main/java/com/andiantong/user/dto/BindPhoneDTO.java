package com.andiantong.user.dto;

import lombok.Data;

@Data
public class BindPhoneDTO {
    private String phone;
    private String code;
    private String bindType;
    private String openId;
}
