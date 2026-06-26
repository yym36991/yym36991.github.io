# Elasticsearch 快速开始

## 验证安装
```bash
# 检查 Elasticsearch 是否运行
curl -X GET "localhost:9200/"
```

## 基本操作示例

### 1. 创建索引
```bash
curl -X PUT "localhost:9200/test_index" -H 'Content-Type: application/json' -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}'
```

### 2. 添加文档
```bash
curl -X POST "localhost:9200/test_index/_doc/1" -H 'Content-Type: application/json' -d '{
  "title": "Elasticsearch入门",
  "content": "学习ES基础知识",
  "tags": ["搜索", "数据库", "大数据"],
  "created_at": "2024-01-01T10:00:00Z"
}'
```

### 3. 搜索文档
```bash
# 简单搜索
curl -X GET "localhost:9200/test_index/_search?pretty"

# 匹配查询
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "match": {
      "title": "Elasticsearch"
    }
  }
}'
```

### 4. 查看索引信息
```bash
# 查看所有索引
curl -X GET "localhost:9200/_cat/indices?v"

# 查看索引详情
curl -X GET "localhost:9200/test_index?pretty"
```

### 5. 清理测试数据
```bash
# 删除测试索引
curl -X DELETE "localhost:9200/test_index"
```

## 常用查询示例

### 全文搜索
```bash
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "multi_match": {
      "query": "搜索 数据库",
      "fields": ["title", "content"]
    }
  }
}'
```

### 精确匹配
```bash
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "term": {
      "tags.keyword": "搜索"
    }
  }
}'
```

### 范围查询
```bash
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "range": {
      "created_at": {
        "gte": "2024-01-01",
        "lte": "2024-12-31"
      }
    }
  }
}'
```

### 聚合统计
```bash
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "size": 0,
  "aggs": {
    "tag_stats": {
      "terms": {
        "field": "tags.keyword",
        "size": 10
      }
    }
  }
}'
```

## 性能测试

### 批量插入测试数据
```bash
# 创建批量数据文件
cat > bulk_data.json << EOF
{"index":{"_index":"test_index","_id":"1"}}
{"title":"文档1","content":"这是第一个测试文档","tags":["测试","文档"]}
{"index":{"_index":"test_index","_id":"2"}}
{"title":"文档2","content":"这是第二个测试文档","tags":["测试","示例"]}
{"index":{"_index":"test_index","_id":"3"}}
{"title":"文档3","content":"这是第三个测试文档","tags":["示例","文档"]}
EOF

# 执行批量插入
curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json' --data-binary @bulk_data.json
```

### 性能监控
```bash
# 查看索引统计
curl -X GET "localhost:9200/test_index/_stats?pretty"

# 查看集群健康
curl -X GET "localhost:9200/_cluster/health?pretty"
```

## 故障排除

### 检查服务状态
```bash
# 检查进程
ps aux | grep elasticsearch

# 检查端口
lsof -i :9200

# 检查日志
tail -f /opt/homebrew/var/log/elasticsearch/elasticsearch_a58.log
```

### 重启服务
```bash
# 停止服务
brew services stop elastic/tap/elasticsearch-full

# 启动服务
brew services start elastic/tap/elasticsearch-full

# 手动启动，并设置jdk环境变量
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home && export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH" && /opt/homebrew/opt/elasticsearch-full/bin/elasticsearch


重启kibana
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home && export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH" && /opt/homebrew/opt/kibana-full/bin/kibana


```

## 下一步学习

1. **Kibana 可视化**：安装 Kibana 进行数据可视化
2. **Logstash 数据收集**：学习 ELK Stack 完整方案
3. **高级查询**：学习复合查询、聚合分析
4. **性能优化**：学习索引优化、查询优化
5. **集群管理**：学习多节点集群配置
