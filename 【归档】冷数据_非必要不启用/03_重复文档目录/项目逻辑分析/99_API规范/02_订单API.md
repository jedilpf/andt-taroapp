# 订单API接口规范

## 一、接口概| 接口名称 | 方法 | 路径 | 说明 | 权限 
| 属性 | 接口概览 | 接口名称 |---------|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| 创建订单 | POST | /orders | 创建新订| 用户 
| 订单列表 | GET | /orders | 获取订单列表 | 用户/电工 
| 订单详情 | GET | /orders/:id | 获取订单详情 | 用户/电工 
| 取消订单 | POST | /orders/:id/cancel | 取消订单 | 用户 
| 更新订单状| PATCH | /orders/:id/status | 更新订单状| 电工/系统 
| 订单时间| GET | /orders/:id/timeline | 获取订单时间| 用户/电工 

---

## 二、接口详

### 2.1 创建订单

**接口说明**
用户创建维修、安装、检测等类型订单

**请求**
```http
POST /orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "Repair",
  "title": "插座冒火急修",
  "description": "厨房插座冒火花，有烧焦味,
  "images": [
    "https://cdn.example.com/img1.jpg",
    "https://cdn.example.com/img2.jpg"
  ],
  "location": {
    "lat": 31.1940,
    "lng": 121.4360,
    "address": "上海市浦东新区张江镇",
    "detail": "浦东软件号楼602},
  "contact": {
    "name": "张先,
    "phone": "138****8888",
    "gender": "male"
  },
  "scheduledTime": "尽快",
  "urgency": "high",
  "remark": "家里有老人，请尽快上门"
}
```

**请求参数说明**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| type | string | | 订单类型: Repair/Install/Inspection 
| title | string | | 订单标题，最0字符 
| description | string | | 问题描述，最00字符 
| images | string[] | | 图片URL数组，最
| location | object | | 服务地址 
| location.lat | number | | 纬度 
| location.lng | number | | 经度 
| location.address | string | | 地址描述 
| location.detail | string | | 详细地址 
| contact | object | | 联系人信
| scheduledTime | string | | 预约时间: "尽快" "YYYY-MM-DD HH:mm" 
| urgency | string | | 紧急程high/normal/low 
| remark | string | | 备注信息 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "type": "Repair",
    "title": "插座冒火急修",
    "status": "Pending",
    "priceEstimate": {
      "min": 50,
      "max": 150
    },
    "createdAt": 1705286400000,
    "expectedArrival": "30分钟}
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 1002 | 参数校验失败 | 检查必填字
| 2001 | 地址不在服务范围 | 提示用户更换地址 
| 1001 | 未登| 引导登录 

---

### 2.2 订单列表

**接口说明**
获取当前用户的订单列表（用户端）或电工的任务列表（电工端**请求**
```http
GET /orderspage=1&pageSize=20&status=Pending&type=Repair&sort=createdAt:desc
Authorization: Bearer {token}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| page | int | | 页码，默
| pageSize | int | | 每页数量，默0，最0 
| status | string | | 订单状态筛
| type | string | | 订单类型筛
| sort | string | | 排序字段: createdAt:desc 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "orderId": "ORD202401150001",
        "type": "Repair",
        "typeLabel": "应急维,
        "title": "插座冒火急修",
        "status": "Pending",
        "statusLabel": "待接,
        "priceEstimate": {
          "min": 50,
          "max": 150
        },
        "location": {
          "address": "浦东软件号楼",
          "distance": 1.2
        },
        "scheduledTime": "尽快",
        "createdAt": 1705286400000,
        "electrician": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 35,
      "totalPages": 2
    }
  }
}
```

---

### 2.3 订单详情

**接口说明**
获取订单完整详情信息

**请求**
```http
GET /orders/ORD202401150001
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "type": "Repair",
    "typeLabel": "应急维,
    "title": "插座冒火急修",
    "description": "厨房插座冒火花，有烧焦味,
    "images": [
      "https://cdn.example.com/img1.jpg"
    ],
    "status": "Completed",
    "statusLabel": "已完,
    "location": {
      "lat": 31.1940,
      "lng": 121.4360,
      "address": "上海市浦东新区张江镇",
      "detail": "浦东软件号楼602},
    "contact": {
      "name": "张先,
      "phone": "138****8888"
    },
    "scheduledTime": "尽快",
    "priceEstimate": {
      "min": 50,
      "max": 150
    },
    "finalPrice": {
      "material": 30,
      "labor": 50,
      "trip": 0,
      "total": 80,
      "pointsDeducted": 10,
      "actualPaid": 70
    },
    "client": {
      "userId": "USR001",
      "name": "张先,
      "avatar": "https://cdn.example.com/avatar.jpg",
      "phone": "138****8888"
    },
    "electrician": {
      "electricianId": "ELE001",
      "name": "李师,
      "avatar": "https://cdn.example.com/ele.jpg",
      "phone": "139****9999",
      "rating": 4.9,
      "badges": ["金牌电工", "党员"],
      "completedOrders": 1256
    },
    "timeline": [
      {
        "status": "Pending",
        "label": "待接,
        "time": 1705286400000,
        "description": "订单已创建，等待师傅接单"
      },
      {
        "status": "Accepted",
        "label": "已接,
        "time": 1705286500000,
        "description": "李师傅已接单，正在赶往途中"
      },
      {
        "status": "Arrived",
        "label": "已到,
        "time": 1705288200000,
        "description": "师傅已到达现},
      {
        "status": "In_Progress",
        "label": "施工,
        "time": 1705288300000,
        "description": "师傅正在维修"
      },
      {
        "status": "Completed",
        "label": "已完,
        "time": 1705289400000,
        "description": "维修完成，等待支}
    ],
    "pointsReward": 80,
    "createdAt": 1705286400000,
    "completedAt": 1705289400000,
    "paidAt": 1705289500000
  }
}
```

