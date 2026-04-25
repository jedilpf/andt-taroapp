# 安电通企业端API接口文档

> **版本**: v1.0.0  
> **更新日期**: 2026-01-27  
> **Base URL**: `http://localhost:8080/api`

---

## 📋 目录

1. [接口规范](#接口规范)
2. [认证授权](#认证授权)
3. [用户接口](#用户接口)
4. [任务接口](#任务接口)
5. [订单接口](#订单接口)
6. [错误码](#错误码)

---

## 接口规范

### 请求规范

**请求头（Header）：**
```
Content-Type: application/json
Authorization: Bearer {token}  // 需要登录的接口
```

**请求方法：**
- `GET`: 查询数据
- `POST`: 创建数据
- `PUT`: 更新数据
- `DELETE`: 删除数据

### 响应规范

**成功响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 业务数据
  }
}
```

**失败响应：**
```json
{
  "code": 1002,
  "message": "用户不存在",
  "data": null
}
```

**分页响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [...],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 10
  }
}
```

---

## 认证授权

### JWT Token

所有需要登录的接口都需要在Header中携带Token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token有效期：** 7天

**Token刷新：** 调用刷新接口获取新Token

---

## 用户接口

### 1. 用户注册

**接口：** `POST /user/register`

**说明：** 新用户注册

**认证：** ❌ 不需要

**请求参数：**
```json
{
  "phone": "13800138000",
  "code": "1234",
  "role": "USER"  // USER-普通用户 ENTERPRISE-企业用户
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickName": "User_8000",
    "role": "USER",
    "status": 1,
    "createTime": "2026-01-27 10:00:00"
  }
}
```

---

### 2. 用户登录

**接口：** `POST /user/login`

**说明：** 用户登录获取Token

**认证：** ❌ 不需要

**请求参数：**
```json
{
  "phone": "13800138000",
  "code": "1234"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickName": "张三",
      "avatar": "https://...",
      "role": "USER"
    }
  }
}
```

---

### 3. 获取用户信息

**接口：** `GET /user/info`

**说明：** 获取当前登录用户信息

**认证：** ✅ 需要Token

**请求参数：** 无

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickName": "张三",
    "avatar": "https://...",
    "role": "USER",
    "status": 1
  }
}
```

---

### 4. 更新用户信息

**接口：** `PUT /user/update`

**说明：** 更新当前用户信息

**认证：** ✅ 需要Token

**请求参数：**
```json
{
  "nickName": "李四",
  "avatar": "https://..."
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

---

### 5. 修改手机号

**接口：** `POST /user/changePhone`

**说明：** 修改绑定的手机号

**认证：** ✅ 需要Token

**请求参数：**
```json
{
  "newPhone": "13900139000",
  "code": "1234"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

---

## 任务接口

### 1. 任务列表

**接口：** `GET /task/list`

**说明：** 获取任务列表（分页）

**认证：** ✅ 需要Token

**请求参数（Query）：**
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| pageNum | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认10 |
| status | string | 否 | 任务状态 |
| keyword | string | 否 | 关键词搜索 |

**示例：** `GET /task/list?pageNum=1&pageSize=10&status=PENDING`

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "电路检修任务",
        "description": "某小区电路故障需要检修",
        "reward": 100.00,
        "status": "PENDING",
        "publisherId": 10,
        "publisherName": "张师傅",
        "createTime": "2026-01-27 10:00:00"
      }
    ],
    "total": 50,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 5
  }
}
```

---

### 2. 任务详情

**接口：** `GET /task/{id}`

**说明：** 获取任务详情

**认证：** ✅ 需要Token

**路径参数：**
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | long | 任务ID |

**示例：** `GET /task/1`

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "电路检修任务",
    "description": "某小区电路故障需要检修",
    "reward": 100.00,
    "status": "PENDING",
    "publisherId": 10,
    "publisherName": "张师傅",
    "publisherPhone": "138****8000",
    "address": "北京市朝阳区xxx小区",
    "images": ["https://...", "https://..."],
    "createTime": "2026-01-27 10:00:00"
  }
}
```

---

### 3. 发布任务

**接口：** `POST /task/publish`

**说明：** 发布新任务

**认证：** ✅ 需要Token

**请求参数：**
```json
{
  "title": "电路检修任务",
  "description": "某小区电路故障需要检修",
  "reward": 100.00,
  "address": "北京市朝阳区xxx小区",
  "images": ["https://...", "https://..."]
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "电路检修任务",
    "status": "PENDING",
    "createTime": "2026-01-27 10:00:00"
  }
}
```

---

### 4. 接受任务

**接口：** `POST /task/{id}/accept`

**说明：** 接受任务

**认证：** ✅ 需要Token

**路径参数：**
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | long | 任务ID |

**示例：** `POST /task/1/accept`

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

---

### 5. 完成任务

**接口：** `POST /task/{id}/complete`

**说明：** 标记任务完成

**认证：** ✅ 需要Token

**路径参数：**
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | long | 任务ID |

**请求参数：**
```json
{
  "images": ["https://...", "https://..."],  // 完成照片
  "remark": "任务已完成"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

---

## 订单接口

### 1. 创建订单

**接口：** `POST /order/create`

**说明：** 创建订单

**认证：** ✅ 需要Token

**请求参数：**
```json
{
  "taskId": 1,
  "amount": 100.00
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "orderNo": "ORDER202601271000001",
    "amount": 100.00,
    "status": "PENDING",
    "createTime": "2026-01-27 10:00:00"
  }
}
```

---

### 2. 订单列表

**接口：** `GET /order/list`

**说明：** 获取订单列表

**认证：** ✅ 需要Token

**请求参数（Query）：**
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| pageNum | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |
| status | string | 否 | 订单状态 |

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "orderNo": "ORDER202601271000001",
        "amount": 100.00,
        "status": "PAID",
        "createTime": "2026-01-27 10:00:00",
        "payTime": "2026-01-27 10:05:00"
      }
    ],
    "total": 20,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

