package com.andiantong.user.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AddressVO {

    private Long id;

    private String province;

    private String city;

    private String district;

    private String detail;

    private String contactName;

    private String contactPhone;

    private Integer isDefault;

    private LocalDateTime createTime;
}
