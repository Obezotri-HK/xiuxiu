# 绣绣AI 小程序 AI 对话接口文档

## 目标

本文件用于约定首页 AI 对话页与后端服务的联调协议。

当前前端已经调整为纯渲染层：

- 后端负责生成 AI 文案
- 后端负责查询商城数据库并返回商品卡片
- 前端只负责把返回结果渲染成聊天气泡和商品卡片

## 基本信息

- 接口基础地址：`https://your-api-domain.com/api`
- 数据格式：`JSON`
- 请求方法：`POST`
- 认证方式：`Bearer Token`，可选
- 接口路径：`/chat`

完整请求地址示例：

```text
https://your-api-domain.com/api/chat
```

## 前端当前行为

前端请求逻辑位于 [index.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/index/index.js)。

- 当 `API_BASE_URL` 仍为占位地址时，首页仅返回一条前端演示提示
- 当接入真实后端后，前端会直接解析后端返回的 `reply + products + recommendationMeta`
- 前端不会再本地根据“景点 / 住宿 / 路线”等关键词拼推荐卡片

## 请求协议

### 请求头

```http
Content-Type: application/json
Authorization: Bearer {API_KEY}
X-Conversation-Id: {CONVERSATION_ID}
```

说明：

- `Authorization` 可选，取决于你们后端是否启用
- `X-Conversation-Id` 用于保持多轮上下文，和请求体中的 `conversation_id` 保持一致即可

### 请求体

```json
{
  "message": "我想去桂林玩两天，帮我推荐景点",
  "conversation_id": "conv_1720000000000_xxx",
  "user_id": "guest"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `message` | string | 是 | 用户输入的原始问题 |
| `conversation_id` | string | 是 | 当前会话 ID，用于后端维持上下文 |
| `user_id` | string | 是 | 当前用户 ID，未登录时前端传 `guest` |

## 响应协议

### 推荐使用的标准响应

```json
{
  "code": 0,
  "message": "success",
  "reply": "可以，下面是适合你的商城商品。",
  "conversation_id": "conv_1720000000000_xxx",
  "recommendationMeta": {
    "title": "商城推荐",
    "hint": "以下内容来自商城数据库"
  },
  "products": [
    {
      "id": 3,
      "name": "象鼻山门票",
      "desc": "桂林城徽地标，必游景点",
      "price": "55",
      "image": "https://example.com/product-3.jpg",
      "tag": "必游"
    },
    {
      "id": 7,
      "name": "两江四湖夜游",
      "desc": "乘船夜游桂林城，灯光璀璨",
      "price": "185",
      "image": "https://example.com/product-7.jpg",
      "tag": "夜景"
    }
  ]
}
```

### 最小可用响应

如果当前轮次没有商品卡片，也可以只返回文本：

```json
{
  "reply": "桂林适合 3 到 4 月和 9 到 11 月出行，气候更舒适。"
}
```

### 响应字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code` | number | 否 | 业务状态码，前端当前不强依赖 |
| `message` | string | 否 | 业务状态说明 |
| `reply` | string | 建议必填 | AI 回复文案 |
| `conversation_id` | string | 否 | 当前会话 ID，可回传 |
| `recommendationMeta` | object | 否 | 商品卡片区域标题和说明 |
| `products` | array | 否 | 商品卡片数组，为空或不传则不展示卡片 |

### recommendationMeta 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 否 | 卡片区标题，如 `商城推荐` |
| `hint` | string | 否 | 卡片区补充说明 |

### products 数组字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 建议必填 | 商品唯一 ID，用于跳转详情页 |
| `name` | string | 是 | 商品标题 |
| `desc` | string | 否 | 商品描述 |
| `price` | string \| number | 否 | 商品价格 |
| `image` | string | 否 | 商品主图 URL |
| `tag` | string | 否 | 商品标签，如 `必游`、`夜景` |

## 前端兼容字段映射

为方便后端平滑接入，前端当前兼容以下命名：

### 文案字段

- `reply`
- `content`
- `message`
- `text`

### 商品数组字段

- `products`
- `cards`
- `recommendations`
- `goodsList`

### recommendationMeta 字段

- `recommendationMeta`
- `cardMeta`

### 商品对象字段

| 前端标准字段 | 兼容字段 |
|------|------|
| `id` | `id` / `productId` / `goodsId` |
| `name` | `name` / `title` / `productName` |
| `desc` | `desc` / `description` / `subtitle` / `summary` |
| `price` | `price` / `salePrice` / `currentPrice` |
| `image` | `image` / `imageUrl` / `cover` / `coverUrl` |
| `tag` | `tag` / `badge` / `label` |

## 前端渲染规则

