<div align="center">
<img width="1200" height="475" alt="安电通" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 安电通上门电工服务系统

基于 AI 智能诊断的 O2O 电工服务平台

## 功能特点

- **AI 智能诊断**：基于 DeepSeek/通义千问的电路故障智能分析
- **地图找人**：实时查看附近电工位置，一键预约
- **双端协同**：用户端 + 电工端，数据实时同步
- **订单追踪**：8 状态订单生命周期管理，全程透明
- **公益模式**：免费上门检测，关爱特殊群体

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **移动端**：Capacitor 6
- **UI 组件**：Tailwind CSS + Lucide Icons
- **地图服务**：Leaflet
- **AI 服务**：DeepSeek API / 通义千问 API

## 运行环境

**前提条件**：Node.js 18+

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```bash
# AI 服务提供商配置
# 可选值：deepseek, qwen, local
AI_PROVIDER=deepseek

# AI API 密钥
AI_API_KEY=your_api_key_here
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 打包为移动应用

```bash
# 同步 Capacitor
npx cap sync

# 添加 Android 平台
npx cap add android

# 打开 Android Studio
npx cap open android
```

## 项目结构

```
├── pages/              # 页面组件
│   ├── user/          # 用户端页面
│   ├── electrician/   # 电工端页面
│   └── shared/        # 共享页面
├── components/        # 公共组件
├── context/           # 状态管理
├── services/          # 服务层
└── assets/            # 静态资源
```

## 核心功能

### 用户端
- AI 智能诊断：输入故障描述，获取专业建议
- 电路急修：一键下单，快速响应
- 深度体检：全屋电路安全检测
- 上门安装：灯具、开关、浴霸安装
- 订单管理：实时追踪订单状态
- 积分商城：积分兑换商品和服务

### 电工端
- 任务大厅：查看附近可接订单
- 我的任务：管理已接订单
- 收益管理：查看收入统计
- 技能管理：管理个人技能标签

## 版权信息

Copyright © 2026 米枫网络科技. All rights reserved.

本软件为原创开发，受中华人民共和国著作权法保护。
