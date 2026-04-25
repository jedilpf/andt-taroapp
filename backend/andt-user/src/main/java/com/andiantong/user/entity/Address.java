package com.andiantong.user.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_address")
public class Address extends BaseEntity {

    private Long userId;

    private String province;

    private String city;

    private String district;

    private String detail;

    private String contactName;

    private String contactPhone;

    private Integer isDefault;
}
