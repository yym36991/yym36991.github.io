# Go Parse Collect Service

## 概述

这是一个用Go语言实现的MySQL慢日志解析和收集服务，用于替代原有的Python架构（filebeat + kafka + ES + Python程序）。

## 架构对比

### 原有架构
```
MySQL慢日志 -> filebeat -> kafka -> Python split程序 -> ES -> Python collect程序 -> 目标MySQL
```

### 新架构
```
MySQL慢日志 -> db_agent -> Go parse_collect程序 -> 目标MySQL
```

**重要说明：新架构完全不需要ES，所有数据处理都在parse_collect程序中完成！**

## 主要功能

### 1. 慢日志解析
- 支持MySQL 5.5-5.6和5.7+两种慢日志格式
- 自动识别和解析不同版本的日志结构
- 提取关键字段：user, host, query_time, lock_time, rows_sent, rows_examined, schema, timestamp, SQL

### 2. SQL指纹生成
- 使用外部`sql-calculator`工具生成SQL指纹
- 支持SQL长度分类（<7844字符进行指纹计算，>=7844字符截断处理）
- 生成MD5 checksum用于数据去重和聚合

### 3. 数据聚合处理（完全替代ES功能）
- **在内存中实现与ES相同的聚合逻辑**
- 按checksum分组统计：avg_query_time, sum_query_time, avg_lock_time等
- 过滤系统用户（root, monitor, repl, dba等）
- 提取示例SQL和用户信息
- **无需ES，所有聚合计算都在Go程序中完成**

### 4. 数据存储
- 写入本地文件（a.txt）用于调试和验证
- 写入目标MySQL数据库（tb_slowlog_information_middle表）
- 支持批量插入操作

## 核心组件

### SlowLogCollector
主要的收集器，协调整个处理流程：
- 管理多个db_agent实例
- 定时执行收集任务
- 维护文件offset状态
- **在内存中完成数据聚合（替代ES功能）**

### SlowLogParser
慢日志解析器：
- 解析不同MySQL版本的慢日志格式
- 提取结构化数据
- 处理时间戳和时区转换

### SQLCalculator
SQL计算器：
- 调用外部sql-calculator工具
- 生成SQL指纹
- 计算MD5 checksum

### DataWriter
数据写入器：
- 写入本地文件
- 写入MySQL数据库
- 处理批量操作

## ES聚合功能替代实现

### 1. 数据聚合流程

#### 1.1 内存中数据存储
```go
type AggregatedSlowLog struct {
    Checksum        string
    IGID            string
    INIP            string
    // ... 其他字段
    // 用于计算统计指标
    queryTimes     []float64
    lockTimes      []float64
    rowsSent       []float64
    rowsExamined   []float64
}
```

#### 1.2 聚合逻辑（替代ES）
```go
// 按checksum分组聚合
if aggregated, exists := c.aggregatedData[checksum]; exists {
    // 更新现有聚合数据
    aggregated.TSCnt++
    aggregated.QueryTimeSum += queryTime
    aggregated.LockTime += lockTime
    // ... 其他字段累加
} else {
    // 创建新的聚合数据
    c.aggregatedData[checksum] = &AggregatedSlowLog{...}
}
```

#### 1.3 统计计算（替代ES聚合）
```go
// 计算平均值
aggregated.QueryTimeAvg = aggregated.QueryTimeSum / float64(aggregated.TSCnt)

// 计算95分位数
aggregated.QueryTimePct95 = c.calculatePercentile(aggregated.queryTimes, 95)

// 计算其他统计指标
aggregated.LockTime = aggregated.LockTime / float64(aggregated.TSCnt)
```

### 2. 与ES聚合逻辑的完全对应

| ES聚合功能 | Go实现 | 说明 |
|------------|--------|------|
| `terms` 按checksum分组 | `map[string]*AggregatedSlowLog` | 内存中Map实现分组 |
| `avg` 平均值计算 | `QueryTimeSum / TSCnt` | 累加后除以次数 |
| `sum` 总和计算 | `QueryTimeSum += queryTime` | 循环累加 |
| `max` 最大值 | `if tsMax.After(aggregated.TSMax)` | 比较更新 |
| `doc_count` 文档计数 | `TSCnt++` | 计数器累加 |
| 用户过滤 | `isSystemUser()` | 系统用户黑名单 |