---

### 3. 订单详情

**接口：** `GET /order/{id}`

**说明：** 获取订单详情

**认证：** ✅ 需要Token

**路径参数：**
| 参数 | 类型 | 说明 |
|-----|------|------|
| id | long | 订单ID |

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "orderNo": "ORDER202601271000001",
    "userId": 1,
    "taskId": 1,
    "amount": 100.00,
    "status": "PAID",
    "createTime": "2026-01-27 10:00:00",
    "payTime": "2026-01-27 10:05:00",
    "task": {
      "title": "电路检修任务",
      "description": "..."
    }
  }
}
```

---

## 错误码

### 系统级错误码

| Code | Message | 说明 |
|------|---------|------|
| 0 | success | 成功 |
| 500 | 系统错误 | 服务器内部错误 |
| 400 | 参数错误 | 请求参数不合法 |

### 业务级错误码

#### 用户相关 (1000-1099)

| Code | Message | 说明 |
|------|---------|------|
| 1001 | 用户不存在 | 用户未注册 |
| 1002 | 用户已存在 | 手机号已注册 |
| 1003 | 验证码错误 | 短信验证码错误 |
| 1004 | 未登录 | Token无效或过期 |
| 1005 | 无权限 | 没有访问权限 |

#### 任务相关 (2000-2099)

| Code | Message | 说明 |
|------|---------|------|
| 2001 | 任务不存在 | 任务ID无效 |
| 2002 | 任务已被接受 | 任务已被其他人接受 |
| 2003 | 不能接受自己的任务 | 发布者不能接受自己的任务 |
| 2004 | 任务状态错误 | 任务当前状态不允许该操作 |

#### 订单相关 (3000-3099)

| Code | Message | 说明 |
|------|---------|------|
| 3001 | 订单不存在 | 订单ID无效 |
| 3002 | 订单已支付 | 不能重复支付 |
| 3003 | 支付失败 | 支付处理失败 |

---

## 接口调用示例

### JavaScript/TypeScript

```typescript
// 登录
const login = async (phone: string, code: string) => {
  const res = await fetch('http://localhost:8080/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, code })
  })
  
  const data = await res.json()
  if (data.code === 0) {
    const token = data.data.token
    // 保存Token
    localStorage.setItem('token', token)
    return data.data
  } else {
    throw new Error(data.message)
  }
}

// 获取任务列表（需要Token）
const getTasks = async () => {
  const token = localStorage.getItem('token')
  
  const res = await fetch('http://localhost:8080/api/task/list?pageNum=1&pageSize=10', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await res.json()
  return data.data
}
```

### cURL

```bash
# 登录
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"1234"}'

# 获取任务列表
curl -X GET "http://localhost:8080/api/task/list?pageNum=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 更新日志

### v1.0.0 (2026-01-27)
- ✅ 用户注册/登录接口
- ✅ 用户信息管理接口
- ✅ 任务CRUD接口
- ✅ 订单创建/查询接口

### 未来计划
- [ ] 实时消息通知
- [ ] 文件上传接口
- [ ] 数据统计接口
- [ ] 支付回调接口

---

**文档维护**: API开发组  
**联系方式**: api-dev@andiantong.com
