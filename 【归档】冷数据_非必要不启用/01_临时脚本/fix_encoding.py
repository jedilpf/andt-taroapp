# -*- coding: utf-8 -*-
import re
import os

def fix_file(filepath):
    """Fix corrupted markdown files with merged lines"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed_lines = []
    skip_next = False
    
    for i, line in enumerate(lines):
        # Skip lines that are table header garbage
        if re.match(r'^\|\| \|\| 属性 \|\| \|\| 接口概览', line):
            fixed_lines.append('|------|------|\n')
            continue
        
        # Fix section header + table header merge
        if re.match(r'^## .+ \?\|\|', line):
            # Extract the section title
            match = re.match(r'^(## [一二三四五六七八九十\d]+、)(.+?)\s+\?\|\||', line)
            if match:
                header = match.group(1) + match.group(2) if match.group(2) else match.group(1) + line.split('|')[0].replace('## ', '').strip()
                # Reconstruct properly
                fixed_lines.append(f"## {header}\n\n")
                fixed_lines.append("| 属性 | 内容 |\n")
                fixed_lines.append("|------|------|\n")
                continue
        
        # Fix merged section header with table
        if re.match(r'^## .+\s+\| 属性', line):
            header_match = re.match(r'^(## [一二三四五六七八九十\d]+、)(.+?)\s+\|', line)
            if header_match:
                section = header_match.group(1) + header_match.group(2)
                fixed_lines.append(f"## {section}\n\n")
                fixed_lines.append("| 属性 | 内容 |\n")
                fixed_lines.append("|------|------|\n")
                continue
        
        # Fix specific truncation patterns
        line = re.sub(r'Phase-1优先\?\|', 'Phase-1优先级 |', line)
        line = re.sub(r'技术方\?\|', '技术方案 |', line)
        line = re.sub(r'核心价\?\|', '核心价值 |', line)
        line = re.sub(r'接口名\?\|', '接口名称 |', line)
        line = re.sub(r'接口概\?\|', '接口概述 |', line)
        line = re.sub(r'接口方\?\|', '接口说明 |', line)
        line = re.sub(r'请求格\?\|', '请求格式 |', line)
        line = re.sub(r'请求方\?\|', '请求方式 |', line)
        line = re.sub(r'请求路\?\|', '请求路径 |', line)
        line = re.sub(r'请求参\?\|', '请求参数 |', line)
        line = re.sub(r'返回格\?\|', '返回格式 |', line)
        line = re.sub(r'返回码\?\|', '返回码 |', line)
        line = re.sub(r'错误码\?\|', '错误码 |', line)
        line = re.sub(r'认证方\?\|', '认证方式 |', line)
        line = re.sub(r'频率限\?\|', '频率限制 |', line)
        
        # Common field truncations
        line = re.sub(r'文档版\?\|', '文档版本 |', line)
        line = re.sub(r'更新日\?\|', '更新日期 |', line)
        line = re.sub(r'适用范\?\|', '适用范围 |', line)
        line = re.sub(r'基础UR\?\|', '基础URL |', line)
        line = re.sub(r'模块名\?\|', '模块名称 |', line)
        line = re.sub(r'模块代\?\|', '模块代码 |', line)
        line = re.sub(r'功能名\?\|', '功能名称 |', line)
        line = re.sub(r'对应文\?\|', '对应文件 |', line)
        line = re.sub(r'上下文依\?\|', '上下文依赖 |', line)
        line = re.sub(r'依赖组\?\|', '依赖组件 |', line)
        line = re.sub(r'路由配\?\|', '路由配置 |', line)
        
        # Status fields
        line = re.sub(r'已实\?\|', '已实现 |', line)
        line = re.sub(r'待开\?\|', '待开发 |', line)
        
        # Change log
        line = re.sub(r'变更日\?\|', '变更日期 |', line)
        line = re.sub(r'变更版\?\|', '变更版本 |', line)
        line = re.sub(r'变更内\?\|', '变更内容 |', line)
        line = re.sub(r'变更\?\|', '变更人 |', line)
        
        # Fix double pipes
        line = re.sub(r'\|\|', '|', line)
        
        fixed_lines.append(line)
    
    return ''.join(fixed_lines)

def process_all():
    base_dir = r'c:\Users\21389\Downloads\andt1\12259\项目逻辑分析'
    count = 0
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                original = open(filepath, 'r', encoding='utf-8').read()
                fixed = fix_file(filepath)
                
                if fixed != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(fixed)
                    count += 1
                    print(f"Fixed: {file}")
    
    print(f"\nTotal: {count} files fixed")

if __name__ == '__main__':
    process_all()
