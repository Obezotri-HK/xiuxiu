# 绣绣AI 小程序 API 接口文档

## 基本信息

- **接口基础地址**: `https://your-api-domain.com/api`
- **数据格式**: JSON
- **请求方法**: POST
- **认证方式**: Bearer Token (可选)

---

## 聊天接口

### POST /chat

发送消息并获取AI回复

**请求头**
```
Content-Type: application/json
Authorization: Bearer {API_KEY}  // 可选
X-Conversation-Id: {CONVERSATION_ID}  // 对话ID
```

**请求参数**
```json
{
  "message": "用户输入的消息内容",
  "conversation_id": "conv_xxx",
  "user_id": "138****8888"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 用户发送的消息内容 |
| conversation_id | string | 是 | 对话会话ID，用于保持上下文 |
| user_id | string | 是 | 用户ID（手机号或openid） |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "reply": "AI的回复内容",
  "conversation_id": "conv_xxx"
}
```

**失败响应**
```json
{
  "code": 1001,
  "message": "内容包含敏感词",
  "reply": ""
}
```

**响应字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，0为成功 |
| message | string | 状态信息 |
| reply | string | AI回复内容 |
| conversation_id | string | 对话ID（用于上下文关联） |

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 内容包含敏感词 |
| 1002 | 用户余额不足 |
| 1003 | 请求频率过快 |
| 2001 | 服务内部错误 |
| 2002 | 模型调用失败 |

---

## 前端配置

在 `pages/index/index.js` 文件顶部配置：

```javascript
// 后端API地址
const API_BASE_URL = 'https://your-api-domain.com/api'

// API密钥（如果需要）
const API_KEY = 'your-api-key'
```

---

## 测试建议

1. 先在开发者工具中勾选"不校验合法域名"进行测试
2. 生产环境需要在微信公众平台配置 request 合法域名
3. 建议后端实现接口限流，防止恶意请求
