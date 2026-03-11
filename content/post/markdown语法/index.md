---
title: 🥟 markdown语法
description: markdown语法汇总
date: 2025-09-08
editable: false
authors:
  - admin
categories:
  - markdown
tags:
  - markdown
image:
  filename: "Image_1752969389136.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---

# Markdown 语法对照展示（原始写法 + 渲染效果）

---

## 1. 标题
### 原始写法（未渲染）
\# 一级标题

\## 二级标题

### 渲染效果
# 一级标题
## 二级标题

---

## 2. 引用
### 原始写法（未渲染）
\> 一级引用

\>\> 二级引用

### 渲染效果
> 一级引用
>> 二级引用

---

## 3. 代码块
### 原始写法（未渲染）
\`\`\`java
    public static void main() {
        System.out.println("Hello World!");
    }
\`\`\`

### 渲染效果
```java
    public static void main() {
        System.out.println("Hello World!");
    }
```

---

## 4. 行内代码
### 原始写法（未渲染）
\`System.out.println("Hello World!");\`

### 渲染效果
`System.out.println("Hello World!");`

---

## 5. 分割线
### 原始写法（未渲染）
\-\-\-

\***

\* \* \*

### 渲染效果
---
***
* * *

---

## 6. 数学公式
### 原始写法（未渲染）
```
$$ ax^2+bx+c=0 \\ x = \frac{-b\pm\sqrt{b^2-4ac}}{2a} $$

$$\int_{0}^{+\infty}\frac{1}{x^a*(x+1)^b}$$
```

### 渲染效果
$$ ax^2+bx+c=0 \\ x = \frac{-b\pm\sqrt{b^2-4ac}}{2a} $$

$$\int_{0}^{+\infty}\frac{1}{x^a*(x+1)^b}$$
