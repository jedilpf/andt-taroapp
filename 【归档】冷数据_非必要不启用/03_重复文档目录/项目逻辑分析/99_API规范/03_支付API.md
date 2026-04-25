# 支付API接口规范

## 一、接口概| 接口名称 | 方法 | 路径 | 说明 | 权限 
| 属性 | 接口概览 | 接口名称 |---------|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| 创建支付 | POST | /payments | 创建支付订单 | 用户 
| 支付详情 | GET | /payments/:id | 获取支付详情 | 用户 
| 支付回调 | POST | /payments/callback/:channel | 支付渠道回调 | 系统 
| 申请退| POST | /payments/:id/refund | 申请退| 用户/客服 
| 退款详| GET | /payments/:id/refund | 获取退款详| 用户/客服 
| 支付记录 | GET | /payments | 获取支付记录列表 | 用户 

---

## 二、接口详

### 2.1 创建支付

**接口说明**
为已完成订单创建支付订单

**请求**
```http
POST /payments
Content-Type: application/json
Authorization: Bearer {token}

{
  "orderId": "ORD202401150001",
  "amount": 80,
  "pointsToUse": 1000,
  "couponId": "CPN001",
  "paymentMethod": "wechat",
  "returnUrl": "https://app.example.com/order/ORD202401150001"
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| orderId | string | | 订单ID 
| amount | number | | 支付金额（元
| pointsToUse | number | | 使用积分数量 
| couponId | string | | 优惠券ID 
| paymentMethod | string | | 支付方式: wechat/alipay 
| returnUrl | string | | 支付完成跳转地址 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "paymentId": "PAY202401150001",
    "orderId": "ORD202401150001",
    "amount": 80,
    "pointsDeducted": 1000,
    "pointsDeductionAmount": 10,
    "couponDeduction": 0,
    "actualAmount": 70,
    "status": "pending",
    "paymentMethod": "wechat",
    "paymentParams": {
      "appId": "wx1234567890",
      "timeStamp": "1705286400",
      "nonceStr": "abc123",
      "package": "prepay_id=wx2024...",
      "signType": "RSA",
      "paySign": "xxx"
    },
    "expireAt": 1705287000000
  }
}
```

**错误响应**

| 错误| 说明 | 处理建议 
| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |---------
| 2003 | 订单状态不允许支付 | 检查订单状
| 2006 | 积分不足 | 提示积分余额不足 
| 2007 | 优惠券不可用 | 提示优惠券已过期或不满足条件 
| 2005 | 创建支付失败 | 提示稍后重试 

---

### 2.2 支付详情

**请求**
```http
GET /payments/PAY202401150001
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "paymentId": "PAY202401150001",
    "orderId": "ORD202401150001",
    "amount": 80,
    "pointsDeducted": 1000,
    "actualAmount": 70,
    "status": "paid",
    "statusLabel": "支付成功",
    "paymentMethod": "wechat",
    "paymentMethodLabel": "微信支付",
    "transactionId": "WX4200001234567890",
    "paidAt": 1705286500000,
    "createdAt": 1705286400000
  }
}
```

---

### 2.3 支付回调

**接口说明**
支付渠道异步通知接口

**微信支付回调**
```http
POST /payments/callback/wechat
Content-Type: application/json

{
  "appid": "wx1234567890",
  "mch_id": "1234567890",
  "nonce_str": "abc123",
  "sign": "xxx",
  "result_code": "SUCCESS",
  "openid": "oUpF8uMuAJ...",
  "trade_type": "JSAPI",
  "bank_type": "CMC",
  "total_fee": 7000,
  "cash_fee": 7000,
  "transaction_id": "WX4200001234567890",
  "out_trade_no": "PAY202401150001",
  "time_end": "20240115120000"
}
```

**响应**
```json
{
  "code": "SUCCESS",
  "message": "成功"
}
```

**处理流程**
```
1. 验证签名
2. 检查订单状3. 更新支付状4. 更新订单状态为Paid
5. 发放积分奖励
6. 发送支付成功通知
```

---

### 2.4 申请退**接口说明**
用户或客服申请订单退**请求**
```http
POST /payments/PAY202401150001/refund
Content-Type: application/json
Authorization: Bearer {token}

{
  "reason": "服务不满,
  "amount": 70,
  "description": "维修后仍有问题，要求退,
  "images": [
    "https://cdn.example.com/refund1.jpg"
  ]
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------| 属性 | 接口概览 | 接口名称 |------
| reason | string | | 退款原
| amount | number | | 退款金额，不填则全额退
| description | string | | 详细说明 
| images | string[] | | 凭证图片 

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "refundId": "REF202401150001",
    "paymentId": "PAY202401150001",
    "orderId": "ORD202401150001",
    "amount": 70,
    "status": "pending",
    "statusLabel": "待审,
    "createdAt": 1705287000000
  }
}
```

