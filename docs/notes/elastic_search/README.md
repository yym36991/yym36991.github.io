# Elasticsearch 学习资料

本目录包含 Elasticsearch 的安装、配置和使用指南。

## 📁 文件结构

```
elastic_search/
├── README.md              # 本文件，目录说明
├── installation.md        # 安装指南
├── basic_commands.md      # 基本命令参考
├── quick_start.md         # 快速开始指南
└── kibana_guide.md        # Kibana 使用指南
```

## 🚀 快速开始

1. **安装 Elasticsearch**：参考 [installation.md](./installation.md)
2. **学习基本命令**：参考 [basic_commands.md](./basic_commands.md)
3. **实践操作**：参考 [quick_start.md](./quick_start.md)

## 📋 当前环境信息

- **Elasticsearch 版本**：7.17.4
- **Kibana 版本**：7.17.4
- **Java 版本**：OpenJDK 17
- **Elasticsearch 地址**：http://localhost:9200
- **Kibana 地址**：http://localhost:5601
- **集群状态**：单节点，健康状态

## 🔧 常用服务管理命令

```bash
# 启动 Elasticsearch
brew services start elastic/tap/elasticsearch-full

# 启动 Kibana
brew services start elastic/tap/kibana-full

# 停止服务
brew services stop elastic/tap/elasticsearch-full
brew services stop elastic/tap/kibana-full

# 重启服务
brew services restart elastic/tap/elasticsearch-full
brew services restart elastic/tap/kibana-full

# 检查状态
curl -X GET "localhost:9200/"          # Elasticsearch
curl -X GET "localhost:5601/api/status" # Kibana
```

## 📚 学习资源

### 官方文档
- [Elasticsearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/index.html)
- [Elasticsearch 中文文档](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)

### 相关工具
- **Kibana**：数据可视化和管理界面
- **Logstash**：数据收集和处理
- **Beats**：轻量级数据收集器

### ELK Stack
- **E**lasticsearch：搜索和分析引擎
- **L**ogstash：数据收集和处理
- **K**ibana：数据可视化

## 🎯 学习路径建议

1. **基础阶段**
   - 理解 Elasticsearch 基本概念
   - 学习索引、文档、映射
   - 掌握基本的 CRUD 操作

2. **进阶阶段**
   - 学习复杂查询语法
   - 掌握聚合分析
   - 了解性能优化

3. **高级阶段**
   - 集群管理和监控
   - 数据建模和索引设计
   - 生产环境部署

## 🔍 常用查询示例

### 检查集群健康
```bash
curl -X GET "localhost:9200/_cluster/health?pretty"
```

### 查看所有索引
```bash
curl -X GET "localhost:9200/_cat/indices?v"
```

### 简单搜索
```bash
curl -X GET "localhost:9200/test_index/_search?pretty"
```

## 📝 注意事项

1. **Java 环境**：确保使用 Java 17
2. **配置文件**：已禁用 ML 和安全功能（开发环境）
3. **数据持久化**：数据存储在 `/opt/homebrew/var/lib/elasticsearch/`
4. **日志文件**：日志存储在 `/opt/homebrew/var/log/elasticsearch/`

## 🆘 故障排除

如果遇到问题，请按以下顺序检查：

1. 检查 Java 环境变量
2. 检查 Elasticsearch 服务状态
3. 查看错误日志
4. 参考 [installation.md](./installation.md) 中的常见问题部分

## 📞 获取帮助

- 查看官方文档
- 搜索 Stack Overflow
- 参考 GitHub Issues
- 加入 Elastic 社区论坛


获取所有：
GET /mysqlslow_detail_total_2025_10_20/_search
{
  "query": {
    "match_all": {}
  }
}


2141 2025/11/04 14:52:22.494068 writerUtils.go:38: [INFO] return msg:{"code":"success","msg":"success","data":4622}
2142 2025/11/04 14:52:22.498315 store.go:113: [ERROR] store get version resp, httpHost 10.186.2.77:31109 cid 2134 errMsg , err Post "http://10.186.2.77:31109/get_version?cid=2134": dial tcp 10.186.2.77:31     109: connect: connection refused
2143 2025/11/04 14:52:22.500135 store.go:113: [ERROR] store get version resp, httpHost 10.186.2.77:31109 cid 2134 errMsg , err Post "http://10.186.2.77:31109/get_version?cid=2134": dial tcp 10.186.2.77:31     109: connect: connection refused
2144 2025/11/04 14:52:22.500495 store.go:113: [ERROR] store get version resp, httpHost 10.186.2.77:31109 cid 2134 errMsg , err Post "http://10.186.2.77:31109/get_version?cid=2134": dial tcp 10.186.2.77:31     109: connect: connection refused
2145 2025/11/04 14:52:22.502454 deploy.go:960: [INFO] deployGroupStores cid:2134 gid:20 groupDbData:&{Id:61447881957889 Gid:20 Cid:2134 GroupType:bk2 DataType:ssd Status:0 TotalStoreNum:2 CurrentStoreNum:     0 VolumeNum:50 VolumeType:512Mb*64 Creater:yangguizeng CreatedAt:2025-02-20 22:26:17 +0800 CST DeletedAt:0001-01-01 00:00:00 +0000 UTC}, storeList:[0xc000a795c0], canConcurrent:false
2146 2025/11/04 14:52:23.095195 deploy.go:1112: [ERROR] deploy store ip 10.186.2.77:8095 version:1.7.6／5c2d5 error:exit status 1
2147 2025/11/04 14:52:23.104626 deploy.go:835: [ERROR] deploy id 4622 has deploy falied:1

