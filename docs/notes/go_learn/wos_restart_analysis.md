# wos_store_restart.sh 脚本问题分析

## 🔍 对比分析：wos vs nebula 重启脚本

### 关键代码对比

#### Nebula 脚本 (`restart.sh`)
```bash
#不存在pidfile,为新创建；存在pidfile,用这个pid去ps，如果有，为升级，其余均为错误
if [ -f $pidfile ];then
    echo "exist pidfile,restart process" >> $curdir/update.log
    pid=`cat $pidfile`
    findpid=`ps -ef | grep $pid | grep $2`
    echo $findpid >> $curdir/update.log
    if [ -z "$findpid" ];then
        echo "can not find this process" >> $curdir/update.log
        exit 1
    fi
```

#### WOS 脚本 (`wos_store_restart.sh`)
```bash
#不存在pidfile,为新创建；存在pidfile,用这个pid去ps，如果有，为升级，其余均为错误
if [ -f $pidfile ];then
    echo "exist pidfile,restart process" >> $curdir/update.log
    pid=`cat $pidfile`
    findpid=`ps -ef | grep $pid | grep $2`
    echo $findpid >> $curdir/update.log
    if [ -z "$findpid" ];then
        echo "can not find this process" >> $curdir/update.log
        exit 1
    fi
```

## ✅ 结论：**是的，WOS 脚本也存在同样的问题！**

### 📊 问题对比表

| 问题项 | Nebula (`restart.sh`) | WOS (`wos_store_restart.sh`) | 状态 |
|--------|----------------------|------------------------------|------|
| pidfile 存在但进程不存在时 exit 1 | ❌ 存在 | ❌ 存在 | 相同问题 |
| 进程检查方式（grep 可能误匹配） | ⚠️ `ps -ef \| grep $pid \| grep $2` | ⚠️ `ps -ef \| grep $pid \| grep $2` | 相同问题 |
| 异常退出场景处理 | ❌ 无处理 | ❌ 无处理 | 相同问题 |
| 注释说明 | ✅ 有说明 | ✅ 有说明 | 相同 |

## 🔍 详细分析

### 1. 相同的核心逻辑（33-41行）

```bash
if [ -f $pidfile ];then
    echo "exist pidfile,restart process" >> $curdir/update.log
    pid=`cat $pidfile`
    findpid=`ps -ef | grep $pid | grep $2`  # ⚠️ 相同的问题
    echo $findpid >> $curdir/update.log
    if [ -z "$findpid" ];then
        echo "can not find this process" >> $curdir/update.log
        exit 1  # ❌ 相同的问题
    fi
```

### 2. 相同的设计意图（第32行注释）

两个脚本使用完全相同的注释：
```bash
#不存在pidfile,为新创建；存在pidfile,用这个pid去ps，如果有，为升级，其余均为错误
```

### 3. WOS 脚本的额外特点

#### 3.1 支持更多类型
```bash
# WOS 支持的类型
- manager
- directory
- proxy
- detector
- store

# Nebula 支持的类型
- master
- store
```

#### 3.2 proxy 类型的特殊处理
```bash
if [ $2 == "proxy" ];then
    pidfile=$2_http_pid.txt  # 特殊的 pidfile 名称
else
    pidfile=$2_pid.txt
fi
```

#### 3.3 store 类型的重启方式不同
```bash
# WOS store 类型
elif [ $2 == "store" ];then
    ./wos-storetool restart ../conf/wos.conf >> $curdir/update.log  # 使用工具重启

# Nebula store 类型
elif [ $2 == "store" ];then
    kill $pid
    while(true)  # 有等待逻辑
    do
      findpid=`ps -ef | grep $pid | grep $2`
      if [ -z "$findpid" ];then
        break
      fi
      sleep 2
    done
    ./start.sh store ../conf/nebula2.conf >> $curdir/update.log
```

#### 3.4 WOS 有 etcd 集成
```bash
# WOS store 类型会从 etcd 获取路径信息
exist_cid_type=`$curdir/etcdctl --endpoints=$etcd_domain --user=$etcd_root get /wos/v1/cluster/$cid/group/${group}/stores/$local_ip --prefix --keys-only| grep -w $local_ip`
```

