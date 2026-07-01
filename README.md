# 绣绣AI - 微信小程序

桂林旅游智能出行助手，基于 AI 的旅游咨询小程序。

## 项目介绍

绣绣AI是一款专注于桂林旅游的智能对话小程序，为用户提供景点推荐、路线规划、美食攻略等旅游咨询服务。

## 功能特性

### 已完成功能

- **登录系统**
  - 手机号 + 验证码登录
  - 微信授权登录
  - 游客体验（50次对话额度）
  - 用户协议 / 隐私政策

- **AI 对话**
  - 智能对话界面（类千问风格）
  - 快捷提示词
  - 新对话功能
  - 加载动画效果
  - 自动滚动到底部

- **位置与天气**
  - 实时定位（微信定位API）
  - 逆地理编码（腾讯地图）
  - 实时天气（和风天气）
  - 点击刷新

- **界面主题**
  - 桂林山水青绿主题
  - 响应式设计
  - 适配 iOS / Android

## 技术栈

- **框架**: 微信小程序原生框架
- **语言**: JavaScript
- **样式**: WXSS
- **后端接口**: RESTful API (待接入)

## 项目结构

```
├── app.js                      # 小程序入口
├── app.json                    # 全局配置
├── app.wxss                    # 全局样式
├── sitemap.json                # 站点地图
├── project.config.json         # 项目配置
├── API_DOC.md                  # 后端接口文档
└── pages/
    ├── login/                  # 登录页
    │   ├── login.js
    │   ├── login.json
    │   ├── login.wxml
    │   └── login.wxss
    ├── index/                  # 首页/对话页
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    ├── agreement/              # 用户协议
    │   ├── agreement.js
    │   ├── agreement.json
    │   ├── agreement.wxml
    │   └── agreement.wxss
    └── privacy/                # 隐私政策
        ├── privacy.js
        ├── privacy.json
        ├── privacy.wxml
        └── privacy.wxss
```

## 快速开始

### 环境要求

- 微信开发者工具（最新版）
- 微信小程序 AppID

### 开发步骤

1. **导入项目**
   - 打开微信开发者工具
   - 导入项目，选择本目录
   - 填写你的小程序 AppID

2. **配置后端 API**
   
   打开 `pages/index/index.js`，修改顶部配置：
   ```javascript
   const API_BASE_URL = 'https://your-api-domain.com/api'  // 你的后端地址
   const API_KEY = 'your-api-key'  // API密钥（可选）
   ```

3. **配置第三方服务（可选）**
   
   - **腾讯地图**（逆地理编码）：https://lbs.qq.com/
   - **和风天气**（实时天气）：https://dev.qweather.com/
   
   在 `pages/index/index.js` 中配置：
   ```javascript
   const WEATHER_API_KEY = '你的和风天气Key'
   const QQ_MAP_KEY = '你的腾讯地图Key'
   ```

4. **开发者工具设置**
   - 详情 → 本地设置 → 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」（开发阶段）

## 后端接口

详细接口文档请参考 [API_DOC.md](./API_DOC.md)

### 主要接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/chat` | POST | AI 对话接口 |

### 请求示例

```javascript
// 请求
{
  "message": "推荐一条桂林三日游路线",
  "conversation_id": "conv_xxx",
  "user_id": "138****8888"
}

// 响应
{
  "code": 0,
  "message": "success",
  "reply": "AI回复内容...",
  "conversation_id": "conv_xxx"
}
```

## 发布上线

### 上线前检查

- [ ] 后端 API 已部署
- [ ] 在微信公众平台配置 request 合法域名
- [ ] 小程序类目选择正确
- [ ] 用户协议和隐私政策已完善
- [ ] 已提交隐私保护指引

### 发布流程

1. 微信开发者工具 → 上传
2. 填写版本号和项目备注
3. 登录微信公众平台 → 版本管理
4. 提交审核
5. 审核通过后发布

## 数据存储

所有用户数据存储在本地（`wx.setStorageSync`）：

| 键名 | 说明 |
|------|------|
| `userInfo` | 用户信息对象 |
| `isLoggedIn` | 是否正式登录 |
| `isGuest` | 是否游客模式 |
| `token` | 登录凭证 |
| `remainingCount` | 剩余对话次数 |
| `conversationId` | 当前对话ID |

## 主题配色

基于桂林山水设计的青绿主题：

| 颜色 | 色值 | 用途 |
|------|------|------|
| 主色 | `#10B981` | 按钮、强调 |
| 深主色 | `#059669` | 渐变终点 |
| 背景 | `#F7F8FA` | 页面背景 |
| 卡片 | `#FFFFFF` | 消息气泡 |
| 文字主色 | `#1F2937` | 标题、正文 |
| 文字副色 | `#6B7280` | 辅助文字 |

## 许可证

本项目仅供学习和内部使用。

## 联系方式

如有问题，请在小程序内联系客服。
