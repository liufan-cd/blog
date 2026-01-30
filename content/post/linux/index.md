---
title: 🧩 linux
description: linux常用命令
date: 2025-08-05
authors:
  - admin
categories:
  - 命令
tags:
  - linux
  - 命令
image:
  filename: "Image_1753955926661.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
# 常用命令

## 系统监控

---
查看cpu，内存
```bash
top
```

查看内存
```bash
free -h
```

查看磁盘
```bash
df -h
```

查看磁盘
```bash
du -h
```
```bash
du -ah
```

查看磁盘io
```bash
vmstat -d 1
```

查看进程中包含java关键字
```bash
ps -ef | grep java
```

查看定时任务
```bash
crontab -l
```

定时删除日志
```bash
0 0 */1 * * /usr/bin/find /home/project/provincial-iot/iot-plugin/analysis/logs -ctime +1 -exec rm -rf {} \;
```

定时执行脚本
```bash
*/5 * * * * sh /home/project/provincial/storage_monitor.sh
```
分钟 小时 日 月 星期

查看一天前移动或创建的文件
```bash
-ctime +1
```

将之前的字符串执行
```bash
-exec rm -rf {} \;
```

创建窗口
```bash
screen -R xxx
```

进入窗口
```bash
screen -r xxx
```

强制退出窗口，每一个窗口只能一个人使用
```bash
screen -d xxx
```

---
## 网络


查看ip端口是否可用
```bash
telent ip port
```

查看tcp端口监听
```bash
netstat -tulnp
```

启动防火墙
```bash
systemctl start firewalld
```

查看防火墙
```bash
systemctl status firewalld
```

关闭防火墙
```bash
systemctl stop firewalld
```

开放端口
```bash
firewall-cmd --add-port=18087/tcp --permanent
```
```bash
firewall-cmd --reload
```

移除开放端口
```bash
firewall-cmd --permanent --remove-port=7000/tcp
```

重新加载防火墙配置
```bash
firewall-cmd --reload
```

查看开放端口
```bash
firewall-cmd --zone=public --list-ports
```

查看监听端口
```bash
lsof -i:18087
```
```bash
lsof -nP -iTCP -sTCP:LISTEN
```

网络工具包
```bash
yum -y install net-tools
```

查看监听端口
```bash
ss -nltp
```

生成sshkey
```bash
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
```

将sshkey公钥放入其他服务器
```bash
ssh-copy-id root@192.168.10.200
```

使用sshkey登录其他服务器
```bash
ssh -i /home/chaoying/.ssh/id_rsa root@192.168.10.200
```

发送请求
```bash
wget https://baidu.com
```
```bash
curl
```

路由追踪
```bash
yum install traceroute
```
```bash
traceroute 117.175.145.53
```

---
## 文件管理

进入根目录
```bash
cd /
```

创建文件夹
```bash
mkdir xxx
```

强制删除文件
```bash
rm -rf xxx
```

解压
```bash
tar -zxvf xxx.tar.gz
```
```bash
gzip -d xxx.gz
```
```bash
unzip xxx.zip
```

复制
```bash
cp origin remote
```

移动
```bash
mv origin remote
```

创建或编辑文件
```bash
vim xx
```

vim一共三种模式
默认模式
命令行模式 :进入命令行模式，Esc进入默认模式
编辑模式 按i进入编辑模式，Esc进入默认模式

安装xxxx应用
```bash
yum install xxxx
```

执行shell脚本
```bash
sh ./xxx.sh
```

使用sshkey复制文件到其他服务器
```bash
scp -i /home/chaoying/.ssh/id_rsa ./target/compressor.jar root@192.168.10.200:/home/compressor/test.jar
```

---
## 数据查看

查找文件
```bash
find | grep java
```

管道过滤，将前一个命令的回响结果进行过滤展示
```bash
xxx | grep
```

过滤查看第row行，第col个字符串
```bash
xxx | awk 'NR==row{print$col}'
```

查看文件搜索search_name上下10行
```bash
cat file | grep -10 'search_name'
```


将文件移动到xxxx目录并使用new_name
```bash
mv old_name xxxx/new_name
```

将文件复制到another目录下
```bash
cp name another
```

显示路径
```bash
pwd
```

---
# shell脚本

输出至空设备
```bash
>/dev/null 2>&1
```

启动命令文件名，第一，第二参数
```bash
$0,$1,$2
```

执行后续字符，
```bash
eval ""
```

switch语句
```bash
case "$1" in
"debug")
    debug
    ;;
"start")
    start
    ;;
"stop")
    stop
    ;;
"status")
    status
    ;;
"restart")
    restart
    ;;
*)
    echo "sh run.sh [debug | start | stop | status]"
    ;;
esac
```