package com.andiantong.inspection.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inspection_quota")
public class InspectionQuota extends BaseEntity {

    private Long userId;

    private String quotaType;

    private Integer totalCount;

    private Integer usedCount;

    private Integer remainingCount;

    private LocalDateTime expireTime;
}
