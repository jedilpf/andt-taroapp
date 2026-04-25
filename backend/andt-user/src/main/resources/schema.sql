-- H2 数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    avatar VARCHAR(255),
    password VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    status TINYINT DEFAULT 1,
    last_login_time TIMESTAMP,
    last_login_ip VARCHAR(50),
    wechat_open_id VARCHAR(100),
    wechat_union_id VARCHAR(100),
    wechat_nickname VARCHAR(100),
    wechat_avatar VARCHAR(255),
    wechat_bind_time TIMESTAMP,
    alipay_open_id VARCHAR(100),
    alipay_nickname VARCHAR(100),
    alipay_avatar VARCHAR(255),
    alipay_bind_time TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
);

-- 验证码表
CREATE TABLE IF NOT EXISTS sys_sms_code (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    expire_time TIMESTAMP NOT NULL,
    used TINYINT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
);

-- 用户地址表
CREATE TABLE IF NOT EXISTS user_address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    detail VARCHAR(200) NOT NULL,
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    is_default TINYINT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
);
