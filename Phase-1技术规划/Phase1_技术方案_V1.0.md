# 安电通 Phase-1 技术方案文档

**版本**: V1.0.0
**日期**: 2026-04-22
**状态**: 待评审
**技术栈**: Taro 4.x + NutUI 4.x + Spring Boot + MySQL

---

## 一、项目概述

### 1.1 项目背景

安电通是一个家庭电路服务O2O平台，致力于解决居民家庭电路维修"找不到电工、收费不透明、服务无保障"的痛点。平台连接用户与专业电工，提供一键预约上门检测服务。

### 1.2 项目目标

| 指标 | 目标值 |
|------|--------|
| 首屏加载时间 | < 2秒 |
| 订单创建成功率 | > 99.5% |
| 派单响应时间 | < 30秒 |
| 支持并发用户 | 1000+ |

### 1.3 Phase-1 范围

```
Phase-1 定位：MVP版本，验证核心业务流程

核心功能：
├── 用户端：一键预约检测、查看报告、整改下单
├── 电工端：任务大厅、接单上门、提交报告
├── 公共模块：用户体系、地址管理、消息通知
└── 后端：订单服务、检测服务、电工服务

暂不包含：
├── 微信支付（Phase-2）
├── 完整积分体系（Phase-2）
├── 运营后台（Phase-2）
└── 多端小程序（Phase-2）
```

---

## 二、技术架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户层 (User Layer)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   微信小程序  │  │   APP(H5)   │  │  运营后台   │             │
│  │   Taro 4.x  │  │   Taro 4.x  │  │   React    │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│                   ┌─────────────────┐                            │
│                   │   API Gateway   │                            │
│                   │    (Spring)     │                            │
│                   └────────┬────────┘                            │
│                            │                                     │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                     服务层 (Service Layer)                       │
├────────────────────────────┼────────────────────────────────────┤
│                            ▼                                     │
│    ┌──────────────────────────────────────────────────┐        │
│    │                   业务服务层                       │        │
│    ├──────────────┬──────────────┬──────────────┤              │
│    │ 用户服务      │ 订单服务     │ 检测服务     │              │
│    │ User-Service │ Order-Service│Inspection   │              │
│    └──────────────┴──────────────┴──────────────┘              │
│                            │                                     │
│                            ▼                                     │
│    ┌──────────────────────────────────────────────────┐        │
│    │                   数据访问层                       │        │
│    ├──────────────┬──────────────┬──────────────┤              │
│    │   MySQL      │   Redis     │   文件存储   │              │
│    └──────────────┴──────────────┴──────────────┘              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 技术选型

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **多端框架** | Taro | 4.x | 一套代码编译到微信/京东/APP |
| **UI组件库** | NutUI | 4.x | 京东风格组件库 |
| **语言** | TypeScript | 5.x | 类型安全 |
| **状态管理** | Zustand | 4.x | 轻量级状态管理 |
| **后端框架** | Spring Boot | 3.x | 主流Java框架 |
| **ORM** | MyBatis-Plus | 3.5.x | 提升开发效率 |
| **数据库** | MySQL | 8.0 | 主数据存储 |
| **缓存** | Redis | 7.x | 会话缓存/队列 |
| **构建工具** | Vite | 5.x | 前端构建加速 |
| **容器化** | Docker | 24.x | 环境一致性 |

### 2.3 目录结构

