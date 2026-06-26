# 一致性哈希算法详细分析

## 1. 为什么使用哈希环？

### 传统取模算法的问题
```
实例分配公式：collector_id = hash(instance_key) % collector_count

场景：3个收集器 -> 4个收集器
- 原来：hash(instance) % 3 = 0,1,2
- 现在：hash(instance) % 4 = 0,1,2,3
- 结果：75%的实例需要重新分配！
```

### 一致性哈希的优势
```
场景：3个收集器 -> 4个收集器
- 只有落在新收集器范围内的实例需要迁移
- 平均只需要迁移 1/4 = 25% 的实例
- 其他75%的实例分配关系保持不变
```

## 2. 哈希环的工作原理

### 哈希环结构
```
哈希值空间：0 到 2^32-1 (4,294,967,295)

哈希环示意图：
        0
        |
   2^32-1|1
        |
        |
   2^31-1|2^31
        |
        |
```

### 虚拟节点分布
```
每个收集器创建150个虚拟节点：

收集器A的虚拟节点：
- A#0 -> hash: 123456789
- A#1 -> hash: 234567890
- A#2 -> hash: 345678901
- ...
- A#149 -> hash: 987654321

收集器B的虚拟节点：
- B#0 -> hash: 111111111
- B#1 -> hash: 222222222
- B#2 -> hash: 333333333
- ...
- B#149 -> hash: 999999999
```

### 实例分配过程
```
1. 计算实例哈希值：
   instance_key = "192.168.1.10:3306"
   instance_hash = hash(instance_key) = 456789012

2. 在哈希环上找到最近的收集器：
   - 顺时针查找第一个 >= instance_hash 的虚拟节点
   - 如果没找到，返回第一个节点（环形结构）

3. 分配结果：
   - 实例分配给该虚拟节点对应的收集器
```

## 3. 扩容场景分析

### 场景：3个收集器 -> 4个收集器

#### 扩容前（3个收集器）
```
哈希环分布：
collect-1: [0, 1000000000) 区间
collect-2: [1000000000, 2000000000) 区间  
collect-3: [2000000000, 2^32-1) 区间

实例分配：
mysql-001 (hash: 500000000) -> collect-1
mysql-002 (hash: 1500000000) -> collect-2
mysql-003 (hash: 2500000000) -> collect-3
mysql-004 (hash: 800000000) -> collect-1
mysql-005 (hash: 1800000000) -> collect-2
mysql-006 (hash: 2800000000) -> collect-3
mysql-007 (hash: 1200000000) -> collect-2
mysql-008 (hash: 2200000000) -> collect-3
mysql-009 (hash: 900000000) -> collect-1
mysql-010 (hash: 1900000000) -> collect-2
```

#### 扩容后（4个收集器）
```
哈希环分布：
collect-1: [0, 750000000) 区间
collect-2: [750000000, 1500000000) 区间
collect-3: [1500000000, 2250000000) 区间
collect-4: [2250000000, 2^32-1) 区间

实例分配：
mysql-001 (hash: 500000000) -> collect-1 ✓ 不变
mysql-002 (hash: 1500000000) -> collect-3 ✓ 不变
mysql-003 (hash: 2500000000) -> collect-4 ✗ 需要迁移
mysql-004 (hash: 800000000) -> collect-2 ✗ 需要迁移
mysql-005 (hash: 1800000000) -> collect-3 ✓ 不变
mysql-006 (hash: 2800000000) -> collect-4 ✗ 需要迁移
mysql-007 (hash: 1200000000) -> collect-2 ✓ 不变
mysql-008 (hash: 2200000000) -> collect-4 ✗ 需要迁移
mysql-009 (hash: 900000000) -> collect-2 ✓ 不变
mysql-010 (hash: 1900000000) -> collect-3 ✓ 不变

迁移结果：4个实例需要迁移，6个实例保持不变
迁移比例：40% (接近理论值 25%)
```

## 4. 缩容场景分析

### 场景：3个收集器 -> 2个收集器

