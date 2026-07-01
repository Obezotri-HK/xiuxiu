# 绣绣AI - 桂林旅游 AI 微信小程序

绣绣AI是一款面向桂林旅游场景的微信小程序，首页默认进入 AI 对话界面，并提供商城与个人中心两个辅助页面，方便做旅游咨询、商品展示和账号信息管理。

## 当前版本功能

### 对话页

- 首页即对话页，整体交互参考千问/豆包风格
- 支持快捷提示词，点击后可直接发起提问
- 支持新对话
- 支持文字输入与语音输入模式切换
- 支持录音入口，已预留语音识别接口
- 支持对话自动滚到底部
- 支持接入自有 AI 后端接口

### 商城页

- 提供桂林旅游商品展示页
- 包含旅游产品、景点、民宿、美食等示例数据
- 支持作为后续商城或内容推荐页面扩展

### 我的页

- 提供个人中心页面
- 展示用户信息、订单、收藏、浏览历史、联系客服等入口

### 底部导航

- 使用自定义 `tabBar`
- 当前包含 `对话`、`商城`、`我的` 三个导航项
- 可自定义高度、字体和选中态样式

## 技术栈

- 框架：微信小程序原生框架
- 语言：JavaScript
- 视图：WXML
- 样式：WXSS
- 数据接口：REST API

## 目录结构

```text
├── app.js
├── app.json
├── app.wxss
├── API_DOC.md
├── README.md
├── sitemap.json
├── custom-tab-bar/
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
└── pages/
    ├── index/          # 对话首页
    ├── mall/           # 商城页
    ├── profile/        # 我的页
    ├── login/          # 登录页
    ├── agreement/      # 用户协议
    └── privacy/        # 隐私政策
```

## 本地开发

### 环境要求

- 微信开发者工具
- 可用的小程序 AppID

### 启动方式

1. 使用微信开发者工具导入项目目录
2. 在开发者工具中配置小程序 AppID
3. 如开发阶段需要，可在开发者工具中关闭合法域名校验

## AI 接口接入

对话页的接口配置位于 [index.js](file:///c:/Users/Administrator/Desktop/xiuxiu/pages/index/index.js) 顶部：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
const API_KEY = 'your-api-key'
```

接入时请将其替换为自己的后端地址和鉴权信息。

### 当前约定

- 聊天接口地址：`POST /chat`
- 请求字段示例：

```json
{
  "message": "推荐一条桂林三日游路线",
  "conversation_id": "conv_xxx",
  "user_id": "guest"
}
```

- 返回字段兼容：
  - `reply`
  - `content`
  - `message`

## 语音能力说明

- 当前小程序已接入微信录音管理器
- 录音入口已完成
- 语音转文字逻辑仍需接入真实语音识别服务
- 可在 [voiceToText](file:///c:/Users/Administrator/Desktop/xiuxiu/pages/index/index.js#L126-L140) 中替换为你们自己的语音识别接口

## 开发说明

### 域名配置

如果在微信开发者工具中调用接口出现合法域名报错，请：

1. 在微信公众平台配置 `request` 合法域名
2. 在开发工具中刷新域名配置
3. 开发调试阶段可临时关闭合法域名校验

### 私有配置文件

`project.private.config.json` 属于本机开发配置，通常不建议提交到仓库。

## 后续可扩展方向

- 接入真实旅游 AI 服务
- 接入真实商品、订单和用户中心接口
- 接入语音识别与语音播报
- 增加景点详情、路线卡片、订单页等业务页面

## 许可证

本项目仅供学习、演示和内部开发使用。