---

### 2.5 退款详**请求**
```http
GET /payments/PAY202401150001/refund
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "refundId": "REF202401150001",
    "paymentId": "PAY202401150001",
    "orderId": "ORD202401150001",
    "amount": 70,
    "status": "success",
    "statusLabel": "退款成,
    "reason": "服务不满,
    "refundChannel": "original",
    "refundTransactionId": "WX4200001234567891",
    "refundedAt": 1705288000000,
    "timeline": [
      {
        "status": "pending",
        "label": "待审,
        "time": 1705287000000,
        "description": "退款申请已提交"
      },
      {
        "status": "approved",
        "label": "已通过",
        "time": 1705287500000,
        "description": "退款申请已通过"
      },
      {
        "status": "success",
        "label": "退款成,
        "time": 1705288000000,
        "description": "退款已原路返回"
      }
    ]
  }
}
```

---

### 2.6 支付记录列表

**请求**
```http
GET /paymentspage=1&pageSize=20&status=paid
Authorization: Bearer {token}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "paymentId": "PAY202401150001",
        "orderId": "ORD202401150001",
        "orderTitle": "插座冒火急修",
        "amount": 80,
        "actualAmount": 70,
        "status": "paid",
        "paymentMethodLabel": "微信支付",
        "paidAt": 1705286500000
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 15
    }
  }
}
```

---

## 三、支付状态说| 状| 英文 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------
| 待支| pending | 支付订单已创
| 支付| processing | 支付处理
| 支付成功 | paid | 支付完成 
| 支付失败 | failed | 支付失败 
| 已关| closed | 超时未支付已关闭 
| 已退| refunded | 已完成退

---

## 四、退款状态说| 状| 英文 | 说明 
|------|------| 属性 | 接口概览 | 接口名称 |------
| 待审| pending | 退款申请待审核 
| 已通过 | approved | 退款申请已通过 
| 处理| processing | 退款处理中 
| 退款成| success | 退款已完成 
| 已拒| rejected | 退款申请被拒绝 
| 已取| cancelled | 用户取消退

---

## 五、积分抵扣规

### 5.1 抵扣计算

```typescript
interface PointsDeduction {
  userPoints: number;        // 用户积分余额
  orderAmount: number;       // 订单金额
  maxDeductionRate: number;  // 最大抵扣比例，默认10%
  minPayment: number;        // 最低支付金额，默认0.01}

function calculateDeduction(config: PointsDeduction) {
  const maxDeductiblePoints = Math.min(
    config.userPoints,
    Math.floor((config.orderAmount * config.maxDeductionRate) * 100)
  );
  
  const deduction = maxDeductiblePoints / 100;
  const actualPayment = Math.max(config.orderAmount - deduction, config.minPayment);
  
  return {
    pointsToUse: maxDeductiblePoints,
    deductionAmount: deduction,
    actualPayment: actualPayment
  };
}
```

### 5.2 抵扣限制

| 规则 | 说明 
|------|------
| 最大抵扣比| 订单金额0% 
| 最低支付金| ¥0.01 
| 积分兑换比例 | 100积分 = ¥1 
| 不可叠加 | 积分抵扣与优惠券不可同时使用 

---

## 六、退款规

### 6.1 可退款条| 订单状| 可退| 说明 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------| 属性 | 接口概览 | 接口名称 |------
| Paid | | 支付后可申请退
| Completed | | 服务完成后可申请退款（7天内
| Cancelled | | 已取消订单不可退

### 6.2 退款金额计```
退款金= 实际支付金额 - 已使用积分抵扣金积分处理：退还已扣除积分，收回已发放积分
```

### 6.3 退款审核流```
用户申请 客服审核 财务审批 执行退通知用户
   24h48h24h1-3工作```

---

## 七、安全措

### 7.1 支付安全

- 支付密码验证（大额支付）
- 短信验证码（首次绑定银行卡）
- 设备指纹验证
- 风控系统实时监测

### 7.2 退款安- 客服审核机制
- 大额退款需财务审批
- 退款频率限- 异常退款预---

## 八、变更记| 日期 | 版本 | 变更内容 | 变更
|------|------| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |--------
| 2026-03-30 | v1.0 | 初始版本 | - 
