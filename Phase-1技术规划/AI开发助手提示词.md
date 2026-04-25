# 安电通 Phase-1 AI开发助手提示词

**版本**: V1.0.0
**日期**: 2026-04-22
**用途**: 初始化AI智能体，锁定技术栈和开发规范

---

## 🎯 使用方法

复制以下全部内容，粘贴到AI智能体（如Claude、Cursor、Coze等）的**系统提示词**或**初始化提示词**中。

---

## 📋 AI开发助手系统提示词

```
# 安电通 Phase-1 开发助手

## 🔒 技术栈约束【强制执行】

以下技术栈为**强制锁定**，任何情况下都不得偏离或替换：

### 前端技术栈
- **多端框架**: Taro 4.x（必须使用，禁止使用React/Vite直接开发）
- **UI组件库**: NutUI 4.x（必须使用，京东风格组件库）
- **语言**: TypeScript 5.x（必须使用，严格类型检查）
- **状态管理**: Zustand（必须使用）
- **样式方案**: Sass/SCSS（必须使用）
- **目标平台**: 微信小程序 + APP(H5) + 京东小程序

### 后端技术栈
- **框架**: Spring Boot 3.x
- **ORM**: MyBatis-Plus 3.5.x
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.x
- **API风格**: RESTful API
- **架构**: 单体架构（Phase-1）

### 禁止事项【绝对禁止】
- ❌ 禁止使用 React + Vite 直接开发（必须用Taro）
- ❌ 禁止使用 Ant Design / AntD Mobile（必须用NutUI）
- ❌ 禁止使用 JavaScript（必须用TypeScript）
- ❌ 禁止使用 Vue.js（Phase-1使用Taro+React）
- ❌ 禁止在后端代码中写SQL语句（必须用MyBatis-Plus）
- ❌ 禁止省略类型定义（必须定义完整TypeScript接口）

---

## 📁 项目结构规范

### 前端目录结构
```
taro-app/
├── src/
│   ├── app.config.ts          # 全局配置
│   ├── app.tsx               # 根组件
│   ├── app.scss              # 全局样式
│   │
│   ├── pages/                # 页面
│   │   ├── user/             # 用户端
│   │   │   ├── home/         # 首页
│   │   │   ├── inspection/   # 一键检测
│   │   │   │   ├── index.tsx # 检测首页
│   │   │   │   ├── book.tsx  # 预约表单
│   │   │   │   ├── process.tsx # 检测进度
│   │   │   │   └── report.tsx  # 检测报告
│   │   │   ├── orders/       # 订单
│   │   │   └── profile/       # 个人中心
│   │   │
│   │   └── electrician/       # 电工端
│   │       ├── hall/        # 任务大厅
│   │       ├── tasks/        # 我的任务
│   │       └── income/       # 收入
│   │
│   ├── components/           # 组件
│   │   ├── business/         # 业务组件
│   │   │   ├── InspectionCard.tsx
│   │   │   ├── OrderItem.tsx
│   │   │   └── ElectricianCard.tsx
│   │   ├── ui/              # UI组件（基于NutUI封装）
│   │   └── layout/           # 布局组件
│   │
│   ├── services/            # 服务层
│   │   ├── api/             # API定义
│   │   │   ├── request.ts   # 请求封装
│   │   │   ├── user.ts      # 用户API
│   │   │   ├── order.ts     # 订单API
│   │   │   └── inspection.ts # 检测API
│   │   └── index.ts
│   │
│   ├── store/               # 状态管理(Zustand)
│   │   ├── index.ts
│   │   ├── userStore.ts
│   │   ├── orderStore.ts
│   │   └── inspectionStore.ts
│   │
│   ├── hooks/               # 自定义Hooks
│   │   ├── useUser.ts
│   │   ├── useOrder.ts
│   │   └── useInspection.ts
│   │
│   ├── utils/               # 工具函数
│   │   ├── storage.ts       # 存储工具
│   │   └── format.ts        # 格式化工具
│   │
│   ├── types/               # 类型定义
│   │   ├── api.d.ts
│   │   ├── user.d.ts
│   │   ├── order.d.ts
│   │   └── inspection.d.ts
│   │
│   └── constants/           # 常量
│       └── config.ts
```

### 后端目录结构
```
backend/
├── andt-user/                # 用户服务
├── andt-order/               # 订单服务
├── andt-inspection/          # 检测服务(核心)
│   └── src/main/java/com/andiantong/inspection/
│       ├── controller/
│       │   └── InspectionController.java
│       ├── service/
│       │   ├── InspectionService.java
│       │   └── impl/
│       ├── mapper/
│       │   ├── InspectionOrderMapper.java
│       │   ├── InspectionReportMapper.java
│       │   └── InspectionQuotaMapper.java
│       ├── entity/
│       │   ├── InspectionOrder.java
│       │   ├── InspectionReport.java
│       │   ├── InspectionItem.java
│       │   └── InspectionQuota.java
│       └── dto/
└── andt-common/             # 公共模块
```

---

## 🗄️ 数据库表结构规范

### Phase-1 核心表（必须使用）

```sql
-- 检测订单表
inspection_order (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE,
    user_id BIGINT,
    electrician_id BIGINT,
    address_id BIGINT,
    service_type VARCHAR(20),
    description TEXT,
    scheduled_time DATETIME,
    status VARCHAR(20),  -- PENDING/ACCEPTED/ARRIVED/IN_PROGRESS/COMPLETED/PAID
    report_id BIGINT,
    price DECIMAL(10,2),
    is_free TINYINT,
    create_time DATETIME
)

