# 安电通API接口文档

**未来申活（上海）数字科技有限公司**

**编制日期：2026年4月8日**

---

## 架构说明

本项目采用**单体架构**设计，所有API接口由同一后端应用统一提供。接口按业务模块进行分组管理，便于开发和维护。

---

## 一、接口规范

### 1.1 基础信息

| 项目 | 说明 |
|-----|------|
| 基础URL | https://api.andiantong.com |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 时间格式 | yyyy-MM-dd HH:mm:ss |

### 1.2 请求规范

**请求头**

```
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
X-Request-Id: {uuid}           // 请求追踪ID（可选）
```

### 1.3 响应规范

**成功响应**

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1712505600000
}
```

**错误响应**

```json
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "timestamp": 1712505600000
}
```

### 1.4 状态码定义

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证/Token过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 二、用户模块

### 2.1 用户注册

**POST** `/api/user/register`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| phone | String | 是 | 手机号(11位) |
| password | String | 是 | 密码(6-20位) |
| code | String | 是 | 验证码(6位) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 10001,
    "phone": "138****8888",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.2 用户登录

**POST** `/api/user/login`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| phone | String | 是 | 手机号 |
| password | String | 是 | 密码 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 10001,
    "nickname": "用户昵称",
    "avatar": "https://...",
    "phone": "138****8888",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.3 微信登录

**POST** `/api/user/wechat-login`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| code | String | 是 | 微信授权code |

**响应示例**

同用户登录

### 2.4 获取用户信息

**GET** `/api/user/info`

**请求头**

```
Authorization: Bearer {token}
```

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 10001,
    "nickname": "用户昵称",
    "avatar": "https://...",
    "phone": "138****8888",
    "gender": 1,
    "role": 1,
    "createdAt": "2026-04-01 10:00:00"
  }
}
```

### 2.5 更新用户信息

**PUT** `/api/user/update`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| nickname | String | 否 | 昵称 |
| avatar | String | 否 | 头像URL |
| gender | Integer | 否 | 性别(1男/2女) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 2.6 Token验证

**POST** `/api/user/validate-token`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| token | String | 是 | JWT Token |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "valid": true,
    "userId": 10001,
    "expireAt": "2026-04-02 10:00:00"
  }
}
```

### 2.7 发送验证码

**POST** `/api/user/send-code`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| phone | String | 是 | 手机号 |
| type | Integer | 是 | 类型(1注册/2登录/3重置密码) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 2.8 重置密码

**POST** `/api/user/reset-password`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| phone | String | 是 | 手机号 |
| code | String | 是 | 验证码 |
| newPassword | String | 是 | 新密码 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 三、订单模块

### 3.1 创建订单

**POST** `/api/order/create`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| serviceType | Integer | 是 | 服务类型(1维修/2安装/3安检) |
| serviceName | String | 是 | 服务名称 |
| description | String | 否 | 问题描述 |
| addressId | Long | 是 | 地址ID |
| contactPhone | String | 是 | 联系电话 |
| appointmentTime | String | 否 | 预约时间 |
| amount | Decimal | 是 | 订单金额 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 202604010001,
    "orderNo": "AD202604010001",
    "status": 0,
    "createdAt": "2026-04-01 10:00:00"
  }
}
```

### 3.2 订单列表

