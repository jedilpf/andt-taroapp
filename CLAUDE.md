# CLAUDE.md - 安电通项目开发指南

> 本文件为 Claude Code 自动化开发团队的项目配置指南

## 项目概述

**安电通** 是一个社区电力服务移动端应用，连接业主与电工师傅，提供：
- 便民电力服务预约（维修、安装、安检）
- 社区商城购物
- AI智能助手咨询
- 地图定位与电工匹配

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5.x |
| 样式 | Tailwind CSS 3.x |
| 路由 | React Router DOM 6.x |
| 打包 | Capacitor 6.x → Android |
| 地图 | Leaflet + react-leaflet |
| AI | Gemini API (通义千问/DeepSeek/豆包) |

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# Capacitor Android同步
npm run cap sync
```

## 代码规范

### 组件命名
- 页面组件: `XxxPage.tsx` 或 `Xxx.tsx`
- 共享组件: `XxxShared.tsx`
- 路由入口: `XxxApp.tsx`

### 目录结构
- `pages/` — 页面组件
  - `pages/user/` — 用户端页面
  - `pages/electrician/` — 电工端页面
  - `pages/shared/` — 共享页面
- `components/` — 共享UI组件
- `context/` — 全局状态管理
- `services/` — API服务接口

### 状态管理
使用 `AppContext.tsx` 管理全局状态:
- `currentUser`: 用户信息
- `orders`: 订单列表
- `addresses`: 地址管理
- `messages`: 通知消息

### 样式约定
- 使用 Tailwind CSS 类名
- 主色调: `orange-500/600` (公益/活动)
- 辅助色: `indigo-600` (AI助手)、`blue-500` (服务)
- 暗色主题: `slate-900` (数码专区)

## 双端路由

### 用户端 `/user/*`
| 路径 | 页面 |
|------|------|
| `/user/home` | 首页 |
| `/user/store` | 商城 |
| `/user/safety` | 安全页 |
| `/user/profile` | 个人中心 |
| `/user/orders` | 订单列表 |
| `/user/repair` | 维修服务 |
| `/user/install` | 安装服务 |
| `/user/inspection` | 安全检查流程 |
| `/user/map` | 地图页 |
| `/user/community` | 社区论坛 |

### 电工端 `/electrician/*`
| 路径 | 页面 |
|------|------|
| `/electrician/home` | 电工首页 |
| `/electrician/hall` | 任务大厅 |
| `/electrician/tasks` | 我的任务 |
| `/electrician/income` | 收入管理 |
| `/electrician/profile` | 个人中心 |

## Mock数据

项目使用 sessionStorage 模拟后端数据:
- 用户数据: `MOCK_USER` / `MOCK_ELEC`
- 订单数据: `INITIAL_MOCK_ORDERS`
- 地址数据: 默认两条地址记录

## 关键功能模块

### AI智能助手 (`AIChatOverlay.tsx`)
- 支持三种AI模型: 通义千问、DeepSeek、豆包Vision
- 可切换人工客服
- 悬浮球可拖拽定位

### 安全检查流程 (`InspectionFlow.tsx`)
- 基础安检 → 深度安检
- 生成检查报告
- 积分奖励机制

### 订单流程
- 下单 → 支付 → 接单 → 服务 → 验收 → 评价
- 状态枚举: `OrderStatus`

## 开发优先级 (2026 Q1)

1. **用户体系**: 登录/注册/个人中心生产级功能
2. **基础交易闭环**: 浏览-加购-下单流程
3. **首批API联调**: 用户认证、商品列表
4. **多端适配**: 移动端响应式布局验证

## 注意事项

- 项目使用 `HashRouter`，所有路径带 `#` 前缀
- 最大宽度 `max-w-md`，模拟手机屏幕
- 使用 `sessionStorage` 持久化，刷新不清除
- 图片资源在 `public/assets/` 目录