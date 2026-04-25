package com.andiantong.common.utils;

import cn.hutool.core.util.IdUtil;

public class OrderNoGenerator {

    public static String generate(String prefix) {
        return prefix + System.currentTimeMillis() + IdUtil.simpleUUID().substring(0, 4).toUpperCase();
    }

    public static String generateInspectionOrderNo() {
        return generate("INS");
    }

    public static String generateReportNo() {
        return generate("RPT");
    }

    public static String generateRectificationNo() {
        return generate("REC");
    }
}