**GET** `/api/order/list`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| status | Integer | 否 | 订单状态 |
| pageNum | Integer | 否 | 页码(默认1) |
| pageSize | Integer | 否 | 每页数量(默认10) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "list": [
      {
        "orderId": 202604010001,
        "orderNo": "AD202604010001",
        "serviceName": "电路维修",
        "amount": 50.00,
        "status": 10,
        "statusText": "已支付",
        "elecName": "张师傅",
        "appointmentTime": "2026-04-01 14:00:00",
        "createdAt": "2026-04-01 10:00:00"
      }
    ]
  }
}
```

### 3.3 订单详情

**GET** `/api/order/{id}`

**路径参数**

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | Long | 订单ID |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 202604010001,
    "orderNo": "AD202604010001",
    "userId": 10001,
    "userName": "李先生",
    "userPhone": "138****8888",
    "elecId": 20001,
    "elecName": "张师傅",
    "elecPhone": "139****9999",
    "elecAvatar": "https://...",
    "elecRating": 4.8,
    "serviceType": 1,
    "serviceName": "电路维修",
    "description": "插座没电",
    "addressText": "上海市浦东新区xxx小区1栋101",
    "contactPhone": "138****8888",
    "appointmentTime": "2026-04-01 14:00:00",
    "amount": 50.00,
    "status": 30,
    "statusText": "服务中",
    "createdAt": "2026-04-01 10:00:00"
  }
}
```

### 3.4 取消订单

**POST** `/api/order/{id}/cancel`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| reason | String | 否 | 取消原因 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 202604010001,
    "status": -1,
    "refundAmount": 45.00
  }
}
```

### 3.5 订单状态变更

**POST** `/api/order/{id}/status`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| status | Integer | 是 | 目标状态 |
| remark | String | 否 | 备注 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 3.6 订单评价

**POST** `/api/order/{id}/review`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| rating | Integer | 是 | 评分(1-5) |
| content | String | 否 | 评价内容 |
| tags | Array | 否 | 评价标签 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 3.7 订单日志

**GET** `/api/order/{id}/logs`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "action": "创建订单",
      "fromStatus": null,
      "toStatus": 0,
      "operatorType": 1,
      "createdAt": "2026-04-01 10:00:00"
    },
    {
      "action": "支付成功",
      "fromStatus": 0,
      "toStatus": 10,
      "operatorType": 3,
      "createdAt": "2026-04-01 10:05:00"
    }
  ]
}
```

### 3.8 订单状态枚举

| 状态值 | 状态名 | 说明 |
|-------|-------|------|
| -1 | 已取消 | 订单已取消 |
| 0 | 待支付 | 订单已创建，等待支付 |
| 10 | 已支付 | 支付成功，等待电工接单 |
| 20 | 已接单 | 电工已接单，前往服务 |
| 30 | 服务中 | 电工正在服务 |
| 40 | 已完成 | 服务完成，等待评价 |
| 50 | 已评价 | 用户已评价，订单结束 |

---

## 四、支付模块

### 4.1 发起支付

**POST** `/api/payment/create`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| orderId | Long | 是 | 订单ID |
| channel | Integer | 是 | 支付渠道(1微信/2支付宝) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "paymentNo": "PAY202604010001",
    "amount": 50.00,
    "channel": 1,
    "payParams": {
      "appId": "wx...",
      "timeStamp": "1712505600",
      "nonceStr": "...",
      "package": "prepay_id=...",
      "signType": "RSA",
      "paySign": "..."
    }
  }
}
```

### 4.2 支付回调

**POST** `/api/payment/callback`

> 由支付平台调用，用户无需关心

**请求参数**

支付平台回调参数

**响应示例**

```
success
```

### 4.3 支付状态查询

**GET** `/api/payment/{id}/status`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "paymentNo": "PAY202604010001",
    "status": 1,
    "statusText": "已支付",
    "transactionId": "4200001234567890",
    "paidAt": "2026-04-01 10:05:00"
  }
}
```

### 4.4 发起退款

**POST** `/api/payment/refund`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| paymentNo | String | 是 | 支付流水号 |
| reason | String | 是 | 退款原因 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "refundNo": "RF202604010001",
    "status": 2,
    "refundAmount": 50.00
  }
}
```

### 4.5 支付记录查询

**GET** `/api/payment/list`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 10,
    "list": [
      {
        "paymentNo": "PAY202604010001",
        "orderNo": "AD202604010001",
        "amount": 50.00,
        "channel": 1,
        "channelText": "微信支付",
        "status": 1,
        "createdAt": "2026-04-01 10:00:00"
      }
    ]
  }
}
```