```
andt/
│
├── frontend/                          # 前端源码
│   ├── taro-app/                     # Taro多端应用
│   │   ├── src/
│   │   │   ├── app.config.ts         # 全局配置
│   │   │   ├── app.tsx               # 根组件
│   │   │   ├── app.scss              # 全局样式
│   │   │   │
│   │   │   ├── pages/                # 页面
│   │   │   │   ├── user/             # 用户端
│   │   │   │   │   ├── home/         # 首页
│   │   │   │   │   ├── inspection/   # 一键检测
│   │   │   │   │   │   ├── index.tsx # 检测首页
│   │   │   │   │   │   ├── book.tsx  # 预约表单
│   │   │   │   │   │   ├── process.tsx # 检测进度
│   │   │   │   │   │   └── report.tsx  # 检测报告
│   │   │   │   │   ├── orders/       # 订单
│   │   │   │   │   └── profile/      # 个人中心
│   │   │   │   │
│   │   │   │   └── electrician/     # 电工端
│   │   │   │       ├── hall/        # 任务大厅
│   │   │   │       ├── tasks/        # 我的任务
│   │   │   │       └── income/       # 收入
│   │   │   │
│   │   │   ├── components/           # 组件
│   │   │   │   ├── business/         # 业务组件
│   │   │   │   │   ├── InspectionCard.tsx
│   │   │   │   │   ├── OrderItem.tsx
│   │   │   │   │   └── ElectricianCard.tsx
│   │   │   │   ├── ui/              # UI组件
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── Toast.tsx
│   │   │   │   └── layout/           # 布局组件
│   │   │   │       ├── Header.tsx
│   │   │   │       └── TabBar.tsx
│   │   │   │
│   │   │   ├── services/            # 服务层
│   │   │   │   ├── api/             # API定义
│   │   │   │   │   ├── request.ts   # 请求封装
│   │   │   │   │   ├── user.ts      # 用户API
│   │   │   │   │   ├── order.ts     # 订单API
│   │   │   │   │   └── inspection.ts # 检测API
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── store/               # 状态管理
│   │   │   │   ├── index.ts
│   │   │   │   ├── userStore.ts
│   │   │   │   ├── orderStore.ts
│   │   │   │   └── inspectionStore.ts
│   │   │   │
│   │   │   ├── hooks/               # 自定义Hooks
│   │   │   │   ├── useUser.ts
│   │   │   │   ├── useOrder.ts
│   │   │   │   └── useInspection.ts
│   │   │   │
│   │   │   ├── utils/               # 工具函数
│   │   │   │   ├── request.ts       # 请求工具
│   │   │   │   ├── storage.ts       # 存储工具
│   │   │   │   └── format.ts        # 格式化工具
│   │   │   │
│   │   │   ├── types/               # 类型定义
│   │   │   │   ├── api.d.ts
│   │   │   │   ├── user.d.ts
│   │   │   │   ├── order.d.ts
│   │   │   │   └── inspection.d.ts
│   │   │   │
│   │   │   └── constants/           # 常量
│   │   │       ├── api.ts
│   │   │       └── config.ts
│   │   │
│   │   ├── config/                  # 项目配置
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                        # 运营后台(简化版)
│       └── src/
│
├── backend/                          # 后端源码
│   ├── andt-gateway/                 # API网关
│   │   └── src/main/
│   │       └── java/com/andiantong/gateway/
│   │
│   ├── andt-user/                    # 用户服务
│   │   └── src/main/
│   │       ├── java/com/andiantong/user/
│   │       │   ├── controller/
│   │       │   │   └── UserController.java
│   │       │   ├── service/
│   │       │   │   ├── UserService.java
│   │       │   │   └── impl/
│   │       │   ├── mapper/
│   │       │   │   └── UserMapper.java
│   │       │   ├── entity/
│   │       │   │   └── User.java
│   │       │   └── dto/
│   │       └── resources/
│   │           └── application.yml
│   │
│   ├── andt-order/                   # 订单服务
│   │   └── src/main/
│   │       ├── java/com/andiantong/order/
│   │       │   ├── controller/
│   │       │   │   └── OrderController.java
│   │       │   ├── service/
│   │       │   ├── mapper/
│   │       │   ├── entity/
│   │       │   └── dto/
│   │       └── resources/
│   │
│   ├── andt-inspection/               # 检测服务(核心)
│   │   └── src/main/
│   │       ├── java/com/andiantong/inspection/
│   │       │   ├── controller/
│   │       │   │   └── InspectionController.java
│   │       │   ├── service/
│   │       │   │   ├── InspectionService.java
│   │       │   │   └── impl/
│   │       │   ├── mapper/
│   │       │   │   ├── InspectionOrderMapper.java
│   │       │   │   ├── InspectionReportMapper.java
│   │       │   │   └── InspectionQuotaMapper.java
│   │       │   ├── entity/
│   │       │   │   ├── InspectionOrder.java
│   │       │   │   ├── InspectionReport.java
│   │       │   │   ├── InspectionItem.java
│   │       │   │   └── InspectionQuota.java
│   │       │   └── dto/
│   │       └── resources/
│   │
│   └── andt-common/                  # 公共模块
│       └── src/main/
│           ├── java/com/andiantong/common/
│           │   ├── config/           # 配置类
│           │   ├── exception/        # 异常处理
│           │   ├── result/           # 统一返回
│           │   └── util/            # 工具类
│           └── resources/
│
├── database/                          # 数据库脚本
│   ├── init.sql                      # 初始化脚本
│   └── migration/                     # 增量脚本
│
├── scripts/                           # 构建脚本
│   ├── build.sh                      # 前端构建
│   ├── deploy.sh                     # 后端部署
│   └── docker/                        # Docker配置
│
└── docs/                              # 文档
    ├── tech/                          # 技术文档
    └── api/                          # API文档
```

