package com.andiantong.order.mapper;

import com.andiantong.order.entity.RectificationOrder;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RectificationOrderMapper extends BaseMapper<RectificationOrder> {

    @Select("SELECT * FROM rectification_order WHERE user_id = #{userId} AND deleted = 0 ORDER BY create_time DESC")
    List<RectificationOrder> selectByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM rectification_order WHERE inspection_report_id = #{reportId} AND deleted = 0 ORDER BY create_time DESC")
    List<RectificationOrder> selectByReportId(@Param("reportId") Long reportId);

    @Select("SELECT * FROM rectification_order WHERE electrician_id = #{electricianId} AND deleted = 0 ORDER BY create_time DESC")
    List<RectificationOrder> selectByElectricianId(@Param("electricianId") Long electricianId);
}
