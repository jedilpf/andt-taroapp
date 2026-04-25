---
name: "ui-design-system"
description: "安电通项目 UI 设计规范系统。Invoke when developing or refactoring Taro + NutUI mobile app pages to ensure premium, native-app-like visual quality."
---

# 安电通 UI 设计规范系统

## 核心原则：告别"地摊风"，打造原生 App 高级感

### 1. 视觉分层（Visual Hierarchy）

#### 背景降噪
- **页面背景**：`#F7F8FA` 浅灰色（降噪）或 `#FFFFFF` 纯白（原生 App 感）
- **品牌色**：`#E60012` 只用于点缀（按钮、图标、装饰条）
- **卡片容器**：白色背景 + 圆角 12PX+ + 柔和阴影

#### 阴影规范
```scss
// 卡片阴影
box-shadow: 0 16PX 40PX rgba(0, 0, 0, 0.06), 0 8PX 16PX rgba(230, 0, 18, 0.04);

// 按钮阴影
box-shadow: 0 8PX 20PX rgba(230, 0, 18, 0.15);

// 红色弥散阴影
box-shadow: 0 10PX 30PX rgba(230, 0, 18, 0.25);
```

---

### 2. 字号规范（Typography）

| 元素 | 字号 | 字重 | 说明 |
|------|------|------|------|
| 品牌标题 | 32PX | 800 | 极粗，有冲击力 |
| 副标题 | 12-14PX | 200-300 | 极细，字间距 4-6PX |
| 卡片标题 | 20-26PX | 600 | 比纯黑高级的深灰 `#111` |
| 正文 | 14-16PX | 400 | 标准阅读字号 |
| 辅助文字 | 12PX | 400 | 协议、提示等 |
| Placeholder | 14PX | 300 | 高级灰 `#C0C4CC` |

**禁止**：30PX 以上的巨型字体

---

### 3. 间距规范（Spacing）

#### 8PX 倍数系统
- 页面外边距：24PX 或 32PX
- 组件间距：8PX、16PX、24PX、32PX、40PX
- 卡片内边距：24PX 16PX 或 40PX 32PX
- 输入框间距：20-24PX 上下

#### 呼吸感原则
- 按钮上边距：40PX+（留出呼吸空间）
- 标题下边距：24-32PX
- 元素之间保持"空气感"

---

### 4. 圆角规范（Border Radius）

| 元素 | 圆角 |
|------|------|
| 大卡片 | 20-24PX |
| 小卡片 | 16PX |
| 按钮 | 22-25PX（全圆角） |
| 输入框 | 8PX |
| 标签/徽章 | 4PX |

---

### 5. 颜色系统（Color System）

```scss
// 品牌色
$brand-primary: #E60012;        // 京东红
$brand-light: #ff6b6b;          // 浅红（渐变用）
$brand-dark: #9e000c;           // 深红（渐变用）

// 背景色
$bg-page: #F7F8FA;              // 页面背景
$bg-card: #FFFFFF;              // 卡片背景
$bg-hover: #F7F8FA;             // 悬停背景

// 文字色
$text-primary: #111111;         // 主标题（比纯黑高级）
$text-secondary: #333333;       // 副标题
$text-tertiary: #666666;        // 正文
$text-quaternary: #999999;      // 辅助文字
$text-placeholder: #C0C4CC;     // Placeholder

// 功能色
$link-blue: #2F5F8F;            // 华为蓝/京东蓝（协议链接）
$wechat-green: #07C160;         // 微信绿
$divider: #EEEEEE;              // 分割线
$border: #F2F2F2;               // 边框
```

---

### 6. 渐变规范（Gradients）

```scss
// 头部背景渐变
background: linear-gradient(160deg, #E60012 0%, #9e000c 100%);

// 按钮渐变
background: linear-gradient(135deg, #ff6b6b 0%, #E60012 100%);

// 遮罩渐变
background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);

// 红色装饰条渐变
background: linear-gradient(180deg, #ff6b6b 0%, #E60012 100%);
```

---

### 7. 移动端适配（Mobile Adaptation）

#### PX 单位规范
- 使用大写 `PX` 防止 Taro 转换（保持固定尺寸）
- 或使用小写 `px` + `pxtransform` 配置

#### 防溢出
```scss
.andiantong-login-page {
  max-width: 100vw;
  overflow-x: hidden;
}
```

