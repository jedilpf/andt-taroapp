# OpenClaw 安装与迁移方案

**未来申活（上海）数字科技有限公司**

---

## 一、方案概述

**目标**：在本地电脑安装测试OpenClaw，验证可行后迁移到生产服务器

| 阶段 | 环境 | 目的 |
|-----|------|------|
| **阶段1** | 本地电脑（Windows） | 安装测试、技能开发 |
| **阶段2** | 生产服务器（Linux） | 正式部署、团队使用 |

---

## 二、本地环境要求

### 2.1 硬件要求

| 项目 | 最低要求 | 推荐配置 |
|-----|---------|---------|
| CPU | 双核 | 四核+ |
| 内存 | 4GB | 8GB+ |
| 硬盘 | 1GB可用 | 5GB+ |
| 网络 | 可访问外网 | 稳定网络 |

### 2.2 软件要求

| 软件 | 版本要求 | 检查命令 |
|-----|---------|---------|
| Node.js | 22.16+（推荐24） | `node --version` |
| npm | 9.0+ | `npm --version` |
| Git | 任意版本 | `git --version` |

### 2.3 操作系统支持

| 系统 | 支持情况 | 备注 |
|-----|---------|------|
| Windows 10/11 | ✅ 支持 | 推荐 WSL2 |
| macOS | ✅ 支持 | 原生支持 |
| Linux | ✅ 支持 | 生产环境推荐 |

---

## 三、阶段1：本地安装测试

### 3.1 Windows环境安装

#### 方式A：原生Windows安装

```bash
# 步骤1：安装Node.js 24
# 下载地址：https://nodejs.org/
# 或使用nvm-windows管理版本

# 步骤2：验证安装
node --version   # 应显示 v24.x.x
npm --version    # 应显示 10.x.x

# 步骤3：安装OpenClaw
npm install -g openclaw@latest

# 步骤4：验证安装
openclaw --version

# 步骤5：初始化配置
openclaw onboard --install-daemon

# 步骤6：配置AI模型
openclaw config set model "gpt-4o"
# 或使用国内API
openclaw config set model "deepseek-chat"
openclaw config set api-key "sk-xxx"
```

#### 方式B：WSL2安装（推荐）

```bash
# 步骤1：进入WSL
wsl

# 步骤2：安装Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# 步骤3：安装OpenClaw
npm install -g openclaw@latest

# 步骤4：初始化
openclaw onboard --install-daemon
```

### 3.2 macOS环境安装

```bash
# 使用Homebrew安装Node.js
brew install node@24

# 或使用nvm
nvm install 24
nvm use 24

# 安装OpenClaw
npm install -g openclaw@latest

# 初始化
openclaw onboard --install-daemon
```

### 3.3 本地测试验证

```bash
# 启动OpenClaw
openclaw start

# 测试基本对话
openclaw chat "你好，请介绍一下你自己"

# 测试Web界面
# 浏览器访问 http://localhost:18789
```

---

## 四、技能开发与测试

### 4.1 创建技能目录

```bash
# 创建工作区
mkdir -p ~/openclaw-skills
cd ~/openclaw-skills

# 创建技能结构
mkdir -p requirement-analyzer
mkdir -p progress-tracker
mkdir -p doc-generator
```

### 4.2 技能文件模板

**requirement-analyzer/SKILL.md**
```yaml
---
name: requirement-analyzer
description: 需求分析智能体，自动解析需求并生成任务分解
version: 1.0.0
author: andiantong
metadata:
  openclaw:
    requires:
      env:
        - GITHUB_TOKEN
      bins:
        - git
        - curl
    primaryEnv: GITHUB_TOKEN
---

# 需求分析智能体

## 角色定义
你是一个专业的需求分析师，帮助团队将需求转化为任务列表。

## 核心能力
1. 需求解析与澄清
2. 任务分解与工时估算
3. 依赖关系识别
4. 风险点分析

## 工作流程

### 输入
用户需求描述，例如：
- "添加用户登录功能"
- "接入微信支付"

### 输出格式
1. **需求理解**
   - 复述需求，确认理解正确

2. **任务分解**
   | 任务ID | 任务名称 | 负责人 | 工时 | 依赖 |
   |-------|---------|-------|-----|-----|
   | T001  | xxx     | 前端  | 2d  | -   |

3. **风险点**
   - 技术风险
   - 业务风险
   - 资源风险

4. **建议优先级**
   - P0/P1/P2

## 工具调用
- 使用GitHub API创建Issue
- 使用数据库查询现有任务
```

### 4.3 本地测试技能

```bash
# 发布技能到本地
cd ~/openclaw-skills
openclaw skill publish requirement-analyzer

# 同步技能
openclaw sync

# 测试技能
openclaw chat "分析需求：添加广告模块"
```

---

