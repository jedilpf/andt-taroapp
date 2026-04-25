package com.andiantong.user.entity;

import com.andiantong.common.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class User extends BaseEntity {
    
    private String username;
    
    private String phone;
    
    private String avatar;
    
    private String password;
    
    private String role;
    
    private Integer status;
    
    private LocalDateTime lastLoginTime;
    
    private String lastLoginIp;
    
    // 微信相关
    private String wechatOpenId;
    
    private String wechatUnionId;
    
    private String wechatNickname;
    
    private String wechatAvatar;
    
    private LocalDateTime wechatBindTime;
    
    // 支付宝相关
    private String alipayOpenId;
    
    private String alipayNickname;
    
    private String alipayAvatar;
    
    private LocalDateTime alipayBindTime;
}
