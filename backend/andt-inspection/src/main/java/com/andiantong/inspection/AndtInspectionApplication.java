package com.andiantong.inspection;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("com.andiantong.inspection.mapper")
@ComponentScan("com.andiantong.common")
public class AndtInspectionApplication {
    public static void main(String[] args) {
        SpringApplication.run(AndtInspectionApplication.class, args);
    }
}
