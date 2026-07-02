var API = require('../../utils/api.js')

Page({
  data: {
    history: [],
    isLoading: false,
    isLoggedIn: false
  },

  onLoad() {},

  onShow() {
    this.syncAuthState()
    this.loadHistory()
  },

  syncAuthState() {
    this.setData({
      isLoggedIn: !!wx.getStorageSync('isLoggedIn')
    })
  },

  loadHistory() {
    this.setData({ isLoading: true })

    if (this.data.isLoggedIn) {
      this.loadRemoteHistory()
      return
    }

    this.loadLocalHistory()
  },

  loadRemoteHistory() {
    var token = wx.getStorageSync('token') || ''

    wx.request({
      url: API.history.list,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      timeout: 10000,
      success: function(res) {
        if (res.data && (res.data.code === 200 || res.data.code === 0) && Array.isArray(res.data.data)) {
          this.setData({
            history: this.normalizeHistoryList(res.data.data)
          })
          return
        }

        this.loadLocalHistory(true)
      }.bind(this),
      fail: function() {
        this.loadLocalHistory(true)
      }.bind(this),
      complete: function() {
        this.setData({ isLoading: false })
      }.bind(this)
    })
  },

  loadLocalHistory(silent) {
    var history = wx.getStorageSync('history') || []
    this.setData({
      history: this.normalizeHistoryList(history),
      isLoading: false
    })

    if (silent) {
      return
    }
  },

  normalizeHistoryList(list) {
    return (list || []).map(function(item) {
      return {
        id: item.id || item.productId || item.goodsId,
        name: item.name || item.title || item.productName || '未命名商品',
        desc: item.desc || item.description || item.subtitle || '',
        price: item.price || item.salePrice || item.currentPrice || '',
        tag: item.tag || item.badge || '',
        image: item.image || item.imageUrl || item.cover || item.coverUrl || '',
        time: item.time || item.viewTime || this.formatHistoryTime(item.viewedAt || item.createTime || item.timestamp)
      }
    }.bind(this)).filter(function(item) {
      return !!item.id
    })
  },

  formatHistoryTime(value) {
    if (!value) {
      return ''
    }

    var date = typeof value === 'number' ? new Date(value) : new Date(String(value).replace(/-/g, '/'))

    if (isNaN(date.getTime())) {
      return String(value)
    }

    var now = new Date()
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    var targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    var diffDay = Math.floor((today - targetDay) / 86400000)
    var hour = String(date.getHours()).padStart(2, '0')
    var minute = String(date.getMinutes()).padStart(2, '0')

    if (diffDay === 0) {
      return '今天 ' + hour + ':' + minute
    }

    if (diffDay === 1) {
      return '昨天 ' + hour + ':' + minute
    }

    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' ' + hour + ':' + minute
  },

  onProductTap(e) {
    var product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: '/pages/product/detail?id=' + product.id
    })
  },

  onClear() {
    wx.showModal({
      title: '清空历史',
      content: '确定清空所有浏览历史？',
      confirmText: '确定',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          if (this.data.isLoggedIn) {
            this.clearRemoteHistory()
            return
          }

          wx.removeStorageSync('history')
          this.setData({ history: [] })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }.bind(this)
    })
  },

  clearRemoteHistory() {
    var token = wx.getStorageSync('token') || ''

    wx.request({
      url: API.history.clear,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      timeout: 10000,
      success: function(res) {
        if (res.data && (res.data.code === 200 || res.data.code === 0)) {
          this.setData({ history: [] })
          wx.removeStorageSync('history')
          wx.showToast({ title: '已清空', icon: 'success' })
          return
        }

        wx.showToast({ title: '清空失败', icon: 'none' })
      }.bind(this),
      fail: function() {
        wx.showToast({ title: '清空失败', icon: 'none' })
      }
    })
  }
})
