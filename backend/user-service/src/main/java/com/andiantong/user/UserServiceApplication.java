package com.andiantong.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 安电通用户服务启动类
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.andiantong.user.mapper")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
        System.out.println("========================================");
        System.out.println("    安电通用户服务启动成功!");
        System.out.println("    User Service Started Successfully");
        System.out.println("========================================");
    }

}