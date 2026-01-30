---
title: 🀄 springboot打包方式
description: 解析springboot如何将java文件打包成可执行jar包
date: 2025-08-05
authors:
  - admin
tags:
  - spring
image:
  filename: "Image_1756769910334.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## springboot打包
### springboot包目录结构
```
project/
├── BOOT-INF/                                                                   
│   ├── classes                                 # 当前项目结果文件放置在 classes 路径下
│   │   │   └── application.properties          # 项目中配置文件
│   │   ├── org/                                # 项目中 java 路径下，编译成 class 文件路径
│   │   ├── static/                             # 项目中 resources 路径下的静态文件夹
│   │   └── templates/                          # 项目中 resources 路径下的模板文件夹
│   └── lib/                                    # 项目所依赖的第三方 jar（Tomcat，SpringBoot 等）
├── META-INF/                                                                   
│   └── MANIFEST.MF                             # 清单文件，用于描述可执行 jar 的一些基本信息
└── org/springframework/boot/loader/            # jar 包启动相关的引导
    ├── archive/
    ├── data
    ├── ExectableArchiveLauncher.class
    ├── jar/
    ├── JarLauncher.class
    ├── LaunchedURLClassLoader.class
    ├── LaunchedURLClassLoader$UseFastConnectionExceptionsEnumeration.class
    ├── Launcher.class
    ├── MainMethodRunner.class
    ├── PropertiesLauncher.class
    ├── PropertiesLauncher$1.class
    ├── PropertiesLauncher$ArchiveEntryFilter.class
    ├── PropertiesLauncher$PrefixMatchingArchiveFilter.class
    ├── PropertiesLauncher$ArchiveEntryFilter.class
    ├── util/
    └── WarLauncher.class

```
### maven中的打包插件

#### 依赖

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

#### 为什么要自定义打包插件
springboot希望使用java -jar 命令可以直接运行的可执行并且不依赖其他外部依赖的jar包。基于这个需求，有以下几点jar包需要满足：
- jar包中有整个项目所有的依赖jar包
- java规定jar包的启动类必须在顶层目录
- jar包中有整个项目结果文件

#### springboot如何实现上述需求
- 使用BOOT-INF保存项目class和依赖jar包
- 通过[MANIFEST.MF](#MANIFEST)中Main-Class指定项目启动类
- 通过JarLauncher创建classLoader加载项目类，设定根目录为BOOT-INF，启动线程读取[MANIFEST.MF](#MANIFEST)中Start-Class属性反射调用main方法。

<span id="MANIFEST">

**MANIFEST.MF 信息**
```
Manifest-Version: 1.0
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
Implementation-Title: compressor
Implementation-Version: 1.0.0
Spring-Boot-Layers-Index: BOOT-INF/layers.idx
Start-Class: com.chaoyingtec.compressor.CompressorApplication
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Build-Jdk-Spec: 1.8
Spring-Boot-Version: 2.5.15
Created-By: Maven JAR Plugin 3.2.2
Main-Class: org.springframework.boot.loader.JarLauncher


```
<span>