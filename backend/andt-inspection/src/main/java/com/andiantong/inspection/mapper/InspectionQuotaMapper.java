package com.andiantong.inspection.mapper;

import com.andiantong.inspection.entity.InspectionQuota;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface InspectionQuotaMapper extends BaseMapper<InspectionQuota> {

    @Select("SELECT * FROM inspection_quota WHERE user_id = #{userId}")
    InspectionQuota selectByUserId(@Param("userId") Long userId);
}
