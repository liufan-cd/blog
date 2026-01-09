---
title: 🚌 JNI
summary: java本地代码支持
date: 2025-08-05
authors:
  - admin
tags:
  - java与其他语言交互
image:
  filename: "Image_1756769917911.png"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## JNI

### 什么是 JNI

JNI（Java Native Interface，Java本地接口）是Java平台提供的一种编程接口，允许Java代码与其他语言（主要是C/C++）编写的本地代码进行交互。通过JNI，Java程序可以调用本地方法，也可以被本地代码调用，实现与操作系统底层或第三方库的集成。

---

### JNI 的优缺点

**优点：**
- 可以调用C/C++等本地代码，提升性能，适合对性能要求高的场景。
- 能访问操作系统底层资源或硬件，扩展Java的能力。
- 便于复用已有的本地库或第三方库。

**缺点：**
- 编程复杂，开发和调试难度较大。
- 跨平台性变差，依赖本地平台和编译环境。
- 可能引入内存泄漏、崩溃等安全隐患。
- 影响Java应用的可移植性和稳定性。

---

### Java 中如何使用 JNI

#### 1. 创建 Java 代码

**Example.java**
```java
public class Example {
    // 声明本地方法
    public native void helloFromSo();

    // 加载共享库
    static {
        System.loadLibrary("example"); // 不需要加前缀 "lib" 和后缀 ".so"
    }

    public static void main(String[] args) {
        Example example = new Example();
        example.helloFromSo(); // 调用本地方法
    }
}
```

#### 2. 编译 Java 代码

```bash
/usr/local/java/jdk1.8.0_121/bin/javac Example.java
```

#### 3. 由 Java 代码生成头文件

```bash
/usr/local/java/jdk1.8.0_121/bin/javah -jni Example
```

---

### 4. 使用 C 实现方法

**example.c**
```c
#include <jni.h>
#include <stdio.h>
#include "Example.h"

JNIEXPORT void JNICALL Java_Example_helloFromSo(JNIEnv *env, jobject obj) {
    printf("Hello from JNI!\n");
}
```

#### 5. 编译生成标准链接库

依赖 jni.h 和 jni_md.h 头文件，需要指定路径：

```bash
gcc -I /usr/local/java/jdk1.8.0_121/include -I /usr/local/java/jdk1.8.0_121/include/linux -shared -o libexample.so -fPIC example.c
```

#### 6. 设置环境变量，引用标准连接库

将 .so 文件放入 /usr/lib64 中，或者设置环境变量：

```bash
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
```

#### 7. 运行程序

```bash
/usr/local/java/jdk1.8.0_121/bin/java Example
```

---

### JVM 是如何执行 native 方法

当 Java 程序调用 native 方法时，JVM 的执行过程如下：

#### 1. Java 编译生成 class 结构
```java
public class Demo {
    public static void main(String[] args) {
        int sum = sum(1, 2);
        System.out.println(sum);
    }

    public static native int sum(int a, int b);
}
```
```bash
javap -c -s -v Demo.class
```

```
Classfile /C:/Users/chaoying/IdeaProjects/LinuxSo/LinuxSo/src/main/java/Demo.class
  Last modified 2025-5-16; size 420 bytes
  MD5 checksum f6487b784931d6c10816100764ac1295
  Compiled from "Demo.java"
public class Demo
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #6.#17         // java/lang/Object."<init>":()V
   #2 = Methodref          #5.#18         // Demo.sum:(II)I
   #3 = Fieldref           #19.#20        // java/lang/System.out:Ljava/io/PrintStream;
   #4 = Methodref          #21.#22        // java/io/PrintStream.println:(I)V
   #5 = Class              #23            // Demo
   #6 = Class              #24            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               main
  #12 = Utf8               ([Ljava/lang/String;)V
  #13 = Utf8               sum
  #14 = Utf8               (II)I
  #15 = Utf8               SourceFile
  #16 = Utf8               Demo.java
  #17 = NameAndType        #7:#8          // "<init>":()V
  #18 = NameAndType        #13:#14        // sum:(II)I
  #19 = Class              #25            // java/lang/System
  #20 = NameAndType        #26:#27        // out:Ljava/io/PrintStream;
  #21 = Class              #28            // java/io/PrintStream
  #22 = NameAndType        #29:#30        // println:(I)V
  #23 = Utf8               Demo
  #24 = Utf8               java/lang/Object
  #25 = Utf8               java/lang/System
  #26 = Utf8               out
  #27 = Utf8               Ljava/io/PrintStream;
  #28 = Utf8               java/io/PrintStream
  #29 = Utf8               println
  #30 = Utf8               (I)V
{
  public Demo();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=1
         0: iconst_1
         1: iconst_2
         2: invokestatic  #2                  // Method sum:(II)I
         5: istore_1
         6: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         9: iload_1
        10: invokevirtual #4                  // Method java/io/PrintStream.println:(I)V
        13: return
      LineNumberTable:
        line 3: 0
        line 4: 6
        line 5: 13

  public static native int sum(int, int);
    descriptor: (II)I
    flags: ACC_PUBLIC, ACC_STATIC, ACC_NATIVE
}
SourceFile: "Demo.java"
```
其中native方法会生成ACC_NATIVE标识

#### 2. Java 类加载

类加载器（ClassLoader）将 .class 文件加载到 JVM 内存中，native 方法的信息也被加载到方法区。

#### 3. 程序执行流程

- 对于 JVM 来说，一个 Java 程序对应一个虚拟机栈（Java Stack）。
- 当 Java 方法调用 native 方法时，JVM 会为当前线程创建一个本地方法栈（Native Stack），并将程序计数器（PC）跳转到 native 方法的内存地址。
- JVM 查找并调用本地方法实现（如动态链接库中的函数），并按照顺序执行本地代码逻辑。
- 本地方法执行完毕后，弹出本地方法栈，程序计数器跳回 Java 虚拟机栈，继续执行后续 Java 代码。

#### 4. 本地方法格式要求

- 为了让 JVM 能正确解析和加载本地方法，本地方法需要遵循特定的格式。
- 可以通过 `javah` 工具根据 Java 类自动生成对应的 C/C++ 头文件，确保方法签名和参数类型正确匹配。
- 具体的本地方法实现由业务代码控制。

---