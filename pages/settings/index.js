Page({
  data: {
    appVersion: '1.0.0'
  },

  onLoad() {},

  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '桂林旅游助手 v' + this.data.appVersion + '\n\n我们致力于为游客提供最优质的桂林旅游服务，包括景点推荐、美食攻略、路线规划等。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！您可以通过以下方式联系我们：\n\n客服热线：400-123-4567\n服务时间：9:00-21:00',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})