---

## 三、功能详细设计

### 3.1 一键检测核心流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      一键检测业务流程                              │
└─────────────────────────────────────────────────────────────────┘

用户端                                          电工端
   │                                              │
   ▼                                              │
┌──────────────┐                                  │
│ 1. 首页入口   │                                  │
│ 点击"免费检测"│                                  │
└──────┬───────┘                                  │
       │                                          │
       ▼                                          │
┌──────────────┐                                  │
│ 2. 预约表单   │                                  │
│ - 选择地址    │                                  │
│ - 选择时间    │                                  │
│ - 问题描述    │                                  │
└──────┬───────┘                                  │
       │                                          │
       ▼                                          │
┌──────────────┐                                  │
│ 3. 创建订单   │                                  │
│ status:PENDING                                  │
└──────┬───────┘                                  │
       │            ┌──────────────┐              │
       │            │ 4. 系统派单   │              │
       │            │ 派给附近电工  │              │
       │            └──────┬───────┘              │
       │                   │                     │
       ▼                   ▼                     │
┌──────────────┐    ┌──────────────┐              │
│ 5. 等待接单   │    │ 5. 收到新订单│              │
│ 倒计时显示    │    │ 通知        │              │
└──────┬───────┘    └──────┬───────┘              │
       │                   │                     │
       │                   ▼                     │
       │            ┌──────────────┐              │
       │            │ 6. 电工接单  │              │
       │            │ 确认上门时间 │              │
       │            └──────┬───────┘              │
       │                   │                     │
       ▼                   ▼                     │
┌──────────────┐    ┌──────────────┐              │
│ 7. 显示电工   │    │ 8. 上门到达  │              │
│ 信息/电话    │    │ 点击"到达"   │              │
└──────┬───────┘    └──────┬───────┘              │
       │                   │                     │
       │                   ▼                     │
       │            ┌──────────────┐              │
       │            │ 9. 开始检测  │              │
       │            │ 逐项填写     │              │
       │            └──────┬───────┘              │
       │                   │                     │
       ▼                   ▼                     │
┌──────────────┐    ┌──────────────┐              │
│ 10. 查看报告  │◄───│ 11. 提交报告 │              │
│ 综合评分/隐患 │    │ 生成检测结果 │              │
│ 整改建议     │    │ status:COMPLETED             │
└──────┬───────┘    └──────────────┘              │
       │                                              │
       ▼                                              │
┌──────────────┐                                     │
│ 12. 整改下单  │                                    │
│ - 选择物料   │                                     │
│ - 确认支付  │                                     │
└──────────────┘                                     │
```

### 3.2 订单状态机

```
┌─────────────────────────────────────────────────────────────────┐
│                        订单状态流转图                              │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     PENDING     │
                    │    (待接单)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    ACCEPTED     │ │   CANCELLED     │ │    TIMEOUT      │
│   (已接单)      │ │   (已取消)      │ │   (超时)        │
└────────┬────────┘ └─────────────────┘ └─────────────────┘
         │
         ▼
┌─────────────────┐
│    ARRIVED      │
│   (已到达)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IN_PROGRESS    │
│   (检测中)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   COMPLETED     │
│   (已完成)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    PAID         │
│   (已支付)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    CLOSED       │
│   (已关闭)      │
└─────────────────┘

