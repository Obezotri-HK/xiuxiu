Page({
  data: {
    orderType: 'all',
    orderTypes: [
      { id: 'all', name: '全部' },
      { id: 'pending_pay', name: '待付款' },
      { id: 'pending_use', name: '待使用' },
      { id: 'pending_comment', name: '待评价' },
      { id: 'refund', name: '退款/售后' }
    ],
    orders: [
      {
        id: 'ORD20260701001',
        status: 'pending_use',
        statusText: '待使用',
        createTime: '2026-07-01 10:30',
        items: [
          { name: '漓江精华段游船', price: '198', quantity: 2, image: 'https://picsum.photos/seed/order1/100/100' }
        ],
        totalPrice: '396'
      },
      {
        id: 'ORD20260630002',
        status: 'pending_comment',
        statusText: '待评价',
        createTime: '2026-06-30 14:20',
        items: [
          { name: '象鼻山门票', price: '55', quantity: 2, image: 'https://picsum.photos/seed/order2/100/100' },
          { name: '阳朔西街特色民宿', price: '299', quantity: 1, image: 'https://picsum.photos/seed/order3/100/100' }
        ],
        totalPrice: '409'
      },
      {
        id: 'ORD20260628003',
        status: 'pending_pay',
        statusText: '待付款',
        createTime: '2026-06-28 09:15',
        items: [
          { name: '龙脊梯田一日游', price: '168', quantity: 2, image: 'https://picsum.photos/seed/order4/100/100' }
        ],
        totalPrice: '336'
      },
      {
        id: 'ORD20260625004',
        status: 'pending_use',
        statusText: '待使用',
        createTime: '2026-06-25 16:45',
        items: [
          { name: '两江四湖夜游', price: '185', quantity: 2, image: 'https://picsum.photos/seed/order5/100/100' }
        ],
        totalPrice: '370'
      }
    ],
    filteredOrders: []
  },

  onLoad(options) {
    if (!getApp().requireLogin({
      content: '订单功能需要登录后才能查看'
    })) {
      this.setData({
        orders: [],
        filteredOrders: []
      })
      return
    }

    var type = options ? options.type : 'all'
    this.setData({ orderType: type })
    this.filterOrders()
  },

  filterOrders() {
    var orders = this.data.orders
    var type = this.data.orderType
    
    if (type !== 'all') {
      orders = orders.filter(function(item) {
        return item.status === type
      })
    }
    
    this.setData({ filteredOrders: orders })
  },

  switchType(e) {
    var type = e.currentTarget.dataset.type
    this.setData({ orderType: type })
    this.filterOrders()
  },

  onOrderDetail(e) {
    var orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/detail?id=' + orderId
    })
  },

  onPay(e) {
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '支付订单',
      content: '订单号: ' + orderId + '\n确认支付？',
      confirmText: '去支付',
      confirmColor: '#10B981',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({ title: '支付成功', icon: 'success' })
        }
      }
    })
  },

  onUse(e) {
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '使用订单',
      content: '订单号: ' + orderId + '\n请出示核销码给商家',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  onComment(e) {
    var orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/comment?id=' + orderId
    })
  },

  onRefund(e) {
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '申请退款',
      content: '订单号: ' + orderId + '\n确认申请退款？',
      confirmText: '申请退款',
      confirmColor: '#EF4444',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({ title: '退款申请已提交', icon: 'success' })
        }
      }
    })
  }
})
