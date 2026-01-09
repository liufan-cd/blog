---
title: ⛲ JNA
summary: java本地代码支持开源库
date: 2025-08-05
authors:
  - admin
tags:
  - java与其他语言交互
image:
  filename: "Image_1752540306767.png"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 使用 JNA
JNA（Java Native Access）是一个开源的 Java 库，允许 Java 程序无需 JNI 代码即可直接调用本地（如 C/C++）共享库中的函数。JNA 通过动态代理和反射机制，将 Java 接口方法映射为本地库中的函数调用，大大简化了 Java 与本地代码的集成开发。

### 1. JNA 依赖包

```xml
<dependency>
    <groupId>net.java.dev.jna</groupId>
    <artifactId>jna</artifactId>
    <version>5.10.0</version>
</dependency>
```

---

### 2. C 文件

```c
#include <stdio.h>

void hello_from_so() {
    printf("Hello from shared library!========================\n");
}
```

---

### 3. 创建代理接口

```java
import com.sun.jna.Library;

public interface ExampleSo extends Library {
    public void hello_from_so();
}
```

---

### 4. 反射加载标准链接库，生成代理对象

```java
import com.sun.jna.Library;
import com.sun.jna.Native;

public class Example {
    public static void main(String[] args) {
        ExampleSo instance = null;

        try {
            instance = (ExampleSo) Native.loadLibrary("/root/test/libexample.so", ExampleSo.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (instance != null) {
            instance.hello_from_so(); // 调用本地方法
        }
    }
}
```

至此可以成功编译运行文件。

---

### 5. 设置方法名映射

在这个方法中判断了是否对 name 进行覆盖，默认是不覆盖，即使用方法传入的 name，即为方法名 hello_from_so。

JNA 内部源码片段（com.sun.jna.NativeLibrary#getFunction）：

```java
Function getFunction(String name, Method method) {
        FunctionMapper mapper = (FunctionMapper) options.get(Library.OPTION_FUNCTION_MAPPER);
        if (mapper != null) {
            // 重写该方法，重新定义映射name
            name = mapper.getFunctionName(this, method);
        }
        // If there's native method profiler prefix, strip it
        String prefix = System.getProperty("jna.profiler.prefix", "$$YJP$$");
        if (name.startsWith(prefix)) {
            name = name.substring(prefix.length());
        }
        int flags = this.callFlags;
        Class<?>[] etypes = method.getExceptionTypes();
        for (int i=0;i < etypes.length;i++) {
            if (LastErrorException.class.isAssignableFrom(etypes[i])) {
                flags |= Function.THROW_LAST_ERROR;
            }
        }
        return getFunction(name, flags);
    }
```

---

### 6. 自定义方法名映射示例

```java
import com.sun.jna.FunctionMapper;
import com.sun.jna.Library;
import com.sun.jna.Native;
import java.util.HashMap;

public class Example {
    public static void main(String[] args) {
        ExampleSo instance = null;

        try {
            HashMap<String, Object> options = new HashMap<>();

            FunctionMapper functionMapper = (library, method) -> {
                LibraryName annotation = method.getAnnotation(LibraryName.class);
                return annotation == null ? method.getName() : annotation.value();
            };

            options.put(Library.OPTION_FUNCTION_MAPPER, functionMapper);
            instance = (ExampleSo) Native.loadLibrary("/root/test/libexample.so", ExampleSo.class, options);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (instance != null) {
            instance.helloFromSo(); // 调用本地方法
        }
    }
}
```

```java
import com.sun.jna.Library;

public interface ExampleSo extends Library {

    @LibraryName("hello_from_so")
    void helloFromSo();
}
```

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface LibraryName {
    String value();
}
```

通过上述方法可以将方法重新映射。

---

### 7. 编译与运行

#### javac 编译问题

通过 `-cp` 或 `-classpath` 指定依赖地址：

```bash
/usr/local/java/jdk1.8.0_121/bin/javac -cp "/root/test/jna-3.0.9.jar" -sourcepath "./" Example.java ExampleSo.java LibraryName.java
```

#### java 运行问题

指定 `-classpath` 会覆盖环境变量，需要显式声明环境变量的 classpath：

```bash
/usr/local/java/jdk1.8.0_121/bin/java -classpath "/root/test/jna-3.0.9.jar:.:$JAVA_HOME/lib.tools.jar" Example
```