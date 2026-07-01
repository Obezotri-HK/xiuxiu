const app = getApp()

// ============================================
// 后端API配置 - 请修改为你的后端地址
// ============================================
const API_BASE_URL = 'https://your-api-domain.com/api'  // 后端API地址
const API_KEY = 'your-api-key'  // API密钥（如果需要）

Page({
  data: {
    inputValue: '',
    messageList: [],
    isLoading: false,
    scrollToView: '',
    msgIdCounter: 0,
    conversationId: ''
  },

  onLoad() {
    this.initConversation()
  },

  // 初始化对话ID
  initConversation() {
    const conversationId = wx.getStorageSync('conversationId')
    if (conversationId) {
      this.setData({ conversationId })
    } else {
      const newId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      wx.setStorageSync('conversationId', newId)
      this.setData({ conversationId: newId })
    }
  },

  // 输入处理
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送快捷提示
  sendPrompt(e) {
    const prompt = e.currentTarget.dataset.prompt
    this.setData({
      inputValue: prompt
    })
    this.sendMessage()
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content || this.data.isLoading) return

    // 添加用户消息
    const userMsgId = this.data.msgIdCounter + 1
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: content,
      timestamp: Date.now()
    }

    this.setData({
      messageList: [...this.data.messageList, userMsg],
      inputValue: '',
      msgIdCounter: userMsgId,
      isLoading: true
    })

    this.scrollToBottom('msg-' + userMsgId)

    // 调用后端API
    this.callAIApi(content)
  },

  // 调用后端AI接口
  callAIApi(userMessage) {
    // 如果后端未配置，使用模拟回复
    if (API_BASE_URL === 'https://your-api-domain.com/api') {
      this.mockAIReply(userMessage)
      return
    }

    wx.request({
      url: `${API_BASE_URL}/chat`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-Conversation-Id': this.data.conversationId
      },
      data: {
        message: userMessage,
        conversation_id: this.data.conversationId,
        user_id: wx.getStorageSync('userInfo')?.phone || 'guest'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const aiReply = res.data.reply || res.data.content || res.data.message || '抱歉，我没有收到回复'
          this.addAIMessage(aiReply)
        } else {
          this.addAIMessage('抱歉，服务出现了问题，请稍后再试。')
        }
      },
      fail: (err) => {
        console.error('API调用失败:', err)
        this.addAIMessage('网络连接失败，请检查网络后重试。')
      }
    })
  },

  // 添加AI消息
  addAIMessage(content) {
    const aiMsgId = this.data.msgIdCounter + 1
    const aiMsg = {
      id: aiMsgId,
      role: 'ai',
      content: content,
      timestamp: Date.now()
    }

    this.setData({
      messageList: [...this.data.messageList, aiMsg],
      msgIdCounter: aiMsgId,
      isLoading: false
    })

    this.scrollToBottom('msg-' + aiMsgId)
  },

  // 模拟AI回复（后端未配置时使用）
  mockAIReply(userMessage) {
    setTimeout(() => {
      const replies = [
        `好的，我来帮你解答关于"${userMessage}"的问题。桂林是世界著名的风景游览城市，有着举世无双的喀斯特地貌，山青、水秀、洞奇、石美堪称桂林四绝。`,
        `感谢你的提问！关于"${userMessage}"，我可以给你一些建议。桂林的最佳旅游季节是每年的4-10月，这个时候气候宜人，风景最美。`,
        `收到！关于"${userMessage}"，我推荐你去这些地方：漓江（船游百里画廊）、象鼻山（桂林城徽）、阳朔西街（洋人街）、遇龙河（竹筏漂流）。`,
        `你好！${userMessage}是个很棒的话题。在桂林旅游，除了欣赏美景，还可以品尝地道的桂林米粉、阳朔啤酒鱼、荔浦芋扣肉等美食。`,
        `我来帮你分析一下"${userMessage}"。桂林景点众多，建议你根据天数来规划：1-2天游市区，3-5天深度游阳朔和周边。`
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      this.addAIMessage(randomReply)
    }, 1500 + Math.random() * 1500)
  },

  // 滚动到底部
  scrollToBottom(id) {
    setTimeout(() => {
      this.setData({
        scrollToView: id || 'msg-loading'
      })
    }, 100)
  },

  // 新建对话
  newChat() {
    if (this.data.messageList.length === 0) return

    wx.showModal({
      title: '提示',
      content: '确定要开始新对话吗？当前对话记录将被清空。',
      success: (res) => {
        if (res.confirm) {
          // 生成新的对话ID
          const newId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
          wx.setStorageSync('conversationId', newId)
          
          this.setData({
            messageList: [],
            msgIdCounter: 0,
            isLoading: false,
            scrollToView: '',
            conversationId: newId
          })
        }
      }
    })
  }
})