状态说明：
- PENDING: 订单创建，等待派单/接单
- ACCEPTED: 电工已接单
- ARRIVED: 电工已到达用户地址
- IN_PROGRESS: 检测进行中
- COMPLETED: 检测完成，报告已生成
- PAID: 整改费用已支付(可选)
- CLOSED: 订单关闭
- CANCELLED: 用户取消
- TIMEOUT: 派单超时无人接
```

### 3.3 数据库设计

#### 3.3.1 检测订单表

```sql
CREATE TABLE `inspection_order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    `order_no` VARCHAR(32) UNIQUE NOT NULL COMMENT '订单编号',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `electrician_id` BIGINT COMMENT '电工ID',
    `address_id` BIGINT NOT NULL COMMENT '地址ID',
    `service_type` VARCHAR(20) DEFAULT 'inspection' COMMENT '服务类型',
    `description` TEXT COMMENT '问题描述',
    `scheduled_time` DATETIME COMMENT '预约时间',
    `arrived_time` DATETIME COMMENT '到达时间',
    `start_time` DATETIME COMMENT '开始检测时间',
    `end_time` DATETIME COMMENT '完成时间',
    `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态',
    `report_id` BIGINT COMMENT '关联报告ID',
    `price` DECIMAL(10,2) DEFAULT 0 COMMENT '预估价格',
    `final_price` DECIMAL(10,2) DEFAULT 0 COMMENT '最终价格',
    `is_free` TINYINT DEFAULT 1 COMMENT '是否免费检测',
    `cancel_reason` VARCHAR(255) COMMENT '取消原因',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB COMMENT='检测订单表';

CREATE INDEX idx_order_user ON inspection_order(user_id);
CREATE INDEX idx_order_elec ON inspection_order(electrician_id);
CREATE INDEX idx_order_status ON inspection_order(status);
CREATE INDEX idx_order_no ON inspection_order(order_no);
```

#### 3.3.2 检测报告表

```sql
CREATE TABLE `inspection_report` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '报告ID',
    `report_no` VARCHAR(32) UNIQUE NOT NULL COMMENT '报告编号',
    `order_id` BIGINT NOT NULL COMMENT '关联订单ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `electrician_id` BIGINT NOT NULL COMMENT '电工ID',
    `total_score` INT COMMENT '综合评分 0-100',
    `safety_level` VARCHAR(20) COMMENT '安全等级：excellent/good/warning/danger',
    `hazard_count` INT DEFAULT 0 COMMENT '隐患数量',
    `report_data` JSON COMMENT '详细检测数据',
    `suggestions` TEXT COMMENT '整改建议',
    `electrician_sign` VARCHAR(255) COMMENT '电工签名',
    `user_sign` VARCHAR(255) COMMENT '用户签名',
    `report_time` DATETIME COMMENT '报告生成时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='检测报告表';

CREATE INDEX idx_report_order ON inspection_report(order_id);
CREATE INDEX idx_report_user ON inspection_report(user_id);
```

#### 3.3.3 检测报告项表

```sql
CREATE TABLE `inspection_item` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '检测项ID',
    `report_id` BIGINT NOT NULL COMMENT '关联报告ID',
    `category` VARCHAR(50) COMMENT '分类：distribution_box/wiring/socket/appliance',
    `category_name` VARCHAR(50) COMMENT '分类名称',
    `item_name` VARCHAR(100) COMMENT '检测项名称',
    `test_value` VARCHAR(50) COMMENT '实测值',
    `standard_value` VARCHAR(50) COMMENT '标准值',
    `status` VARCHAR(20) COMMENT '状态：pass/warn/fail',
    `score` INT COMMENT '得分',
    `description` TEXT COMMENT '问题描述',
    `suggestion` TEXT COMMENT '整改建议',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='检测报告项表';

CREATE INDEX idx_item_report ON inspection_item(report_id);
```

#### 3.3.4 用户检测资格表

```sql
CREATE TABLE `inspection_quota` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '资格ID',
    `user_id` BIGINT NOT NULL UNIQUE COMMENT '用户ID',
    `quota_type` VARCHAR(20) DEFAULT 'first_free' COMMENT '资格类型',
    `total_count` INT DEFAULT 1 COMMENT '总次数',
    `used_count` INT DEFAULT 0 COMMENT '已使用次数',
    `remaining_count` INT DEFAULT 1 COMMENT '剩余次数',
    `first_use_time` DATETIME COMMENT '首次使用时间',
    `last_use_time` DATETIME COMMENT '最后使用时间',
    `expire_time` DATETIME COMMENT '资格过期时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='用户检测资格表';