#### 3.5 WOS 有 crontab 监控设置
```bash
# 启动crontab的monitor监控（128-134行）
tmpcronlist=/tmp/wosuspcronlist.txt
crontab -l > $tmpcronlist
sed -i '/wos-monitor/d' $tmpcronlist
echo "* * * * * cd /opt/woscomm/wos-monitor/bin && ./check.sh >> /dev/null 2>&1" >> $tmpcronlist
crontab $tmpcronlist
rm -rf $tmpcronlist
```

## ⚠️ WOS 脚本的潜在影响

### 1. 影响范围更大
- WOS 支持 5 种类型（manager, directory, proxy, detector, store）
- 每种类型都可能遇到 pidfile 存在但进程不存在的问题
- 特别是 `directory` 和 `store` 类型使用工具重启，可能更容易出现异常退出

### 2. store 类型的特殊风险
```bash
elif [ $2 == "store" ];then
    ./wos-storetool restart ../conf/wos.conf >> $curdir/update.log
```
- 使用 `wos-storetool restart` 工具
- 如果工具执行失败或进程异常退出，pidfile 可能残留
- 下次执行脚本时会触发 exit 1

### 3. proxy 类型的 pidfile 名称特殊
```bash
if [ $2 == "proxy" ];then
    pidfile=$2_http_pid.txt  # proxy_http_pid.txt
else
    pidfile=$2_pid.txt
fi
```
- proxy 类型的 pidfile 名称不同
- 但检查逻辑相同，问题依然存在

## 🔧 改进建议

### 方案1：统一改进两个脚本（推荐）

```bash
# 改进进程检查逻辑
if [ -f $pidfile ];then
    echo "exist pidfile,restart process" >> $curdir/update.log
    pid=`cat $pidfile`
    
    # 更精确的进程检查
    if ps -p $pid > /dev/null 2>&1; then
        # 进程存在，继续重启流程
        findpid="found"
    else
        # 进程不存在，检查是否是异常退出
        echo "pidfile exists but process not found, checking if it's a stale pidfile..." >> $curdir/update.log
        
        # 等待 2 秒，可能是进程正在退出
        sleep 2
        if ps -p $pid > /dev/null 2>&1; then
            findpid="found"
        else
            echo "process definitely not running, cleaning stale pidfile" >> $curdir/update.log
            rm -f $pidfile
            # 继续执行新进程启动逻辑（走 else 分支）
            findpid=""  # 设置为空，让脚本走 else 分支
        fi
    fi
    
    if [ -n "$findpid" ];then
        # 进程存在，执行重启逻辑
        # ... 原有的重启逻辑 ...
    fi
else
    # pidfile 不存在，启动新进程
    # ... 原有的启动逻辑 ...
fi
```

### 方案2：为不同场景提供不同策略

```bash
if [ -z "$findpid" ];then
    echo "pidfile exists but process not found" >> $curdir/update.log
    
    # 根据类型采取不同策略
    if [ $2 == "store" ];then
        # store 类型：清理 pidfile 并重新启动
        echo "cleaning stale pidfile for store type" >> $curdir/update.log
        rm -f $pidfile
        # 继续执行启动逻辑
    elif [ $2 == "directory" ];then
        # directory 类型：清理 pidfile 并重新启动
        echo "cleaning stale pidfile for directory type" >> $curdir/update.log
        rm -f $pidfile
        # 继续执行启动逻辑
    else
        # 其他类型：保持原有行为，exit 1
        echo "can not find this process" >> $curdir/update.log
        exit 1
    fi
fi
```

## 📊 问题总结

| 脚本 | 问题 | 影响范围 | 严重程度 |
|------|------|----------|----------|
| `restart.sh` (Nebula) | pidfile 存在但进程不存在时 exit 1 | master, store | 高 |
| `wos_store_restart.sh` (WOS) | pidfile 存在但进程不存在时 exit 1 | manager, directory, proxy, detector, store | 高 |

## 💡 建议

1. **统一改进两个脚本**：使用更精确的进程检查方法
2. **增加异常处理**：自动清理 stale pidfile
3. **增加日志记录**：记录异常情况的详细信息
4. **考虑使用 systemd**：如果可能，使用 systemd 管理进程，避免 pidfile 管理问题

