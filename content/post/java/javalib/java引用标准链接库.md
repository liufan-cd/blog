---
title: 🤞 java调用c以及c++
summary: java调用c以及c++
date: 2025-08-05
authors:
  - admin
tags:
  - java与其他语言交互
image:
  filename: "Image_1752969383788.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 问题描述
数据采集卡使用pcie通道连接pc，将数据直接写入内存中，并编写了标准链接库，用于操作数据。现需要使用java代码调用c代码。
## 使用jni
此种方法需要自己实现c语言代码，不适用这种调用三方库的形式。

### 创建java代码
Example.java
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

### 编译代码
```/usr/local/java/jdk1.8.0_121/bin/javac Example.java```

### 由java代码生成头文件
```java/usr/local/java/jdk1.8.0_121/bin/javah -jni Example```
### 使用c实现方法
example.c
```c
#include <jni.h>
#include <stdio.h>
#include "Example.h"

JNIEXPORT void JNICALL Java_Example_helloFromSo(JNIEnv *env, jobject obj) {
    printf("Hello from JNI!\n");
}
```
### 编译生成标准链接库

```gcc -I /usr/local/java/jdk1.8.0_121/include -I /usr/local/java/jdk1.8.0_121/include/linux -shared -o libexample.so -fPIC example_jni.c```

### 设置环境变量，引用标准连接库
```export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH```
或者将.so文件放入/usr/lib64中

### 运行程序
```/usr/local/java/jdk1.8.0_121/bin/java Example```


## 使用jna
### jna依赖包
```maven
        <dependency>
            <groupId>net.java.dev.jna</groupId>
            <artifactId>jna</artifactId>
            <version>5.10.0</version>
        </dependency>
```
### c文件
```c
#include <stdio.h>

void hello_from_so() {
    printf("Hello from shared library!========================\n");
}

```
### 创建代理接口
```java
import com.sun.jna.Library;

public interface ExampleSo extends Library {
    public void hello_from_so();
}
```
### 反射加载标准链接库，生成代理对象
```java
import com.sun.jna.FunctionMapper;
import com.sun.jna.Library;
import com.sun.jna.Native;

import java.util.HashMap;

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

至此可以成功编译运行文件
### 设置方法名映射
在这个方法中判断了是否对name进行覆盖，默认是不覆盖，即使用方法传入的name，即为方法名hello_from_so。
com.sun.jna.NativeLibrary#getFunction(java.lang.String, java.lang.reflect.Method)
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
    public void helloFromSo();
}
```

``` java
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

通过上述方法可以将方法重新映射
### javac 编译问题
通过-cp或者-classpath指定依赖地址
```/usr/local/java/jdk1.8.0_121/bin/javac -cp "/root/test/jna-3.0.9.jar" -sourcepath "./" Example.java ExampleSo.java LibraryName.java```

### java 运行问题
指定-classpath会覆盖环境变量，需要显式声明环境变量的classpath
```/usr/local/java/jdk1.8.0_121/bin/java -classpath "/root/test/jna-3.0.9.jar:.:$JAVA_HOME/lib.tools.jar" Example```