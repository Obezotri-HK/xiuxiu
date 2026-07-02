Page({
  data: {
    userName: '游客',
    isLoggedIn: false,
    isGuest: false,
    orderStats: [
      { id: 'pending_pay', icon: '💳', name: '待付款', count: 2 },
      { id: 'pending_use', icon: '🎫', name: '待使用', count: 3 },
      { id: 'pending_comment', icon: '⭐', name: '待评价', count: 1 },
      { id: 'refund', icon: '💰', name: '退款/售后', count: 0 }
    ],
    userInfo: null
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
    this.updateTabBar(2)
  },

  checkLoginStatus() {
    var app = getApp()
    var userInfo = wx.getStorageSync('userInfo')
    var isLoggedIn = wx.getStorageSync('isLoggedIn')
    var isGuest = wx.getStorageSync('isGuest')

    if (isLoggedIn && userInfo) {
      this.setData({
        userName: userInfo.nickname || userInfo.nickName || userInfo.phone || '用户',
        isLoggedIn: true,
        isGuest: false,
        userInfo: userInfo
      })
      return
    }

    this.setData({
      userName: isGuest ? '游客模式' : '游客',
      isLoggedIn: false,
      isGuest: !!isGuest,
      userInfo: userInfo || null
    })

    if (app && app.globalData) {
      app.globalData.userInfo = userInfo || null
      app.globalData.isLoggedIn = !!isLoggedIn
      app.globalData.isGuest = !!isGuest
    }
  },

  updateTabBar(selected) {
    if (typeof this.getTabBar !== 'function') return

    var tabBar = this.getTabBar()
    if (tabBar && typeof tabBar.setData === 'function') {
      tabBar.setData({ selected: selected })
    }
  },

  onOrderTap(e) {
    if (!getApp().requireLogin({
      content: '查看订单需要登录后才能使用'
    })) {
      return
    }

    var orderType = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/order/list?type=' + orderType
    })
  },

  onMyOrders() {
    if (!getApp().requireLogin({
      content: '查看订单需要登录后才能使用'
    })) {
      return
    }

    wx.navigateTo({
      url: '/pages/order/list?type=all'
    })
  },

  onMyFavorites() {
    if (!getApp().requireLogin({
      content: '查看收藏需要登录后才能使用'
    })) {
      return
    }

    wx.navigateTo({
      url: '/pages/favorite/list'
    })
  },

  onHistory() {
    wx.navigateTo({
      url: '/pages/history/list'
    })
  },

  onContactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服热线：400-123-4567\n服务时间：9:00-21:00',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  onSettings() {
    wx.navigateTo({
      url: '/pages/settings/index'
    })
  },

  onAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/index'
    })
  },

  onPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    })
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          getApp().logout()
          this.setData({
            userName: '游客',
            isLoggedIn: false,
            isGuest: false,
            userInfo: null
          })
          wx.showToast({
            title: '退出成功',
            icon: 'success'
          })
        }
      }.bind(this)
    })
  },

  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
})
