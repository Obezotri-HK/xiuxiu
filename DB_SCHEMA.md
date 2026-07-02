# 数据库方案

## 目标

当前项目建议采用：

- 开发测试阶段：`SQLite`
- 正式环境：`PostgreSQL`

这样做的好处是：

- 本地测试成本低，建库快
- 表结构设计能提前稳定下来
- 后续迁移 PostgreSQL 基本不需要改前端接口协议

## 已提供文件

- [schema.sqlite.sql](file:///C:/Users/Administrator/Desktop/xiuxiu/database/schema.sqlite.sql)
- [schema.postgres.sql](file:///C:/Users/Administrator/Desktop/xiuxiu/database/schema.postgres.sql)

## 当前覆盖的表

- `users`
- `products`
- `user_history`
- `user_favorites`
- `cart_items`
- `orders`
- `order_items`
- `chat_conversations`
- `chat_messages`

这些表已经对齐当前前端已有或即将对接的功能：

- AI 对话
- 商品列表 / 商品详情
- 浏览历史
- 收藏
- 购物车
- 订单

## SQLite 测试建议

### 1. 先跑 SQLite 建表脚本

```sql
-- 执行 database/schema.sqlite.sql
```

### 2. 建议先验证这几条主链路

- 商品列表 / 商品详情
- 浏览历史读写
- 收藏切换
- 购物车增删改查
- 订单创建
- AI 对话消息持久化

### 3. SQLite 阶段推荐做法

- 商品 `id` 先固定为前端商品 ID
- 浏览历史按 `user_id + product_id` 去重
- 购物车按 `user_id + product_id + spec_name` 去重
- 聊天消息按 `conversation_id` 归档

## PostgreSQL 上线建议

等本地 SQLite 测试稳定后，再迁移到 PostgreSQL：

### 保持不变的内容

- 表名
- 主要字段名
- 接口协议
- 前端传参与返回结构

### 主要差异

- `SQLite` 使用 `INTEGER PRIMARY KEY AUTOINCREMENT`
- `PostgreSQL` 使用 `BIGSERIAL PRIMARY KEY`
- `SQLite` 时间字段多用 `DATETIME`
- `PostgreSQL` 时间字段建议用 `TIMESTAMPTZ`
- `PostgreSQL` 更适合正式环境的并发和索引能力

## 推荐迁移顺序

1. 先用 SQLite 跑通商品、历史、收藏、购物车
2. 再迁移 PostgreSQL
3. 最后接入正式 AI 对话和订单链路

## 与前端已对齐的重点

### 浏览历史

前端当前已实现：

- 登录用户优先请求数据库历史记录
- 打开商品详情时自动记录浏览行为
- 接口失败回退本地缓存

对应表：

- `user_history`
- `products`

### AI 对话

前端当前已实现：

- 请求 `POST /chat`
- 后端返回 `reply + recommendationMeta + products`

如果要落库存档：

- `chat_conversations`
- `chat_messages`

### 商品卡片推荐

后端可以基于：

- 用户问题
- 浏览历史
- 收藏偏好
- 当前定位

查询 `products` 表后返回给前端。

## 建议

如果你们下一步准备先做后端测试，优先顺序建议是：

1. `products`
2. `user_history`
3. `user_favorites`
4. `cart_items`
5. `orders`
6. `chat_conversations` / `chat_messages`
