package com.andiantong.inspection.mapper;

import com.andiantong.inspection.entity.InspectionItem;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface InspectionItemMapper extends BaseMapper<InspectionItem> {

    @Select("SELECT * FROM inspection_item WHERE report_id = #{reportId} ORDER BY create_time ASC")
    List<InspectionItem> selectByReportId(@Param("reportId") Long reportId);
}
