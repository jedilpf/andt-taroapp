import os
import subprocess

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档-真实代码.md"
output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.docx"

cmd = f'pandoc "{md_file}" -o "{output_file}" --reference-doc="c:\\Users\\21389\\Downloads\\andt1\\12259\\安电通-软著申请材料-2026.4\\~$template.docx"'
result = os.system(cmd)

if result == 0:
    print(f"转换成功: {output_file}")
else:
    print(f"转换失败，尝试不使用模板...")
    cmd2 = f'pandoc "{md_file}" -o "{output_file}"'
    result2 = os.system(cmd2)
    if result2 == 0:
        print(f"转换成功: {output_file}")
    else:
        print(f"转换失败")
