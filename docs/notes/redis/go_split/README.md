# MySQL慢日志处理器 (Go版本)

这是一个用Go语言实现的MySQL慢日志处理系统，功能与原Python版本相同。

## 功能特性

- 从Kafka消费MySQL慢日志数据
- 解析MySQL 5.5-8.0版本的慢日志格式
- 提取关键信息：用户、主机、查询时间、锁时间、行数、SQL语句等
- 生成SQL指纹（使用外部工具sql-calculator）
- 将处理后的数据存储到Elasticsearch
- 支持并发处理，提高性能

## 项目结构

```
go_split/
├── main.go                 # 主程序入口
├── go.mod                  # Go模块文件
├── config/
│   ├── config.ini         # 配置文件
│   └── config.go          # 配置加载模块
├── models/
│   └── slowlog.go         # 数据模型定义
├── parser/
│   └── slowlog_parser.go  # 慢日志解析器
├── processor/
│   └── slowlog_processor.go # 主要处理器
├── storage/
│   └── elasticsearch.go   # Elasticsearch存储模块
├── utils/
│   └── sql_calculator.go  # SQL计算器工具
└── README.md              # 项目说明
```

## 配置说明

配置文件 `config/config.ini` 包含以下配置项：

### Elasticsearch配置
- `domain`: ES服务器域名
- `read_username`: ES用户名
- `read_password`: ES密码
- `port`: ES端口

### Kafka配置
- `topic`: Kafka主题名
- `group_id`: 消费者组ID
- `bootstrap_servers`: Kafka服务器列表（逗号分隔）
- `sql_calculator`: SQL指纹计算器工具路径

## 安装和运行

1. **安装依赖**
   ```bash
   go mod tidy
   ```

2. **配置环境**
   - 确保sql-calculator工具已安装并可执行
   - 修改config/config.ini中的配置参数

3. **运行程序**
   ```bash
   go run main.go
   ```

## 与原Python版本的对比

### 优势
- **性能更好**: Go的并发处理能力更强
- **内存效率**: Go的内存管理更高效
- **部署简单**: 编译成单一可执行文件
- **类型安全**: 强类型系统减少运行时错误

### 功能对等
- 完全相同的慢日志解析逻辑
- 相同的Kafka消费和ES存储功能
- 相同的SQL指纹计算和校验和生成
- 相同的错误处理和状态管理

## 注意事项

1. 需要确保sql-calculator工具在指定路径可用
2. Kafka和Elasticsearch服务需要正常运行
3. 配置文件中的认证信息需要正确设置
4. 建议在生产环境中使用日志轮转和监控

## 开发说明

- 使用Go 1.21+
- 主要依赖：sarama (Kafka)、go-elasticsearch (ES)、logrus (日志)
- 支持并发处理，默认使用goroutine池
- 错误处理采用优雅降级策略 