#### 防止换行
```scss
white-space: nowrap;  // 标题必须一行显示
```

---

### 8. 设计细节（Design Details）

#### 装饰元素
```scss
// 红色小条（标题装饰）
.card-title::before {
  content: "";
  width: 4PX;
  height: 18PX;
  background: linear-gradient(180deg, #ff6b6b 0%, #E60012 100%);
  border-radius: 4PX;
  margin-right: 12PX;
}

// 右上角装饰圆圈
.brand-header::after {
  content: "";
  position: absolute;
  width: 400PX;
  height: 400PX;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -100PX;
  right: -100PX;
}
```

#### 文字投影（让字浮起来）
```scss
text-shadow: 0 2PX 4PX rgba(0, 0, 0, 0.05);
```

#### 粗细对比
- 标题：800 极粗
- 副标题：200 极细
- 制造视觉层次

---

### 9. 组件规范（Component Guidelines）

#### NutUI 组件使用
```tsx
import { Button, Input, CellGroup, ConfigProvider, Checkbox } from '@nutui/nutui-react-taro';

// 主题配置
const customTheme = {
  nutuiColorPrimary: '#E60012',
  nutuiColorPrimaryLight: '#FFF2F2',
};
```

#### 按钮规范
```tsx
<Button 
  block 
  type='primary' 
  shape='round' 
  className='submit-btn'
>
  立即登录
</Button>
```

```scss
.submit-btn {
  height: 48PX !important;
  font-size: 16PX !important;
  background: linear-gradient(135deg, #ff6b6b 0%, #E60012 100%);
  border: none;
  box-shadow: 0 8PX 20PX rgba(230, 0, 18, 0.15);
  letter-spacing: 4PX;  // 文字拉开
}
```

#### 输入框规范
```tsx
<Input
  name='phone'
  placeholder='请输入手机号'
  type='tel'
  clearable
  className='app-input'
/>
```

```scss
.app-input {
  padding: 20PX 0 !important;
  border-bottom: 1PX solid #F2F2F2;
  
  .nut-input-native {
    font-size: 16PX !important;
    
    &::placeholder {
      color: #C0C4CC !important;
      font-weight: 300;
    }
  }
}
```

#### 验证码按钮
```tsx
<Input
  slotButton={
    <View className='get-code-btn' onClick={handleSendCode}>
      获取验证码
    </View>
  }
/>
```

```scss
.get-code-btn {
  color: #E60012;
  font-size: 14PX;
  padding-left: 16PX;
  border-left: 1PX solid #EEE;
  white-space: nowrap;
}
```

---

### 10. 页面布局模式（Page Layout Patterns）

#### 模式 A：悬浮卡片式（登录页经典）
```
+------------------+
|   品牌 Header    |  <- 红色渐变背景
|   (装饰圆圈)     |
+------------------+
|  +------------+  |
|  |  白色卡片   |  |  <- 悬浮压在背景上
|  |  - 标题     |  |
|  |  - 输入框   |  |
|  |  - 按钮     |  |
|  +------------+  |
+------------------+
```

#### 模式 B：Banner + 卡片式（现代 App）
```
+------------------+
|                  |
|   Banner 图片    |  <- 广告/品牌展示
|   (渐变遮罩)     |
|                  |
+------------------+
|  +------------+  |
|  |  白色卡片   |  |  <- 微微压在 Banner 上
|  |  (顶部圆角) |  |
|  +------------+  |
+------------------+
```

---

### 11. 质感提升 checklist

- [ ] 背景使用浅灰或纯白（降噪）
- [ ] 品牌色只用于点缀（克制）
- [ ] 卡片带圆角和阴影（层次感）
- [ ] 标题和副标题有粗细对比
- [ ] 副标题使用极细字重 + 宽字间距
- [ ] 按钮使用渐变而非纯色
- [ ] 按钮带彩色弥散阴影
- [ ] 输入框有焦点状态反馈
- [ ] 验证码按钮填补右侧空白
- [ ] 协议链接使用蓝色并拉开间距
- [ ] 添加装饰性元素（圆圈、方块）
- [ ] 使用大写 PX 防止尺寸失控
- [ ] 防止文字换行（white-space: nowrap）
- [ ] 防止容器溢出（max-width: 100vw）

---

### 12. 常见反模式（Anti-patterns）

