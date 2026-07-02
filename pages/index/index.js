const app = getApp()
const config = require('../../config/api.js')

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
    voiceMode: false,
    location: '桂林市·象山区',
    weather: '多云',
    temperature: '28°',
    weatherIcon: '⛅',
    isRefreshingLocation: false,
    isLoggedIn: false,
    isGuest: false
  },

  onLoad() {
    this.initConversation()
    this.initRecorder()
    this.getLocationAndWeather()
    this.syncAuthState()
  },

  onShow() {
    this.syncAuthState()
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

  syncAuthState() {
    const app = getApp()
    const isLoggedIn = !!wx.getStorageSync('isLoggedIn')
    const isGuest = !!wx.getStorageSync('isGuest')

    this.setData({
      isLoggedIn,
      isGuest
    })
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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
          const parsedResponse = this.parseAIApiResponse(res.data)
          this.addAIMessage(
            parsedResponse.reply,
            parsedResponse.products,
            parsedResponse.recommendationMeta
          )
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
  addAIMessage(content, products, recommendationMeta) {
    const normalizedProducts = this.normalizeProducts(products)
    const finalRecommendationMeta = normalizedProducts.length
      ? (recommendationMeta || this.getDefaultRecommendationMeta())
      : null

    const aiMsgId = this.data.msgIdCounter + 1
    const aiMsg = {
      id: aiMsgId,
      role: 'ai',
      content: content,
      products: normalizedProducts,
      recommendationMeta: finalRecommendationMeta,
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
      const demoResponse = this.getBossDemoResponse(userMessage)

      if (demoResponse) {
        this.addAIMessage(
          demoResponse.reply,
          demoResponse.products,
          demoResponse.recommendationMeta
        )
        return
      }

      const reply = '当前为前端演示模式。请接入你们自己的 AI 接口和商品数据库，后端返回回复文案与商品卡片数据后，这里会自动按当前页面样式渲染展示。'
      this.addAIMessage(reply)
    }, 800 + Math.random() * 500)
  },

  getBossDemoResponse(userMessage) {
    var normalizedMessage = (userMessage || '').replace(/\s+/g, '')
    var demoKeywords = ['老板演示', '演示卡片', '商品卡片演示', '我想去象山公园玩']
    var isDemoMessage = demoKeywords.some(function(keyword) {
      return normalizedMessage.indexOf(keyword) > -1
    })

    if (!isDemoMessage) {
      return null
    }

    return {
      reply: '可以，当前先按演示模式给你展示一组商城推荐卡片。后续接入你们自己的 AI 和数据库后，这里的话术和商品都由后端实时返回，前端直接按当前样式渲染。',
      recommendationMeta: {
        title: '商城推荐',
        hint: '以下为老板演示专用卡片，点击可进入商品详情页'
      },
      products: [
        {
          id: 3,
          name: '象鼻山门票',
          desc: '桂林城徽地标，必游景点',
          price: '55',
          image: 'https://picsum.photos/seed/guilin-scenic1/400/300',
          tag: '必游'
        },
        {
          id: 7,
          name: '两江四湖夜游',
          desc: '乘船夜游桂林城，灯光璀璨',
          price: '185',
          image: 'https://picsum.photos/seed/guilin-night1/400/300',
          tag: '夜景'
        },
        {
          id: 4,
          name: '阳朔西街特色民宿',
          desc: '临溪而居，静谧舒适',
          price: '299',
          image: 'https://picsum.photos/seed/guilin-hotel1/400/300',
          tag: '推荐'
        }
      ]
    }
  },

  parseAIApiResponse(responseData) {
    // 后端可返回：
    // {
    //   reply: 'AI 回复文案',
    //   recommendationMeta: { title: '商城推荐', hint: '说明文案' },
    //   products: [
    //     { id, name, desc, price, image, tag }
    //   ]
    // }
    // 也兼容 cards / recommendations / goodsList 等命名。
    const data = responseData.data || responseData.result || responseData
    const reply = data.reply || data.content || data.message || data.text || '抱歉，我没有收到回复'
    const rawProducts = data.products || data.cards || data.recommendations || data.goodsList || []
    const recommendationMeta = data.recommendationMeta || data.cardMeta || null

    return {
      reply: reply,
      products: this.normalizeProducts(rawProducts),
      recommendationMeta: this.normalizeRecommendationMeta(recommendationMeta)
    }
  },

  normalizeProducts(products) {
    if (!Array.isArray(products)) {
      return []
    }

    return products.map(function(item, index) {
      return {
        id: item.id || item.productId || item.goodsId || ('card_' + index),
        name: item.name || item.title || item.productName || '未命名商品',
        desc: item.desc || item.description || item.subtitle || item.summary || '',
        price: item.price || item.salePrice || item.currentPrice || '',
        image: item.image || item.imageUrl || item.cover || item.coverUrl || '',
        tag: item.tag || item.badge || item.label || ''
      }
    }).filter(function(item) {
      return !!item.name
    })
  },

  normalizeRecommendationMeta(meta) {
    if (!meta) {
      return null
    }

    return {
      title: meta.title || meta.heading || meta.label || '商城推荐',
      hint: meta.hint || meta.desc || meta.description || '以下卡片均来自当前商城，点击可进入商品详情页'
    }
  },

  getDefaultRecommendationMeta() {
    return {
      title: '商城推荐',
      hint: '以下卡片均来自当前商城，点击可进入商品详情页'
    }
  },

  goProductDetail(e) {
    const productId = e.currentTarget.dataset.id

    if (!productId) {
      return
    }

    wx.navigateTo({
      url: '/pages/product/detail?id=' + productId
    })
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
  },

  getLocationAndWeather(callback) {
    var app = getApp()
    
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        this.reverseGeocode(latitude, longitude, callback)
      }.bind(this),
      fail: function(err) {
        console.error('获取位置失败:', err)
        
        var defaultLocation = app.globalData.location || '桂林市·象山区'
        var defaultWeather = app.globalData.weather || '多云'
        var defaultTemp = app.globalData.temperature || '28°'
        
        this.setData({
          location: defaultLocation,
          weather: defaultWeather,
          temperature: defaultTemp,
          weatherIcon: this.getWeatherIcon(defaultWeather)
        })
        
        if (typeof callback === 'function') {
          callback()
        }
      }.bind(this)
    })
  },

  reverseGeocode(latitude, longitude, callback) {
    wx.request({
      url: config.MAP_API_BASE_URL + '/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + config.MAP_API_KEY,
      timeout: 5000,
      success: function(res) {
        if (res.data && res.data.status === 0 && res.data.result) {
          var addressComponent = res.data.result.address_component
          var city = addressComponent.city || '桂林市'
          var district = addressComponent.district || '象山区'
          var location = city.replace('市', '') + '·' + district
          
          this.setData({ location: location })
          this.getWeatherByCity(city, callback)
        } else {
          this.useDefaultLocation(callback)
        }
      }.bind(this),
      fail: function() {
        this.useDefaultLocation(callback)
      }.bind(this),
      complete: function() {}
    })
  },

  getWeatherByCity(city, callback) {
    wx.request({
      url: config.WEATHER_API_BASE_URL + '/v7/weather/now?location=' + city + '&key=' + config.WEATHER_API_KEY,
      timeout: 5000,
      success: function(res) {
        if (res.data && res.data.code === '200' && res.data.now) {
          var text = res.data.now.text
          var temp = res.data.now.temp
          this.setData({
            weather: text,
            temperature: temp + '°',
            weatherIcon: this.getWeatherIcon(text)
          })
          
          var app = getApp()
          app.globalData.location = this.data.location
          app.globalData.weather = text
          app.globalData.temperature = temp + '°'
          
          if (typeof callback === 'function') {
            callback()
          }
        } else {
          this.useDefaultWeather(callback)
        }
      }.bind(this),
      fail: function() {
        this.useDefaultWeather(callback)
      }.bind(this),
      complete: function() {}
    })
  },

  useDefaultLocation(callback) {
    var app = getApp()
    var defaultLocation = app.globalData.location || '桂林市·象山区'
    this.setData({ location: defaultLocation })
    this.useDefaultWeather(callback)
  },

  useDefaultWeather(callback) {
    var app = getApp()
    var defaultWeather = app.globalData.weather || '多云'
    var defaultTemp = app.globalData.temperature || '28°'
    
    this.setData({
      weather: defaultWeather,
      temperature: defaultTemp,
      weatherIcon: this.getWeatherIcon(defaultWeather)
    })
    
    if (typeof callback === 'function') {
      callback()
    }
  },

  getWeatherIcon(weatherText) {
    var iconMap = {
      '晴': '☀️',
      '多云': '⛅',
      '阴': '☁️',
      '小雨': '🌧️',
      '中雨': '🌧️',
      '大雨': '⛈️',
      '暴雨': '⛈️',
      '雷阵雨': '⛈️',
      '雨夹雪': '🌨️',
      '小雪': '❄️',
      '中雪': '❄️',
      '大雪': '❄️',
      '暴雪': '❄️',
      '雾': '🌫️',
      '霾': '😷',
      '沙尘': '🌪️',
      '台风': '🌀'
    }
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (weatherText.includes(key)) {
        return icon
      }
    }
    
    return '⛅'
  },

  refreshLocation() {
    if (this.data.isRefreshingLocation) return
    
    this.setData({ isRefreshingLocation: true })
    
    wx.showLoading({ title: '更新中...' })
    
    this.getLocationAndWeather(() => {
      this.setData({ isRefreshingLocation: false })
      wx.hideLoading()
      wx.showToast({ title: '更新成功', icon: 'success', duration: 1500 })
    })
  }
})