## 五、阶段2：迁移到生产服务器

### 5.1 生产服务器要求

| 项目 | 最低配置 | 推荐配置 |
|-----|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 硬盘 | 20GB SSD | 50GB SSD |
| 带宽 | 1Mbps | 5Mbps+ |
| 系统 | Ubuntu 22.04 | Ubuntu 24.04 |

### 5.2 服务器安装步骤

```bash
# SSH登录服务器
ssh user@your-server-ip

# 安装Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2（进程管理）
sudo npm install -g pm2

# 安装OpenClaw
sudo npm install -g openclaw@latest

# 创建运行用户
sudo useradd -m -s /bin/bash openclaw
sudo su - openclaw

# 初始化
openclaw onboard --install-daemon
```

### 5.3 迁移技能

```bash
# 方式1：从本地复制
scp -r ~/openclaw-skills user@server:/home/openclaw/

# 方式2：从Git仓库拉取
git clone https://github.com/andiantong/pm-skills.git
cd pm-skills
openclaw skill publish --all
```

### 5.4 配置生产环境

```bash
# 配置模型
openclaw config set model "gpt-4o"
openclaw config set api-key "sk-prod-xxx"

# 配置Webhook通知
openclaw channel add wechat --webhook "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx"

# 配置数据库连接
openclaw config set database "mysql://user:pass@localhost:3306/andiantong"
```

### 5.5 启动服务

```bash
# 使用PM2启动
pm2 start "openclaw start" --name openclaw

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs openclaw
```

### 5.6 配置Nginx反向代理

```nginx
# /etc/nginx/sites-available/openclaw
server {
    listen 80;
    server_name pm.andiantong.com;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 六、配置文件迁移清单

### 6.1 需要迁移的文件

| 文件/目录 | 位置 | 说明 |
|----------|------|------|
| 配置文件 | ~/.openclaw/config.json | 模型、API配置 |
| 技能目录 | ~/.openclaw/skills/ | 自定义技能 |
| 环境变量 | ~/.openclaw/.env | 敏感信息 |
| 会话数据 | ~/.openclaw/sessions/ | 历史对话（可选） |

### 6.2 迁移命令

```bash
# 打包本地配置
tar -czvf openclaw-backup.tar.gz -C ~ .openclaw

# 上传到服务器
scp openclaw-backup.tar.gz user@server:~/

# 在服务器解压
ssh user@server
tar -xzvf openclaw-backup.tar.gz -C ~
```

---

## 七、验证清单

### 7.1 本地验证

| 检查项 | 命令 | 期望结果 |
|-------|------|---------|
| OpenClaw安装 | `openclaw --version` | 显示版本号 |
| 服务启动 | `openclaw start` | 无报错 |
| Web界面 | 浏览器访问 localhost:18789 | 页面正常 |
| 技能加载 | `openclaw skill list` | 显示技能列表 |
| 基本对话 | `openclaw chat "test"` | 有正常响应 |

### 7.2 生产环境验证

| 检查项 | 命令/操作 | 期望结果 |
|-------|----------|---------|
| 服务运行 | `pm2 status` | online状态 |
| 外部访问 | 浏览器访问域名 | 页面正常 |
| Webhook通知 | 发送测试消息 | 通知送达 |
| 数据库连接 | 执行查询 | 返回数据 |
| 技能执行 | 调用测试技能 | 结果正确 |

---

## 八、成本估算

### 8.1 本地测试阶段

| 项目 | 费用 |
|-----|------|
| 本地电脑 | 已有 |
| OpenClaw | 免费 |
| API测试费用 | 约50元 |
| **小计** | **约50元** |

### 8.2 生产环境阶段

| 项目 | 月费用 |
|-----|-------|
| 云服务器（2核4G） | 约200元 |
| OpenClaw | 免费 |
| OpenAI API | 约500元 |
| 域名+SSL | 约10元 |
| **月合计** | **约710元** |

---

## 九、风险与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|-----|-------|------|---------|
| Node.js版本不兼容 | 低 | 安装失败 | 升级到Node 24 |
| API调用超限 | 中 | 功能不可用 | 设置调用限制、备用模型 |
| 服务崩溃 | 低 | 临时不可用 | PM2自动重启 |
| 数据丢失 | 低 | 配置丢失 | 定期备份配置 |

---

## 十、实施时间表

| 阶段 | 任务 | 预计时间 |
|-----|------|---------|
| 本地安装 | 环境搭建+安装 | 0.5天 |
| 本地测试 | 功能验证+技能开发 | 2天 |
| 服务器部署 | 安装配置+迁移 | 1天 |
| 联调测试 | 集成测试+优化 | 1天 |
| **总计** | | **4.5天** |

---

**未来申活（上海）数字科技有限公司**
**编制日期：2026年4月8日**