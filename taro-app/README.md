# 安电通 Taro 前端项目

## 项目简介

安电通 Taro 多端应用，支持 H5、微信小程序、京东小程序等平台。

## 技术栈

- **框架**: Taro 3.6.35
- **UI 组件库**: NutUI React Taro 2.7.0
- **状态管理**: Zustand 4.5
- **样式**: SCSS
- **语言**: TypeScript 5.x

## 快速开始

### 1. 安装依赖

```bash
cd taro-app
npm install
```

### 2. 运行开发服务器

```bash
# H5 版本
npm run dev:h5

# 微信小程序版本
npm run dev:weapp

# 京东小程序版本
npm run dev:jd
```

### 3. 构建生产版本

```bash
# H5 版本
npm run build:h5

# 微信小程序版本
npm run build:weapp

# 京东小程序版本
npm run build:jd
```

## 项目结构

```
taro-app/
├── config/                 # Taro 配置
├── src/
│   ├── pages/              # 页面
│   │   ├── auth/           # 认证相关（登录、绑定手机等）
│   │   ├── user/           # 用户端页面
│   │   └── electrician/    # 电工端页面
│   ├── services/           # API 服务
│   ├── store/              # 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── constants/          # 常量配置
│   ├── app.tsx             # 应用入口
│   ├── app.config.ts       # 应用配置
│   └── app.scss            # 全局样式
├── package.json
└── tsconfig.json
```

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 注意事项

1. 首次运行前请确保已安装所有依赖
2. H5 开发服务器默认端口为 10086
3. 微信小程序需要在微信开发者工具中打开
