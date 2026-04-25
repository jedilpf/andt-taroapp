# -*- coding: utf-8 -*-
"""
Word文档读取脚本
读取.doc和.docx文件并保存为文本
"""

import os
import sys

# 尝试导入必要的库
try:
    from docx import Document
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False
    print("python-docx未安装，将跳过.docx文件")

try:
    import win32com.client
    import pythoncom
    HAS_WIN32 = True
except ImportError:
    HAS_WIN32 = False
    print("win32com未安装，将跳过.doc文件")

def read_docx(file_path):
    """读取docx文件"""
    if not HAS_DOCX:
        return None
    try:
        doc = Document(file_path)
        text = []
        for para in doc.paragraphs:
            text.append(para.text)
        return '\n'.join(text)
    except Exception as e:
        print(f"读取docx失败: {e}")
        return None

def read_doc(file_path):
    """读取doc文件"""
    if not HAS_WIN32:
        return None
    try:
        pythoncom.CoInitialize()
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        doc = word.Documents.Open(file_path)
        text = doc.Content.Text
        doc.Close(False)
        word.Quit()
        pythoncom.CoUninitialize()
        return text
    except Exception as e:
        print(f"读取doc失败: {e}")
        return None

def main():
    folder = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料"
    output_folder = r"c:\Users\21389\Downloads\andt1\12259\extracted_text"
    
    # 创建输出目录
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    print("=" * 50)
    print("Word文档读取脚本")
    print("=" * 50)
    
    # 获取所有文件
    files = os.listdir(folder)
    
    for filename in files:
        file_path = os.path.join(folder, filename)
        
        if not os.path.isfile(file_path):
            continue
            
        ext = os.path.splitext(filename)[1].lower()
        
        print(f"\n正在处理: {filename}")
        
        text = None
        
        if ext == '.docx':
            text = read_docx(file_path)
        elif ext == '.doc':
            text = read_doc(file_path)
        else:
            print("  跳过非Word文件")
            continue
        
        if text:
            # 生成输出文件名
            base_name = os.path.splitext(filename)[0]
            output_file = os.path.join(output_folder, f"{base_name}.txt")
            
            # 保存为UTF-8编码的文本文件
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(text)
            
            print(f"  成功! 保存到: {output_file}")
            print(f"  字符数: {len(text)}")
        else:
            print(f"  读取失败")
    
    print("\n" + "=" * 50)
    print("处理完成!")
    print(f"输出目录: {output_folder}")
    print("=" * 50)

if __name__ == "__main__":
    main()
