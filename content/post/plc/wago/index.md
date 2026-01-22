---
title: 👀 wago-plc-调试
description: 万可（wago）PLC设备接入及调试
date: 2026-01-21
authors:
  - admin
categories:
    plc
tags:
  - wago
# image:
#   filename: "Image_1752969385133.jpg"
#   focal_point: Smart
#   preview_only: false
#   alt_text: "随机图片"
---
## 简介
需要将万可plc接入采集模块，并将采集数据发送至mqtt，采集模块共三类，PN协议，modbus协议，模拟量采集。

## PLC及采集模块实物

// todo

### 实物介绍

### 接线

## 软件安装与调试

### 万可codesys安装

#### 下载
![wago软件下载页面](wago软件下载页面.png)
![wago软件下载页面](wago软件下载页面2.png)

[wago软件下载地址](https://downloadcenter.wago.com/software)

#### 安装

![安装](安装.png)

### 新建工程

![新建工程](新建工程界面.png)
![选择设备并选择编程方式，常用ST和FBD](选择设备界面.png)

![创建成功界面](创建成功界面.png)

### PLC发现及设置

![选择设备然后扫描网络](设备发现界面.png)
![选择目标设备](网络扫描结果界面.png)

![登录](登录.png)
![plc连接完成](plc连接完成页面.png)

### PN协议调试

![选择添加gsd描述文件](选择添加gsd描述文件.png)
![添加gsd描述文件（profinet设备描述文件）](添加gsd文件.png)

![选择device添加Ethernet设备](添加Ethernet设备.png)
![选择Ethernet设备添加PN-controller主站](添加PN主站.png)

![选择主站扫描从站](添加pn从站.png)
![绑定变量](pn绑定变量.png)

### Modbus协议调试

![添加Modebus设备](添加Modebus设备.png)
![设置Modbus参数](设置Modbus参数.png)

![添加串行主站](添加串行主站.png)
![添加串行从站](添加串行从站.png)

![设置从站id](设置从站id.png)
![添加从站通道](添加从站通道.png)

![添加通道，即Modbus访问参数](设置Modbus访问参数.png)
![绑定变量](Modbus绑定变量.png)

### 模拟量调试

![扫描扩展模块](扫描扩展模块.png)
![添加扩展设备](添加扩展设备.png)

![绑定变量](模拟量绑定变量.png)

### 使用mqtt发送数据

#### 设置mqtt云服务器地址

![通过https://PLC-IP/访问配置页面，重启生效](mqtt配置页面.png)

#### 添加依赖库

![添加mqtt依赖库](添加mqtt依赖库.png)
![添加WagoAppCloud库](WagoAppCloud库.png)

#### 编程发送
```bash
PROGRAM Publish_NativeMQTT
VAR
	MyInterval		: TIME := T#5S;
	Timer			: TON;
	
	dwMyCounter 	: DWORD := 1;
	MyString 		: STRING(255);
	aBuffer			: ARRAY[0..255] OF BYTE;
	dwBytesCount 	: DWORD;
	
	oFbPublish 		: WagoAppCloud.FbPublishMQTT;
	xMyTrigger		: BOOL := FALSE;
	dwBusyCounter	: DWORD := 0;
	dwErrorCounter	: DWORD := 0;
	 udiOffset      : UDINT := 0;
END_VAR
```

```bash
// 定时发送
Timer(IN := TRUE, PT := MyInterval);
IF Timer.Q THEN
	Timer(IN := FALSE);

	IF NOT oFbPublish.xBusy THEN
    // 拼接发送payload，由于PLC中字符串长度限制为255，所以直接将二进制数据拼接发送
		udiOffset := 0;

		MemCopy(
			pDest := ADR(aBuffer) + udiOffset,
			pSource := ADR(MB_RTU_Data),
			udiSize := SIZEOF(MB_RTU_Data)
		);
		
		udiOffset := udiOffset + SIZEOF(MB_RTU_Data);
		
		MemCopy(
			pDest := ADR(aBuffer) + udiOffset,
			pSource := ADR(An),
			udiSize := SIZEOF(An)
		);
		
		udiOffset := udiOffset + SIZEOF(An);
		
		MemCopy(
			pDest := ADR(aBuffer) + udiOffset,
			pSource := ADR(PN_Encoder),
			udiSize := SIZEOF(PN_Encoder)
		);
		
		udiOffset := udiOffset + SIZEOF(PN_Encoder);
		
    // 触发发送逻辑
		// Trigger the transmission
		xMyTrigger := TRUE;
	ELSE
		// Busy statistics counter
		dwBusyCounter := dwBusyCounter + 1;
	END_IF
	
	IF oFbPublish.xError THEN
		// Error statistics counter
		dwErrorCounter := dwErrorCounter + 1;
	END_IF
	
END_IF

// 触发发送逻辑
// Trigger MQTT publish
oFbPublish(sTopic := 'wago/pfc/cloudconnectivity/example/mqttpublish',
			eQualityOfService := 1,
			dwSize := udiOffset,
			aData := aBuffer,
			xTrigger := xMyTrigger);
```