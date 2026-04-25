package com.andiantong.order.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RectificationOrderVO {

    private Long id;

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

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
