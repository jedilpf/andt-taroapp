package com.andiantong.order;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("com.andiantong.order.mapper")
@ComponentScan("com.andiantong.common")
public class AndtOrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(AndtOrderApplication.class, args);
    }
}
