package com.andiantong.inspection.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inspection_report")
public class InspectionReport extends BaseEntity {

    private String reportNo;

    private Long orderId;

    private Long userId;

    private Long electricianId;

    private Integer totalScore;

    private String safetyLevel;

    private Integer hazardCount;

    private String reportData;

    private String suggestions;

    private LocalDateTime reportTime;
}
