package com.andiantong.inspection.mapper;

import com.andiantong.inspection.entity.InspectionOrder;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface InspectionOrderMapper extends BaseMapper<InspectionOrder> {

    @Select("SELECT * FROM inspection_order WHERE user_id = #{userId} AND deleted = 0 ORDER BY create_time DESC")
    List<InspectionOrder> selectByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM inspection_order WHERE electrician_id = #{electricianId} AND deleted = 0 ORDER BY create_time DESC")
    List<InspectionOrder> selectByElectricianId(@Param("electricianId") Long electricianId);

    @Select("SELECT * FROM inspection_order WHERE status = 'PENDING' AND deleted = 0 ORDER BY create_time DESC")
    List<InspectionOrder> selectPendingOrders();
}
