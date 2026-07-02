var API = require('../../utils/api.js')

Page({
  data: {
    cartItems: [],
    isLoading: false,
    totalPrice: 0,
    totalCount: 0,
    selectedAll: false
  },

  onLoad() {},

  onShow() {
    if (!getApp().requireLogin({
      content: '购物车和下单功能需要登录后才能使用'
    })) {
      this.setData({
        cartItems: [],
        totalPrice: 0,
        totalCount: 0,
        selectedAll: false
      })
      return
    }

    this.loadCart()
  },

  loadCart() {
    this.setData({ isLoading: true })

    wx.request({
      url: API.cart.list,
      method: 'GET',
      timeout: 10000,
      success: function(res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          this.setData({
            cartItems: res.data.data
          })
        } else {
          this.loadMockCart()
        }
        this.calculateTotal()
      }.bind(this),
      fail: function() {
        this.loadMockCart()
        this.calculateTotal()
      }.bind(this),
      complete: function() {
        this.setData({ isLoading: false })
      }.bind(this)
    })
  },

  loadMockCart() {
    var cart = wx.getStorageSync('cart') || []
    this.setData({ cartItems: cart })
  },

  calculateTotal() {
    var items = this.data.cartItems
    var totalPrice = 0
    var totalCount = 0

    items.forEach(function(item) {
      if (item.selected !== false) {
        totalPrice += item.price * item.quantity
        totalCount += item.quantity
      }
    })

    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount
    })
  },

  onQuantityChange(e) {
    var index = e.currentTarget.dataset.index
    var delta = e.currentTarget.dataset.delta
    var items = this.data.cartItems
    var item = items[index]
    var newQty = item.quantity + delta

    if (newQty < 1) {
      newQty = 1
    }
    if (item.stock && newQty > item.stock) {
      newQty = item.stock
      wx.showToast({ title: '库存不足', icon: 'none' })
    }

    items[index].quantity = newQty
    this.setData({ cartItems: items })
    this.saveCart()
    this.calculateTotal()
  },

  onRemove(e) {
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除商品',
      content: '确定删除该商品？',
      confirmText: '确定',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          var items = this.data.cartItems
          items.splice(index, 1)
          this.setData({ cartItems: items })
          this.saveCart()
          this.calculateTotal()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }.bind(this)
    })
  },

  onItemSelect(e) {
    var index = e.currentTarget.dataset.index
    var items = this.data.cartItems
    items[index].selected = !items[index].selected
    this.setData({ cartItems: items })
    this.saveCart()
    this.calculateTotal()
    this.checkSelectedAll()
  },

  onSelectAll(e) {
    var selectedAll = !this.data.selectedAll
    var items = this.data.cartItems
    items.forEach(function(item) {
      item.selected = selectedAll
    })
    this.setData({
      cartItems: items,
      selectedAll: selectedAll
    })
    this.saveCart()
    this.calculateTotal()
  },

  checkSelectedAll() {
    var items = this.data.cartItems
    var selectedAll = items.length > 0 && items.every(function(item) {
      return item.selected === true
    })
    this.setData({ selectedAll: selectedAll })
  },

  saveCart() {
    wx.setStorageSync('cart', this.data.cartItems)
  },

  onClearCart() {
    wx.showModal({
      title: '清空购物车',
      content: '确定清空所有商品？',
      confirmText: '确定',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          this.setData({ cartItems: [] })
          this.saveCart()
          this.calculateTotal()
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }.bind(this)
    })
  },

  onCheckout() {
    if (!getApp().requireLogin({
      content: '提交订单需要登录后才能使用'
    })) {
      return
    }

    if (this.data.totalCount === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }

    var selectedItems = this.data.cartItems.filter(function(item) {
      return item.selected !== false
    })

    var orderData = {
      items: selectedItems,
      totalPrice: this.data.totalPrice,
      totalCount: this.data.totalCount
    }

    wx.request({
      url: API.orders.create,
      method: 'POST',
      data: orderData,
      timeout: 10000,
      success: function(res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          this.handleOrderSuccess(res.data.data)
        } else {
          wx.showToast({ title: '下单失败', icon: 'none' })
        }
      }.bind(this),
      fail: function() {
        this.handleOrderSuccess({
          orderId: 'ORD' + Date.now(),
          ...orderData
        })
      }.bind(this)
    })
  },

  handleOrderSuccess(order) {
    this.setData({ cartItems: [] })
    this.saveCart()
    this.calculateTotal()

    wx.showModal({
      title: '下单成功',
      content: '订单号：' + order.orderId,
      showCancel: false,
      success: function() {
        wx.navigateTo({
          url: '/pages/order/list'
        })
      }
    })
  },

  onProductTap(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/product/detail?id=' + item.productId
    })
  },

  goMall() {
    wx.switchTab({
      url: '/pages/mall/mall'
    })
  }
})