- `reply` 存在时，渲染 AI 文本气泡
- `products` 有值时，在文本气泡下方渲染横向商品卡片
- `recommendationMeta` 为空但 `products` 有值时，前端默认补：

```json
{
  "title": "商城推荐",
  "hint": "以下卡片均来自当前商城，点击可进入商品详情页"
}
```

- `products` 为空时，不显示卡片区

## 错误处理建议

### 建议失败响应

```json
{
  "code": 500,
  "message": "服务繁忙，请稍后重试",
  "reply": "抱歉，当前服务繁忙，请稍后再试。"
}
```

### 前端当前兜底

- HTTP 非 `200` 或接口异常：显示 `网络连接失败，请检查网络后重试。`
- 返回成功但数据为空：显示 `抱歉，服务出现了问题，请稍后再试。`

## 浏览历史接口

当前前端实现：

- 用户进入商品详情页时会记录一条浏览历史
- 已登录用户优先写入并读取后端数据库
- 未登录或接口失败时回退本地缓存

前端涉及文件：

- [detail.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/product/detail.js)
- [list.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/history/list.js)

### 1. 获取浏览历史

#### GET /api/history

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 3,
      "name": "象鼻山门票",
      "desc": "桂林城徽地标，必游景点",
      "price": "55",
      "tag": "必游",
      "image": "https://example.com/product-3.jpg",
      "viewedAt": 1720000000000
    },
    {
      "id": 7,
      "name": "两江四湖夜游",
      "desc": "乘船夜游桂林城，灯光璀璨",
      "price": "185",
      "tag": "夜景",
      "image": "https://example.com/product-7.jpg",
      "viewedAt": 1720000001000
    }
  ]
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 建议必填 | 商品 ID |
| `name` | string | 是 | 商品名称 |
| `desc` | string | 否 | 商品简介 |
| `price` | string \| number | 否 | 商品价格 |
| `tag` | string | 否 | 商品标签 |
| `image` | string | 否 | 商品图片 |
| `viewedAt` | number \| string | 建议必填 | 浏览时间，时间戳或可解析时间字符串 |

前端兼容时间字段：

- `time`
- `viewTime`
- `viewedAt`
- `createTime`
- `timestamp`

### 2. 新增浏览历史

#### POST /api/history

当用户进入商品详情页，前端会提交一条历史记录。

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

请求体：

```json
{
  "id": 3,
  "productId": 3,
  "name": "象鼻山门票",
  "desc": "桂林城徽地标，必游景点",
  "price": "55",
  "tag": "必游",
  "image": "https://example.com/product-3.jpg",
  "viewedAt": 1720000000000
}
```

说明：

- 前端当前会同时传 `id` 和 `productId`
- 后端可只使用其中一个主键
- 推荐后端按用户维度去重，保留最近一次浏览时间

推荐成功响应：

```json
{
  "code": 200,
  "message": "success"
}
```

### 3. 清空浏览历史

#### DELETE /api/history

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success"
}
```

### 浏览历史兼容字段映射

为方便后端平滑接入，前端当前兼容以下字段：

| 前端标准字段 | 兼容字段 |
|------|------|
| `id` | `id` / `productId` / `goodsId` |
| `name` | `name` / `title` / `productName` |
| `desc` | `desc` / `description` / `subtitle` |
| `price` | `price` / `salePrice` / `currentPrice` |
| `image` | `image` / `imageUrl` / `cover` / `coverUrl` |
| `tag` | `tag` / `badge` |

### 浏览历史后端建议

建议后端实现以下策略：

1. 按 `user_id + product_id` 做唯一约束或最近浏览覆盖
2. 获取列表时按浏览时间倒序返回
3. 返回数量建议控制在最近 20 到 50 条
4. 清空历史时只删除当前登录用户自己的记录

## 收藏接口

当前前端实现：

- 商城列表页可切换收藏状态
- 商品详情页可切换收藏状态
- 已登录用户应优先使用后端收藏数据
- 当前前端本地仍保留缓存兜底，后端接入后建议逐步切到服务端

前端涉及文件：

- [mall.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/mall/mall.js)
- [detail.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/product/detail.js)
- [list.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/favorite/list.js)

### 1. 获取收藏列表

#### GET /api/favorites

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 3,
      "name": "象鼻山门票",
      "desc": "桂林城徽地标，必游景点",
      "price": "55",
      "tag": "必游",
      "image": "https://example.com/product-3.jpg"
    },
    {
      "id": 7,
      "name": "两江四湖夜游",
      "desc": "乘船夜游桂林城，灯光璀璨",
      "price": "185",
      "tag": "夜景",
      "image": "https://example.com/product-7.jpg"
    }
  ]
}
```

### 2. 切换收藏状态

#### POST /api/favorites

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

请求体建议：

