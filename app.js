App({
  onLaunch() {
    const userInfo = wx.getStorageSync('userInfo') || null
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false
    const isGuest = wx.getStorageSync('isGuest') || false
    const remainingCount = wx.getStorageSync('remainingCount') || 50
    
    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = isLoggedIn
    this.globalData.isGuest = isGuest
    this.globalData.remainingCount = remainingCount
  },

  checkLogin() {
    return this.globalData.isLoggedIn
  },

  syncAuthState() {
    const userInfo = wx.getStorageSync('userInfo') || null
    const isLoggedIn = !!wx.getStorageSync('isLoggedIn')
    const isGuest = !!wx.getStorageSync('isGuest')
    const remainingCount = wx.getStorageSync('remainingCount') || 50

    this.globalData.userInfo = userInfo
    this.globalData.isLoggedIn = isLoggedIn
    this.globalData.isGuest = isGuest
    this.globalData.remainingCount = remainingCount

    return {
      userInfo,
      isLoggedIn,
      isGuest,
      remainingCount
    }
  },

  requireLogin(options) {
    const config = options || {}
    const authState = this.syncAuthState()

    if (authState.isLoggedIn) {
      return true
    }

    wx.showModal({
      title: config.title || '请先登录',
      content: config.content || '该功能需要登录后才能使用',
      confirmText: config.confirmText || '去登录',
      confirmColor: '#10B981',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })

    return false
  },

  getUserInfo() {
    return this.globalData.userInfo
  },

  logout() {
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
    wx.removeStorageSync('isLoggedIn')
    wx.removeStorageSync('isGuest')
    
    this.globalData.userInfo = null
    this.globalData.isLoggedIn = false
    this.globalData.isGuest = false
    this.globalData.remainingCount = 50
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    isGuest: false,
    remainingCount: 50,
    location: '桂林市·象山区',
    weather: '多云',
    temperature: '28°'
  }
})