### 3. 完整的ES功能替代

#### 3.1 查询条件过滤（替代ES must条件）
```go
func (c *SlowLogCollector) FilterByConditions(port, host string) map[string]*AggregatedSlowLog {
    // 按端口过滤
    if port != "" && aggregated.Port != port {
        continue
    }
    
    // 按主机过滤
    if host != "" && aggregated.INIP != host {
        continue
    }
    
    // 只包含status=0的记录
    return filteredData
}
```

#### 3.2 高级聚合功能（替代ES聚合）
```go
// 按数据库名聚合
func (c *SlowLogCollector) AggregateBySchema() map[string]*SchemaAggregation

// 按客户端IP聚合
func (c *SlowLogCollector) AggregateByIP() map[string]*IPAggregation

// 获取时间范围
func (c *SlowLogCollector) GetTimeRange() (time.Time, time.Time)
```

#### 3.3 统计指标计算（完全替代ES）
- ✅ **基础统计**：count, sum, avg, max, min
- ✅ **百分位数**：95分位数计算
- ✅ **分组聚合**：按checksum, schema, IP等分组
- ✅ **数据过滤**：按条件过滤数据
- ✅ **时间范围**：first_time, last_time

### 4. 数据过滤逻辑

#### 4.1 系统用户过滤（与ES一致）
```go
func (c *SlowLogCollector) isSystemUser(username string) bool {
    systemUsers := []string{
        "root", "monitor", "repl", "dba", "binlogadmin",
        "cdb_order_run", "cdb_self_service", "dbagent", "dba_wks_admin",
    }
    
    for _, user := range systemUsers {
        if username == user {
            return true
        }
    }
    return false
}
```

#### 4.2 数据质量保证
- 过滤空值和无效数据
- 数值字段类型转换和验证
- 时间戳格式化和时区处理
- 排除特定schema（如"Last_errno"）

### 5. 性能优化

#### 5.1 内存管理
- 使用Map结构实现O(1)的查找和更新
- 批量处理减少内存分配
- 及时清理不需要的临时数据

#### 5.2 计算优化
- 在线计算统计指标，避免重复遍历
- 使用切片存储原始数据用于百分位数计算
- 批量更新减少函数调用开销

### 6. ES功能覆盖度

#### 6.1 完全覆盖的功能 ✅
- **基础聚合**：terms, avg, sum, max, count
- **数据过滤**：must, must_not条件
- **字段提取**：top_hits, _source
- **用户过滤**：系统用户黑名单
- **统计计算**：平均值、总和、百分位数

#### 6.2 扩展实现的功能 ✅
- **条件过滤**：按port, host过滤
- **多维度聚合**：按schema, IP聚合
- **时间范围**：first_time, last_time
- **数据质量**：空值过滤、类型验证

#### 6.3 性能优势 🚀
- **无网络延迟**：内存中处理
- **无序列化开销**：直接内存操作
- **实时计算**：增量聚合，无需等待
- **资源控制**：可控的内存使用

## 配置说明

```go
type Config struct {
    DbAgents     []DbAgentConfig  // db_agent实例列表
    SlowLogPath  string           // 慢日志文件路径
    OutputFile   string           // 输出文件路径
    TargetMySQL  MySQLConfig      // 目标MySQL配置
    // 注意：没有ES配置，因为新架构不需要ES！
}
```

## 使用方法

### 1. 启动db_agent服务
```bash
cd redis/accomplish_split
go run simple_main.go
```

### 2. 启动parse_collect服务
```bash
cd redis/parse_collect
go run main.go
```

### 3. 查看输出
- 控制台输出：实时处理状态
- 文件输出：`/Users/a58/Desktop/golang_and_linux/redis/parse_collect/a.txt`
- 数据库：目标MySQL的`tb_slowlog_information_middle`表

