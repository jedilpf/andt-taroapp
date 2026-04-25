package com.andiantong.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.andiantong.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 用户Mapper接口
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据手机号查询用户
     */
    @Select("SELECT * FROM user WHERE phone = #{phone} AND deleted = 0")
    User findByPhone(@Param("phone") String phone);

    /**
     * 根据微信OpenID查询用户
     */
    @Select("SELECT * FROM user WHERE wechat_open_id = #{openId} AND deleted = 0")
    User findByWechatOpenId(@Param("openId") String openId);

}