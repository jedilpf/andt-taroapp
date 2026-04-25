package com.andiantong.inspection.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inspection_order")
public class InspectionOrder extends BaseEntity {

    private String orderNo;

    private Long userId;

    private Long electricianId;

    private Long addressId;

    private String serviceType;

    private String description;

    private LocalDateTime scheduledTime;

    private String status;

    private Long reportId;

    private BigDecimal price;

    private Boolean isFree;
}