当前web在部署store时出错了。
nebula的store在/Users/a58/yym/nebula2,store机器的agent在：/Users/a58/yym/storage_agent
请根据以上报错，分析为啥前端部署store秒失败了，




curl -s -u mysqlslow_rw:356fcea64fc3d143 -XPOST "http://es9201.db.58dns.org:9201/mysqlslow_detail_total_2025_10_08/_search" \
  -H 'Content-Type: application/json' \
  -d '{
    "size": 100,
    "query": {
      "bool": {
        "filter": [
          {
            "term": {
              "host": "172.26.0.143"
            }
          }
        ]
      }
    }
  }' | jq -c '.hits.hits[]' > online_20251008.txt



查询
GET /mysqlslow_detail_total_2025_10_20/_search
{
  "query": {
    "match": {"_id": "zxdJC5oB8ZNsK4YwVy9m"}
  }
}
单个查询：
GET /mysqlslow_detail_total_2025_10_20/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "_id" : "ds_HD5oB_Et_ndwYswtz"
          }
        }
      ]
    }
  }
}


多条件查询：
GET /mysqlslow_detail_total_2025_10_20/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "_type": "_doc"
          }
        },
        {
          "term":{
            "_index":"mysqlslow_detail_total_2025_10_20"
          }
        },
        {
          "term":{
            "_id":"ds_HD5oB_Et_ndwYswtz"
          }
        }
      ]
    }
  }
}


checksum
host
ip
schema
user

咱们写入es的数据没有
@version，还多了一个“timestamp”


#! Deprecation: [types removal] The parameter include_type_name should be explicitly specified in get mapping requests to prepare for 7.0. In 7.0 include_type_name will default to 'false', which means responses will omit the type name in mapping definitions.
{
  "mysqlslow_detail_total_2025_10_08" : {
    "mappings" : {
      "_doc" : {
        "properties" : {
          "@timestamp" : {
            "type" : "date",
            "format" : "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
          },
          "@version" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "checksum" : {
            "type" : "keyword"
          },
          "host" : {
            "type" : "keyword",
            "ignore_above" : 256
          },
          "ip" : {
            "type" : "keyword",
            "ignore_above" : 256
          },
          "lock_time" : {
            "type" : "float"
          },
          "port" : {
            "type" : "long"
          },
          "query_time" : {
            "type" : "float"
          },
          "rows_examined" : {
            "type" : "long"
          },
          "rows_sent" : {
            "type" : "long"
          },
          "schema" : {
            "type" : "keyword",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "sql" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "sql_fingerprint" : {
            "type" : "text",
            "fields" : {
              "keyword" : {
                "type" : "keyword",
                "ignore_above" : 256
              }
            }
          },
          "status" : {
            "type" : "long"
          },
          "user" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      }
    }
  }
}

#! [types removal] Using the _type field in queries and aggregations is deprecated, prefer to use a field instead.
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "mysqlslow_detail_total_2025_10_08",
        "_type" : "_doc",
        "_id" : "_tGwKJoB_Et_ndwYSB2t",
        "_score" : 0.0,
        "_ignored" : [
          "sql.keyword"
        ],
        "_source" : {
          "port" : 53015,
          "host" : "172.26.0.143",
          "user" : "lbg_qatedb_test",
          "ip" : "10.253.77.48",
          "query_time" : 0.391512,
          "lock_time" : 8.1E-5,
          "rows_sent" : 1,
          "rows_examined" : 279725,
          "schema" : "",
          "sql" : "SELECT `id`, `deviceId`, `priority`, `create_time`, `update_time`, `lbg_plan_id`, `is_delete`, `ip` FROM `lbg_task` WHERE `ip` = '10.253.108.53' AND `is_delete` != 1 AND `env` = 1 AND DATE(create_time) = CURDATE() ORDER BY `priority` ASC, `create_time` DESC;",
          "sql_fingerprint" : """SELECT `id`,`deviceId`,`priority`,`create_time`,`update_time`,`lbg_plan_id`,`is_delete`,`ip` FROM `lbg_task` WHERE `ip`=? AND `is_delete`!=? AND `env`=? AND DATE(`create_time`)=CURDATE() ORDER BY `priority`,`create_time` DESC
""",
          "checksum" : "2812239873719366950",
          "status" : 0,
          "@timestamp" : "2025-10-08 02:06:08"
        }
      }
    ]
  }
}