```

#### 3.3.5 整改订单表

```sql
CREATE TABLE `rectification_order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '整改单ID',
    `order_no` VARCHAR(32) UNIQUE NOT NULL COMMENT '整改单编号',
    `inspection_report_id` BIGINT NOT NULL COMMENT '关联检测报告ID',
    `inspection_order_id` BIGINT NOT NULL COMMENT '关联检测订单ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `electrician_id` BIGINT NOT NULL COMMENT '电工ID',
    `materials` JSON COMMENT '物料清单',
    `material_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '物料费',
    `labor_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '工时费',
    `total_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '总计',
    `points_discount` DECIMAL(10,2) DEFAULT 0 COMMENT '积分抵扣',
    `final_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '实付金额',
    `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态',
    `pay_time` DATETIME COMMENT '支付时间',
    `complete_time` DATETIME COMMENT '完成时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='整改订单表';
```

---

## 四、API接口设计

### 4.1 用户端接口

#### 4.1.1 检测相关接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 检查资格 | GET | /api/inspection/quota | 检查用户免费检测资格 |
| 创建预约 | POST | /api/inspection/create | 创建检测预约订单 |
| 获取订单列表 | GET | /api/inspection/list | 获取用户检测订单列表 |
| 获取订单详情 | GET | /api/inspection/{id} | 获取检测订单详情 |
| 取消预约 | POST | /api/inspection/{id}/cancel | 取消检测预约 |
| 获取检测报告 | GET | /api/inspection/report/{id} | 获取检测报告详情 |
| 创建整改订单 | POST | /api/inspection/rectify | 创建整改订单 |

#### 4.1.2 用户相关接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 发送验证码 | POST | /api/user/sendCode | 发送短信验证码 |
| 手机号登录 | POST | /api/user/login | 手机号+验证码登录 |
| 获取用户信息 | GET | /api/user/info | 获取用户信息 |
| 更新用户信息 | PUT | /api/user/update | 更新用户信息 |
| 获取地址列表 | GET | /api/address/list | 获取用户地址列表 |
| 新增地址 | POST | /api/address/create | 新增收货地址 |
| 设置默认地址 | PUT | /api/address/{id}/default | 设置默认地址 |

### 4.2 电工端接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取待抢订单 | GET | /api/electrician/pending | 获取附近待抢订单 |
| 接单 | POST | /api/electrician/accept/{id} | 接受检测订单 |
| 到达确认 | POST | /api/electrician/arrive/{id} | 确认到达 |
| 开始检测 | POST | /api/electrician/start/{id} | 开始检测 |
| 提交报告 | POST | /api/electrician/report | 提交检测报告 |
| 获取我的订单 | GET | /api/electrician/orders | 获取我的订单列表 |
| 获取收入明细 | GET | /api/electrician/income | 获取收入记录 |

### 4.3 接口详细设计

#### 4.3.1 创建检测预约

```
POST /api/inspection/create

请求参数：
{
  "addressId": 123,
  "scheduledTime": "2026-04-25 10:00:00",
  "description": "厨房插座偶尔冒火花"
}

响应：
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 1001,
    "orderNo": "INS202604250001",
    "status": "PENDING",
    "estimatedArrival": "30分钟内",
    "electrician": null
  }
}
```

#### 4.3.2 电工提交检测报告

```
POST /api/electrician/report

请求参数：
{
  "orderId": 1001,
  "totalScore": 78,
  "safetyLevel": "warning",
  "hazardCount": 3,
  "items": [
    {
      "category": "distribution_box",
      "categoryName": "配电箱检测",
      "itemName": "漏电保护动作电流",
      "testValue": "45mA",
      "standardValue": "≤30mA",
      "status": "fail",
      "score": 0,
      "description": "动作值过高，无法有效保护人体触电",
      "suggestion": "建议更换为30mA漏电保护器"
    }
  ],
  "suggestions": "整体线路存在老化迹象，建议尽快整改"
}

响应：
{
  "code": 200,
  "message": "success",
  "data": {
    "reportId": 501,
    "reportNo": "RPT202604250001"
  }
}
```

---

## 五、任务分解（WBS）

### 5.1 Phase-1 任务总览

```
Phase-1 任务分解
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

