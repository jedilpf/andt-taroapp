# Knowledge MCP 配置指南

## 一、安装Knowledge MCP服务器

### 1.1 使用npm安装

```bash
npm install -g @modelcontextprotocol/server-knowledge
```

### 1.2 或使用npx直接运行

```bash
npx @modelcontextprotocol/server-knowledge
```

---

## 二、配置MCP服务器

### 2.1 找到Trae配置文件位置

**Windows系统**:
```
C:\Users\<用户名>\.trae\config\mcp_settings.json
```

**macOS/Linux系统**:
```
~/.trae/config/mcp_settings.json
```

### 2.2 编辑配置文件

打开 `mcp_settings.json` 文件，添加以下配置：

```json
{
  "mcpServers": {
    "knowledge": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-knowledge"
      ],
      "env": {
        "KNOWLEDGE_STORAGE_PATH": "c:\\Users\\21389\\Downloads\\andt1\\12259\\项目逻辑分析"
      }
    }
  }
}
```

**注意**：
- `KNOWLEDGE_STORAGE_PATH` 指向您的项目逻辑分析目录
- Windows路径需要使用双反斜杠 `\\` 或正斜杠 `/`

---

## 三、配置说明

### 3.1 配置参数详解

| 参数 | 说明 | 示例值 |
|------|------|--------|
| `command` | MCP服务器启动命令 | `npx` 或 `node` |
| `args` | 命令参数 | `["@modelcontextprotocol/server-knowledge"]` |
| `env.KNOWLEDGE_STORAGE_PATH` | 知识库存储路径 | 项目逻辑分析目录 |

### 3.2 环境变量说明

```json
{
  "env": {
    "KNOWLEDGE_STORAGE_PATH": "项目逻辑分析目录路径",
    "KNOWLEDGE_INDEX_FILE": "knowledge_index.json",
    "KNOWLEDGE_MAX_FILE_SIZE": "10485760"
  }
}
```

---

## 四、重启Trae IDE

配置完成后，需要重启Trae IDE以加载新的MCP服务器：

1. 关闭Trae IDE
2. 重新打开Trae IDE
3. 检查MCP服务器是否加载成功

---

## 五、验证配置

### 5.1 检查MCP服务器状态

在Trae IDE中，打开命令面板（Ctrl+Shift+P），搜索"MCP"，查看Knowledge MCP是否显示为已连接。

### 5.2 测试Knowledge MCP功能

配置成功后，您可以使用以下功能：

1. **知识库索引**: 自动索引项目逻辑分析目录下的所有Markdown文件
2. **语义搜索**: 基于自然语言搜索相关文档
3. **知识问答**: 基于知识库回答问题
4. **文档关联**: 自动关联相关文档

---

## 六、使用示例

配置成功后，您可以这样使用：

### 示例1：搜索功能逻辑

```
用户: 查找订单状态机的相关文档
AI: [使用Knowledge MCP搜索] 找到以下相关文档：
- 订单状态机功能逻辑.md
- 核心业务总体概览.md
```

### 示例2：知识问答

```
用户: 派单系统有哪些派单模式？
AI: [使用Knowledge MCP查询] 根据文档，派单系统有三种模式：
1. 抢单模式（已实现）
2. 指派模式（Phase-2）
3. 竞价模式（Phase-2）
```

---

## 七、常见问题

### Q1: MCP服务器无法启动

**解决方案**:
- 检查Node.js是否已安装（需要v18+）
- 检查npm是否可用
- 尝试手动运行命令：`npx @modelcontextprotocol/server-knowledge`

### Q2: 配置文件不存在

**解决方案**:
- 手动创建配置目录和文件
- Windows: `mkdir C:\Users\<用户名>\.trae\config`
- 创建 `mcp_settings.json` 文件

### Q3: 路径格式错误

**解决方案**:
- Windows路径使用双反斜杠：`C:\\Users\\...`
- 或使用正斜杠：`C:/Users/...`
- 确保路径存在且有读写权限

---

## 八、高级配置

### 8.1 自定义索引规则

```json
{
  "mcpServers": {
    "knowledge": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-knowledge"],
      "env": {
        "KNOWLEDGE_STORAGE_PATH": "项目路径",
        "KNOWLEDGE_FILE_PATTERNS": "*.md,*.txt,*.json",
        "KNOWLEDGE_EXCLUDE_PATTERNS": "node_modules,dist,build"
      }
    }
  }
}
```

### 8.2 多知识库配置

```json
{
  "mcpServers": {
    "knowledge-project": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-knowledge"],
      "env": {
        "KNOWLEDGE_STORAGE_PATH": "项目逻辑分析路径"
      }
    },
    "knowledge-docs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-knowledge"],
      "env": {
        "KNOWLEDGE_STORAGE_PATH": "文档路径"
      }
    }
  }
}
```

---

## 九、下一步

配置完成后，您可以：

1. ✅ 重启Trae IDE
2. ✅ 验证MCP服务器状态
3. ✅ 开始使用知识库功能
4. ✅ 测试搜索和问答功能

---

## 十、技术支持

如果遇到问题，请检查：

1. Node.js版本：`node -v`（需要v18+）
2. npm版本：`npm -v`
3. MCP服务器日志：查看Trae IDE的输出面板
4. 配置文件格式：确保JSON格式正确

**配置完成后，您就可以使用Knowledge MCP来管理和查询项目逻辑分析知识库了！**
