package com.andiantong.order.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rectification_order")
public class RectificationOrder extends BaseEntity {

    private String orderNo;

    private Long inspectionReportId;

    private Long userId;

    private Long electricianId;

    private String materials;

    private BigDecimal materialAmount;

    private BigDecimal laborAmount;

    private BigDecimal totalAmount;

    private BigDecimal pointsDiscount;

    private BigDecimal finalAmount;

    private String status;
}