阶段一：技术准备 (Week 1)
├── 1.1 项目初始化
│   ├── 1.1.1 Taro项目初始化 ✓
│   ├── 1.1.2 NutUI组件库集成 ✓
│   ├── 1.1.3 TypeScript配置 ✓
│   ├── 1.1.4 项目目录结构创建 ✓
│   └── 1.1.5 ESLint/Prettier配置 ✓
│   ├── 1.2.1 Spring Boot项目初始化
│   ├── 1.2.2 MyBatis-Plus集成
│   ├── 1.2.3 Redis配置
│   ├── 1.2.4 API网关配置
│   └── 1.2.5 数据库初始化脚本
│   └── 1.3.1 需求评审会议
│   ├── 1.3.2 接口评审会议
│   └── 1.3.3 设计评审会议

阶段二：用户端开发 (Week 2-3)
├── 2.1 首页模块
│   ├── 2.1.1 首页布局开发
│   ├── 2.1.2 公益检测入口
│   └── 2.1.3 快捷服务入口
├── 2.2 登录模块
│   ├── 2.2.1 手机号登录页
│   ├── 2.2.2 验证码发送/校验
│   └── 2.2.3 用户信息存储
├── 2.3 地址模块
│   ├── 2.3.1 地址列表页
│   ├── 2.3.2 地址编辑页
│   └── 2.3.3 地图选点
├── 2.4 一键检测模块
│   ├── 2.4.1 检测首页
│   ├── 2.4.2 预约表单页
│   ├── 2.4.3 检测进度页
│   ├── 2.4.4 检测报告页
│   └── 2.4.5 整改下单页
├── 2.5 订单模块
│   ├── 2.5.1 订单列表页
│   └── 2.5.2 订单详情页
└── 2.6 个人中心
    ├── 2.6.1 个人中心首页
    └── 2.6.2 设置页

阶段三：电工端开发 (Week 3-4)
├── 3.1 登录模块
│   ├── 3.1.1 电工手机号登录
│   └── 3.1.2 电工信息认证
├── 3.2 任务大厅
│   ├── 3.2.1 待抢订单列表
│   ├── 3.2.2 订单详情查看
│   └── 3.2.3 抢单功能
├── 3.3 我的任务
│   ├── 3.3.1 进行中订单
│   ├── 3.3.2 已完成订单
│   └── 3.3.3 订单状态更新
├── 3.4 检测功能
│   ├── 3.4.1 到达确认
│   ├── 3.4.2 开始检测
│   ├── 3.4.3 填写检测项
│   └── 3.4.4 提交报告
└── 3.5 收入模块
    ├── 3.5.1 收入概览
    └── 3.5.2 收入明细

阶段四：后端开发 (Week 2-4 并行)
├── 4.1 用户服务
│   ├── 4.1.1 用户注册/登录
│   ├── 4.1.2 用户信息管理
│   └── 4.1.3 地址管理
├── 4.2 订单服务
│   ├── 4.2.1 订单创建
│   ├── 4.2.2 订单查询
│   ├── 4.2.3 订单状态流转
│   └── 4.2.4 派单逻辑
├── 4.3 检测服务
│   ├── 4.3.1 资格校验
│   ├── 4.3.2 报告管理
│   ├── 4.3.3 整改订单
│   └── 4.3.4 消息通知
├── 4.4 电工服务
│   ├── 4.4.1 电工登录
│   ├── 4.4.2 任务大厅
│   ├── 4.4.3 接单功能
│   └── 4.4.4 收入结算
└── 4.5 公共模块
    ├── 4.5.1 统一响应
    ├── 4.5.2 异常处理
    ├── 4.5.3 日志记录
    └── 4.5.4 权限验证

阶段五：联调测试 (Week 5)
├── 5.1 前后端联调
│   ├── 5.1.1 用户端接口联调
│   └── 5.1.2 电工端接口联调
├── 5.2 功能测试
│   ├── 5.2.1 一键检测全流程
│   ├── 5.2.2 电工接单流程
│   └── 5.2.3 异常场景测试
├── 5.3 性能测试
│   ├── 5.3.1 首屏加载时间
│   └── 5.3.2 接口响应时间
└── 5.4 Bug修复
    └── 5.4.1 问题修复