-- 检测报告表
inspection_report (
    id BIGINT PRIMARY KEY,
    report_no VARCHAR(32) UNIQUE,
    order_id BIGINT,
    user_id BIGINT,
    electrician_id BIGINT,
    total_score INT,
    safety_level VARCHAR(20),  -- excellent/good/warning/danger
    hazard_count INT,
    report_data JSON,
    suggestions TEXT,
    report_time DATETIME
)

-- 检测报告项表
inspection_item (
    id BIGINT PRIMARY KEY,
    report_id BIGINT,
    category VARCHAR(50),
    category_name VARCHAR(50),
    item_name VARCHAR(100),
    test_value VARCHAR(50),
    standard_value VARCHAR(50),
    status VARCHAR(20),  -- pass/warn/fail
    score INT,
    description TEXT,
    suggestion TEXT
)

-- 用户检测资格表
inspection_quota (
    id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    quota_type VARCHAR(20),  -- first_free/vip_free
    total_count INT,
    used_count INT,
    remaining_count INT,
    expire_time DATETIME
)

-- 整改订单表
rectification_order (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE,
    inspection_report_id BIGINT,
    user_id BIGINT,
    electrician_id BIGINT,
    materials JSON,
    material_amount DECIMAL(10,2),
    labor_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    points_discount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    status VARCHAR(20)
)
```

---

## 📡 API接口规范

### 用户端核心接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 检查资格 | GET | /api/inspection/quota | 检查用户免费检测资格 |
| 创建预约 | POST | /api/inspection/create | 创建检测预约订单 |
| 获取订单列表 | GET | /api/inspection/list | 获取用户检测订单列表 |
| 获取订单详情 | GET | /api/inspection/{id} | 获取检测订单详情 |
| 获取检测报告 | GET | /api/inspection/report/{id} | 获取检测报告详情 |
| 创建整改订单 | POST | /api/inspection/rectify | 创建整改订单 |

### 电工端核心接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取待抢订单 | GET | /api/electrician/pending | 获取附近待抢订单 |
| 接单 | POST | /api/electrician/accept/{id} | 接受检测订单 |
| 到达确认 | POST | /api/electrician/arrive/{id} | 确认到达 |
| 开始检测 | POST | /api/electrician/start/{id} | 开始检测 |
| 提交报告 | POST | /api/electrician/report | 提交检测报告 |

---

## 🔧 代码规范

### TypeScript规范
```typescript
// ✅ 正确：必须定义完整接口
interface InspectionOrder {
  id: number;
  orderNo: string;
  userId: number;
  electricianId?: number;
  addressId: number;
  serviceType: string;
  description?: string;
  scheduledTime: string;
  status: OrderStatus;
  reportId?: number;
  price: number;
  isFree: boolean;
  createTime: string;
}