---

## 五、地址模块

### 5.1 地址列表

**GET** `/api/address/list`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "李先生",
      "phone": "13812345678",
      "province": "上海市",
      "city": "上海市",
      "district": "浦东新区",
      "detail": "张江高科技园区xxx路1号",
      "isDefault": 1
    }
  ]
}
```

### 5.2 添加地址

**POST** `/api/address/add`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| name | String | 是 | 联系人 |
| phone | String | 是 | 电话 |
| province | String | 是 | 省 |
| city | String | 是 | 市 |
| district | String | 是 | 区 |
| detail | String | 是 | 详细地址 |
| isDefault | Integer | 否 | 默认地址(0否/1是) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2
  }
}
```

### 5.3 更新地址

**PUT** `/api/address/update`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| id | Long | 是 | 地址ID |
| name | String | 否 | 联系人 |
| phone | String | 否 | 电话 |
| detail | String | 否 | 详细地址 |
| isDefault | Integer | 否 | 默认地址 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 5.4 删除地址

**DELETE** `/api/address/{id}`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 5.5 设置默认地址

**PUT** `/api/address/{id}/default`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 六、商品模块

### 6.1 商品分类列表

**GET** `/api/goods/category/list`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "数码专区",
      "icon": "https://...",
      "children": []
    }
  ]
}
```

### 6.2 商品列表

**GET** `/api/goods/list`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| categoryId | Long | 否 | 分类ID |
| keyword | String | 否 | 搜索关键词 |
| sortBy | String | 否 | 排序字段(sales/price) |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": 1,
        "name": "智能插座",
        "price": 59.00,
        "originalPrice": 79.00,
        "mainImage": "https://...",
        "sales": 500
      }
    ]
  }
}
```

### 6.3 商品详情

**GET** `/api/goods/{id}`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "智能插座",
    "description": "支持远程控制...",
    "price": 59.00,
    "originalPrice": 79.00,
    "stock": 100,
    "sales": 500,
    "mainImage": "https://...",
    "images": ["https://...", "https://..."],
    "unit": "个"
  }
}
```

### 6.4 商品搜索

**GET** `/api/goods/search`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| keyword | String | 是 | 搜索关键词 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

同商品列表

---

## 七、地图模块

### 7.1 附近电工列表

**GET** `/api/map/nearby-electricians`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| latitude | Decimal | 是 | 纬度 |
| longitude | Decimal | 是 | 经度 |
| radius | Integer | 否 | 搜索半径(km，默认3) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "elecId": 20001,
      "name": "张师傅",
      "avatar": "https://...",
      "rating": 4.8,
      "orderCount": 120,
      "certLevel": 2,
      "distance": 0.5,
      "latitude": 31.2304,
      "longitude": 121.4737,
      "status": 1
    }
  ]
}
```

### 7.2 电工位置更新

**POST** `/api/map/location/update`

> 电工端调用

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| latitude | Decimal | 是 | 纬度 |
| longitude | Decimal | 是 | 经度 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 7.3 地址解析

**GET** `/api/map/geocode`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| address | String | 是 | 地址文本 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "latitude": 31.2304,
    "longitude": 121.4737,
    "formattedAddress": "上海市浦东新区张江高科技园区"
  }
}
```

---

## 八、AI服务模块

### 8.1 AI对话

**POST** `/api/ai/chat`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| message | String | 是 | 用户消息 |
| provider | String | 否 | AI提供商(qianwen/deepseek/doubao) |
| history | Array | 否 | 历史对话 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "您好，请问有什么可以帮您的？",
    "conversationId": "conv_123456"
  }
}
```

### 8.2 AI对话历史

