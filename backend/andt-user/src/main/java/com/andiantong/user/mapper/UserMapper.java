package com.andiantong.user.mapper;

import com.andiantong.user.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    @Select("SELECT * FROM sys_user WHERE phone = #{phone} AND status = 1")
    User selectByPhone(String phone);
    
    @Select("SELECT * FROM sys_user WHERE wechat_open_id = #{openId} AND status = 1")
    User selectByWechatOpenId(String openId);
    
    @Select("SELECT * FROM sys_user WHERE alipay_open_id = #{openId} AND status = 1")
    User selectByAlipayOpenId(String openId);
}
