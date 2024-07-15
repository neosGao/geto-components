## 初次使用：

## 1、初始化子模块

```git
git submodule init
```

## 2、更新子模块

```git
git submodule update
```

### 至此已经成功获取 git 上 submodule 的内容

## 其余常用命令：

## 获取最新的子模块变更

```git
git submodule update --remote
```

## 切换子模块到特定分支/提交

```git
cd <path_to_submodule_directory>
git checkout <branch_or_commit>
cd ..
```

## 删除子模块

```git
git submodule deinit -f <path_to_submodule_directory>
git rm -f <path_to_submodule_directory>
rm -rf .git/modules/<path_to_submodule_directory>
```

## 查看子模块状态

```git
git submodule status
```

path_to_submodule_directory 为子库的远程地址
branch_or_commit 为分支的名称或 hash 值
