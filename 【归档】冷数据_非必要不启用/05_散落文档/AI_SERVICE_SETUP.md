# AI 服务配置指南

本文档说明如何配置和使用安电通项目的 AI 服务（支持 DeepSeek 和通义千问）。

## 📋 目录

1. [获取 API 密钥](#获取-api-密钥)
2. [配置环境变量](#配置环境变量)
3. [切换 AI 提供商](#切换-ai-提供商)
4. [功能说明](#功能说明)
5. [故障排查](#故障排查)

---

## 🔑 获取 API 密钥

### DeepSeek API Key

1. 访问 DeepSeek 开放平台：https://platform.deepseek.com/
2. 注册/登录账号
3. 进入「API 密钥管理」页面
4. 点击「创建 API 密钥」
5. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxx`）

**价格参考**（以官方为准）：
- 输入：¥1.00 / 百万 tokens
- 输出：¥2.00 / 百万 tokens

### 通义千问 API Key

1. 访问阿里云百炼平台：https://dashscope.console.aliyun.com/
2. 注册/登录阿里云账号
3. 开通「通义千问」服务
4. 进入「API-KEY 管理」页面
5. 点击「创建新的 API-KEY」
6. 复制生成的 API Key

**价格参考**（以官方为准）：
- Qwen-Turbo: ¥0.002 / 千 tokens
- Qwen-Plus: ¥0.004 / 千 tokens

---

## ⚙️ 配置环境变量

### 1. 复制环境变量文件

在项目根目录找到 `.env.local` 文件。

### 2. 编辑配置

打开 `.env.local`，根据你的需求修改配置：

```bash
# AI 服务提供商配置
# 可选值：deepseek, qwen, local
AI_PROVIDER=deepseek

# AI API 密钥（根据选择的提供商填写对应的 Key）
AI_API_KEY=你的_API_KEY_在这里
```

### 3. 配置示例

**使用 DeepSeek：**
```bash
AI_PROVIDER=deepseek
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

**使用通义千问：**
```bash
AI_PROVIDER=qwen
AI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

**使用本地模式（无需 API Key）：**
```bash
AI_PROVIDER=local
# AI_API_KEY 留空即可
```

---

## 🔄 切换 AI 提供商

### 方法一：修改配置文件

直接编辑 `.env.local` 文件中的 `AI_PROVIDER` 值：

```bash
# 从 DeepSeek 切换到通义千问
AI_PROVIDER=qwen
```

**注意**：修改后需要重启开发服务器才能生效。

### 方法二：在应用中切换（AI Chat Overlay）

在 AI 聊天界面中，可以通过顶部模型选择器实时切换：

- **通义千问**：通用问答、生活百科
- **DeepSeek 满血版**：逻辑推理、复杂问题
- **豆包 Vision**：创意生活、视觉识别（模拟）

---

## 📱 功能说明

### 1. 电路故障智能诊断

**入口**：用户端 → 电路急修 → AI 智能诊断

**功能**：
- 用户描述故障现象（如"厨房插座冒火花"）
- AI 分析故障原因
- 提供 3 步建议：安全警告、可能原因、建议服务类型
- 支持一键下单

**代码位置**：
- 前端：`pages/user/UserFunctions.tsx` - `RepairPage`
- 服务：`services/geminiService.ts` - `analyzeElectricalIssue()`

### 2. AI 聊天机器人

**入口**：右下角 AI 助手悬浮按钮

**功能**：
- 多模型切换（通义千问/DeepSeek/豆包）
- 支持对话历史
- 根据用户角色调整回答风格（用户/电工）
- 可切换人工客服

**代码位置**：
- 组件：`components/AIChatOverlay.tsx`
- 服务：`services/geminiService.ts` - `chatWithBot()`

### 3. 本地知识库（离线模式）

当 API Key 缺失或网络故障时，自动切换到本地规则匹配：

**支持的关键词**：
- 跳闸 → 负载过大/短路诊断
- 冒烟 → 安全警告 + 过热诊断
- 火花 → 接触不良诊断
- 灯 → 电压不稳/老化诊断
- 安装 → 服务介绍
- 价格 → 收费标准说明

---

## 🐛 故障排查

### 问题 1：AI 无响应，始终显示本地回复

**可能原因**：
1. API Key 配置错误
2. API Provider 配置错误
3. 网络连接问题

**解决方法**：
```bash
# 1. 检查 .env.local 配置
AI_PROVIDER=deepseek  # 或 qwen
AI_API_KEY=正确的_API_KEY

# 2. 查看浏览器控制台日志
# 应该能看到类似：
# "AI API Key is missing for deepseek. Using local mode."
```

### 问题 2：API 调用失败

**错误示例**：
```
DeepSeek API error: 401
Qwen API error: 400
```

**解决方法**：
1. 检查 API Key 是否正确（无多余空格）
2. 确认 API Key 未过期
3. 检查账户余额是否充足
4. 查看 API 服务商的状态页面

### 问题 3：修改配置后不生效

**解决方法**：
```bash
# 1. 停止开发服务器
# Ctrl + C

# 2. 清除缓存
rm -rf node_modules/.vite

# 3. 重新启动
npm run dev
```

### 问题 4：TypeScript 类型错误

如果遇到类型不匹配错误，检查 `chatWithBot` 函数的调用：

```typescript
// 正确的调用方式
const history = [
  { role: 'user', content: '你好' },
  { role: 'assistant', content: '您好！有什么可以帮您？' }
];

const response = await chatWithBot(history, '新问题', 'USER', 'deepseek');
```

---

## 📊 性能对比

| 模型 | 响应速度 | 电路专业知识 | 通用知识 | 价格 |
|------|---------|-------------|---------|------|
| **DeepSeek-V3** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 |
| **通义千问** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 低 |
| **本地知识库** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | 免费 |

**推荐配置**：
- 生产环境：`AI_PROVIDER=deepseek`（专业度高）
- 开发测试：`AI_PROVIDER=qwen`（成本低）
- 演示模式：`AI_PROVIDER=local`（零成本）

---

## 🔒 安全建议

1. **不要提交 API Key 到代码仓库**
   - `.env.local` 已添加到 `.gitignore`
   - 使用环境变量而非硬编码

2. **设置 API 消费限额**
   - DeepSeek：在开放平台设置每日预算
   - 通义千问：在阿里云设置月度预算

3. **监控使用情况**
   - 定期检查 API 调用日志
   - 发现异常及时更换 API Key

---

## 📞 技术支持

如有问题，请联系：
- 邮箱：support@andiantong.com
- 文档：`doc/` 目录下的开发文档

---

**最后更新**: 2026-02-28  
**维护团队**: 安电通技术团队
