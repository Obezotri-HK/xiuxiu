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
