# 绣绣AI H5 版本

基于 HTML + CSS + JavaScript 开发的纯前端版本，方便快速迭代和网页预览。

## 快速开始

### 方式一：直接打开

直接双击 `index.html` 即可在浏览器中打开预览。

### 方式二：本地服务器（推荐）

使用 VS Code 的 Live Server 插件，或者启动一个简单的本地服务器：

```bash
# 进入 h5 目录
cd h5

# Python 3
python -m http.server 8080

# 或 Node.js (需要安装 http-server)
npx http-server -p 8080
```

然后在浏览器中打开：http://localhost:8080

## 功能特性

- ✅ 登录页面（手机号验证码 + 微信授权 + 游客体验）
- ✅ AI 对话界面（千问风格）
- ✅ 快捷提示词
- ✅ 新对话功能
- ✅ 加载动画
- ✅ 用户协议 / 隐私政策
- ✅ 响应式设计，适配手机和桌面

## 项目结构

```
h5/
├── index.html          # 主页面（包含所有页面结构）
├── css/
│   └── style.css       # 全局样式
├── js/
│   └── app.js          # 业务逻辑 + 路由 + 状态管理
└── README.md           # 本文件
```

## 后端接入

打开 `js/app.js`，修改顶部配置：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';  // 你的后端地址
const API_KEY = 'your-api-key';  // API密钥（可选）
```

### 接口规范

**POST /chat**

```javascript
// 请求
{
  "message": "用户消息内容",
  "conversation_id": "对话ID",
  "user_id": "用户ID"
}

// 响应
{
  "code": 0,
  "message": "success",
  "reply": "AI回复内容"
}
```

详细接口文档请参考根目录的 `API_DOC.md`。

## 与小程序版本对比

| 功能 | H5版本 | 小程序版本 |
|------|--------|-----------|
| 登录页 | ✅ | ✅ |
| 对话功能 | ✅ | ✅ |
| 微信授权登录 | 模拟 | 真实API |
| 定位功能 | - | ✅ |
| 天气功能 | - | ✅ |
| 本地存储 | localStorage | wx.setStorageSync |
| 路由 | 单页面切换 | 多页面跳转 |

## 迁移到小程序

H5 版本和小程序版本的业务逻辑基本一致，主要差异在于 API 调用：

| H5 | 小程序 |
|----|--------|
| localStorage | wx.setStorageSync / wx.getStorageSync |
| fetch | wx.request |
| alert / confirm | wx.showToast / wx.showModal |
| window.location | wx.navigateTo / wx.redirectTo |

## 浏览器兼容性

- Chrome / Edge (推荐)
- Safari
- Firefox
- 移动端浏览器

## 开发说明

所有页面都在 `index.html` 中定义，通过 `page.active` 类控制显示/隐藏。

页面路由通过 `navigateTo(pageName)` 函数实现。