阶段六：部署上线 (Week 6)
├── 6.1 环境准备
│   ├── 6.1.1 云服务器购买
│   ├── 6.1.2 域名配置
│   └── 6.1.3 SSL证书
├── 6.2 部署实施
│   ├── 6.2.1 后端服务部署
│   ├── 6.2.2 前端资源部署
│   └── 6.2.3 数据库迁移
├── 6.3 上线验证
│   ├── 6.3.1 核心流程验证
│   └── 6.3.2 监控配置
└── 6.4 交付文档
    ├── 6.4.1 API文档
    ├── 6.4.2 部署文档
    └── 6.4.3 用户手册
```

### 5.2 任务详细说明

#### 阶段一：技术准备（Week 1）

| 任务ID | 任务名称 | 负责人 | 预计工时 | 依赖任务 | 验收标准 |
|--------|---------|--------|---------|---------|---------|
| T1.1.1 | Taro项目初始化 | 前端 | 4h | - | 项目可运行，无编译错误 |
| T1.1.2 | NutUI集成 | 前端 | 2h | T1.1.1 | 组件可正常引入使用 |
| T1.1.3 | 目录结构创建 | 前端 | 4h | T1.1.1 | 目录结构符合设计规范 |
| T1.2.1 | Spring Boot项目初始化 | 后端 | 4h | - | 项目可启动 |
| T1.2.2 | 数据库脚本执行 | 后端 | 2h | - | 所有表创建成功 |
| T1.3.1 | 接口评审 | 全体 | 4h | T1.2.2 | 接口文档定稿 |

---

## 六、开发时间计划

### 6.1甘特图

```
Week 1   Week 2   Week 3   Week 4   Week 5   Week 6
  │        │        │        │        │        │
  ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────┐
│ 阶段一：技术准备                                  │
│ ████████                                        │
└─────────────────────────────────────────────────┘
  │
┌─────────────────────────────────────────────────┐
│ 阶段二：用户端开发                                │
│         ████████████████████████████████████    │
│                                                    │
└─────────────────────────────────────────────────┘
  │
┌─────────────────────────────────────────────────┐
│ 阶段三：电工端开发                                │
│                     ████████████████████        │
│                                                    │
└─────────────────────────────────────────────────┘
  │
┌─────────────────────────────────────────────────┐
│ 阶段四：后端开发（并行）                          │
│         ████████████████████████████████████    │
│                                                    │
└─────────────────────────────────────────────────┘
  │
┌─────────────────────────────────────────────────┐
│ 阶段五：联调测试                                  │
│                                     ████████    │
└─────────────────────────────────────────────────┘
  │
┌─────────────────────────────────────────────────┐
│ 阶段六：部署上线                                  │
│                                             ████│
└─────────────────────────────────────────────────┘