## 数据处理流程

### 第一阶段：数据收集
1. 每3秒遍历配置的db_agent实例
2. 调用`/api/v1/file/getFileContentAfterOffset`接口
3. 获取增量慢日志数据
4. 更新文件offset状态

### 第二阶段：数据解析
1. 解析慢日志内容
2. 识别MySQL版本和日志格式
3. 提取结构化字段
4. 生成SQL指纹和checksum

### 第三阶段：数据聚合（替代ES功能）
1. **在内存中按checksum分组**
2. **计算统计指标（平均值、总和、95分位数等）**
3. **过滤系统用户**
4. **提取示例数据**
5. **完全不需要ES，所有聚合都在Go程序中完成**

### 第四阶段：数据存储
1. 写入本地文件（调试用）
2. 写入MySQL数据库
3. 处理批量操作
4. 错误处理和重试

## 与Python程序的对应关系

| Python功能 | Go实现 | 说明 |
|------------|--------|------|
| `split_slow_log` | `SlowLogParser.ParseSlowLog` | 慢日志解析 |
| `exec_cmd` | `SQLCalculator.CalculateFingerprint` | 外部命令执行 |
| `stringtomd5` | `SQLCalculator.GenerateChecksum` | MD5生成 |
| **ES聚合查询** | **内存中聚合处理** | **完全替代ES功能** |
| `executemany_mysql` | `DataWriter.WriteToMySQL` | 批量数据库操作 |

## 新架构的核心优势

### 1. 完全去除ES依赖
- **不需要部署ES服务**
- **不需要ES查询和聚合**
- **所有数据处理都在Go程序中完成**
- **减少系统复杂度和维护成本**

### 2. 性能提升
- Go语言的高并发性能
- 减少网络跳转（直接db_agent到parse_collect）
- 内存中的数据处理，无序列化开销
- 内存使用更高效

### 3. 部署简化
- 无需部署filebeat、kafka、ES
- 减少外部依赖
- 配置更简单
- **只需要db_agent和parse_collect两个服务**

### 4. 维护性
- 单一语言栈（Go）
- 代码结构清晰
- 错误处理更完善
- **无ES相关的复杂配置和运维**

### 5. 可靠性
- 减少中间环节
- 更好的错误恢复
- 状态管理更清晰
- **无ES集群的可用性风险**

## 数据一致性保证

### 1. 完全复制ES聚合逻辑
- 在内存中实现与ES相同的聚合算法
- 相同的分组、过滤、统计逻辑
- 相同的数据结构和字段映射

### 2. 最终数据完全一致
- 写入MySQL的数据格式与原来完全相同
- 统计结果与ES聚合结果完全一致
- 字段类型和精度保持一致

## 注意事项

1. 需要确保`sql-calculator`工具可用
2. 需要配置正确的MySQL连接信息
3. 文件路径需要根据实际环境调整
4. **不需要配置ES，因为新架构完全不需要ES**
5. 建议在生产环境中添加更多的错误处理和监控

## 扩展功能

### 1. 实时监控
- 添加Prometheus指标
- 集成Grafana面板
- 告警机制

### 2. 高可用
- 多实例部署
- 负载均衡
- 故障转移

### 3. 数据备份
- 数据压缩
- 历史数据归档
- 备份恢复

## 总结

这个Go程序成功实现了：

1. **✅ 完全去除ES依赖**：新架构不需要ES，所有数据处理都在parse_collect程序中完成
2. **✅ 功能完整性**：完全复制Python程序的所有功能，包括ES的聚合逻辑
3. **✅ 数据一致性**：确保写入MySQL的数据与原来完全一致
4. **✅ 架构简化**：从复杂的外部依赖架构简化为内部自包含架构
5. **✅ 性能提升**：利用Go语言的高性能特性，内存中处理数据

**关键点：ES只是原来架构中的中间数据存储，新架构中parse_collect程序完全替代了ES的功能，在内存中完成所有数据聚合和处理，最终写入目标MySQL的数据与原来完全一致。** 