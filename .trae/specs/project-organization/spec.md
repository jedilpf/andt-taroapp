# 安电通项目 - 项目结构与代码规范 Spec

## Why
用户要求整理项目文件并阅读理解项目代码，以便更好地了解项目现状、进行汇报和后续开发。

## What Changes

### 项目概述

**项目名称**: 安电通（AndianTong）
**项目类型**: O2O上门电工服务移动应用
**技术栈**: React 18 + TypeScript + Vite + TailwindCSS + Capacitor

### 项目架构

```
c:\Users\21389\Downloads\andt1\12259\
├── App.tsx                    # 主应用入口
├── package.json               # 依赖配置
├── capacitor.config.json      # Capacitor配置
├── vite.config.ts            # Vite构建配置
│
├── android/                   # Android原生项目（Capacitor包装）
├── components/                # 共享组件
│   ├── AIChatOverlay.tsx     # AI聊天浮窗
│   ├── ErrorBoundary.tsx     # 错误边界
│   └── Shared.tsx            # 共享组件
│
├── context/                   # 全局状态管理
│   └── AppContext.tsx        # 应用上下文
│
├── pages/                    # 页面
│   ├── Auth.tsx              # 认证页面（启动/角色选择/登录）
│   ├── UserApp.tsx           # 用户端路由
│   ├── ElectricianApp.tsx     # 电工端路由
│   ├── MapPage.tsx           # 地图页面
│   │
│   ├── user/                 # 用户端页面
│   │   ├── UserHome.tsx      # 用户首页
│   │   ├── services/         # 服务相关（安检/维修/安装等）
│   │   ├── orders/           # 订单相关
│   │   ├── profile/          # 个人中心
│   │   └── tasks/            # 任务相关
│   │
│   ├── electrician/          # 电工端页面
│   │   ├── hall/             # 任务大厅
│   │   ├── tasks/            # 我的任务
│   │   ├── income/           # 收益管理
│   │   └── profile/          # 电工Profile
│   │
│   └── shared/               # 共享页面
│
├── services/                 # 服务层
│   └── geminiService.ts      # Gemini AI服务
│
├── public/                   # 静态资源
│   ├── assets/               # 图片、视频等
│   └── ...
│
├── 汇报材料/                 # 汇报PPT文档
├── 开发文档/                  # 开发文档
├── doc/                      # 技术文档
└── android/                   # Android原生代码
```

### 核心模块

| 模块 | 说明 |
|------|------|
| **用户端 (UserApp)** | C端用户使用，包含首页、预约服务、订单管理、个人中心 |
| **电工端 (ElectricianApp)** | 电工接单使用，包含任务大厅、我的任务、收益管理 |
| **AI服务 (geminiService)** | Google Gemini AI集成，提供智能诊断功能 |
| **地图服务 (MapPage)** | Leaflet地图，显示附近电工位置 |
| **AI聊天 (AIChatOverlay)** | 全局AI诊断浮窗 |

### 技术特点

1. **双端分离**: 用户端和电工端完全分离，通过路由区分
2. **持久化地图**: 用户端地图作为底层持久存在
3. **AI集成**: 使用Google Gemini进行AI智能诊断
4. **移动优先**: Capacitor打包为原生APP，支持iOS/Android

## Impact

### 现有文档结构
- `/开发文档` - AI工作流、API文档、管理手册
- `/doc` - 前后端开发文档、功能清单
- `/汇报材料` - 投资人汇报PPT（4个文件）

### 代码文件统计
- React组件: 约60+个页面组件
- 服务文件: geminiService.ts
- 上下文: AppContext.tsx
- Android原生: Java代码 + Capacitor配置

## ADDED Requirements

### Requirement: 项目理解
理解安电通项目的完整功能架构和代码组织方式。

#### Scenario: 阅读项目代码
- **WHEN** 需要了解项目结构时
- **THEN** 可通过本文档快速定位文件和理解架构

### Requirement: 汇报材料管理
整理和管理各类汇报演示文档。

#### Scenario: 投资人汇报
- **WHEN** 需要向投资人展示时
- **THEN** 使用 `/汇报材料` 文件夹中的PPT文件
