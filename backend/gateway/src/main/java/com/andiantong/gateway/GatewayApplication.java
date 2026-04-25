package com.andiantong.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 安电通API网关启动类
 *
 * @author 安电通开发团队
 * @version 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        System.out.println("========================================");
        System.out.println("    安电通API网关服务启动成功!");
        System.out.println("    Gateway Service Started Successfully");
        System.out.println("========================================");
    }

}