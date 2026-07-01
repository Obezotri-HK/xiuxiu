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
    scrollTop: 0,
    msgIdCounter: 0,
    conversationId: '',
    isRecording: false,
    isCancel: false,
    recorderManager: null,
    startY: 0,
    voiceMode: false // 默认文字模式
  },

  onLoad() {
    this.initConversation()
    this.initRecorder()
  },

  onShow() {
    this.updateTabBar(0)
    if (this.data.messageList.length || this.data.isLoading) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 120)
    }
  },

  onUnload() {
    if (this.data.recorderManager) {
      this.data.recorderManager.stop()
    }
  },

  // 初始化录音管理器
  initRecorder() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      console.log('录音开始')
    })

    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.setData({ isRecording: false })
      
      if (!this.data.isCancel) {
        this.voiceToText(res.tempFilePath)
      } else {
        this.setData({ isCancel: false })
      }
    })

    recorderManager.onError((err) => {
      console.error('录音错误', err)
      this.setData({ isRecording: false })
      wx.showToast({ title: '录音失败', icon: 'none' })
    })

    this.setData({ recorderManager })
  },

  // 开始录音（按住）
  startRecording(e) {
    this.setData({ 
      startY: e.touches[0].clientY,
      isCancel: false 
    })
    
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.data.recorderManager.start({
          duration: 60000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        })
        this.setData({ isRecording: true })
      },
      fail: () => {
        wx.showToast({ title: '需要录音权限', icon: 'none' })
      }
    })
  },

  // 停止录音（松开）
  stopRecording() {
    if (this.data.isRecording) {
      this.data.recorderManager.stop()
    }
  },

  // 滑动取消
  onTouchMove(e) {
    if (!this.data.isRecording) return
    
    const moveY = e.touches[0].clientY
    const diff = this.data.startY - moveY
    
    if (diff > 100) {
      this.setData({ isCancel: true })
    } else {
      this.setData({ isCancel: false })
    }
  },

  // 切换语音/文字模式
  toggleVoiceMode() {
    this.setData({
      voiceMode: !this.data.voiceMode
    })
  },

  // 语音转文字（请接入您的语音识别API）
  voiceToText(filePath) {
    wx.showLoading({ title: '识别中...' })
    
    // ==========================================
    // TODO: 在这里接入您的语音识别API
    // filePath 是录音文件的临时路径
    // ==========================================
    
    // 临时代码：不做任何处理，直接隐藏loading
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '请先接入语音识别API', icon: 'none' })
    }, 500)
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

    this.scrollToBottom()

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

    this.scrollToBottom()
  },

  // 模拟AI回复（用于测试界面）
  mockAIReply(userMessage) {
    setTimeout(() => {
      let reply = ''
      
      // 简单的关键词回复
      if (userMessage.includes('桂林')) {
        reply = '桂林是世界著名的风景游览城市，有着举世无双的喀斯特地貌。您想了解桂林的景点、美食还是住宿呢？'
      } else if (userMessage.includes('阳朔')) {
        reply = '阳朔是桂林最著名的旅游县，有漓江、遇龙河、西街等著名景点。您是打算去阳朔旅游吗？'
      } else if (userMessage.includes('米粉')) {
        reply = '桂林米粉是桂林最有名的特色美食，以其独特的风味和口感闻名。推荐您去尝一下正宗的桂林米粉！'
      } else if (userMessage.includes('天气')) {
        reply = '桂林属于亚热带季风气候，四季分明。您可以告诉我您想了解哪个季节的天气情况？'
      } else if (userMessage.includes('景点') || userMessage.includes('推荐')) {
        reply = '桂林必游景点推荐：1. 漓江风景区 2. 象鼻山 3. 阳朔西街 4. 遇龙河 5. 龙脊梯田。您对哪个最感兴趣？'
      } else if (userMessage.includes('路线') || userMessage.includes('规划')) {
        reply = '桂林经典路线推荐：Day1 象鼻山+两江四湖；Day2 漓江游船+阳朔西街；Day3 遇龙河竹筏+银子岩。需要更详细的规划吗？'
      } else if (userMessage.includes('美食')) {
        reply = '桂林美食推荐：桂林米粉、阳朔啤酒鱼、荔浦芋扣肉、田螺酿、恭城油茶。您想了解哪一个？'
      } else {
        reply = '收到！我是您的桂林旅游助手。关于桂林旅游，您有什么想了解的？比如景点推荐、美食攻略、路线规划等都可以问我哦！'
      }
      
      this.addAIMessage(reply)
    }, 800 + Math.random() * 500)
  },

  // 滚动到底部
  scrollToBottom() {
    const nextScrollTop = this.data.scrollTop + 100000

    this.setData({
      scrollToView: '',
      scrollTop: nextScrollTop
    }, () => {
      setTimeout(() => {
        this.setData({
          scrollToView: 'chat-bottom-anchor',
          scrollTop: nextScrollTop + 1
        })
      }, 50)
    })
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
  },

  updateTabBar(selected) {
    if (typeof this.getTabBar !== 'function') return

    const tabBar = this.getTabBar()
    if (tabBar && typeof tabBar.setData === 'function') {
      tabBar.setData({ selected })
    }
  }
})
