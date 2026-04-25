# 积分API接口规范

## 一、接口概| 接口名称 | 方法 | 路径 | 说明 | 权限 
| 属性 | 接口概览 | 接口名称 |---------|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| 积分余额查询 | GET | /points/balance | 获取用户积分余额 | 用户 
| 积分明细 | GET | /points/transactions | 获取积分流水 | 用户 
| 签到 | POST | /points/checkin | 每日签到 | 用户 
| 积分兑换 | POST | /points/redeem | 积分兑换商品 | 用户 
| 积分规则 | GET | /points/rules | 获取积分规则 | 用户 
| 积分调整 | POST | /points/adjust | 管理员调整积| 客服 

---

## 二、接口详

### 2.1 积分余额查询

**请求**
```http
GET /points/balance
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 2580,
    "expiringSoon": 200,
    "expiringDate": "2028-03-30",
    "todayCheckin": false,
    "continuousCheckin": 5,
    "level": {
      "name": "银卡会员",
      "minPoints": 1000,
      "maxPoints": 5000,
      "benefits": ["积分1.2, "专属客服"]
    },
    "statistics": {
      "totalEarned": 5680,
      "totalUsed": 3100,
      "thisMonthEarned": 380,
      "thisMonthUsed": 150
    }
  }
}
```

---

### 2.2 积分明细

**请求**
```http
GET /points/transactionspage=1&pageSize=20&type=earn
Authorization: Bearer {token}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| page | int | | 页码 
| pageSize | int | | 每页数量 
| type | string | | 类型: earn/use/all 
| startDate | string | | 开始日
| endDate | string | | 结束日期 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "transactionId": "PTS202401150001",
        "type": "earn",
        "typeLabel": "获取",
        "amount": 80,
        "balance": 2580,
        "source": "order_reward",
        "sourceLabel": "订单奖励",
        "description": "完成订单ORD202401150001奖励",
        "relatedId": "ORD202401150001",
        "expiredAt": 1704067200000,
        "createdAt": 1705286500000
      },
      {
        "transactionId": "PTS202401140001",
        "type": "use",
        "typeLabel": "使用",
        "amount": -100,
        "balance": 2500,
        "source": "order_deduction",
        "sourceLabel": "订单抵扣",
        "description": "订单ORD202401140001积分抵扣",
        "relatedId": "ORD202401140001",
        "createdAt": 1705200000000
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 45
    }
  }
}
```

---

### 2.3 签到

**请求**
```http
POST /points/checkin
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "points": 20,
    "continuousDays": 6,
    "totalCheckinDays": 128,
    "message": "连续签到6天，获得20积分",
    "nextReward": {
      "days": 7,
      "points": 50,
      "bonus": "神秘礼包"
    },
    "checkinCalendar": [
      { "day": 1, "points": 5, "checked": true },
      { "day": 2, "points": 6, "checked": true },
      { "day": 3, "points": 7, "checked": true },
      { "day": 4, "points": 8, "checked": true },
      { "day": 5, "points": 20, "checked": true },
      { "day": 6, "points": 20, "checked": true },
      { "day": 7, "points": 50, "checked": false }
    ]
  }
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 4001 | 今日已签| 提示明日再来 

---

### 2.4 积分兑换

**请求**
```http
POST /points/redeem
Content-Type: application/json
Authorization: Bearer {token}

{
  "productId": "PRD001",
  "quantity": 1,
  "addressId": "ADDR001"
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| productId | string | | 兑换商品ID 
| quantity | int | | 兑换数量 
| addressId | string | | 收货地址ID（实物商品） 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "redeemId": "RDM202401150001",
    "productId": "PRD001",
    "productName": "高品质数据线",
    "points": 500,
    "quantity": 1,
    "status": "pending",
    "statusLabel": "待发,
    "address": {
      "name": "张先,
      "phone": "138****8888",
      "address": "上海市浦东新区张江镇xxx"
    },
    "createdAt": 1705287000000
  }
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 2006 | 积分不足 | 提示积分余额不足 
| 4002 | 商品已下| 提示商品不可兑换 
| 4003 | 库存不足 | 提示库存不足 

---

### 2.5 积分规则

