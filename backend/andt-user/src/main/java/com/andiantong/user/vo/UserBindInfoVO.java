package com.andiantong.user.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserBindInfoVO {
    private String phone;
    private Boolean wechatBound;
    private Boolean alipayBound;
    private WechatInfo wechatInfo;
    private AlipayInfo alipayInfo;
    
    @Data
    public static class WechatInfo {
        private String nickname;
        private String avatar;
        private LocalDateTime bindTime;
    }
    
    @Data
    public static class AlipayInfo {
        private String nickname;
        private String avatar;
        private LocalDateTime bindTime;
    }
}
