Page({
  data: {
    favorites: []
  },

  onLoad() {},

  onShow() {
    if (!getApp().requireLogin({
      content: '收藏列表需要登录后才能查看'
    })) {
      this.setData({ favorites: [] })
      return
    }

    this.loadFavorites()
  },

  loadFavorites() {
    var favorites = wx.getStorageSync('favorites') || []
    this.setData({ favorites: favorites })
  },

  onProductTap(e) {
    var product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: '/pages/product/detail?id=' + product.id
    })
  },

  onRemove(e) {
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '取消收藏',
      content: '确定取消收藏该商品？',
      confirmText: '确定',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          var favorites = this.data.favorites.filter(function(item) {
            return item.id !== id
          })
          this.setData({ favorites: favorites })
          wx.setStorageSync('favorites', favorites)
          wx.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }.bind(this)
    })
  }
})