**请求**
```http
GET /points/rules
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "basicRules": {
      "name": "安电通积,
      "exchangeRate": 100,
      "exchangeUnit": ",
      "validityPeriod": 730,
      "validityUnit": ",
      "minRedeem": 100,
      "maxDeductionRate": 0.1
    },
    "earnRules": [
      {
        "source": "order_reward",
        "name": "订单奖励",
        "description": "完成订单获得积分",
        "rate": 1,
        "rateUnit": "积分/,
        "minAmount": 0
      },
      {
        "source": "checkin",
        "name": "每日签到",
        "description": "每日签到获得积分",
        "rules": [
          { "continuous": 1, "points": 5 },
          { "continuous": 2, "points": 6 },
          { "continuous": 3, "points": 7 },
          { "continuous": 4, "points": 8 },
          { "continuous": "5+", "points": 20 }
        ]
      },
      {
        "source": "first_order",
        "name": "首单奖励",
        "description": "首次下单额外奖励",
        "points": 100
      },
      {
        "source": "review",
        "name": "评价奖励",
        "description": "完成订单评价",
        "points": 10
      },
      {
        "source": "invite",
        "name": "邀请好,
        "description": "好友成功注册",
        "points": 200
      }
    ],
    "useRules": [
      {
        "scene": "order_deduction",
        "name": "订单抵扣",
        "description": "下单时使用积分抵,
        "maxRate": 0.1,
        "minOrderAmount": 10
      },
      {
        "scene": "points_mall",
        "name": "积分商城",
        "description": "积分兑换商品",
        "minPoints": 100
      }
    ]
  }
}
```

---

### 2.6 积分调整

**接口说明**
管理员手动调整用户积分（客服后台使用**请求**
```http
POST /points/adjust
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "userId": "USR001",
  "amount": 100,
  "type": "add",
  "reason": "投诉补偿",
  "remark": "用户投诉电工态度问题，补00积分"
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| userId | string | | 用户ID 
| amount | number | | 调整数量（正数） 
| type | string | | 类型: add/deduct 
| reason | string | | 调整原因 
| remark | string | | 详细说明 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "adjustId": "ADJ202401150001",
    "userId": "USR001",
    "amount": 100,
    "type": "add",
    "previousBalance": 2480,
    "currentBalance": 2580,
    "reason": "投诉补偿",
    "operator": "客服小王",
    "createdAt": 1705287500000
  }
}
```

---

## 三、积分来源类| 来源代码 | 名称 | 积分计算 | 说明 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| order_reward | 订单奖励 | 订单金额×1 | 完成订单获得 
| checkin | 每日签到 | 5-20| 连续签到递增 
| first_order | 首单奖励 | 100| 首次下单 
| review | 评价奖励 | 10| 完成评价 
| invite | 邀请好| 200| 好友注册成功 
| activity | 活动奖励 | 按活动规| 参与活动 
| compensation | 补偿积分 | 按情| 投诉补偿 
| admin_adjust | 管理员调| 按情| 后台调整 

---

## 四、积分使用场| 场景代码 | 名称 | 使用规则 | 说明 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| order_deduction | 订单抵扣 | 最高抵0% | 下单时抵
| points_mall | 积分商城 | 全额积分 | 兑换商品 
| recharge_deduction | 充值抵| 最高抵0% | 充值时抵扣 

---

## 五、积分过期规

### 5.1 过期计算

```
积分有效期：获得年（730天）
过期日期：获得日+ 730过期时间：过期日期的23:59:59
```

### 5.2 过期提醒

| 提醒时机 | 提醒方式 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |---------
| 积分即将过期0天内| App推
| 积分即将过期天内| 短信通知 
| 积分即将过期（当天） | App推短信 

### 5.3 过期处理

```json
{
  "type": "points_expired",
  "data": {
    "userId": "USR001",
    "expiredPoints": 200,
    "expiredDate": "2026-03-30",
    "source": "order_reward",
    "originalEarnDate": "2024-03-30"
  }
}
```

---

## 六、积分风

### 6.1 异常行为检| 异常类型 | 检测规| 处理方式 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |---------
| 刷积| 单日获取超过500| 人工审核 
| 异常签到 | 设备/IP异常 | 验证码验
| 批量注册 | 邀请奖励异| 冻结积分 
| 积分套现 | 频繁退| 限制退

### 6.2 积分冻结

```json
{
  "code": 0,
  "data": {
    "frozenPoints": 500,
    "frozenReason": "异常行为检,
    "frozenAt": 1705287000000,
    "status": "under_review"
  }
}
```

---

## 七、变更记录 日期 | 版本 | 变更内容 | 变更
|------|------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------
| 2026-03-30 | v1.0 | 初始版本 | - 