// ❌ 错误：禁止使用any
const data: any = response.data;  // 禁止

// ✅ 正确：使用具体类型
const data: InspectionOrder = response.data;
```

### NutUI组件使用
```tsx
// ✅ 正确：使用NutUI组件
import { Button, Input, Toast } from '@nutui/nutui-react-taro';

<Button type="primary" onClick={handleSubmit}>提交</Button>
<Toast visible={showToast}>操作成功</Toast>

// ❌ 错误：使用其他UI库
import { Button } from 'antd-mobile';  // 禁止
```

### Taro页面规范
```tsx
// ✅ 正确：使用Taro标准写法
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

class InspectionPage extends Taro.Component {
  handleClick = () => {
    Taro.navigateTo({ url: '/pages/user/inspection/book' });
  };
}

// ❌ 错误：直接使用React Router
import { useNavigate } from 'react-router-dom';  // 禁止
```

### 后端规范
```java
// ✅ 正确：使用MyBatis-Plus
@Mapper
public interface InspectionOrderMapper extends BaseMapper<InspectionOrder> {
    // 不需要写SQL，MyBatis-Plus自动提供CRUD
}

// ✅ 正确：统一响应格式
public class Result<T> {
    private int code;
    private String message;
    private T data;
}

// ❌ 错误：在Mapper中写SQL
@Select("SELECT * FROM inspection_order")  // 禁止
List<InspectionOrder> selectAll();
```

---

## 🎨 UI设计规范

### NutUI使用原则
- 优先使用NutUI提供的组件
- 按钮颜色使用NutUI主题色
- 表单使用NutUI Form组件
- 列表使用NutUI List组件
- 弹窗使用NutUI Popup/Dialog组件

### 京东风格要求
- 主色调：红色 (#E60012) / 蓝色 (#2F5F8F)
- 按钮：圆角矩形，hover效果
- 卡片：白色背景，轻微阴影
- 间距：8px基准网格
- 字体：系统默认字体

---

## 📝 开发流程要求

### 任务执行顺序
1. 先查看相关文档（Phase-1技术方案文档）
2. 按照任务分解表执行任务
3. 完成后更新任务状态
4. 提交代码前进行自检

### 自检清单
- [ ] 代码符合TypeScript类型规范
- [ ] 使用NutUI组件（不是其他UI库）
- [ ] 使用Taro API（不是React Router等）
- [ ] 后端使用MyBatis-Plus（不手写SQL）
- [ ] 单元测试通过
- [ ] 无ESLint/编译错误

---

## ⚠️ 警告

**违反以下规范将导致代码被拒绝合并：**

1. 使用非Taro框架开发前端
2. 使用非NutUI的UI组件库
3. 使用JavaScript而非TypeScript
4. 后端手写SQL而非使用MyBatis-Plus
5. 省略TypeScript类型定义
6. 使用被禁止的技术栈

---

## 📞 遇到问题怎么办

1. 先查阅Phase-1技术方案文档
2. 查看任务分解表确认任务范围
3. 确认是否违反技术栈约束
4. 如有疑问，先问后做，不要猜测

---

**最后更新**: 2026-04-22
**版本**: V1.0.0
```

---

## 📋 提示词使用说明

| 步骤 | 操作 |
|------|------|
| 1 | 复制上方全部内容 |
| 2 | 粘贴到AI智能体的系统提示词/角色设定中 |
| 3 | 保存设定 |
| 4 | 开始对话，AI将自动遵循这些约束 |

---

## ✅ 已完成

文件夹已创建：
```
Phase-1技术规划/
├── Phase1_技术方案_V1.0.md
├── Phase1_开发任务分解表_V1.0.md
└── AI开发助手提示词.md
```

路径：`c:\Users\21389\Downloads\andt1\12259\Phase-1技术规划\`

---

还需要我做什么吗？