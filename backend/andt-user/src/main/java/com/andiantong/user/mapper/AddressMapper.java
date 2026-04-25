package com.andiantong.user.mapper;

import com.andiantong.user.entity.Address;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AddressMapper extends BaseMapper<Address> {

    @Select("SELECT * FROM user_address WHERE user_id = #{userId} AND deleted = 0 ORDER BY is_default DESC, create_time DESC")
    List<Address> selectByUserId(Long userId);
}
