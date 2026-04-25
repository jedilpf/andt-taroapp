---
name: "prd-logic-writer"
description: "生成标准化的PRD逻辑文档，包含HTML侧边目录布局。Invoke when user needs to create functional logic analysis documents with HTML sidebar navigation."
---

# PRD 逻辑文档生成器

本Skill用于为项目模块生成标准化的功能逻辑文档，遵循PRD规范，并输出为带侧边目录导航的HTML格式。

## 核心特点

1. **HTML侧边目录** - 固定左侧导航栏，支持章节跳转和滚动联动
2. **PRD标准化结构** - 遵循大厂PRD规范，包含完整的8步法则
3. **代码参考** - 自动分析Demo代码，提取业务逻辑
4. **问题解决方案** - 所有待确认问题必须提供详细解决方案

## 文档输出结构

### HTML布局模板

生成的HTML应包含以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{模块名称} 功能逻辑</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f7fa;
        }
        .layout { display: flex; min-height: 100vh; }
        .sidebar {
            width: 280px;
            background: white;
            border-right: 1px solid #e5e7eb;
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            overflow-y: auto;
            z-index: 100;
            box-shadow: 2px 0 8px rgba(0,0,0,0.05);
        }
        .sidebar-header {
            padding: 24px 20px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
        }
        .sidebar-header h1 {
            font-size: 18px;
            font-weight: 600;
            border: none;
            padding: 0;
            margin: 0;
            line-height: 1.4;
        }
        .sidebar-toc { padding: 16px 0; }
        .sidebar-toc .section-title {
            font-size: 11px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 20px;
        }
        .sidebar-toc a {
            display: block;
            padding: 10px 20px;
            color: #4b5563;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }
        .sidebar-toc a:hover {
            background: #f3f4f6;
            color: #3b82f6;
        }
        .sidebar-toc a.active {
            background: #eff6ff;
            color: #3b82f6;
            border-left-color: #3b82f6;
            font-weight: 500;
        }
        .sidebar-toc a .section-num {
            display: inline-block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: #e5e7eb;
            border-radius: 6px;
            font-size: 12px;
            margin-right: 10px;
            color: #6b7280;
        }
        .sidebar-toc a.active .section-num {
            background: #3b82f6;
            color: white;
        }
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 40px 60px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 48px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        h1 { font-size: 32px; color: #1a1a1a; border-bottom: 3px solid #3b82f6; padding-bottom: 16px; margin-bottom: 32px; }
        h2 { font-size: 24px; color: #1a1a1a; margin-top: 48px; margin-bottom: 20px; padding-left: 12px; border-left: 4px solid #3b82f6; scroll-margin-top: 20px; }
        h3 { font-size: 20px; color: #2c3e50; margin-top: 32px; margin-bottom: 16px; }
        h4 { font-size: 18px; color: #34495e; margin-top: 24px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; color: #e91e63; }
        pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'Monaco', 'Menlo', monospace; }
        pre code { background: none; padding: 0; color: #e2e8f0; }
        .keyword { color: #c792ea; }
        .string { color: #c3e88d; }
        .comment { color: #676e95; }
        .function { color: #82aaff; }
        .number { color: #f78c6c; }
        ul, ol { margin: 16px 0; padding-left: 32px; }
        li { margin: 8px 0; }
        .tree {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
            line-height: 1.8;
            white-space: pre-wrap;
            overflow-x: auto;
        }
        hr { border: none; border-top: 2px solid #e5e7eb; margin: 40px 0; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 8px; }
        .badge-p0 { background: #fef2f2; color: #dc2626; }
        .badge-p1 { background: #fef3c7; color: #d97706; }
        .badge-p2 { background: #dbeafe; color: #2563eb; }
        .back-to-top {
            position: fixed;
            bottom: 30px; right: 30px;
            width: 48px; height: 48px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(59,130,246,0.4);
            transition: all 0.3s;
            opacity: 0;
            visibility: hidden;
        }
        .back-to-top.visible { opacity: 1; visibility: visible; }
        .back-to-top:hover { background: #2563eb; transform: translateY(-2px); }
        @media (max-width: 1024px) {
            .sidebar { width: 240px; }
            .main-content { margin-left: 240px; padding: 30px 40px; }
        }
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 20px; }
            .container { padding: 24px; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="layout">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>{模块编号}_{模块名称}</h1>
                <div class="subtitle">功能逻辑文档</div>
            </div>
            <nav class="sidebar-toc">
                <div class="section-title">目录导航</div>
                <a href="#section-1" class="active"><span class="section-num">1</span>模块概述</a>
                <a href="#section-2"><span class="section-num">2</span>页面结构总览</a>
                <a href="#section-3"><span class="section-num">3</span>功能单元详解</a>
                <a href="#section-4"><span class="section-num">4</span>数据依赖分析</a>
                <a href="#section-5"><span class="section-num">5</span>异常场景处理</a>
                <a href="#section-6"><span class="section-num">6</span>模块调用关系</a>
                <a href="#section-7"><span class="section-num">7</span>Phase-1开发建议</a>
                <a href="#section-8"><span class="section-num">8</span>文件清单</a>
                <a href="#section-9"><span class="section-num">9</span>待确认问题</a>
            </nav>
        </aside>

        <main class="main-content">
            <div class="container">
                <h1>{模块编号}_{模块名称} 功能逻辑</h1>

                <h2 id="section-1">一、模块概述</h2>
                <!-- 模块基本信息表格 -->

                <h2 id="section-2">二、页面结构总览</h2>
                <!-- 树形结构图 -->

                <h2 id="section-3">三、功能单元详解</h2>
                <!-- 功能单元详细分析 -->

                <h2 id="section-4">四、数据依赖分析</h2>
                <!-- 静态数据和API依赖 -->

                <h2 id="section-5">五、异常场景处理</h2>
                <!-- 异常场景表格 -->

                <h2 id="section-6">六、模块调用关系</h2>
                <!-- 模块间调用关系 -->

                <h2 id="section-7">七、Phase-1开发建议</h2>
                <!-- 开发优先级和建议 -->

                <h2 id="section-8">八、文件清单</h2>
                <!-- 相关文件列表 -->

                <h2 id="section-9">九、待确认问题</h2>
                <!-- 待确认问题及详细解决方案 -->
            </div>
        </main>
    </div>

    <script>
        // 侧边栏导航交互
        const sidebarLinks = document.querySelectorAll('.sidebar-toc a');
        const sections = document.querySelectorAll('h2[id]');

        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // 返回顶部按钮
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function() {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    </script>
</body>
</html>
```

## PRD文档标准章节

### 1. 模块概述
| 字段 | 内容 |
|------|------|
| 模块名称 | {模块名称} |
| 对应文件 | `pages/{path}.tsx` |
| 模块类型 | 展示型/交互型/业务流程型 |
| Phase-1优先级 | **P0/P1/P2** |
| 依赖模块 | {依赖模块列表} |

### 2. 页面结构总览
用树形结构展示页面组成：
```
模块名
├── 1. 子模块1
├── 2. 子模块2
└── 3. 子模块3
```

### 3. 功能单元详解
每个功能单元分析以下维度：
- **触发条件**: 什么操作激活这个功能
- **数据来源**: 静态数据还是动态API
- **业务规则**: 用表格列出所有规则
- **页面跳转**: 用流程图展示页面流转
- **Demo现状**: 当前是静态还是动态

### 4. 数据依赖分析
- **静态数据**: Demo中的hardcode数据
- **待接入API**: API接口清单

### 5. 异常场景处理
| 场景 | 处理方式 | 优先级 |
|------|---------|--------|
| xxx | xxx | P0 |

### 6. 模块调用关系
```
本模块
├── → 调用 模块A
├── → 触发 事件X
└── → 接收 模块B的数据
```

### 7. Phase-1开发建议
| 功能 | 说明 | 优先级 |
|------|------|--------|
| xxx | xxx | P0 |

### 8. 文件清单
| 文件路径 | 作用 | 现状 |
|---------|------|------|
| `pages/xxx.tsx` | xxx | 已完成/待开发 |

### 9. 待确认问题（必须提供解决方案）

**重要：每个问题必须包含以下内容：**

1. **Phase-1方案（简化版）**: 快速上线的简化方案
2. **Phase-2方案（完整版）**: 完整功能的详细方案
3. **技术实现**: 具体的代码示例
4. **API接口**: 需要的接口定义

## 文档输出位置

生成的HTML文档应保存到：`项目逻辑分析/{目录}/{模块名}功能逻辑.html`

## 使用示例

用户说："帮我写应急维修模块的PRD"

执行步骤：
1. 分析Demo代码文件 `pages/user/repair.tsx`
2. 提取页面结构和功能单元
3. 分析数据依赖和API需求
4. 识别异常场景和待确认问题
5. 输出标准HTML文档到指定位置

## 遵循PRD规范的8步法则

1. **更新标记** - 版本号、更新时间
2. **业务场景** - 解决什么问题
3. **方案概述** - 核心逻辑
4. **业务流程** - 状态机/泳道图
5. **前端交互** - 触发条件→动作→结果
6. **表结构** - 数据模型定义
7. **数据流向** - 接口调用链
8. **评审问题** - 待确认事项（必须含解决方案）
