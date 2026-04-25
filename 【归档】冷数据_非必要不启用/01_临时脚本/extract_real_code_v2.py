import os
import glob

PROJECT_DIR = r"c:\Users\21389\Downloads\andt1\12259"
OUTPUT_DIR = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "安电通-源代码文档-真实代码.md")

def get_file_type(filepath):
    if filepath.endswith('.java'):
        return 'java'
    elif filepath.endswith('.tsx'):
        return 'tsx'
    elif filepath.endswith('.ts'):
        return 'typescript'
    elif filepath.endswith('.yml') or filepath.endswith('.yaml'):
        return 'yaml'
    elif filepath.endswith('.sql'):
        return 'sql'
    elif filepath.endswith('.xml'):
        return 'xml'
    elif filepath.endswith('.json'):
        return 'json'
    return 'text'

def read_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        try:
            with open(filepath, 'r', encoding='gbk') as f:
                return f.read()
        except:
            return None

content = []
content.append("# 安电通家庭用电安全服务平台软件\n")
content.append("# 源代码文档\n")
content.append("\n")
content.append("**版本：V1.0**\n")
content.append("\n")
content.append("**著作权人：未来申活（上海）数字科技有限公司**\n")
content.append("\n")
content.append("**编制日期：2026年4月**\n")
content.append("\n")
content.append("---\n")
content.append("\n")
content.append("## 说明\n")
content.append("\n")
content.append("根据《计算机软件著作权登记办法》要求：\n")
content.append("- 源代码文档提供软件前30页和后30页源代码\n")
content.append("- 不足60页的全部提供\n")
content.append("- 每页不少于50行\n")
content.append("\n")
content.append("本软件采用Spring Cloud微服务架构，后端使用Java Spring Boot，前端使用TypeScript + React + Taro框架开发。\n")
content.append("\n")
content.append("---\n")
content.append("\n")

total_lines = 0

# ===== 后端代码 =====
content.append("## 第一部分：后端核心代码\n")
content.append("\n")

backend_files = [
    (r"backend\gateway\src\main\java\com\andiantong\gateway\GatewayApplication.java", "API网关启动类"),
    (r"backend\gateway\src\main\resources\application.yml", "网关配置文件"),
    (r"backend\user-service\src\main\java\com\andiantong\user\UserServiceApplication.java", "用户服务启动类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\controller\Result.java", "统一响应结果类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\controller\UserController.java", "用户管理控制器"),
    (r"backend\user-service\src\main\java\com\andiantong\user\service\UserService.java", "用户服务接口"),
    (r"backend\user-service\src\main\java\com\andiantong\user\service\impl\UserServiceImpl.java", "用户服务实现类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\entity\User.java", "用户实体类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\mapper\UserMapper.java", "用户数据访问层"),
    (r"backend\user-service\src\main\resources\application.yml", "用户服务配置"),
    (r"backend\database\init.sql", "数据库初始化脚本"),
]

content.append("### 1.1 后端服务启动与配置\n")
content.append("\n")
for filepath, desc in backend_files[:5]:
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("### 1.2 用户服务核心代码\n")
content.append("\n")
for filepath, desc in backend_files[5:10]:
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("### 1.3 数据库结构\n")
content.append("\n")
filepath, desc = backend_files[10]
full_path = os.path.join(PROJECT_DIR, filepath)
code = read_file(full_path)
if code:
    file_type = get_file_type(filepath)
    content.append(f"#### {desc}\n")
    content.append(f"\n**文件路径**: `{filepath}`\n")
    content.append(f"\n```{file_type}\n")
    content.append(code)
    content.append("\n```\n")
    content.append("\n")
    lines = len(code.split('\n'))
    total_lines += lines
    print(f"Added: {desc} ({lines} lines)")

# ===== 前端代码 =====
content.append("\n## 第二部分：前端核心代码\n")
content.append("\n")

