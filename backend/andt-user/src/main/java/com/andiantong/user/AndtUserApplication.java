package com.andiantong.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("com.andiantong.user.mapper")
@ComponentScan("com.andiantong.common")
public class AndtUserApplication {
    public static void main(String[] args) {
        SpringApplication.run(AndtUserApplication.class, args);
    }
}
