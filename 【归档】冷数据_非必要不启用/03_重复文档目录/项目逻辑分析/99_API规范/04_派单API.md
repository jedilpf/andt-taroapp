# 派单API接口规范

## 一、接口概| 接口名称 | 方法 | 路径 | 说明 | 权限 
| 属性 | 接口概览 | 接口名称 |---------|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| 获取待接单列| GET | /dispatch/orders | 获取可抢单列| 电工 
| 抢单 | POST | /dispatch/orders/:id/accept | 电工抢单 | 电工 
| 电工状态切| PUT | /dispatch/electrician/status | 切换工作状| 电工 
| 电工位置上报 | POST | /dispatch/electrician/location | 上报当前位置 | 电工 
| 派单配置 | GET | /dispatch/config | 获取派单配置 | 电工 
| 系统派单 | POST | /dispatch/orders/:id/assign | 系统指派订单 | 系统 

---

## 二、接口详

### 2.1 获取待接单列**接口说明**
电工获取任务大厅的可抢单列表

**请求**
```http
GET /dispatch/orderspage=1&pageSize=20&sort=distance&radius=5
Authorization: Bearer {token}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| page | int | | 页码，默
| pageSize | int | | 每页数量，默0 
| sort | string | | 排序方式: distance/price/time 
| radius | number | | 筛选半km)，默
| type | string | | 订单类型筛

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
        "urgency": "high",
        "urgencyLabel": "紧,
        "priceEstimate": {
          "min": 50,
          "max": 150
        },
        "location": {
          "address": "浦东软件号楼",
          "distance": 1.2,
          "lat": 31.1940,
          "lng": 121.4360
        },
        "scheduledTime": "尽快",
        "createdAt": 1705286400000,
        "waitingTime": 5,
        "tags": ["紧, "企业订单"]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 8
    },
    "electricianStatus": {
      "workStatus": "online",
      "ongoingOrders": 2,
      "canAccept": true
    }
  }
}
```

---

### 2.2 抢单

**接口说明**
电工抢单操作

**请求**
```http
POST /dispatch/orders/ORD202401150001/accept
Content-Type: application/json
Authorization: Bearer {token}

{
  "estimatedArrival": 15,
  "currentLocation": {
    "lat": 31.1900,
    "lng": 121.4300
  }
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| estimatedArrival | number | | 预计到达时间(分钟) 
| currentLocation | object | | 当前位置 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "status": "Accepted",
    "acceptedAt": 1705286500000,
    "client": {
      "name": "张先,
      "phone": "138****8888",
      "address": "浦东软件号楼602},
    "navigation": {
      "distance": 1.2,
      "duration": 15,
      "routeUrl": "https://map.example.com/route/xxx"
    }
  }
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 2004 | 订单已被其他电工接单 | 刷新列表 
| 3001 | 电工已下| 切换为在线状
| 3002 | 电工忙碌| 完成当前订单后再
| 3004 | 接单数量已达上限 | 休息后再

---

### 2.3 电工状态切**接口说明**
电工切换工作状态（在线/休息**请求**
```http
PUT /dispatch/electrician/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "offline",
  "reason": "午休"
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| status | string | | 状online/offline 
| reason | string | | 切换原因 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "electricianId": "ELE001",
    "status": "offline",
    "updatedAt": 1705287000000,
    "stats": {
      "todayOrders": 5,
      "todayEarnings": 380,
      "onlineDuration": 180
    }
  }
}
```

**状态切换限*

| 当前状| 进行中订| 可切| 说明 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |-----------| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------
| online | 0 | | 可切换为offline 
| online | 1-2 | | 可切换为offline，但会提
| online | | | 必须完成订单后才能休
| offline | 0 | | 可切换为online 

---

### 2.4 电工位置上报

**接口说明**
电工实时上报位置，用于距离计算和轨迹追踪

**请求**
```http
POST /dispatch/electrician/location
Content-Type: application/json
Authorization: Bearer {token}

