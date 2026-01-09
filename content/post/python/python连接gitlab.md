---
title: 🔊 通过python访问gitlab
summary: 通过python访问gitlab
date: 2025-08-05
authors:
  - admin
tags:
  - python
image:
  filename: "Image_1757402967849.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 通过python访问gitlab

### 环境配置

```bash
pip install python_gitlab==3.14.0
pip install Requests==2.31.0
```

### 代码
```python
import gitlab
from datetime import datetime
import calendar
# import pymysql
import re

# 获取当前时间
now = datetime.now()
year = now.year
month = now.month - 1 # 统计上一个月
# month = now.month    # 统计本月
day = calendar.monthrange(year, month)[1]
# yesterday = calendar.monthrange(year, month)[1] - 1

def git_address_to_number(git_address):     #根据git地址返回对应数字编号
    if git_address == 'git.gitlab.com' or git_address == 'http://git.gitlab.com/':
        return '1'
    elif git_address == 'git2.gitlab.com' or git_address == 'http://git2.gitlab.com/':
        return '2'
    else :
        return '3'

def time_without_timezone(date):    #移除时间中的地区信息
    time = date
    output_datetime_str = re.sub(r'[+-]\d{2}:\d{2}', '', time)
    return output_datetime_str

def check_pid_exist(pid): # 判断项目id是否存在
    try:
        return True
    except gitlab.exceptions.GitlabGetError as e:
        print(f"{pid},{e.error_message}")
        return False
        pass

def check_branch_exist(pid,branch_name):    # 判断分支是否存在
    branch_data = []
    page = 0
    while  True:
        page += 1
        per_page = 100
        branchs = project.branches.list(page=page, per_page=per_page)
        
        for branch in branchs:
                branch_data.append(branch.name)
        if branchs == []:
            break
    try:
        if branch_name in branch_data:
            return True
        return False
    except gitlab.GitlabGetError as e:
        print(f"无法获取项目或分支信息：{e}")
        return False
    except Exception as e:
        print(f"发生错误：{e}")
        return False

def get_commits(pid,branch_name):   #获取代码提交信息
    commit_data = []
    print(pid,branch_name) 
    start_date = datetime(year, month, 1).strftime("%Y-%m-%dT00:00:00Z")  # 月
    end_date = datetime(year, month, 1).replace(day=day).strftime("%Y-%m-%dT23:59:59Z")  # 月
    # start_date = datetime(year, month, 1).replace(day=yesterday).strftime("%Y-%m-%dT00:00:00Z")   # 统计前一日
    # end_date = datetime(year, month, 1).replace(day=yesterday).strftime("%Y-%m-%dT23:59:59Z")     # 统计前一日
    commits = project.commits.list(ref_name = branch_name, since=start_date, until=end_date, get_all=True)
    # 遍历每个提交
    for commit in commits:
        # 获取提交详细信息
        commit_details = project.commits.get(commit.id)
        commit_data.append({
            'gc_commitid' : commit_details.id,
            'gc_commit_short_id' : commit_details.short_id,
            'gc_created_at' : time_without_timezone(commit_details.created_at),
            'gc_parent_ids' : format(commit_details.parent_ids),
            'gc_title' : commit_details.title,
            'gc_message' : commit_details.message,
            'gc_author_name' : commit_details.author_name,
            'gc_author_email' : commit_details.author_email,
            'gc_authored_date' : time_without_timezone(commit_details.authored_date),
            'gc_committer_name' : commit_details.committer_name,
            'gc_committer_email' : commit_details.committer_email,
            'gc_committed_date' : time_without_timezone(commit_details.committed_date),
            # 'gc_web_url' : commit_details.web_url,
            'gc_additions' : commit_details.stats['additions'],
            'gc_deletions' : commit_details.stats['deletions'],
            'gc_total' : commit_details.stats['total'],
            'gc_status' : commit_details.status,
            'gc_project_id' : commit_details.project_id,
            'gc_last_pipeline' : format(commit_details.last_pipeline),
            'gc_gittype' : git_address_to_number(gitlab_url),
            'gc_branch_name' : branch_name
        })
    return commit_data

def run_process(project_id,branch_name):
    if check_pid_exist(project_id) == True:
        if check_branch_exist(project_id,branch_name) == True:
            commit_data = get_commits(project_id,branch_name)
            print(commit_data)
            # insert_to_mysql(commit_data)
        else:
            print(f"项目'{project_id}'分支'{branch_name}'不存在")
            pass
    else:
        print(f"项目'{project_id}'不存在")
        pass

if __name__ == "__main__":
    gitlab_url = "http://192.168.10.234:8091"       # gitlab地址         
    private_token = 'pnoHo21NG5GrLNjStyWy'      # gitlab账号token
    project_id = 58  # 项目id列表
    branch_name = 'master'
    gl = gitlab.Gitlab(gitlab_url, private_token=private_token)
    project = gl.projects.get(58, lazy=True)  # 获取项目
    run_process(project_id, branch_name)
```

### python-gitlab文档
[文档地址](https://python-gitlab.readthedocs.io/en/stable/index.html)