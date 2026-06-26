# Kibana 使用指南

## 🎯 概述

Kibana 是 Elasticsearch 的可视化管理界面，提供强大的数据分析和可视化功能。

## 🚀 快速开始

### 访问 Kibana
- **Web 界面**：http://localhost:5601
- **状态检查**：http://localhost:5601/api/status

### 服务管理
```bash
# 启动 Kibana
brew services start elastic/tap/kibana-full

# 停止 Kibana
brew services stop elastic/tap/kibana-full

# 重启 Kibana
brew services restart elastic/tap/kibana-full

# 查看状态
brew services list | grep kibana
```

## 📊 主要功能模块

### 1. Discover（数据发现）
- **功能**：浏览和搜索 Elasticsearch 中的数据
- **用途**：数据探索、日志分析、实时监控

**基本操作**：
1. 选择索引模式
2. 设置时间范围
3. 使用搜索栏进行查询
4. 查看文档详情

### 2. Visualize（可视化）
- **功能**：创建各种图表和可视化
- **图表类型**：
  - 柱状图（Vertical Bar Chart）
  - 折线图（Line Chart）
  - 饼图（Pie Chart）
  - 数据表（Data Table）
  - 指标（Metric）
  - 热力图（Heat Map）

### 3. Dashboard（仪表板）
- **功能**：组合多个可视化创建综合仪表板
- **用途**：监控面板、业务报表、系统状态

### 4. Dev Tools（开发工具）
- **功能**：Elasticsearch 查询控制台
- **用途**：API 测试、查询调试、索引管理

**常用查询示例**：
```json
# 查看集群健康
GET _cluster/health

# 查看所有索引
GET _cat/indices?v

# 搜索文档
GET test_index/_search
{
  "query": {
    "match_all": {}
  }
}

# 创建索引
PUT my_index
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
```

### 5. Management（管理）
- **功能**：系统配置和索引管理
- **包含**：
  - Index Patterns（索引模式）
  - Index Management（索引管理）
  - Saved Objects（保存的对象）
  - Stack Monitoring（堆栈监控）

## 🔧 实用技巧

### 创建索引模式
1. 进入 **Management** → **Index Patterns**
2. 点击 **Create index pattern**
3. 输入索引名称（支持通配符，如 `logstash-*`）
4. 选择时间字段（如果有）
5. 点击 **Create index pattern**

### 创建可视化
1. 进入 **Visualize** → **Create visualization**
2. 选择可视化类型
3. 选择数据源（索引模式）
4. 配置指标和桶
5. 保存可视化

### 构建仪表板
1. 进入 **Dashboard** → **Create new dashboard**
2. 点击 **Add** 添加可视化
3. 拖拽调整布局
4. 设置时间范围
5. 保存仪表板

## 📈 数据可视化示例

### 示例1：创建柱状图
```json
# 在 Dev Tools 中执行
POST test_index/_doc
{
  "timestamp": "2024-01-01T10:00:00Z",
  "category": "A",
  "value": 100
}

POST test_index/_doc
{
  "timestamp": "2024-01-01T11:00:00Z",
  "category": "B",
  "value": 150
}
```

**可视化配置**：
- **指标**：Count
- **桶**：X-axis → Terms → category.keyword

### 示例2：创建时间序列图
```json
# 在 Dev Tools 中执行
POST metrics/_doc
{
  "@timestamp": "2024-01-01T10:00:00Z",
  "cpu_usage": 45.2,
  "memory_usage": 67.8
}

POST metrics/_doc
{
  "@timestamp": "2024-01-01T11:00:00Z",
  "cpu_usage": 52.1,
  "memory_usage": 71.3
}
```

**可视化配置**：
- **指标**：Average → cpu_usage
- **桶**：X-axis → Date Histogram → @timestamp

## 🎨 高级功能

### 1. 搜索语法
- **简单搜索**：`error`
- **字段搜索**：`status:200`
- **范围搜索**：`bytes:[1000 TO 2000]`
- **通配符**：`user:j*`
- **布尔查询**：`status:200 AND method:GET`

### 2. 过滤器
- **时间过滤器**：设置时间范围
- **字段过滤器**：按字段值过滤
- **查询过滤器**：使用查询语法过滤

### 3. 聚合分析
- **指标聚合**：Count、Sum、Average、Min、Max
- **桶聚合**：Terms、Date Histogram、Range、Filters

## 🔍 故障排除

### 常见问题

**问题1：无法连接到 Elasticsearch**
- 检查 Elasticsearch 是否运行：`curl localhost:9200`
- 检查 Kibana 配置：`/opt/homebrew/etc/kibana/kibana.yml`

**问题2：索引模式创建失败**
- 确保索引存在：`GET _cat/indices?v`
- 检查索引是否有数据：`GET index_name/_count`

**问题3：可视化显示异常**
- 检查字段映射：`GET index_name/_mapping`
- 验证数据格式和类型

### 日志查看
```bash
# Kibana 日志
tail -f /opt/homebrew/var/log/kibana/kibana.log

# Elasticsearch 日志
tail -f /opt/homebrew/var/log/elasticsearch/elasticsearch_a58.log
```

## 📚 学习资源

### 官方文档
- [Kibana 用户指南](https://www.elastic.co/guide/en/kibana/7.17/index.html)
- [Kibana 可视化指南](https://www.elastic.co/guide/en/kibana/7.17/visualize.html)

### 最佳实践
1. **索引设计**：合理设计索引结构和映射
2. **时间字段**：为时间序列数据设置合适的时间字段
3. **字段类型**：正确设置字段类型（text、keyword、date等）
4. **性能优化**：使用适当的聚合和查询优化性能

## 🎯 下一步学习

1. **Logstash**：学习数据收集和处理
2. **Beats**：轻量级数据收集器
3. **ELK Stack**：完整的日志分析解决方案
4. **高级查询**：学习复杂的 Elasticsearch 查询
5. **集群管理**：多节点集群配置和监控
