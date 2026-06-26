# Elasticsearch 基本命令

## 服务管理

### 启动服务
```bash
# 作为系统服务启动
brew services start elastic/tap/elasticsearch-full

# 手动启动（前台运行）
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
/opt/homebrew/opt/elasticsearch-full/bin/elasticsearch
```

### 停止服务
```bash
brew services stop elastic/tap/elasticsearch-full
```

### 重启服务
```bash
brew services restart elastic/tap/elasticsearch-full
```

### 查看服务状态
```bash
brew services list | grep elasticsearch
```

## 集群管理

### 检查集群健康状态
```bash
curl -X GET "localhost:9200/_cluster/health?pretty"
```

### 查看集群信息
```bash
curl -X GET "localhost:9200/"
```

### 查看节点信息
```bash
curl -X GET "localhost:9200/_nodes?pretty"
```

### 查看集群设置
```bash
curl -X GET "localhost:9200/_cluster/settings?pretty"
```

## 索引管理

### 查看所有索引
```bash
curl -X GET "localhost:9200/_cat/indices?v"
```

### 创建索引
```bash
# 基本创建
curl -X PUT "localhost:9200/test_index"

# 带设置创建
curl -X PUT "localhost:9200/test_index" -H 'Content-Type: application/json' -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}'
```

### 删除索引
```bash
curl -X DELETE "localhost:9200/test_index"
```

### 查看索引信息
```bash
curl -X GET "localhost:9200/test_index?pretty"
```

### 查看索引映射
```bash
curl -X GET "localhost:9200/test_index/_mapping?pretty"
```

## 文档操作

### 添加文档
```bash
# 自动生成ID
curl -X POST "localhost:9200/test_index/_doc" -H 'Content-Type: application/json' -d '{
  "title": "测试文档",
  "content": "这是一个测试文档",
  "tags": ["测试", "文档"]
}'

# 指定ID
curl -X POST "localhost:9200/test_index/_doc/1" -H 'Content-Type: application/json' -d '{
  "title": "指定ID文档",
  "content": "这是一个指定ID的文档"
}'
```

### 获取文档
```bash
curl -X GET "localhost:9200/test_index/_doc/1?pretty"
```

### 更新文档
```bash
# 完整更新
curl -X PUT "localhost:9200/test_index/_doc/1" -H 'Content-Type: application/json' -d '{
  "title": "更新的文档",
  "content": "这是更新后的内容"
}'

# 部分更新
curl -X POST "localhost:9200/test_index/_update/1" -H 'Content-Type: application/json' -d '{
  "doc": {
    "title": "部分更新的标题"
  }
}'
```

### 删除文档
```bash
curl -X DELETE "localhost:9200/test_index/_doc/1"
```

## 搜索操作

### 简单搜索
```bash
# 搜索所有文档
curl -X GET "localhost:9200/test_index/_search?pretty"

# 匹配查询
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "match": {
      "title": "测试"
    }
  }
}'
```

### 复合查询
```bash
# 布尔查询
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "query": {
    "bool": {
      "must": [
        {"match": {"title": "测试"}},
        {"match": {"content": "文档"}}
      ]
    }
  }
}'
```

### 聚合查询
```bash
curl -X GET "localhost:9200/test_index/_search?pretty" -H 'Content-Type: application/json' -d '{
  "size": 0,
  "aggs": {
    "tag_count": {
      "terms": {
        "field": "tags.keyword"
      }
    }
  }
}'
```

## 批量操作

### 批量插入
```bash
curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json' --data-binary @bulk_data.json
```

### 批量更新
```bash
curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json' -d '
{"update":{"_index":"test_index","_id":"1"}}
{"doc":{"title":"批量更新"}}
{"update":{"_index":"test_index","_id":"2"}}
{"doc":{"title":"批量更新2"}}
'
```

## 监控和调试

### 查看慢查询
```bash
curl -X GET "localhost:9200/_nodes/stats/indices/search?pretty"
```

### 查看索引统计
```bash
curl -X GET "localhost:9200/test_index/_stats?pretty"
```

### 查看任务
```bash
curl -X GET "localhost:9200/_tasks?pretty"
```

## 常用别名

### 创建别名
```bash
curl -X POST "localhost:9200/_aliases" -H 'Content-Type: application/json' -d '{
  "actions": [
    {"add": {"index": "test_index", "alias": "test_alias"}}
  ]
}'
```

### 查看别名
```bash
curl -X GET "localhost:9200/_cat/aliases?v"
```
