# 安电通 (AndianTong) - 智能电路检测平台

安电通是一款专业的电路安全检测服务平台，为用户提供家庭、商业、工业电路检测服务，同时连接认证电工提供上门检测服务。

## 项目架构

本项目采用前后端分离架构：

```
andt-project/
├── frontend/          # Taro 多端前端
├── backend/           # Spring Boot 微服务后端
├── docs/              # 项目文档
└── docker-compose.yml # 完整部署配置
```

## 技术栈

### 前端
- **框架**: Taro 3.6.35 (React 18)
- **UI 组件库**: NutUI React Taro 2.7.0
- **状态管理**: Zustand 4.5
- **样式**: SCSS
- **语言**: TypeScript 5.x

### 后端
- **框架**: Spring Boot 3.2.0
- **语言**: Java 17
- **ORM**: MyBatis-Plus 3.5.7
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **注册中心**: Nacos 2.3
- **容器化**: Docker + Docker Compose

## 模块说明

### 前端模块 (frontend/)
| 目录 | 说明 |
|------|------|
| `src/pages/auth/` | 认证页面（登录、注册、绑定手机） |
| `src/pages/user/` | 用户端页面（首页、检测、订单、个人中心） |
| `src/pages/electrician/` | 电工端页面（任务大厅、我的任务、收入） |
| `src/services/` | API 服务层 |
| `src/store/` | Zustand 状态管理 |

### 后端模块 (backend/)
| 服务 | 端口 | 说明 |
|------|------|------|
| `andt-user` | 8081 | 用户服务（认证、用户信息、地址） |
| `andt-inspection` | 8083 | 检测服务（预约、订单、电工管理） |
| `andt-order` | 8082 | 订单服务（整改订单） |
| `andt-common` | - | 公共模块（工具类、实体基类） |
| `gateway` | 8080 | 网关服务 |

## 快速开始

### 环境要求
- Node.js >= 18
- Java 17
- Maven 3.8+
- MySQL 8.0
- Redis 7

### 1. 克隆仓库

```bash
git clone <仓库地址>
cd andt-project
```

### 2. 启动后端

```bash
cd backend

# 方式一：本地启动（需先安装 MySQL 和 Redis）
mvn clean install
cd andt-user && mvn spring-boot:run
cd andt-inspection && mvn spring-boot:run
cd andt-order && mvn spring-boot:run

# 方式二：Docker 一键启动（推荐）
docker-compose up -d
```

### 3. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 开发模式（H5）
npm run dev:h5

# 开发模式（微信小程序）
npm run dev:weapp

# 构建生产环境
npm run build:h5
npm run build:weapp
```

### 4. 访问应用

- **前端 H5**: http://localhost:3010
- **用户服务 API**: http://localhost:8081
- **检测服务 API**: http://localhost:8083
- **订单服务 API**: http://localhost:8082
- **网关服务**: http://localhost:8080

## 项目规范

- [前端开发规范](frontend/开发规范.md)
- [后端开发规范](backend/开发规范.md)

## 文档

- [产品需求文档](docs/PRD/安电通PRD产品需求文档.md)
- [技术方案](docs/Phase-1技术规划/Phase1_技术方案_V1.0.md)

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