**GET** `/api/ai/history`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| conversationId | String | 否 | 会话ID |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 10,
    "list": [
      {
        "role": "user",
        "content": "家里插座坏了怎么办？",
        "createdAt": "2026-04-01 10:00:00"
      },
      {
        "role": "assistant",
        "content": "您好，建议您联系专业电工进行维修...",
        "createdAt": "2026-04-01 10:00:05"
      }
    ]
  }
}
```

---

## 九、电工模块

### 9.1 电工信息

**GET** `/api/electrician/info`

**请求头**

```
Authorization: Bearer {token}
```

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "elecId": 20001,
    "name": "张师傅",
    "avatar": "https://...",
    "phone": "139****9999",
    "certLevel": 2,
    "certLevelText": "中级电工",
    "rating": 4.8,
    "orderCount": 120,
    "income": 15680.00,
    "status": 1,
    "statusText": "在线接单"
  }
}
```

### 9.2 电工认证

**POST** `/api/electrician/certify`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| name | String | 是 | 真实姓名 |
| idCard | String | 是 | 身份证号 |
| certType | Integer | 是 | 证书类型 |
| certNo | String | 是 | 证书编号 |
| certImages | Array | 是 | 证书照片 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": 0,
    "statusText": "审核中"
  }
}
```

### 9.3 接单开关

**PUT** `/api/electrician/status`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| status | Integer | 是 | 状态(1在线/0离线) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 9.4 任务大厅

**GET** `/api/electrician/hall`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| latitude | Decimal | 否 | 纬度(用于排序) |
| longitude | Decimal | 否 | 经度(用于排序) |
| serviceType | Integer | 否 | 服务类型 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "list": [
      {
        "orderId": 202604010001,
        "serviceName": "电路维修",
        "description": "插座没电",
        "addressText": "浦东新区xxx路1号",
        "distance": 0.5,
        "amount": 50.00,
        "createdAt": "2026-04-01 10:00:00"
      }
    ]
  }
}
```

### 9.5 我的任务

**GET** `/api/electrician/tasks`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| status | Integer | 否 | 任务状态 |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

同订单列表

### 9.6 接单

**POST** `/api/electrician/accept/{orderId}`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 202604010001,
    "status": 20,
    "statusText": "已接单"
  }
}
```

---

## 十、消息模块

### 10.1 消息列表

**GET** `/api/message/list`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| type | Integer | 否 | 消息类型(1系统/2订单/3活动) |
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "list": [
      {
        "id": 1,
        "title": "订单已接单",
        "content": "您的订单已被张师傅接单，预计30分钟后到达",
        "type": 2,
        "typeText": "订单消息",
        "isRead": 0,
        "createdAt": "2026-04-01 10:30:00"
      }
    ]
  }
}
```

### 10.2 未读消息数

**GET** `/api/message/unread-count`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 3,
    "order": 2,
    "system": 1,
    "activity": 0
  }
}
```

### 10.3 标记已读

**PUT** `/api/message/read/{id}`

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 十一、广告模块

> 广告接口不需要登录，但需要deviceId用于统计

### 11.1 获取开屏广告

**GET** `/api/ad/splash`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| deviceId | String | 是 | 设备唯一标识 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "imageUrl": "https://...",
    "videoUrl": "https://...",
    "linkUrl": "https://...",
    "linkType": 1,
    "duration": 5,
    "skipAfter": 3
  }
}
```

**字段说明**

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | Long | 广告ID |
| imageUrl | String | 图片广告URL（图片广告时有效） |
| videoUrl | String | 视频广告URL（视频广告时有效） |
| linkUrl | String | 点击跳转链接 |
| linkType | Integer | 跳转类型(1页面跳转/2外链/3商品详情/4服务预约) |
| duration | Integer | 广告展示时长(秒) |
| skipAfter | Integer | 可跳过时间(秒) |

### 11.2 获取横幅广告列表

