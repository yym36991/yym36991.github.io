
2.1 分支类型说明
- 主干分支（master）：永远保持干净、稳定、可上线，禁止直接在主干修改代码。
- 个人私有开发分支：所有开发必须新建个人分支，不允许直接在公共分支开发。
2.2 分支命名规范
统一格式：类型前缀-用户名-功能名
其中的类型前缀可以是如下一种：
1. feature    新功能开发
2. bugfix     BUG 修复
3. optimize   功能优化
4. refactor   代码重构
示例：
- feature-zhangsan-user-login（用户登录功能）
- feature-lisi-order-pay（订单支付功能）
3. 完整开发流程（含全部命令+详细解释）
3.1 第一步：拉取最新主干，新建私有分支
每次开发新功能，必须从最新主干拉取分支，避免初始代码过旧。
执行命令：
# 1. 切换到主干分支
git checkout master
# 2. 拉取主干最新代码
git pull
# 3. 新建个人私有分支并切换进去
git checkout -b feature-xxx-demo
注意：个人分支属于私有分支，别人不会协同修改，允许自由 rebase、修改提交记录。
3.2 第二步：开发编码 + 规范提交（重点：善用 amend）
3.2.1 提交原则
- 禁止频繁提交：修复bug、补代码、改文字，不要多次重复提交。
- 单次功能尽量保持一个功能、一条提交。
- 小修改、补改代码，一律使用 git commit --amend 合并到上一次提交。
3.2.2 提交命令说明
普通初次提交：
git add .
git commit -m "【功能】新增用户登录接口"
写完发现漏改、改错、补充代码（不要新建commit）：
git add .
# 把本次改动合并到上一次提交，不产生新记录
git commit --amend --no-edit
3.2.3 amend 使用场景总结
- 代码写完补充逻辑
- 修复自测发现的小bug
- 注释、文案、格式优化
- 配置文件微调
目的：避免出现大量“修复bug、再次修复、补充代码”垃圾提交。
3.3 第三步：开发完成，合并前置操作（重点：rebase拉直分支）
3.3.1 使用场景
功能开发完毕，准备合并到主干之前，必须执行 git rebase。
作用：把当前分支接续到主干最新代码末尾，消除分叉，主干永远保持一条直线。
3.3.2 操作命令
# 1. 先切主干拉最新
git checkout master
git pull
# 2. 切回自己的开发分支
git checkout feature/xxx-demo
# 3. 变基：把自己的提交平移到主干最新末尾
git rebase master
3.3.3 遇到冲突怎么处理
1. 冲突全部在个人本地分支解决，禁止丢到主干合并时处理。
2. 修改完冲突代码后执行：
git add .
git rebase --continue
中途想放弃变基：
git rebase --abort
3.4 第四步：推送远程 + 提交合并请求
3.4.1 推送代码
git push origin feature/xxx-demo
3.4.2 Merge / PR 注释规范（强制）
合并注释必须清晰可读，禁止随意填写，格式规范：
【类型】功能模块：详细说明改动内容
类型可选：【功能】【修复】【优化】【重构】【配置】
示例：
- 【功能】用户模块：新增手机号登录、验证码校验
- 【修复】订单模块：修复支付回调重复下单问题
- 【优化】接口性能：缓存优化，减少数据库查询次数
4. 禁止行为（红线规范）
1. 禁止直接在 master 主干分支编写、修改代码。
2. 禁止大量无意义提交：修复、再改、微调、回滚等垃圾记录。
3. 禁止主干直接 merge 产生交叉分叉，必须前置 rebase。
4. 禁止提交注释随便乱写，如：修改、调试、更新代码。
5. 公共分支（多人共用）禁止使用 rebase，仅个人私有分支允许 rebase。
5. 常用高频命令汇总（可收藏）
# 新建并切换分支
git checkout -b feature/xxx
# 查看本地分支
git branch
# 简单提交
git commit -m "注释"
# 合并到上一次提交（最常用）
git commit --amend --no-edit
# 拉取主干最新
git pull
# 变基拉直分支
git rebase master
# 冲突解决后继续
git rebase --continue
# 放弃本次变基
git rebase --abort
# 查看分支有没有分叉（排查历史）
git log --oneline --graph --all
6. 规范最终目的
1. 分支干净：主干永远线性无分叉，历史清晰。
2. 提交干净：一个功能一条提交，无杂乱垃圾记录。
3. 冲突可控：冲突全部本地解决，不污染公共主干。
4. 追溯简单：后续排查bug、回滚版本、代码复盘成本极低。

git pull master
git checkout y_compactor_0407
git rebase master

git push origin y_compactor_0407
To igit.58corp.com:storage-app/wos/wos.git
 ! [rejected]          y_compactor_0407 -> y_compactor_0407 (non-fast-forward)
error: failed to push some refs to 'igit.58corp.com:storage-app/wos/wos.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

确认安全后使用
git push origin y_compactor_0407  --force-with-lease


# 合并多次提交
git reset --soft HEAD~7 把最近 7 个提交（a3c2fbba … b5ac62e3）从历史上拿掉，但改动全部留在暂存区，再执行一次：

git commit -m "修复压缩过程中任务、锁释放失败的bug"

再强制推送到远程，覆盖原有提交记录：
git push --force-with-lease origin y_compactor_0407

以后自己想操作时
合并最近 N 条成 1 条：git reset --soft HEAD~N，再 git commit -m "新说明"。