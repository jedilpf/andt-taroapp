package com.andiantong.order.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateRectificationDTO {

    private Long inspectionReportId;

    private Long userId;

    private String materials;

    private BigDecimal materialAmount;

    private BigDecimal laborAmount;

    private BigDecimal pointsDiscount;
}