{
  "lat": 31.1920,
  "lng": 121.4340,
  "accuracy": 10,
  "speed": 5.2,
  "heading": 180,
  "battery": 85
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| lat | number | | 纬度 
| lng | number | | 经度 
| accuracy | number | | 精度(
| speed | number | | 速度(km/h) 
| heading | number | | 方向
| battery | number | | 电量(%) 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updated": true,
    "nearbyOrders": 3,
    "currentOrderId": "ORD202401150001"
  }
}
```

**上报频率**
- 正常状态：0秒上报一- 赶往途中：每10秒上报一- 低电量模式：0秒上报一---

### 2.5 派单配置

**接口说明**
获取电工的派单相关配置信**请求**
```http
GET /dispatch/config
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "serviceRadius": 5,
    "maxOngoingOrders": 3,
    "orderTypes": ["Repair", "Install", "Inspection"],
    "autoDispatch": false,
    "notificationSettings": {
      "newOrder": true,
      "urgentOrder": true,
      "sound": true,
      "vibration": true
    },
    "stats": {
      "totalOrders": 1256,
      "completedOrders": 1200,
      "rating": 4.9,
      "completionRate": 0.98
    }
  }
}
```

---

### 2.6 系统派单

**接口说明**
系统自动派单给最优电工（内部接口**请求**
```http
POST /dispatch/orders/ORD202401150001/assign
Content-Type: application/json
Authorization: Bearer {system_token}

{
  "algorithm": "distance_priority",
  "maxRadius": 5,
  "excludeElectricians": ["ELE002", "ELE003"]
}
```

**派单算法参数**

| 参数 | 说明 | 默认
|------|------| 属性 | 接口概览 | 接口名称 |--------
| algorithm | 派单算法 | distance_priority 
| maxRadius | 最大派单半km) | 5 
| excludeElectricians | 排除的电工ID | [] 

**派单算法说明**

| 算法 | 说明 | 适用场景 
|------|------| 属性 | 接口概览 | 接口名称 |---------
| distance_priority | 距离优先 | 紧急订
| rating_priority | 评分优先 | VIP客户 
| balance_priority | 订单均衡 | 普通订
| skill_match | 技能匹| 专业订单 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD202401150001",
    "assignedElectrician": {
      "electricianId": "ELE001",
      "name": "李师,
      "phone": "139****9999",
      "distance": 1.2,
      "rating": 4.9,
      "matchScore": 95
    },
    "algorithm": "distance_priority",
    "assignedAt": 1705286600000
  }
}
```

---

## 三、派单规则配

### 3.1 派单优先```
派单优先级排序：
1. 距离（权0%越近优先级越2. 评分（权0%评分越高优先级越3. 完单量（权重20%近期完单量均衡分4. 技能匹配（权重10%技能匹配度
```

### 3.2 派单限制

| 限制| 说明 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------
| 最大半| 默认5km，紧急订单可扩大0km 
| 并发接单 | 最多同时进
| 接单间隔 | 同一电工接单间隔分钟 
| 超时处理 | 派单分钟未响应自动转

### 3.3 特殊订单处理

| 订单类型 | 派单策略 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |---------
| 紧急订| 优先派给最近的在线电工 
| 企业订单 | 优先派给认证电工 
| VIP订单 | 优先派给高评分电
| 复杂订单 | 派给技能匹配的电工 

---

## 四、WebSocket实时通信

### 4.1 连接建立

```javascript
const ws = new WebSocket('wss://api.andiantong.com/dispatch/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'Bearer xxx'
  }));
};
```

### 4.2 消息类型

**新订单推*
```json
{
  "type": "new_order",
  "timestamp": 1705286400000,
  "data": {
    "orderId": "ORD202401150001",
    "title": "插座冒火急修",
    "distance": 1.2,
    "priceEstimate": { "min": 50, "max": 150 }
  }
}
```

**订单状态变*
```json
{
  "type": "order_status_changed",
  "timestamp": 1705286500000,
  "data": {
    "orderId": "ORD202401150001",
    "status": "Accepted",
    "electricianId": "ELE001"
  }
}
```

**系统通知**
```json
{
  "type": "system_notification",
  "timestamp": 1705287000000,
  "data": {
    "level": "info",
    "title": "温馨提示",
    "content": "您已连续工作4小时，建议休}
}
```

---

## 五、变更记| 日期 | 版本 | 变更内容 | 变更
|------|------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------
| 2026-03-30 | v1.0 | 初始版本 | - 
