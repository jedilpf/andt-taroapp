package com.andiantong.user.mapper;

import com.andiantong.user.entity.SmsCode;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SmsCodeMapper extends BaseMapper<SmsCode> {
    
    @Select("SELECT * FROM sys_sms_code WHERE phone = #{phone} AND type = #{type} AND used = 0 ORDER BY create_time DESC LIMIT 1")
    SmsCode selectLatestByPhoneAndType(String phone, String type);
}
