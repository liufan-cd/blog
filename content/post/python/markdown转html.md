---
title: 🚩 markdown文件解析
summary: 将markdown文件编译为html并在浏览器中打开
date: 2025-08-05
authors:
  - admin
tags:
  - markdown
  - python
image:
  filename: "Image_1753955925580.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 简介
想要快速在浏览器中展示markdown文件

## 整体流程
使用python工具库根据markdown文件生成html文件，然后用浏览器打开

## 代码
使用cmd文件快速执行，获取当前目录，调用python文件

```bash
@echo off
for /f "delims=" %%t in ('chdir') do set current_dir=%%t
python openmd.py %current_dir% %1
```

python依赖
```cmd
pip install Pygments
pip install Markdown
pip install pymdown-extensions
```

```python
import markdown
import sys
import webbrowser
import re
import os

def warp_with_style(html_content):
    style = """
<style>
/* GitHub Dark Markdown CSS */
body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    color: #c9d1d9;
    background: #0d1117;
    margin: 0;
    padding: 0;
}
.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
    background: #0d1117;
    color: #c9d1d9;
}
@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: #c9d1d9;
}
.markdown-body h1 {
    font-size: 2em;
    border-bottom: 1px solid #30363d;
    padding-bottom: .3em;
}
.markdown-body h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #30363d;
    padding-bottom: .3em;
}
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: .875em; }
.markdown-body h6 {
    font-size: .85em;
    color: #8b949e;
}
.markdown-body p {
    margin-top: 0;
    margin-bottom: 16px;
}
.markdown-body ul,
.markdown-body ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
}
.markdown-body blockquote {
    margin: 0;
    padding: 0 1em;
    color: #8b949e;
    border-left: .25em solid #30363d;
}
.markdown-body code,
.markdown-body tt {
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 85%;
    background-color: rgba(110,118,129,0.4);
    color: #c9d1d9;
    padding: .2em .4em;
    margin: 0;
    border-radius: 3px;
}
.markdown-body pre {
    background-color: #161b22;
    color: #c9d1d9;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    border-radius: 3px;
    margin-top: 0;
    margin-bottom: 0px;
}
.markdown-body pre code {
    background: none;
    padding: 0;
    margin: 0;
    font-size: 100%;
    border: 0;
    color: inherit;
}
.markdown-body table {
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    width: 100%;
    overflow: auto;
    margin-bottom: 16px;
}
.markdown-body table th,
.markdown-body table td {
    border: 1px solid #30363d;
    padding: 6px 13px;
}
.markdown-body table th {
    font-weight: 600;
    background: #161b22;
}
.markdown-body hr {
    border: 0;
    border-top: 1px solid #30363d;
    margin: 24px 0;
}
.markdown-body img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #0d1117;
}
.markdown-body a {
    color: #58a6ff;
    text-decoration: none;
}
.markdown-body a:hover {
    text-decoration: underline;
}
.markdown-body del {
    text-decoration: line-through;
}
.markdown-body strong {
    font-weight: 600;
}
.markdown-body em {
    font-style: italic;
}
.markdown-body .highlight pre,
.markdown-body pre {
    background-color: #161b22;
}
.markdown-body .codehilite {
    background: #161b22;
    padding: 0.5em;
    border-radius: 3px;
    overflow-x: auto;
}
.markdown-body .codehilite .hll { background-color: #49483e }
.markdown-body .codehilite  { background: #161b22; color: #c9d1d9; }
/* 代码块内语法高亮颜色增强 */
.markdown-body .codehilite .c { color: #8b949e } /* Comment */
.markdown-body .codehilite .err { color: #f85149; background: #420d09 } /* Error */
.markdown-body .codehilite .k { color: #ff7b72 } /* Keyword */
.markdown-body .codehilite .o { color: #ff7b72 } /* Operator */
.markdown-body .codehilite .ch,
.markdown-body .codehilite .cm,
.markdown-body .codehilite .cp,
.markdown-body .codehilite .cpf,
.markdown-body .codehilite .c1,
.markdown-body .codehilite .cs { color: #8b949e }
.markdown-body .codehilite .gd { color: #ffa198; background: #490202 } /* Generic.Deleted */
.markdown-body .codehilite .ge { font-style: italic }
.markdown-body .codehilite .gr { color: #f85149 }
.markdown-body .codehilite .gh { color: #79c0ff }
.markdown-body .codehilite .gi { color: #56d364; background: #033a16 } /* Generic.Inserted */
.markdown-body .codehilite .go { color: #8b949e }
.markdown-body .codehilite .gp { color: #c9d1d9 }
.markdown-body .codehilite .gs { font-weight: bold }
.markdown-body .codehilite .gu { color: #d2a8ff }
.markdown-body .codehilite .gt { color: #f85149 }
.markdown-body .codehilite .kc,
.markdown-body .codehilite .kd,
.markdown-body .codehilite .kn,
.markdown-body .codehilite .kp,
.markdown-body .codehilite .kr { color: #ff7b72 }
.markdown-body .codehilite .kt { color: #d2a8ff }
.markdown-body .codehilite .m,
.markdown-body .codehilite .mb,
.markdown-body .codehilite .mf,
.markdown-body .codehilite .mh,
.markdown-body .codehilite .mi,
.markdown-body .codehilite .mo,
.markdown-body .codehilite .il { color: #a5d6ff }
.markdown-body .codehilite .s,
.markdown-body .codehilite .sa,
.markdown-body .codehilite .sb,
.markdown-body .codehilite .sc,
.markdown-body .codehilite .dl,
.markdown-body .codehilite .sd,
.markdown-body .codehilite .s2,
.markdown-body .codehilite .se,
.markdown-body .codehilite .sh,
.markdown-body .codehilite .si,
.markdown-body .codehilite .sx,
.markdown-body .codehilite .sr,
.markdown-body .codehilite .s1,
.markdown-body .codehilite .ss { color: #a5d6ff }
.markdown-body .codehilite .na,
.markdown-body .codehilite .nd,
.markdown-body .codehilite .ne,
.markdown-body .codehilite .nf,
.markdown-body .codehilite .nl,
.markdown-body .codehilite .nn { color: #d2a8ff }
.markdown-body .codehilite .nb,
.markdown-body .codehilite .nc,
.markdown-body .codehilite .no,
.markdown-body .codehilite .nv,
.markdown-body .codehilite .vc,
.markdown-body .codehilite .vg,
.markdown-body .codehilite .vi,
.markdown-body .codehilite .bp { color: #ffa657 }
.markdown-body .codehilite .nt { color: #7ee787 }
.markdown-body .codehilite .w { color: #c9d1d9 }
.markdown-body .codehilite .fm { color: #d2a8ff }
</style>
    """
    return f"<html><head>{style}</head><body><article class='markdown-body'>{html_content}</article></body></html>"

# markdown文件地址
root = "C:\\user\\markdown\\blog"
targetRoot = "C:\\user\\markdown\\blog\\target"

def dfs_open_markdown_file(file_path):
    path = file_path
    if os.path.isfile(path):
        if not path.endswith('.md'):
            print(f"Skipping non-markdown file: {path}")
            return

        with open(path, 'r', encoding="utf-8") as file:
            content = file.read()
            # 用正则将~~内容~~替换为<del>内容</del>
            content = re.sub(r'~~(.*?)~~', r'<del>\1</del>', content, flags=re.DOTALL)
            # 修正引用路径
            content = re.sub(r'(\[[^\]]*\]\([^\)]*?)\.md(\))', r'\1.html\2', content)
            html_content = markdown.markdown(
                content,
                extensions=['extra', 'fenced_code', 'codehilite'],
                extension_configs={
                    'codehilite': {
                    'guess_lang': False,
                    'noclasses': False
                    }
                }
            )
        # 将html_file_path前缀替换为targetRoot
        rel_path = os.path.relpath(path, root)
        html_file_path = os.path.join(targetRoot, os.path.splitext(rel_path)[0] + '.html')
        os.makedirs(os.path.dirname(html_file_path), exist_ok=True)
        with open(html_file_path, 'w', encoding="utf-8") as file:
            file.write(warp_with_style(html_content))
            print("Markdown file converted to HTML successfully.")
        url = 'file:///' + html_file_path
        webbrowser.register('chrome',None,webbrowser.BackgroundBrowser("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"))
        webbrowser.get("chrome").open(url)
    elif os.path.isdir(path):
        for entry in os.listdir(path):
            full_path = os.path.join(path, entry)
            dfs_open_markdown_file(full_path)

file_path = sys.argv[1]
dfs_open_markdown_file(file_path)
```
## 使用方式
到对应目录下使用cmd命令行，然后输入openmd即可