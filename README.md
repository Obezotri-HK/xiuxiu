# 绣绣AI

绣绣AI是一个面向桂林旅游场景的微信小程序，首页默认进入 AI 对话界面，围绕“旅游咨询 + 本地天气位置 + 旅游商品转化 + 用户中心”来组织整体体验。

当前项目使用微信小程序原生框架开发，已经完成首页对话、商城、我的、商品详情、购物车、订单、收藏、浏览历史、登录、协议与隐私等页面的基础串联。

## 当前功能

### 首页对话

- 首页即聊天页，整体交互偏千问 / 豆包风格
- 顶部展示当前位置和实时天气，支持点击刷新定位与天气
- 支持快捷提示词和底部快捷提问按钮
- 支持“新对话”重置会话
- 支持文字输入与长按语音输入两种模式切换
- 语音录音已接入微信录音管理器，语音转文字接口预留待接入
- 聊天区域支持消息贴底显示，发送消息、AI 回复、切回页面时会自动滚动到底部
- 已预留自有 AI 后端接入入口，未接入时使用本地模拟回复兜底

### 商城模块

- 提供桂林旅游商品列表页，包含租车、游船、酒店、景区景点、装备等分类
- 支持关键词搜索和分类筛选
- 支持商品收藏状态切换
- 支持商品详情页查看图片、规格、政策说明
- 支持加入购物车和立即下单
- 支持后端接口请求失败时回落到本地模拟数据

### 用户中心

- 提供“我的”页面，展示登录状态、订单统计和常用功能入口
- 支持跳转我的订单、我的收藏、浏览历史、设置、用户协议、隐私政策
- 支持退出登录

### 订单与购物车

- 购物车页支持勾选、全选、增减数量、删除、清空和提交订单
- 订单页支持按状态筛选
- 已包含待付款、待使用、待评价、退款/售后等状态演示

### 登录与辅助页面

- 登录页支持手机号验证码登录、微信手机号授权登录、游客登录
- 已提供协议页、隐私页、设置页
- 已提供收藏页、浏览历史页

### 底部导航

- 使用自定义 `tabBar`，不是微信原生 `tabBar`
- 当前包含 `对话`、`商城`、`我的` 三个主入口
- 已针对底部留白做过压缩，整体更贴近内容区

## 技术栈

- 框架：微信小程序原生框架
- 语言：JavaScript
- 视图：WXML
- 样式：WXSS
- 数据交互：`wx.request`
- 本地缓存：`wx.setStorageSync` / `wx.getStorageSync`

## 项目结构

```text
├── app.js
├── app.json
├── app.wxss
├── API_DOC.md
├── README.md
├── sitemap.json
├── config/
│   └── api.js                 # 天气 / 地图服务配置
├── custom-tab-bar/
│   ├── index.js              # 自定义底部导航逻辑
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── utils/
│   └── api.js                # 业务接口地址管理
└── pages/
    ├── index/                # AI 对话首页
    ├── mall/                 # 商城列表页
    ├── product/              # 商品详情页
    ├── cart/                 # 购物车页
    ├── order/                # 订单列表页
    ├── favorite/             # 收藏页
    ├── history/              # 浏览历史页
    ├── profile/              # 我的页
    ├── settings/             # 设置页
    ├── login/                # 登录页
    ├── agreement/            # 用户协议页
    └── privacy/              # 隐私政策页
```

## 关键配置

### AI 对话接口

