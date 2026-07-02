Component({
  data: {
    selected: 0,
    isLoggedIn: false,
    isGuest: false,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "对话"
      },
      {
        pagePath: "/pages/mall/mall",
        text: "商城"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的"
      }
    ]
  },

  lifetimes: {
    attached() {
      this.syncAuthState()
    }
  },

  pageLifetimes: {
    show() {
      this.syncAuthState()
    }
  },

  methods: {
    syncAuthState() {
      const app = getApp()
      const isLoggedIn = !!wx.getStorageSync('isLoggedIn')
      const isGuest = !!wx.getStorageSync('isGuest')

      this.setData({
        isLoggedIn,
        isGuest
      })

      if (app && app.globalData) {
        app.globalData.isLoggedIn = isLoggedIn
        app.globalData.isGuest = isGuest
      }
    },

    switchTab(e) {
      const { path, index } = e.currentTarget.dataset

      if (typeof index === "number") {
        this.setData({ selected: index })
      }

      wx.switchTab({ url: path })
    },

    goLogin() {
      this.syncAuthState()

      if (this.data.isLoggedIn) {
        return
      }

      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
})
