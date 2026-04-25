package com.andiantong.inspection.mapper;

import com.andiantong.inspection.entity.InspectionReport;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface InspectionReportMapper extends BaseMapper<InspectionReport> {

    @Select("SELECT * FROM inspection_report WHERE order_id = #{orderId} AND deleted = 0")
    InspectionReport selectByOrderId(@Param("orderId") Long orderId);
}
