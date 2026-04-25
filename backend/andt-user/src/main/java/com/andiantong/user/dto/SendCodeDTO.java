package com.andiantong.user.dto;

import lombok.Data;

@Data
public class SendCodeDTO {
    private String phone;
    private String type;
}
