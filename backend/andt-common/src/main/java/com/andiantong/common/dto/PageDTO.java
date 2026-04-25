package com.andiantong.common.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PageDTO {
    private Integer page = 1;
    private Integer pageSize = 10;

    public Integer getOffset() {
        return (page - 1) * pageSize;
    }
}