对话接口配置位于 [index.js](file:///c:/Users/Administrator/Desktop/xiuxiu/pages/index/index.js#L1-L8)：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
const API_KEY = 'your-api-key'
```

当前聊天请求约定：

- 请求地址：`POST /chat`
- 请求体包含：

```json
{
  "message": "推荐一条桂林三日游路线",
  "conversation_id": "conv_xxx",
  "user_id": "guest"
}
```

- 首页现已调整为“后端驱动卡片渲染”
- 后端除了返回 `reply` 外，还可以返回 `recommendationMeta` 和 `products`，首页会自动渲染商品卡片
- 详细字段协议见 [API_DOC.md](file:///C:/Users/Administrator/Desktop/xiuxiu/API_DOC.md)
- 如果 `API_BASE_URL` 仍为占位地址，首页只会显示前端演示提示，不再本地拼商品推荐

### 天气与定位

天气与定位配置位于 [api.js](file:///c:/Users/Administrator/Desktop/xiuxiu/config/api.js)：

- `WEATHER_API_BASE_URL`：和风天气接口地址
- `WEATHER_API_KEY`：天气服务密钥
- `MAP_API_BASE_URL`：腾讯地图接口地址
- `MAP_API_KEY`：地图服务密钥

首页通过以下能力完成“当前位置 + 天气”展示：

- `wx.getLocation`
- 腾讯地图逆地理编码
- 和风天气实时天气接口

### 商城与用户业务接口

业务接口统一定义在 [api.js](file:///c:/Users/Administrator/Desktop/xiuxiu/utils/api.js)：

- 商品：列表、详情
- 订单：列表、创建、详情
- 收藏：列表、切换
- 购物车：列表、添加、更新、删除
- 用户：信息、登录、退出、注册
- 位置：天气、地理编码

## 本地开发

### 环境要求

- 微信开发者工具
- 一个可用的小程序 AppID

### 启动方式

1. 使用微信开发者工具导入项目目录
2. 配置小程序 AppID
3. 重新编译项目
4. 如开发阶段尚未配置服务域名，可在开发者工具中临时关闭合法域名校验

## 权限与域名说明

### 位置权限

项目已在 [app.json](file:///c:/Users/Administrator/Desktop/xiuxiu/app.json#L44-L52) 中声明位置相关权限：

- `scope.userLocation`
- `getLocation`
- `chooseLocation`

### 合法域名

如果接口请求失败并提示“不在 request 合法域名列表中”，需要在微信公众平台后台配置以下域名：

- 你们自己的 AI / 业务后端域名
- 和风天气域名
- 腾讯地图域名

开发调试阶段，也可以在微信开发者工具中临时关闭合法域名校验。

## 当前实现说明

- 聊天页、商城页、商品详情页、购物车页都带有本地模拟数据兜底
- 收藏、购物车、登录状态等部分能力依赖本地缓存
- 语音识别接口尚未接入，当前仅完成录音入口和交互
- 项目已经切换到自定义底部导航，相关样式与选中态需要同步维护

## 注意事项

- [project.private.config.json](file:///c:/Users/Administrator/Desktop/xiuxiu/project.private.config.json) 属于本机私有配置，不建议提交到仓库
- 当前仓库中仍保留部分早期页面文件与新版 `index` 路由并存，实际启用页面以 [app.json](file:///c:/Users/Administrator/Desktop/xiuxiu/app.json) 中注册的路径为准

## 后续建议

- 接入正式 AI 对话服务和语音识别服务
- 接入真实商品、订单、购物车、用户中心接口
- 将首页位置、天气、旅游推荐进一步联动
- 为订单详情、支付、评价等流程补全独立页面

## 数据库说明

- 当前建议：本地开发先使用 `SQLite`，正式环境再迁移到 `PostgreSQL`
- 数据库建表方案见 [DB_SCHEMA.md](file:///C:/Users/Administrator/Desktop/xiuxiu/DB_SCHEMA.md)
- SQLite 建表脚本见 [schema.sqlite.sql](file:///C:/Users/Administrator/Desktop/xiuxiu/database/schema.sqlite.sql)
- PostgreSQL 建表脚本见 [schema.postgres.sql](file:///C:/Users/Administrator/Desktop/xiuxiu/database/schema.postgres.sql)

## 许可证

本项目仅供学习、演示和内部开发使用。
