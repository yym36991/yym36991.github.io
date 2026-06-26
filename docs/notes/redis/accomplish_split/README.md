# DB-Agent 服务

这是一个用于新架构的db-agent服务，用于替代原有的filebeat+Kafka+ES架构，实现MySQL慢日志的本地化处理。

## 功能特性

- **HTTP API接口**：提供文件内容读取接口
- **智能文件查找**：自动查找最新的慢日志文件
- **增量读取**：支持从指定offset读取文件内容
- **目录扫描**：支持从目录中查找慢日志文件
- **健康检查**：提供健康检查接口

## API接口

### 1. 获取文件内容

**接口地址：** `GET /api/v1/file/getFileContentAfterOffset`

**请求参数：**
- `filename` (string, 必需): 文件路径或目录路径
- `offset` (int, 可选): 文件偏移量，默认为0

**请求示例：**
```bash
curl --location --request GET 'http://localhost:8080/api/v1/file/getMySqlSlowLogAfterOffset?filename=test/mysql-slow.log&offset=0&limit=10&separator=\n#'
```


http://localhost:8080/api/v1/file/getMySqlSlowLogAfterOffset?filename=test/mysql-slow.log&offset=0&limit=10&separator=\n#

**响应格式：**
```json
{
  "success": true,
  "data": {
    "success": true,
    "filename": "/var/log/slow.log",
    "offset": 1024,
    "data": "文件内容..."
  }
}
```

### 2. 健康检查

**接口地址：** `GET /health`

**响应格式：**
```json
{
  "status": "ok",
  "service": "db-agent",
  "time": "2025-08-25T19:28:55+08:00"
}
```

## 功能说明

### 文件处理逻辑

1. **文件存在**：直接读取指定文件从offset开始的内容
2. **文件不存在**：
   - 如果路径是目录，自动查找该目录下最新的慢日志文件
   - 如果路径不是目录，返回错误
3. **目录路径**：自动查找目录下最新的慢日志文件（包含"slow"且以".log"结尾）

### 慢日志文件识别

程序会自动识别慢日志文件，识别规则：
- 文件名包含"slow"
- 文件扩展名为".log"
- 按修改时间排序，选择最新的文件

## 测试结果

### 1. 健康检查测试
```bash
curl "http://localhost:8080/health"
```
**响应：**
```json
{"service":"db-agent","status":"ok","time":"2025-08-25T19:28:55+08:00"}
```

### 2. 文件读取测试
```bash
curl "http://localhost:8080/api/v1/file/getFileContentAfterOffset?filename=test/slow.log&offset=0"
```
**响应：**
```json
{
  "success": true,
  "data": {
    "success": true,
    "filename": "test/slow.log",
    "offset": 809,
    "data": "# Time: 2024-01-15T10:30:00.000000Z\n# User@Host: user[user] @ host[192.168.1.100] Id: 123\n..."
  }
}
```

### 3. 增量读取测试
```bash
curl "http://localhost:8080/api/v1/file/getFileContentAfterOffset?filename=test/slow.log&offset=100"
```
**响应：** 从offset=100开始读取剩余内容

### 4. 目录扫描测试
```bash
curl "http://localhost:8080/api/v1/file/getFileContentAfterOffset?filename=test&offset=0"
```
**响应：** 自动找到test目录下的slow.log文件并读取

### 5. 文件末尾测试
```bash
curl "http://localhost:8080/api/v1/file/getFileContentAfterOffset?filename=test/slow.log&offset=809"
```
**响应：**
```json
{
  "success": true,
  "data": {
    "success": true,
    "filename": "test/slow.log",
    "offset": 809,
    "data": ""
  }
}
```

## 部署说明

### 1. 编译

```bash
go mod tidy
go build -o db-agent simple_main.go
```

### 2. 运行

```bash
./db-agent
```

服务将在8080端口启动。

### 3. 配置

可以通过环境变量配置：
- `PORT`: 服务端口（默认8080）
- `LOG_LEVEL`: 日志级别（默认info）

## 架构对比

### 原架构（外部依赖）
```
MySQL实例 → filebeat → Kafka → split_slow_log3-1 → ES → collect_mysql_slow_sql → MySQL 3261库
```

### 新架构（内部自包含）
```
MySQL实例 → db-agent → cdbcollect服务 → MySQL 3261库
```

## 优势

1. **减少外部依赖**：不再依赖Kafka、ES、filebeat
2. **简化架构**：直接从db-agent拉取数据
3. **统一管理**：通过cdbcollect服务统一处理
4. **降低成本**：减少中间件维护成本
5. **提高可靠性**：减少网络传输环节

## 开发说明

- 使用Go 1.21+
- 主要依赖：标准库（net/http、encoding/json等）
- 支持CORS跨域请求
- 完整的错误处理和日志记录

## 项目结构

```
accomplish_split/
├── simple_main.go      # 主程序（简化版本）
├── test/
│   └── slow.log        # 测试用的慢日志文件
├── go.mod              # Go模块文件
└── README.md           # 项目说明
``` 