**GET** `/api/ad/banner`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| position | String | 是 | 广告位编码(如home_banner) |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 2,
      "title": "春节特惠活动",
      "imageUrl": "https://...",
      "linkUrl": "https://...",
      "linkType": 1
    },
    {
      "id": 3,
      "title": "安全检查服务",
      "imageUrl": "https://...",
      "linkUrl": "https://...",
      "linkType": 4
    }
  ]
}
```

**常见广告位编码**

| 编码 | 位置 |
|-----|------|
| home_banner | 首页顶部横幅 |
| home_popup | 首页弹窗 |
| store_banner | 商城页横幅 |
| service_banner | 服务页横幅 |

### 11.3 广告展示上报

**POST** `/api/ad/{id}/show`

**路径参数**

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | Long | 广告ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| deviceId | String | 是 | 设备唯一标识 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true
  }
}
```

### 11.4 广告点击上报

**POST** `/api/ad/{id}/click`

**路径参数**

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | Long | 广告ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| deviceId | String | 是 | 设备唯一标识 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "linkUrl": "https://...",
    "linkType": 1
  }
}
```

> 点击上报返回跳转链接，由前端处理跳转逻辑

### 11.5 跳转类型枚举

| 值 | 说明 | 前端处理 |
|---|------|---------|
| 1 | 页面跳转 | 跳转App内指定页面 |
| 2 | 外链跳转 | 打开外部浏览器 |
| 3 | 商品详情 | 跳转商品详情页 |
| 4 | 服务预约 | 跳转服务预约页 |

---

## 十二、错误码定义

| 错误码 | 说明 |
|-------|------|
| 10001 | 参数校验失败 |
| 10002 | 手机号格式错误 |
| 10003 | 验证码错误 |
| 20001 | 用户不存在 |
| 20002 | 密码错误 |
| 20003 | 用户已存在 |
| 20004 | Token已过期 |
| 30001 | 订单不存在 |
| 30002 | 订单状态错误 |
| 30003 | 订单已取消 |
| 30004 | 订单已被接单 |
| 40001 | 支付失败 |
| 40002 | 退款失败 |
| 50001 | 服务内部错误 |
| 50002 | 第三方服务异常 |

---

## 十三、接口调用示例

### 13.1 完整下单流程

```
1. 用户登录
   POST /api/user/login
   获取token

2. 获取地址列表
   GET /api/address/list
   选择服务地址

3. 创建订单
   POST /api/order/create
   获取订单ID

4. 发起支付
   POST /api/payment/create
   获取支付参数

5. 支付回调（系统自动处理）
   更新订单状态

6. 电工接单
   POST /api/electrician/accept/{orderId}
   status = 20

7. 开始服务
   POST /api/order/{id}/status
   status = 30

8. 完成服务
   POST /api/order/{id}/status
   status = 40

9. 用户评价
   POST /api/order/{id}/review
   订单结束
```

### 13.2 电工端接单流程

```
1. 电工登录
   POST /api/user/login
   获取token

2. 更新位置
   POST /api/map/location/update
   上报当前位置

3. 开启接单
   PUT /api/electrician/status
   status = 1

4. 浏览任务大厅
   GET /api/electrician/hall
   获取附近订单

5. 接单
   POST /api/electrician/accept/{orderId}
   订单分配

6. 前往服务
   POST /api/order/{id}/status
   status = 30

7. 完成服务
   POST /api/order/{id}/status
   status = 40

8. 查看收入
   GET /api/electrician/info
   查看累计收入
```

---

## 附录：数据字典

### 用户角色(role)

| 值 | 说明 |
|---|------|
| 1 | 普通用户 |
| 2 | 电工 |

### 电工认证等级(certLevel)

| 值 | 说明 |
|---|------|
| 1 | 初级电工 |
| 2 | 中级电工 |
| 3 | 高级电工 |

### 服务类型(serviceType)

| 值 | 说明 |
|---|------|
| 1 | 维修服务 |
| 2 | 安装服务 |
| 3 | 安全检查 |

### 支付渠道(channel)

| 值 | 说明 |
|---|------|
| 1 | 微信支付 |
| 2 | 支付宝 |

---

**未来申活（上海）数字科技有限公司**
**编制日期：2026年4月8日**