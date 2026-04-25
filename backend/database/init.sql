-- 安电通数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS andt_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS andt_inspection CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS andt_order CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE andt_user;

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像URL',
    password VARCHAR(100) COMMENT '密码',
    role VARCHAR(20) DEFAULT 'user' COMMENT '角色: user/electrician/admin',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    last_login_time DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    wechat_open_id VARCHAR(100) COMMENT '微信OpenID',
    wechat_union_id VARCHAR(100) COMMENT '微信UnionID',
    wechat_nickname VARCHAR(100) COMMENT '微信昵称',
    wechat_avatar VARCHAR(255) COMMENT '微信头像',
    wechat_bind_time DATETIME COMMENT '微信绑定时间',
    alipay_open_id VARCHAR(100) COMMENT '支付宝OpenID',
    alipay_nickname VARCHAR(100) COMMENT '支付宝昵称',
    alipay_avatar VARCHAR(255) COMMENT '支付宝头像',
    alipay_bind_time DATETIME COMMENT '支付宝绑定时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 验证码表
CREATE TABLE IF NOT EXISTS sys_sms_code (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) NOT NULL COMMENT '手机号',
    code VARCHAR(10) NOT NULL COMMENT '验证码',
    type VARCHAR(20) NOT NULL COMMENT '类型: login/register/bind/reset',
    expire_time DATETIME NOT NULL COMMENT '过期时间',
    used TINYINT DEFAULT 0 COMMENT '是否已使用: 0-未使用 1-已使用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码表';

-- 用户地址表
CREATE TABLE IF NOT EXISTS user_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    province VARCHAR(50) NOT NULL COMMENT '省',
    city VARCHAR(50) NOT NULL COMMENT '市',
    district VARCHAR(50) NOT NULL COMMENT '区/县',
    detail VARCHAR(200) NOT NULL COMMENT '详细地址',
    contact_name VARCHAR(50) COMMENT '联系人姓名',
    contact_phone VARCHAR(20) COMMENT '联系人电话',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认: 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除',
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

USE andt_inspection;

