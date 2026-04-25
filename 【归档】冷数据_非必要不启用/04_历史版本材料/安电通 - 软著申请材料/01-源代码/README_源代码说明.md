# 安电通上门电工服务系统 - 源代码目录说明

## 📁 目录结构

```
安电通-软著申请材料/01-源代码/
├── App.tsx                      # 应用根组件
├── index.html                   # HTML 入口文件
├── package.json                 # 项目依赖配置
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts              # Vite 构建配置
├── README.md                    # 项目说明文档
├── metadata.json                # 项目元数据
│
├── pages/                       # 页面组件目录（76 个文件）
│   ├── Auth.tsx                # 登录/注册页面
│   ├── UserApp.tsx             # 用户端主页
│   ├── ElectricianApp.tsx      # 电工端主页
│   ├── MapPage.tsx             # 地图找人页面
│   ├── user/                   # 用户端页面（50+ 文件）
│   │   ├── UserFunctions.tsx   # 功能页面（含 AI 诊断）
│   │   ├── UserHome.tsx        # 用户首页
│   │   ├── orders/             # 订单相关页面
│   │   ├── profile/            # 个人中心页面
│   │   ├── services/           # 服务页面
│   │   ├── store/              # 商城页面
│   │   ├── community/          # 社区页面
│   │   └── tasks/              # 任务页面
│   ├── electrician/            # 电工端页面（10+ 文件）
│   │   ├── hall/               # 任务大厅
│   │   ├── income/             # 收益管理
│   │   ├── profile/            # 电工资料
│   │   └── tasks/              # 任务管理
│   └── shared/                 # 共享页面
│       ├── IdentityVerify.tsx  # 实名认证
│       └── MessageCenter.tsx   # 消息中心
│
├── components/                  # 公共组件目录（4 个文件）
│   ├── AIChatOverlay.tsx       # AI 聊天机器人组件
│   ├── ErrorBoundary.tsx       # 错误边界组件
│   ├── Shared.tsx              # 共享组件
│   └── user/                   # 用户端组件
│
├── context/                     # 上下文状态管理（1 个文件）
│   └── AppContext.tsx          # 全局状态上下文
│
├── services/                    # 服务层（1 个文件）
│   └── geminiService.ts        # AI 服务（支持 DeepSeek/通义千问）
│
└── assets/                      # 静态资源目录（69 个文件）
    ├── avatars/                # 头像图片
    ├── products/               # 产品图片
    ├── store/                  # 商城图片
    └── videos/                 # 视频文件
```

## 📊 代码统计

| 类别 | 文件数 | 说明 |
|------|--------|------|
| **页面组件** | 76 | 覆盖用户端和电工端所有功能页面 |
| **公共组件** | 4 | 可复用的 UI 组件 |
| **状态管理** | 1 | 全局状态上下文 |
| **服务层** | 1 | AI 服务、API 调用 |
| **静态资源** | 69 | 图片、视频资源 |
| **配置文件** | 6 | 项目配置元数据 |
| **总计** | 157 | 完整的前端应用代码 |

## 🎯 核心功能模块

### 1. 用户端功能模块
- **AI 智能诊断**: `pages/user/UserFunctions.tsx` - RepairPage 组件
- **电路急修**: `pages/user/services/Repair.tsx`
- **深度体检**: `pages/user/services/DeepInspection.tsx`
- **上门安装**: `pages/user/services/Install.tsx`
- **订单管理**: `pages/user/orders/Orders.tsx`
- **个人中心**: `pages/user/profile/UserProfile.tsx`
- **社区互动**: `pages/user/community/Community.tsx`
- **积分商城**: `pages/user/PointsMall.tsx`
- **会员中心**: `pages/user/profile/UserMemberCenter.tsx`

### 2. 电工端功能模块
- **任务大厅**: `pages/electrician/hall/TaskHall.tsx`
- **我的任务**: `pages/electrician/tasks/MyTasks.tsx`
- **收益管理**: `pages/electrician/income/Income.tsx`
- **电工资料**: `pages/electrician/profile/ElecProfile.tsx`
- **技能管理**: `pages/electrician/profile/ElecSkills.tsx`
- **服务范围**: `pages/electrician/profile/ElecServiceArea.tsx`

### 3. AI 服务模块
- **AI 聊天机器人**: `components/AIChatOverlay.tsx`
- **电路故障诊断**: `services/geminiService.ts` - analyzeElectricalIssue()
- **多模型支持**: DeepSeek、通义千问、豆包

### 4. 状态管理模块
- **全局状态**: `context/AppContext.tsx`
- **订单状态机**: PENDING → ACCEPTED → ARRIVED → IN_PROGRESS → COMPLETED
- **用户认证**: 登录状态、角色管理

## 🔧 技术栈

- **框架**: React 18.3.1 + TypeScript
- **构建工具**: Vite 5.4.21
- **移动端**: Capacitor 6.2.1
- **路由**: React Router DOM 6.22.0
- **图标**: Lucide React 0.344.0
- **状态管理**: Context API + Zustand
- **AI 服务**: DeepSeek API / 通义千问 API

## 📝 代码特点

1. **完全 TypeScript 化**: 所有代码文件均为.tsx 或.ts 后缀，类型安全
2. **组件化设计**: 页面、组件、服务分层清晰
3. **模块化组织**: 按功能模块划分目录结构
4. **响应式设计**: 移动端优先，适配多种屏幕尺寸
5. **AI 集成**: 原生集成 AI 服务，支持多模型切换

## ⚠️ 注意事项

1. 本源代码不包含 `node_modules` 目录（依赖包通过 package.json 安装）
2. 本源代码不包含 `.git` 目录（版本控制元数据）
3. 环境变量文件 `.env.local` 需单独配置（含 API Key）
4. 静态资源已包含在 assets 目录中

---

**软件名称**: 安电通上门电工服务系统  
**版本号**: V1.0  
**著作权人**: 米枫网络科技  
**生成日期**: 2026-02-28
