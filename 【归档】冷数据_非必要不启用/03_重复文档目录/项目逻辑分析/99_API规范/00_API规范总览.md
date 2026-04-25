# API接口规范总览

## 一、文档说明

| 属性 | 内容 
|------|------
| 文档版本 | v1.0 
| 更新日期 | 2026-03-30 
| 适用范围 | 安电通平台所有API接口 
| 基础URL | `https://api.andiantong.com/v1` 

---

## 二、接口规约

### 2.1 请求规范

#### 请求```
Content-Type: application/json
Authorization: Bearer {access_token}
X-Request-ID: {uuid}          // 请求追踪ID
X-Platform: {mini|h5|admin}   // 请求来源平台
X-Version: {version}          // 客户端版本号
```

#### 请求方法

| 方法 | 用| 示例 
|------|------| 属性 | 接口概览 | 接口名称 |------
| GET | 查询资源 | GET /orders 
| POST | 创建资源 | POST /orders 
| PUT | 全量更新 | PUT /orders/:id 
| PATCH | 部分更新 | PATCH /orders/:id/status 
| DELETE | 删除资源 | DELETE /orders/:id 

### 2.2 响应规范

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 业务数据
  },
  "timestamp": 1705286400000
}
```

#### 分页响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### 错误响应

```json
{
  "code": 1001,
  "message": "用户未登,
  "error": {
    "type": "AUTH_ERROR",
    "details": "Token已过期，请重新登},
  "timestamp": 1705286400000
}
```

### 2.3 错误码规#### 通用错误(1xxx)

| 错误| 错误类型 | 说明 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 1001 | AUTH_ERROR | 未登录或Token失效 
| 1002 | PARAM_ERROR | 参数错误 
| 1003 | PERMISSION_DENIED | 无权限访
| 1004 | RESOURCE_NOT_FOUND | 资源不存
| 1005 | RESOURCE_EXISTS | 资源已存
| 1006 | RATE_LIMIT | 请求频率超限 
| 1007 | SYSTEM_ERROR | 系统错误 

#### 业务错误(2xxx)

| 错误| 错误类型 | 说明 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 2001 | ADDRESS_OUT_OF_SERVICE | 地址不在服务范围 
| 2002 | NO_ELECTRICIAN_AVAILABLE | 暂无可用电工 
| 2003 | ORDER_STATUS_ERROR | 订单状态不允许此操
| 2004 | ORDER_ALREADY_ACCEPTED | 订单已被其他电工接单 
| 2005 | PAYMENT_FAILED | 支付失败 
| 2006 | INSUFFICIENT_POINTS | 积分不足 
| 2007 | COUPON_NOT_AVAILABLE | 优惠券不可用 

#### 电工端错误码 (3xxx)

| 错误| 错误类型 | 说明 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 3001 | ELECTRICIAN_OFFLINE | 电工已下
| 3002 | ELECTRICIAN_BUSY | 电工忙碌
| 3003 | CERTIFICATION_EXPIRED | 资质已过
| 3004 | ORDER_LIMIT_REACHED | 接单数量已达上限 

---

## 三、接口模块划| 模块 | 文档路径 | 说明 
| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 用户认证 | [用户认证API](./01_用户认证API.md) | 登录、注册、Token管理 
| 订单管理 | [订单API](./02_订单API.md) | 订单创建、查询、状态流
| 支付系统 | [支付API](./03_支付API.md) | 支付、退款、账
| 派单系统 | [派单API](./04_派单API.md) | 抢单、派单、电工状
| 积分系统 | [积分API](./05_积分API.md) | 积分获取、消耗、查
| 用户中心 | [用户API](./06_用户API.md) | 用户信息、地址、收
| 电工中心 | [电工API](./07_电工API.md) | 电工信息、评价、资
| 商城系统 | [商城API](./08_商城API.md) | 商品、购物车、订

---

## 四、认证机

### 4.1 Token认证

```
1. 用户登录 获取 access_token + refresh_token
2. 请求携带 access_token
3. access_token 过期 使用 refresh_token 刷新
4. refresh_token 过期 重新登录
```

### 4.2 Token有效| Token类型 | 有效| 存储位置 
| 属性 | 接口概览 | 接口名称 |----------| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |---------
| access_token | 2小时 | 内存 
| refresh_token | 7| 安全存储 

### 4.3 刷新Token

**请求**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "xxx"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 7200
  }
}
```

---

## 五、安全规

### 5.1 请求签名

敏感接口需要签名验证：

```
sign = MD5(appKey + timestamp + nonce + appSecret)
```

### 5.2 敏感数据加密

- 密码：BCrypt加密存储
- 手机号：AES加密传输
- 身份证：AES加密存储

### 5.3 防重放攻```
X-Timestamp: 请求时间戳（5分钟内有效）
X-Nonce: 随机字符串（防重放）
```

---

## 六、接口版本管

### 6.1 版本规则

- URL中包含版本号：`/v1/orders`
- 大版本变更：新增版本路径 `/v2/orders`
- 小版本变更：向后兼容，不改变URL

### 6.2 版本废弃流程

1. 新版本发布，旧版本标记为 deprecated
2. 旧版本响应头添加 `X-API-Deprecated: true`
3. 6个月后下线旧版本

---

## 七、接口限

### 7.1 限流规则

| 接口类型 | 限流策略 | 说明 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 查询接口 | 100分钟 | 普通查
| 写入接口 | 30分钟 | 创建、更
| 敏感接口 | 10分钟 | 支付、提
| 验证| 160| 短信验证

### 7.2 限流响应

```json
{
  "code": 1006,
  "message": "请求频率超限，请稍后重试",
  "error": {
    "type": "RATE_LIMIT",
    "retryAfter": 60
  }
}
```

---

## 八、开发调

### 8.1 测试环境

| 环境 | 基础URL | 说明 
| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |------
| 开发环| `https://dev-api.andiantong.com/v1` | 开发调
| 测试环境 | `https://test-api.andiantong.com/v1` | 测试验证 
| 预发布环| `https://staging-api.andiantong.com/v1` | 预发布验
| 生产环境 | `https://api.andiantong.com/v1` | 正式环境 

### 8.2 接口文档

- Swagger UI: `https://api.andiantong.com/docs`
- Postman Collection: `docs/postman_collection.json`

---

## 九、变更记| 日期 | 版本 | 变更内容 | 变更
|------|------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------
| 2026-03-30 | v1.0 | 初始版本 | - 
