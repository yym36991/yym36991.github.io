# Elasticsearch 安装指南

## 系统环境
- macOS (Apple Silicon)
- Homebrew 包管理器

## 安装步骤

### 1. 添加 Elastic 官方 Homebrew Tap
```bash
brew tap elastic/tap
```

### 2. 安装 Elasticsearch
```bash
brew install elastic/tap/elasticsearch-full
```

### 3. 安装 Java 17 (兼容版本)
```bash
brew install openjdk@17
```

### 4. 配置 Java 环境变量
```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
```

### 5. 配置 Elasticsearch
```bash
# 备份原配置文件
cp /opt/homebrew/etc/elasticsearch/elasticsearch.yml /opt/homebrew/etc/elasticsearch/elasticsearch.yml.backup

# 禁用机器学习功能（解决 macOS 兼容性问题）
echo "xpack.ml.enabled: false" >> /opt/homebrew/etc/elasticsearch/elasticsearch.yml

# 禁用安全功能（开发环境）
echo "xpack.security.enabled: false" >> /opt/homebrew/etc/elasticsearch/elasticsearch.yml
```

### 6. 启动 Elasticsearch
```bash
# 方式1：作为服务启动
brew services start elastic/tap/elasticsearch-full

# 方式2：手动启动（带环境变量）
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
/opt/homebrew/opt/elasticsearch-full/bin/elasticsearch
```

## 验证安装
```bash
# 检查服务状态
curl -X GET "localhost:9200/"

# 检查集群健康状态
curl -X GET "localhost:9200/_cluster/health?pretty"
```

## 常见问题解决

### 问题1：Java 版本不兼容
**错误信息**：`could not find java in bundled JDK`
**解决方案**：安装 Java 17 并设置环境变量

### 问题2：机器学习功能错误
**错误信息**：`Failure running machine learning native code`
**解决方案**：在配置文件中添加 `xpack.ml.enabled: false`

### 问题3：服务启动失败
**解决方案**：
1. 检查 Java 环境变量
2. 检查配置文件语法
3. 查看日志文件：`/opt/homebrew/var/log/elasticsearch/`

## Kibana 安装

### 1. 安装 Kibana
```bash
brew install elastic/tap/kibana-full
```

### 2. 启动 Kibana
```bash
# 方式1：作为服务启动
brew services start elastic/tap/kibana-full

# 方式2：手动启动（带环境变量）
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
/opt/homebrew/opt/kibana-full/bin/kibana
```

### 3. 访问 Kibana
- **Web 界面**：http://localhost:5601
- **API 状态**：http://localhost:5601/api/status

## 文件路径
- **Elasticsearch 配置**：`/opt/homebrew/etc/elasticsearch/`
- **Elasticsearch 数据**：`/opt/homebrew/var/lib/elasticsearch/`
- **Elasticsearch 日志**：`/opt/homebrew/var/log/elasticsearch/`
- **Elasticsearch 插件**：`/opt/homebrew/var/elasticsearch/plugins/`
- **Kibana 配置**：`/opt/homebrew/etc/kibana/`
- **Kibana 数据**：`/opt/homebrew/var/lib/kibana/`