---

### 2.4 取消订单

**接口说明**
用户取消待接单或已接单状态的订单

**请求**
```http
POST /orders/ORD202401150001/cancel
Content-Type: application/json
Authorization: Bearer {token}

{
  "reason": "不需要维修了",
  "remark": "已经自己修好}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| reason | string | | 取消原因 
| remark | string | | 补充说明 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "status": "Cancelled",
    "cancelledAt": 1705287000000,
    "refundAmount": 0
  }
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 2003 | 订单状态不允许取消 | 提示联系客服 
| 1003 | 无权限取消此订单 | 提示权限问题 

---

### 2.5 更新订单状**接口说明**
电工更新订单状态（到达、开始施工、完成）

**请求**
```http
PATCH /orders/ORD202401150001/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "Arrived",
  "latitude": 31.1940,
  "longitude": 121.4360,
  "remark": "已到达客户指定地}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| status | string | | 目标状Arrived/In_Progress/Completed 
| latitude | number | | 当前纬度（到达时必填
| longitude | number | | 当前经度（到达时必填
| remark | string | | 备注说明 
| completionInfo | object | | 完成信息（Completed时必填） 

**完成信息结构**
```json
{
  "completionInfo": {
    "materialCost": 30,
    "laborCost": 50,
    "tripCost": 0,
    "materials": [
      {
        "name": "五孔插座",
        "quantity": 2,
        "price": 15
      }
    ],
    "photos": [
      "https://cdn.example.com/after1.jpg"
    ],
    "warrantyDays": 90
  }
}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "status": "Arrived",
    "updatedAt": 1705288200000
  }
}
```

---

### 2.6 订单时间**接口说明**
获取订单状态变更历**请求**
```http
GET /orders/ORD202401150001/timeline
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "timeline": [
      {
        "status": "Pending",
        "label": "待接,
        "time": 1705286400000,
        "operator": {
          "type": "user",
          "name": "张先},
        "description": "订单已创},
      {
        "status": "Accepted",
        "label": "已接,
        "time": 1705286500000,
        "operator": {
          "type": "electrician",
          "name": "李师,
          "electricianId": "ELE001"
        },
        "description": "李师傅已接单"
      }
    ]
  }
}
```

---

## 三、订单状态流转规```
┌─────────────────────────────────────────────────────────────订单状态流转规├─────────────────────────────────────────────────────────────Pending ──────Accepted ──────Arrived ──────In_Progress ───Completed     Cancelled    Cancelled            Paid       (用户)       (客服)              Cancelled                        (争议)                          └─────────────────────────────────────────────────────────────状态流转权限：
- Pending Cancelled: 用户、系超时)
- Pending Accepted: 电工(抢单)
- Accepted Arrived: 电工
- Accepted Cancelled: 客服(需审核)
- Arrived In_Progress: 电工
- In_Progress Completed: 电工
- Completed Paid: 用户(支付)
- Completed Cancelled: 客服(争议处理)
```

---

## 四、Webhook通知

### 4.1 订单状态变更通知

**触发时机**
订单状态发生变更时，向相关方推送通知

**推送地址**
- 用户端：`POST https://user-app.example.com/webhook/order`
- 电工端：`POST https://electrician-app.example.com/webhook/order`

**推送数*
```json
{
  "event": "order.status_changed",
  "timestamp": 1705286500000,
  "data": {
    "orderId": "ORD202401150001",
    "previousStatus": "Pending",
    "currentStatus": "Accepted",
    "electrician": {
      "electricianId": "ELE001",
      "name": "李师,
      "phone": "139****9999"
    }
  }
}
```

---

## 五、变更记| 日期 | 版本 | 变更内容 | 变更
|------|------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------
| 2026-03-30 | v1.0 | 初始版本 | - 
