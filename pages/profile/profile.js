Page({
  data: {
    userName: '游客',
    isLoggedIn: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
    this.updateTabBar(2)
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    const isLoggedIn = wx.getStorageSync('isLoggedIn')
    
    if (isLoggedIn && userInfo) {
      this.setData({
        userName: userInfo.phone || '用户',
        isLoggedIn: true
      })
    }
  },

  updateTabBar(selected) {
    if (typeof this.getTabBar !== 'function') return

    const tabBar = this.getTabBar()
    if (tabBar && typeof tabBar.setData === 'function') {
      tabBar.setData({ selected })
    }
  }
})