#### 缩容前（3个收集器）
```
实例分配：
mysql-001 -> collect-1
mysql-002 -> collect-2
mysql-003 -> collect-3
mysql-004 -> collect-1
mysql-005 -> collect-2
mysql-006 -> collect-3
mysql-007 -> collect-2
mysql-008 -> collect-3
mysql-009 -> collect-1
mysql-010 -> collect-2
```

#### 缩容后（2个收集器）
```
实例分配：
mysql-001 -> collect-1 ✓ 不变
mysql-002 -> collect-2 ✓ 不变
mysql-003 -> collect-1 ✗ 需要迁移
mysql-004 -> collect-1 ✓ 不变
mysql-005 -> collect-2 ✓ 不变
mysql-006 -> collect-1 ✗ 需要迁移
mysql-007 -> collect-2 ✓ 不变
mysql-008 -> collect-1 ✗ 需要迁移
mysql-009 -> collect-1 ✓ 不变
mysql-010 -> collect-2 ✓ 不变

迁移结果：3个实例需要迁移，7个实例保持不变
迁移比例：30% (接近理论值 33%)
```

## 5. 虚拟节点的作用

### 没有虚拟节点的问题
```
收集器A: [0, 2^32/3)
收集器B: [2^32/3, 2*2^32/3)
收集器C: [2*2^32/3, 2^32-1)

问题：
- 负载不均衡：某些区间可能实例密集
- 热点问题：某些收集器负载过重
- 扩展性差：新增收集器时分布不均匀
```

### 有虚拟节点的优势
```
每个收集器150个虚拟节点：
- 虚拟节点分散在哈希环上
- 负载分布更加均匀
- 减少热点问题
- 提高扩展性

示例：
collect-1: 150个虚拟节点分散在环上
collect-2: 150个虚拟节点分散在环上
collect-3: 150个虚拟节点分散在环上
```

## 6. 实际应用中的优势

### 水平扩展
```
新增收集器时：
- 数据迁移量最小
- 系统稳定性好
- 扩展成本低
```

### 故障恢复
```
收集器故障时：
- 其负责的实例快速重新分配
- 其他收集器接管故障实例
- 系统自动恢复
```

### 负载均衡
```
虚拟节点确保：
- 负载分布均匀
- 避免热点问题
- 提高系统性能
```

### 一致性
```
相同实例总是：
- 分配给相同的收集器
- 保证数据一致性
- 避免重复处理
```

## 7. 代码实现分析

### 核心算法
```go
// 创建哈希环
func (om *OffsetManager) createConsistentHashRing(collectors []CollectorInfo) []HashNode {
    var hashRing []HashNode
    virtualNodes := VirtualNodesPerCollector // 150个虚拟节点
    
    for _, collector := range collectors {
        for i := 0; i < virtualNodes; i++ {
            virtualNodeKey := fmt.Sprintf("%s#%d", collector.ID, i)
            hash := om.hashString(virtualNodeKey)
            hashRing = append(hashRing, HashNode{
                Hash:        hash,
                CollectorID: collector.ID,
            })
        }
    }
    
    // 按哈希值排序
    om.sortHashRing(hashRing)
    return hashRing
}

// 查找收集器
func (om *OffsetManager) findCollectorInRing(hashRing []HashNode, key string) string {
    keyHash := om.hashString(key)
    
    // 找到第一个 >= keyHash 的节点
    for _, node := range hashRing {
        if node.Hash >= keyHash {
            return node.CollectorID
        }
    }
    
    // 环形结构：返回第一个节点
    return hashRing[0].CollectorID
}
```

### 哈希函数
```go
// FNV-1a哈希算法
func (om *OffsetManager) hashString(s string) uint32 {
    hash := uint32(FNVOffset) // 2166136261
    
    for _, c := range s {
        hash ^= uint32(c)      // XOR
        hash *= FNVPrime       // 16777619
    }
    
    return hash
}
```

## 8. 总结

一致性哈希算法的核心优势：

1. **最小化数据迁移**：扩容/缩容时只迁移必要的实例
2. **负载均衡**：虚拟节点确保负载分布均匀
3. **高可用性**：收集器故障时快速恢复
4. **可扩展性**：支持动态添加/删除收集器
5. **一致性**：相同实例总是分配给相同收集器

这使得一致性哈希成为分布式系统中实例分配的理想选择。