frontend_files = [
    (r"pages\UserApp.tsx", "用户端主入口"),
    (r"pages\Auth.tsx", "用户认证页面"),
    (r"pages\user\UserHome.tsx", "用户首页"),
    (r"pages\user\orders\Orders.tsx", "订单列表页面"),
    (r"pages\user\orders\OrderDetail.tsx", "订单详情页面"),
    (r"pages\user\services\Repair.tsx", "应急报修页面"),
    (r"pages\user\services\DeepInspection.tsx", "深度体检页面"),
    (r"pages\user\services\Install.tsx", "便民安装页面"),
    (r"pages\user\services\ElectricianBooking.tsx", "电工预约页面"),
    (r"pages\user\services\SupportChat.tsx", "在线客服页面"),
    (r"pages\user\services\SafetyAcademy.tsx", "安全学堂页面"),
    (r"pages\user\services\SmartHome.tsx", "智能家居页面"),
    (r"pages\user\profile\UserProfile.tsx", "用户资料页面"),
    (r"pages\user\profile\UserAddresses.tsx", "用户地址管理"),
    (r"pages\user\profile\UserCoupons.tsx", "优惠券页面"),
    (r"pages\user\profile\UserIncome.tsx", "我的收益页面"),
    (r"pages\user\profile\UserSettings.tsx", "设置页面"),
    (r"pages\user\PointsMall.tsx", "积分商城页面"),
    (r"pages\user\UserSafety.tsx", "家庭安全服务"),
    (r"pages\user\UserStore.tsx", "用户商城页面"),
    (r"pages\user\community\Community.tsx", "社区服务页面"),
    (r"pages\electrician\ElectricianPages.tsx", "电工端主入口"),
    (r"pages\electrician\hall\TaskHall.tsx", "任务大厅页面"),
    (r"pages\electrician\tasks\MyTasks.tsx", "我的任务页面"),
    (r"pages\electrician\tasks\TaskDetail.tsx", "任务详情页面"),
    (r"pages\electrician\income\Income.tsx", "电工收入页面"),
    (r"pages\electrician\profile\ElecProfile.tsx", "电工资料页面"),
    (r"pages\electrician\profile\ElecSkills.tsx", "电工技能页面"),
    (r"pages\electrician\profile\ElecServiceArea.tsx", "服务区域设置"),
    (r"pages\shared\IdentityVerify.tsx", "身份认证组件"),
    (r"pages\shared\MessageCenter.tsx", "消息中心页面"),
    (r"context\AppContext.tsx", "应用全局状态"),
    (r"types.ts", "类型定义文件"),
    (r"components\Shared.tsx", "公共组件"),
    (r"components\ErrorBoundary.tsx", "错误边界组件"),
]

content.append("### 2.1 用户端核心页面\n")
content.append("\n")
for i, (filepath, desc) in enumerate(frontend_files[:10]):
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("### 2.2 用户个人中心\n")
content.append("\n")
for i, (filepath, desc) in enumerate(frontend_files[10:20]):
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("### 2.3 电工端核心功能\n")
content.append("\n")
for i, (filepath, desc) in enumerate(frontend_files[20:30]):
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("### 2.4 公共组件与类型定义\n")
content.append("\n")
for i, (filepath, desc) in enumerate(frontend_files[30:]):
    full_path = os.path.join(PROJECT_DIR, filepath)
    code = read_file(full_path)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"#### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("\n---\n")
content.append("\n")
content.append("## 代码统计\n")
content.append("\n")
content.append(f"- **总代码行数**: {total_lines} 行\n")
content.append("\n")
content.append("---\n")
content.append("\n")
content.append("**注**: 本源代码文档包含项目实际开发的核心代码片段，来源于 " + PROJECT_DIR + " 目录下的真实项目代码。\n")

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(''.join(content))

print(f"\n{'='*50}")
print(f"总代码行数: {total_lines} 行")
print(f"输出文件: {OUTPUT_FILE}")
print(f"{'='*50}")
