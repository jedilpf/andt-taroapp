import os
import re

PROJECT_DIR = r"c:\Users\21389\Downloads\andt1\12259"
OUTPUT_DIR = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "安电通-源代码文档-真实代码.md")

backend_files = [
    (r"backend\gateway\src\main\java\com\andiantong\gateway\GatewayApplication.java", "网关启动类"),
    (r"backend\gateway\src\main\resources\application.yml", "网关配置"),
    (r"backend\user-service\src\main\java\com\andiantong\user\UserServiceApplication.java", "用户服务启动类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\controller\Result.java", "统一响应结果类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\controller\UserController.java", "用户控制器"),
    (r"backend\user-service\src\main\java\com\andiantong\user\service\UserService.java", "用户服务接口"),
    (r"backend\user-service\src\main\java\com\andiantong\user\service\impl\UserServiceImpl.java", "用户服务实现"),
    (r"backend\user-service\src\main\java\com\andiantong\user\entity\User.java", "用户实体类"),
    (r"backend\user-service\src\main\java\com\andiantong\user\mapper\UserMapper.java", "用户Mapper"),
    (r"backend\user-service\src\main\resources\application.yml", "用户服务配置"),
    (r"backend\database\init.sql", "数据库初始化脚本"),
]

frontend_files = [
    (r"pages\UserApp.tsx", "用户端入口"),
    (r"pages\Auth.tsx", "认证页面"),
    (r"pages\user\UserHome.tsx", "用户首页"),
    (r"pages\user\orders\Orders.tsx", "订单列表页"),
    (r"pages\user\orders\OrderDetail.tsx", "订单详情页"),
    (r"pages\user\services\Repair.tsx", "应急报修页面"),
    (r"pages\user\services\DeepInspection.tsx", "深度体检页面"),
    (r"pages\user\services\Install.tsx", "便民安装页面"),
    (r"pages\user\services\ElectricianBooking.tsx", "电工预约页面"),
    (r"pages\user\profile\UserProfile.tsx", "用户资料页"),
    (r"pages\user\profile\UserAddresses.tsx", "用户地址页"),
    (r"pages\user\profile\UserCoupons.tsx", "优惠券页"),
    (r"pages\user\PointsMall.tsx", "积分商城页"),
    (r"pages\user\UserSafety.tsx", "安全服务页"),
    (r"pages\electrician\ElectricianPages.tsx", "电工端入口"),
    (r"pages\electrician\hall\TaskHall.tsx", "任务大厅"),
    (r"pages\electrician\tasks\MyTasks.tsx", "我的任务"),
    (r"pages\electrician\profile\ElecProfile.tsx", "电工资料页"),
    (r"context\AppContext.tsx", "应用上下文"),
    (r"types.ts", "类型定义"),
]

def read_file(filepath):
    full_path = os.path.join(PROJECT_DIR, filepath)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def get_file_type(filepath):
    if filepath.endswith('.java'):
        return 'java'
    elif filepath.endswith('.tsx') or filepath.endswith('.ts'):
        return 'tsx'
    elif filepath.endswith('.yml') or filepath.endswith('.yaml'):
        return 'yaml'
    elif filepath.endswith('.sql'):
        return 'sql'
    return 'text'

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
content.append("## 第一部分：后端核心代码\n")
content.append("\n")

total_lines = 0

for filepath, desc in backend_files:
    code = read_file(filepath)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"### {desc}\n")
        content.append(f"\n**文件路径**: `{filepath}`\n")
        content.append(f"\n```{file_type}\n")
        content.append(code)
        content.append("\n```\n")
        content.append("\n")
        lines = len(code.split('\n'))
        total_lines += lines
        print(f"Added: {desc} ({lines} lines)")

content.append("\n## 第二部分：前端核心代码\n")
content.append("\n")

for filepath, desc in frontend_files:
    code = read_file(filepath)
    if code:
        file_type = get_file_type(filepath)
        content.append(f"### {desc}\n")
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
content.append("**注**: 本源代码文档包含项目实际开发的核心代码片段，共计约 " + str(total_lines) + " 行。\n")

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(''.join(content))

print(f"\nTotal lines: {total_lines}")
print(f"Output file: {OUTPUT_FILE}")
