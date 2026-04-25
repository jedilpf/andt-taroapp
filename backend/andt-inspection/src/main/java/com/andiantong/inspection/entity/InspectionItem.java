package com.andiantong.inspection.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("inspection_item")
public class InspectionItem {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long reportId;

    private String category;

    private String categoryName;

    private String itemName;

    private String testValue;

    private String standardValue;

    private String status;

    private Integer score;

    private String description;

    private String suggestion;

    private LocalDateTime createTime;
}
