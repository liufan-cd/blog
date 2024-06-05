## 简介
Git是一个免费的、开源的分布式版本控制系统，可以快速高效的处理从小型到大型的各种项目。方便快捷管理所有文件版本。

普通文件修改，git会计算其改动。使用git add可以将改动加入暂存区，使用git commit可以将暂存区改动提交至本地仓库。本地仓管通过push和pull来和远程仓库进行改动交换。

一般ide会在commit的时候，自动将目标使用git add加入暂存区，然后commit。

![git流程](git流程.png)

#### git使用

##### 下载git

[下载地址](https://git-scm.com/download)

##### 安装git
打开安装包，一直点是

##### 工具地址
[git book](https://git-scm.com/book/zh/v2)

#### 常用命令

ssh key 目录地址
默认在用户admin目录下的.ssh中

![ssh_key公钥地址](ssh_key公钥地址.png)

生成ssh key：comment为任意文本，用于区别ssh key
`ssh-keygen -t rsa -C "comment"`

设置ssh key
以git hub为例，其他所有的服务器类似，都是通过将ssh key的公钥上传服务器，用于连接验证
![ssh_key设置](ssh_key设置.png)

创建git仓库
`git init`

指定远程仓库：url为远程仓库地址，可以是ssh连接形式，也可以是http形式
`git remote add url`

推送项目：origin为远程仓库名
`git push origin`

创建新的分支：branch为新分支名字
`git checkout -b branch`0

根据远程仓库中的分支，创建新的本地分支：branch为创建分支名字，origin_branch为远程分支名字
`git checkout -b branch origin/origin_branch`

切换分支：branch为切换分支
`git checkout branch`

查看暂存区状态
`git status`

git仓库添加文件：file为新加文件
`git add file`

提交：message提交信息
`git commit -m message`

推送：origin远程仓库名，可以通过git remote设置别名
`git push origin`

推送：origin远程仓库名，可以通过git remote设置别名，branch为指定分支
`git pull origin branche`

指定邮箱：email为自定义邮箱
`git config --global user.email "email"`

指定用户：user为自定义用户
`git config --global user.name "user"`

重置文件：file_name为文件名
`git restore file_name`

删除文件：file_name为文件名
`git rm file_name`