里程碑：
- M1: 项目初始化完成 (Week 1 结束)
- M2: 用户端核心页面完成 (Week 3 结束)
- M3: 电工端核心功能完成 (Week 4 结束)
- M4: 前后端联调通过 (Week 5 结束)
- M5: 正式上线 (Week 6 结束)
```

### 6.2 每周交付物

| 周次 | 交付物 | 完成标准 |
|------|--------|---------|
| Week 1 | 技术架构文档、项目初始化完成 | 前端可运行、后端可启动 |
| Week 2 | 用户端核心页面(80%) | 首页、检测流程页面完成 |
| Week 3 | 用户端全部完成 + 电工端(50%) | 用户全流程可走通 |
| Week 4 | 电工端全部完成 + 后端(80%) | 前后端接口对接完成 |
| Week 5 | 全流程联调 + Bug修复 | 核心流程无阻塞Bug |
| Week 6 | 上线部署 + 文档交付 | 系统可对外服务 |

---

## 七、验收标准

### 7.1 功能验收

#### 用户端功能验收

| 序号 | 功能 | 验收标准 | 测试方法 |
|------|------|---------|---------|
| F1 | 手机号登录 | 验证码发送成功，登录跳转正确 | 输入手机号，获取验证码，登录 |
| F2 | 地址管理 | 可新增/编辑/删除/设置默认地址 | CRUD操作验证 |
| F3 | 一键预约 | 预约表单提交成功，订单创建 | 填写表单，提交，查看订单 |
| F4 | 检测进度 | 实时显示订单状态变化 | 电工操作，查看状态更新 |
| F5 | 检测报告 | 报告数据完整，隐患项显示正确 | 查看报告，核对数据 |
| F6 | 整改下单 | 可选择物料，确认下单 | 选择物料，提交整改订单 |

#### 电工端功能验收

| 序号 | 功能 | 验收标准 | 测试方法 |
|------|------|---------|---------|
| E1 | 登录认证 | 电工账号密码登录 | 输入账号密码登录 |
| E2 | 任务大厅 | 显示附近待抢订单 | 查看订单列表 |
| E3 | 接单功能 | 点击接单成功，状态更新 | 点击接单，查看订单状态 |
| E4 | 到达确认 | 点击到达，状态更新 | 点击到达，用户端显示 |
| E5 | 检测填写 | 检测项可逐项填写提交 | 填写检测数据，提交 |
| E6 | 提交报告 | 报告提交成功，用户可见 | 提交报告，用户端查看 |

### 7.2 性能验收

| 指标 | 目标值 | 测试方法 |
|------|--------|---------|
| 首页加载时间 | < 2秒 | Lighthouse测试 |
| 接口响应时间 | < 500ms | Postman测试 |
| 页面切换时间 | < 300ms | 人工体验 |
| 同时在线用户 | 支持100+ | 压力测试 |

### 7.3 兼容性验收

| 平台 | 最低版本 | 验收标准 |
|------|---------|---------|
| 微信小程序 | 基础库2.20+ | 核心功能可用 |
| Android | 8.0+ | 核心功能可用 |
| iOS | 13.0+ | 核心功能可用 |
| H5 | Chrome 80+ | 核心功能可用 |

### 7.4 上线检查清单

```
□ 所有P0 Bug已修复
□ 核心流程测试100%通过
□ 性能指标达标
□ 接口文档完整
□ 部署文档完整
□ 监控告警配置完成
□ 数据备份方案就绪
□ 回滚方案已验证
```

---

## 八、风险与应对

### 8.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| Taro多端兼容问题 | 中 | 中 | 预留1周Buffer，重点测试小程序 |
| 实时推送延迟 | 中 | 低 | 使用WebSocket，备选轮询 |
| 大并发性能瓶颈 | 高 | 低 | Redis缓存，数据库索引优化 |

### 8.2 项目风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 需求变更 | 中 | 高 | 每周固定时间接收需求，Phase-1冻结范围 |
| 人力不足 | 高 | 中 | 优先保证核心功能，延后次要功能 |
| 进度延期 | 中 | 中 | 每日站会监控，关键路径优先 |

### 8.3 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 支付资质申请延迟 | 高 | 中 | Phase-1先做上门收款，支付Phase-2接入 |
| 电工入驻不足 | 高 | 中 | 地推团队同步启动招募 |

---

## 九、团队配置

### 9.1 人员需求

| 角色 | 人数 | 主要职责 | 备注 |
|------|------|---------|------|
| 前端开发 | 1-2人 | 用户端/电工端页面开发 | 需熟悉Taro |
| 后端开发 | 1-2人 | 服务端接口开发 | 需熟悉Spring Boot |
| 测试 | 1人 | 功能测试、回归测试 | 可兼职 |
| 产品 | 1人 | 需求把控、项目协调 | 可兼职 |

### 9.2 环境需求

| 环境 | 配置 | 用途 |
|------|------|------|
| 开发环境 | 本地搭建 | 开发调试 |
| 测试环境 | 云服务器1台 | 前后端联调 |
| 生产环境 | 云服务器2台+ | 正式上线 |

---

## 十、附录

### 10.1 技术文档清单

| 文档 | 负责人 | 产出时间 |
|------|--------|---------|
| 技术方案文档 | 技术负责人 | Week 1 |
| 接口文档 | 后端开发 | Week 2 |
| 数据库设计文档 | 后端开发 | Week 1 |
| 部署文档 | 运维/后端 | Week 5 |
| 用户手册 | 产品 | Week 6 |

### 10.2 第三方服务清单

| 服务 | 用途 | 申请周期 | 优先级 |
|------|------|---------|--------|
| 短信服务 | 登录验证码 | 1-2天 | P0 |
| 地图服务 | 地址定位 | 1周 | P0 |
| 微信小程序 | 用户/电工端 | 2-4周 | P0 |
| 微信支付 | 支付功能 | 2-4周 | P1 |

---

**文档状态**: 🟡 待评审
**下一步**: 团队评审 → 确认技术方案 → 开始开发