```json
{
  "productId": 3
}
```

如果你们后端希望更明确，也可以支持：

```json
{
  "productId": 3,
  "action": "toggle"
}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "productId": 3,
    "isFavorite": true
  }
}
```

### 收藏字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 建议必填 | 商品 ID |
| `name` | string | 是 | 商品名称 |
| `desc` | string | 否 | 商品简介 |
| `price` | string \| number | 否 | 商品价格 |
| `tag` | string | 否 | 商品标签 |
| `image` | string | 否 | 商品图片 |

### 收藏兼容字段映射

| 前端标准字段 | 兼容字段 |
|------|------|
| `id` | `id` / `productId` / `goodsId` |
| `name` | `name` / `title` / `productName` |
| `desc` | `desc` / `description` / `subtitle` |
| `price` | `price` / `salePrice` / `currentPrice` |
| `image` | `image` / `imageUrl` / `cover` / `coverUrl` |
| `tag` | `tag` / `badge` / `label` |

### 收藏后端建议

1. 按 `user_id + product_id` 做唯一约束
2. 列表查询按创建时间倒序返回
3. 切换收藏状态后建议返回 `isFavorite`

## 购物车接口

当前前端实现：

- 商品详情页可加入购物车
- 购物车页会读取购物车列表
- 支持增减数量、选择状态、删除、清空
- 当前前端有本地缓存兜底，后端接入后建议以数据库为主

前端涉及文件：

- [detail.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/product/detail.js)
- [list.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/cart/list.js)

### 1. 获取购物车列表

#### GET /api/cart

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 101,
      "productId": 3,
      "name": "象鼻山门票",
      "image": "https://example.com/product-3.jpg",
      "price": 55,
      "spec": "成人票",
      "quantity": 2,
      "selected": true,
      "stock": 200
    }
  ]
}
```

### 2. 加入购物车

#### POST /api/cart

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

请求体：

```json
{
  "productId": 3,
  "name": "象鼻山门票",
  "image": "https://example.com/product-3.jpg",
  "price": 55,
  "spec": "成人票",
  "quantity": 2
}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "cartItemId": 101
  }
}
```

### 3. 更新购物车项

#### PUT /api/cart/{id}

说明：

- `id` 为购物车项 ID
- 前端目前主要会变更 `quantity`
- 后端也可以同时支持更新 `selected`

请求体示例：

```json
{
  "quantity": 3,
  "selected": true
}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success"
}
```

### 4. 删除购物车项

#### DELETE /api/cart/{id}

请求头：

```http
Content-Type: application/json
Authorization: Bearer {TOKEN}
```

推荐成功响应：

```json
{
  "code": 200,
  "message": "success"
}
```

### 购物车字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string \| number | 建议必填 | 购物车项 ID |
| `productId` | string \| number | 是 | 商品 ID |
| `name` | string | 是 | 商品名称 |
| `image` | string | 否 | 商品主图 |
| `price` | string \| number | 是 | 商品单价 |
| `spec` | string | 否 | 规格名称 |
| `quantity` | number | 是 | 数量 |
| `selected` | boolean | 否 | 是否选中 |
| `stock` | number | 否 | 库存，前端用于限制数量 |

### 购物车兼容字段映射

| 前端标准字段 | 兼容字段 |
|------|------|
| `id` | `id` / `cartItemId` |
| `productId` | `productId` / `goodsId` |
| `name` | `name` / `title` / `productName` |
| `image` | `image` / `imageUrl` / `cover` / `coverUrl` |
| `price` | `price` / `salePrice` / `currentPrice` |
| `spec` | `spec` / `specName` |
| `quantity` | `quantity` / `count` |
| `selected` | `selected` / `checked` |

### 购物车后端建议

1. 按 `user_id + product_id + spec_name` 做唯一约束
2. `POST /api/cart` 时若已存在同商品同规格，可直接累加数量
3. 获取购物车列表时建议返回 `selected` 和 `stock`
4. 更新数量时建议校验库存

## 后端接入建议

建议后端在单轮对话中完成以下步骤：

1. 接收用户问题和会话 ID
2. 让 AI 生成当前轮次回复文案
3. 基于用户问题、画像、位置或上下文查询商城数据库
4. 整理出适合前端展示的商品卡片数组
5. 按本文档标准字段返回给前端

## 本地联调建议

1. 在 [index.js](file:///C:/Users/Administrator/Desktop/xiuxiu/pages/index/index.js) 顶部修改：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
const API_KEY = 'your-api-key'
```

2. 在微信开发者工具中配置合法域名，或开发阶段临时关闭域名校验
3. 先返回最小可用响应，确认文案链路正常
4. 再逐步增加 `recommendationMeta` 和 `products` 商品卡片数据
