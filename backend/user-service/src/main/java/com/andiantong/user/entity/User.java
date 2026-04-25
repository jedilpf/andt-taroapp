package com.andiantong.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体类
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("user")
public class User implements Serializable {

    /**
     * 用户ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 密码（加密）
     */
    private String password;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 用户类型：user-普通用户，electrician-电工
     */
    private String userType;

    /**
     * 性别：male-男，female-女
     */
    private String gender;

    /**
     * 微信OpenID
     */
    private String wechatOpenId;

    /**
     * 微信UnionID
     */
    private String wechatUnionId;

    /**
     * 积分
     */
    private Integer points;

    /**
     * 会员等级：0-普通，1-VIP，2-SVIP
     */
    private Integer memberLevel;

    /**
     * 余额（元）
     */
    private Double balance;

    /**
     * 状态：0-正常，1-禁用
     */
    private Integer status;

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标记
     */
    @TableLogic
    private Integer deleted;

}