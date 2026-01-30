---
title: 🤕 java调用python
description: java软件中嵌入python代码块
date: 2025-08-05
authors:
  - admin
categories:
  - java
  - javalib
  - python
tags:
  - java与其他语言交互
image:
  filename: "Image_1752969386553.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 简介
使用java语言调用python

### 原理
通过命令行执行python文件

### 获取执行结果
- java通过命令行输出流获取执行结果
- python进程和java进程通过socket进行通讯

## 示例

### java调用python程序
```java
Runtime runtime = Runtime.getRuntime();
Process process = runtime.exec("\"C:/Program Files/Python313/python.exe\" C:\\user\\py\\test\\test.py");
```

### java通过命令行输出流获取结果
```java
BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
String line;

while ((line = reader.readLine()) != null) {
    System.out.println(line);
}
```

### java监听端口
```java
Thread thread = new Thread(() -> {
    try (ServerSocket serverSocket = new ServerSocket(7382)) {
        Socket client = serverSocket.accept();
        StringBuilder builder = new StringBuilder();
        String line;
        BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));

        while (run) {
            if ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append("\n");
            }
        }

        System.out.println(builder);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
});

thread.start();
```

### python写入端口
```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('127.0.0.1', 7382))
```

### 整体示例
```java
package person.liufan.person.liufan.so;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class ForPython {
    public static void main(String[] args) {
        ForPython forPython = new ForPython();
        forPython.python();
    }

    volatile boolean run = true;

    public void python() {
        Runtime runtime = Runtime.getRuntime();

        Thread thread = new Thread(() -> {
            try (ServerSocket serverSocket = new ServerSocket(7382)) {
                Socket client = serverSocket.accept();
                StringBuilder builder = new StringBuilder();
                String line;
                BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));

                while (run) {
                    if ((line = reader.readLine()) != null) {
                        builder.append(line);
                        builder.append("\n");
                    }
                }

                System.out.println(builder);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });

        thread.start();

        try {
            Process process = runtime.exec("\"C:/Program Files/Python313/python.exe\" C:\\user\\py\\test\\test.py");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            this.run = false;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```

```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('127.0.0.1', 7382))

with open("C:\\Users\\chaoying\\Desktop\\新建文本文档.txt", "r", encoding="utf-8") as file:
    for line in file:
        s.sendall(line.encode('utf-8'))
        # print(line.encode('utf-8'))
s.close()

print("send over")
```