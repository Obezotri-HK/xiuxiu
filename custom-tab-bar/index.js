Component({
  data: {
    selected: 0,
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

  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset

      if (typeof index === "number") {
        this.setData({ selected: index })
      }

      wx.switchTab({ url: path })
    }
  }
})