❌ **避免这些**：
1. 全屏红色背景（视觉压力巨大）
2. 30PX+ 的巨型字体
3. 纯黑色文字（使用 `#111` 或 `#333`）
4. 黑色阴影（使用品牌色阴影）
5. 直角边框（使用圆角）
6. 密集排列（留出呼吸空间）
7. 直接使用原生 `<View>` 堆砌（使用 NutUI 组件）
8. 内联样式（使用 SCSS）
9. 小写 px 导致尺寸失控（使用大写 PX）
10. 忽略协议勾选（合规风险）

---

### 13. Taro 配置要点

```typescript
// config/index.ts
const config = {
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  h5: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          designWidth: 375,
          deviceRatio: {
            640: 2.34 / 2,
            750: 1,
            828: 1.81 / 2
          }
        }
      }
    }
  }
};
```

---

### 14. 技术栈（Stack）

- **前端**：Taro 3.6.35 + NutUI 2.7.0 + TypeScript 5.x + Zustand + SCSS
- **后端**：Spring Boot 3.x + MyBatis-Plus
- **样式**：必须使用 SCSS，严禁内联样式
- **组件**：优先使用 NutUI 组件，严禁直接用原生 `<View>` 构建复杂 UI

---

## 使用示例

### 登录页完整示例

```tsx
import { View, Text } from '@tarojs/components';
import { Button, Input, CellGroup, ConfigProvider } from '@nutui/nutui-react-taro';
import './login.scss';

const customTheme = {
  nutuiColorPrimary: '#E60012',
};

const LoginPage = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <View className='andiantong-app-login'>
        {/* Banner 区 */}
        <View className='ad-banner-section'>
          <Image src={bannerUrl} mode='aspectFill' className='banner-img' />
          <View className='brand-overlay'>
            <Text className='title'>安电通</Text>
            <Text className='subtitle'>专业电力安全检测平台</Text>
          </View>
        </View>

        {/* 登录卡片 */}
        <View className='main-login-card'>
          <View className='card-header-title'>欢迎登录</View>
          
          <CellGroup className='form-group'>
            <Input
              name='phone'
              placeholder='请输入手机号'
              type='tel'
              clearable
              className='app-input'
            />
            <Input
              name='code'
              placeholder='请输入验证码'
              type='number'
              className='app-input'
              slotButton={<View className='get-code-btn'>获取验证码</View>}
            />
          </CellGroup>

          <Button block type='primary' shape='round' className='submit-btn'>
            立即登录
          </Button>
        </View>
      </View>
    </ConfigProvider>
  );
};
```

```scss
.andiantong-app-login {
  min-height: 100vh;
  background-color: #FFFFFF;
  overflow-x: hidden;

  .ad-banner-section {
    position: relative;
    height: 280PX;
    
    .banner-img {
      width: 100%;
      height: 100%;
    }

    .brand-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 40PX 24PX 24PX;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
      color: #FFF;

      .title {
        font-size: 32PX;
        font-weight: bold;
        letter-spacing: 2PX;
      }
      .subtitle {
        font-size: 14PX;
        margin-top: 8PX;
        opacity: 0.9;
        letter-spacing: 1PX;
      }
    }
  }

  .main-login-card {
    position: relative;
    margin-top: -20PX;
    background: #FFFFFF;
    border-radius: 24PX 24PX 0 0;
    padding: 40PX 32PX;
    z-index: 10;

    .card-header-title {
      font-size: 26PX;
      font-weight: 600;
      color: #333;
      margin-bottom: 32PX;
    }

    .submit-btn {
      height: 48PX !important;
      font-size: 16PX !important;
      background: linear-gradient(135deg, #ff6b6b 0%, #E60012 100%);
      border: none;
      box-shadow: 0 8PX 20PX rgba(230, 0, 18, 0.15);
    }
  }
}
```

---

## 总结

**核心口诀**：
1. 背景降噪（浅灰/纯白）
2. 品牌克制（只用于点缀）
3. 卡片悬浮（圆角+阴影）
4. 粗细对比（标题粗副标题细）
5. 呼吸留白（8PX倍数间距）
6. 渐变光影（按钮带阴影）
7. 细节装饰（红条+圆圈）
8. 原生质感（大写PX+nowrap）

**目标**：从"网页感"进化到"原生 App 高级感"