-- 检测订单表
CREATE TABLE IF NOT EXISTS inspection_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单编号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    electrician_id BIGINT COMMENT '电工ID',
    address_id BIGINT COMMENT '地址ID',
    service_type VARCHAR(20) DEFAULT 'basic' COMMENT '服务类型',
    description TEXT COMMENT '问题描述',
    scheduled_time DATETIME COMMENT '预约时间',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING/ACCEPTED/ARRIVED/IN_PROGRESS/COMPLETED/PAID',
    report_id BIGINT COMMENT '报告ID',
    price DECIMAL(10,2) DEFAULT 199.00 COMMENT '价格',
    is_free TINYINT DEFAULT 0 COMMENT '是否免费: 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除',
    INDEX idx_user_id (user_id),
    INDEX idx_electrician_id (electrician_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测订单表';

-- 检测报告表
CREATE TABLE IF NOT EXISTS inspection_report (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_no VARCHAR(32) UNIQUE NOT NULL COMMENT '报告编号',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    electrician_id BIGINT NOT NULL COMMENT '电工ID',
    total_score INT COMMENT '总分',
    safety_level VARCHAR(20) COMMENT '安全等级: excellent/good/warning/danger',
    hazard_count INT DEFAULT 0 COMMENT '隐患数量',
    report_data JSON COMMENT '报告数据JSON',
    suggestions TEXT COMMENT '整改建议',
    report_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除',
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测报告表';

-- 检测项表
CREATE TABLE IF NOT EXISTS inspection_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_id BIGINT NOT NULL COMMENT '报告ID',
    category VARCHAR(50) COMMENT '检测分类',
    category_name VARCHAR(50) COMMENT '分类名称',
    item_name VARCHAR(100) COMMENT '检测项名称',
    test_value VARCHAR(50) COMMENT '检测值',
    standard_value VARCHAR(50) COMMENT '标准值',
    status VARCHAR(20) COMMENT '状态: pass/warn/fail',
    score INT COMMENT '得分',
    description TEXT COMMENT '描述',
    suggestion TEXT COMMENT '建议',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除',
    INDEX idx_report_id (report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测项表';

-- 用户检测资格表
CREATE TABLE IF NOT EXISTS inspection_quota (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL COMMENT '用户ID',
    quota_type VARCHAR(20) DEFAULT 'first_free' COMMENT '资格类型: first_free/vip_free',
    total_count INT DEFAULT 1 COMMENT '总次数',
    used_count INT DEFAULT 0 COMMENT '已使用次数',
    remaining_count INT DEFAULT 1 COMMENT '剩余次数',
    expire_time DATETIME COMMENT '过期时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户检测资格表';

USE andt_order;

-- 整改订单表
CREATE TABLE IF NOT EXISTS rectification_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单编号',
    inspection_report_id BIGINT NOT NULL COMMENT '检测报告ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    electrician_id BIGINT COMMENT '电工ID',
    materials JSON COMMENT '材料清单',
    material_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '材料费',
    labor_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '人工费',
    total_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '总金额',
    points_discount DECIMAL(10,2) DEFAULT 0.00 COMMENT '积分抵扣',
    final_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '实付金额',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING/CONFIRMED/IN_PROGRESS/COMPLETED/PAID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-正常 1-删除',
    INDEX idx_user_id (user_id),
    INDEX idx_report_id (inspection_report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='整改订单表';

-- ============================================================
-- 插入测试数据
-- ============================================================

USE andt_user;
INSERT INTO sys_user (username, phone, role, status) VALUES
('testuser', '13800138000', 'user', 1),
('testelec', '13800138001', 'electrician', 1);

INSERT INTO user_address (user_id, province, city, district, detail, contact_name, contact_phone, is_default) VALUES
(1, 'Shanghai', 'Shanghai', 'Pudong', 'No.2 Boyun Road Zhangjiang', 'TestUser', '13800138000', 1);

USE andt_inspection;
INSERT INTO inspection_quota (user_id, quota_type, total_count, used_count, remaining_count) VALUES
(1, 'first_free', 1, 0, 1);

INSERT INTO inspection_order (order_no, user_id, electrician_id, address_id, service_type, description, scheduled_time, status, price, is_free) VALUES
('INS20260423000001', 1, 2, 1, 'basic', 'Home electrical safety inspection', '2026-04-24 10:00:00', 'COMPLETED', 199.00, 1);

INSERT INTO inspection_report (report_no, order_id, user_id, electrician_id, total_score, safety_level, hazard_count, suggestions) VALUES
('RPT20260423000001', 1, 1, 2, 82, 'good', 2, 'Replace old sockets; Install RCD protector');

INSERT INTO inspection_item (report_id, category, category_name, item_name, test_value, standard_value, status, score, description, suggestion) VALUES
(1, 'wiring', 'Wiring', 'Main insulation resistance', '0.8MOhm', '>=0.5MOhm', 'pass', 95, 'Good insulation', 'No action needed'),
(1, 'wiring', 'Wiring', 'Socket ground resistance', '0.3Ohm', '<=4Ohm', 'pass', 90, 'Good grounding', 'No action needed'),
(1, 'device', 'Device', 'RCD action current', 'Not installed', '<=30mA', 'fail', 0, 'RCD not installed', 'Install RCD protector'),
(1, 'device', 'Device', 'Old socket safety', 'Loose', 'Firm', 'warn', 40, 'Socket aging loose', 'Replace old sockets');

USE andt_order;
INSERT INTO rectification_order (order_no, inspection_report_id, user_id, electrician_id, materials, material_amount, labor_amount, total_amount, points_discount, final_amount, status) VALUES
('RCT20260423000001', 1, 1, 2, '[{"name":"RCD Protector","qty":1,"price":85.00},{"name":"Safety Socket","qty":3,"price":25.00}]', 160.00, 120.00, 280.00, 0.00, 280.00, 'PENDING');
