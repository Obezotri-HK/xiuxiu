var API = require('../../utils/api.js')

Page({
  data: {
    productId: '',
    product: null,
    quantity: 1,
    selectedSpecs: {},
    isLoading: false,
    isSubmitting: false,
    isFavorite: false,
    cartCount: 0
  },

  onLoad(options) {
    console.log('商品详情页面加载')
    if (options && options.id) {
      this.setData({
        productId: options.id
      })
      this.loadProduct(options.id)
    }
  },

  loadProduct(productId) {
    this.setData({ isLoading: true })
    
    wx.request({
      url: API.products.detail + productId,
      method: 'GET',
      timeout: 10000,
      success: function(res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          this.setData({
            product: res.data.data
          }, function() {
            this.recordHistory(this.data.product)
          })
        } else {
          this.loadMockProduct(productId)
        }
      }.bind(this),
      fail: function() {
        this.loadMockProduct(productId)
      }.bind(this),
      complete: function() {
        this.setData({ isLoading: false })
      }.bind(this)
    })
  },

  loadMockProduct(productId) {
    var mockProducts = {
      1: {
        id: 1,
        name: '漓江精华段游船',
        desc: '桂林至阳朔，百里画廊风光',
        price: '198',
        originalPrice: '258',
        sales: '',
        tag: '必游',
        category: 'boat',
        image: 'https://picsum.photos/seed/guilin-boat1/400/300',
        stock: 100,
        images: [
          'https://picsum.photos/seed/guilin-boat1/800/600',
          'https://picsum.photos/seed/guilin-boat1a/800/600',
          'https://picsum.photos/seed/guilin-boat1b/800/600'
        ],
        detail: '漓江精华段游船，从桂林磨盘山码头出发，途经象鼻山、伏波山、叠彩山、穿山、斗鸡山、净瓶山、阳朔等景点，全程约4小时，饱览百里漓江风光。',
        specs: [
          { name: '成人票', price: 198 },
          { name: '儿童票', price: 99 },
          { name: '老人票', price: 158 }
        ],
        policy: '1. 请提前30分钟到达码头检票；2. 儿童身高1.2米以下免费；3. 70岁以上老人需有家人陪同；4. 遇恶劣天气可能停航，请提前咨询。'
      },
      2: {
        id: 2,
        name: '阳朔遇龙河竹筏',
        desc: '双人竹筏，体验水乡风情',
        price: '258',
        originalPrice: '328',
        sales: '',
        tag: '网红',
        category: 'boat',
        image: 'https://picsum.photos/seed/guilin-boat2/400/300',
        stock: 50,
        images: [
          'https://picsum.photos/seed/guilin-boat2/800/600',
          'https://picsum.photos/seed/guilin-boat2a/800/600'
        ],
        detail: '遇龙河竹筏漂流，两人一筏，由船工撑篙，沿途欣赏田园风光，感受水乡风情。漂流全程约1小时，途经遇龙桥、富里桥等景点。',
        specs: [
          { name: '双人筏', price: 258 },
          { name: '单人筏', price: 158 }
        ],
        policy: '1. 竹筏为两人一筏，单人需补差价；2. 请勿在竹筏上站立；3. 贵重物品请妥善保管。'
      },
      3: {
        id: 3,
        name: '象鼻山门票',
        desc: '桂林城徽地标，必游景点',
        price: '55',
        originalPrice: '75',
        sales: '',
        tag: '必游',
        category: 'scenic',
        image: 'https://picsum.photos/seed/guilin-scenic1/400/300',
        stock: 200,
        images: [
          'https://picsum.photos/seed/guilin-scenic1/800/600',
          'https://picsum.photos/seed/guilin-scenic1a/800/600'
        ],
        detail: '象鼻山是桂林的城徽，因山形似大象饮水而得名。景区内有水月洞、象眼岩、普贤塔等景点，是桂林山水的代表。',
        specs: [
          { name: '成人票', price: 55 },
          { name: '儿童票', price: 28 },
          { name: '老人票', price: 40 }
        ],
        policy: '1. 入园时间：8:00-17:30；2. 儿童身高1.2米以下免费；3. 65岁以上老人凭身份证优惠。'
      },
      4: {
        id: 4,
        name: '阳朔西街特色民宿',
        desc: '临溪而居，静谧舒适',
        price: '299',
        originalPrice: '399',
        sales: '',
        tag: '推荐',
        category: 'hotel',
        image: 'https://picsum.photos/seed/guilin-hotel1/400/300',
        stock: 30,
        images: [
          'https://picsum.photos/seed/guilin-hotel1/800/600',
          'https://picsum.photos/seed/guilin-hotel1a/800/600',
          'https://picsum.photos/seed/guilin-hotel1b/800/600'
        ],
        detail: '位于阳朔西街附近，临溪而居，环境静谧舒适。房间配备空调、热水、WiFi等设施，提供免费早餐。',
        specs: [
          { name: '大床房', price: 299 },
          { name: '双床房', price: 358 },
          { name: '家庭房', price: 458 }
        ],
        policy: '1. 入住时间：14:00后；2. 退房时间：12:00前；3. 押金：200元；4. 不可携带宠物。'
      },
      5: {
        id: 5,
        name: '桂林自驾租车',
        desc: '舒适SUV，自由畅游桂林',
        price: '288',
        originalPrice: '388',
        sales: '',
        tag: '热门',
        category: 'car',
        image: 'https://picsum.photos/seed/guilin-car1/400/300',
        stock: 20,
        images: [
          'https://picsum.photos/seed/guilin-car1/800/600',
          'https://picsum.photos/seed/guilin-car1a/800/600'
        ],
        detail: '舒适SUV车型，配备GPS导航，保险齐全。支持机场/火车站接送，提供24小时客服。',
        specs: [
          { name: '经济型轿车', price: 188 },
          { name: '舒适型SUV', price: 288 },
          { name: '豪华型轿车', price: 458 }
        ],
        policy: '1. 需年满21周岁，持有C1驾照；2. 需缴纳押金3000元；3. 里程限制：每日200公里，超出部分按1元/公里计费。'
      },
      6: {
        id: 6,
        name: '龙脊梯田一日游',
        desc: '含往返车费+门票+导游',
        price: '168',
        originalPrice: '228',
        sales: '',
        tag: '必游',
        category: 'scenic',
        image: 'https://picsum.photos/seed/guilin-scenic2/400/300',
        stock: 80,
        images: [
          'https://picsum.photos/seed/guilin-scenic2/800/600',
          'https://picsum.photos/seed/guilin-scenic2a/800/600'
        ],
        detail: '龙脊梯田一日游，含桂林往返车费、景区门票、专业导游讲解。游览金坑大寨梯田，欣赏壮丽的梯田风光。',
        specs: [
          { name: '成人票', price: 168 },
          { name: '儿童票', price: 98 },
          { name: '老人票', price: 128 }
        ],
        policy: '1. 早上7:30集合出发；2. 含中餐；3. 儿童身高1.2米以下免费；4. 山路较多，建议穿舒适鞋子。'
      },
      7: {
        id: 7,
        name: '两江四湖夜游',
        desc: '乘船夜游桂林城，灯光璀璨',
        price: '185',
        originalPrice: '235',
        sales: '',
        tag: '夜景',
        category: 'boat',
        image: 'https://picsum.photos/seed/guilin-night1/400/300',
        stock: 60,
        images: [
          'https://picsum.photos/seed/guilin-night1/800/600',
          'https://picsum.photos/seed/guilin-night1a/800/600'
        ],
        detail: '乘船夜游桂林两江四湖，欣赏灯光璀璨的城市夜景。途经象鼻山、日月双塔、榕湖、杉湖等景点。',
        specs: [
          { name: '成人票', price: 185 },
          { name: '儿童票', price: 93 },
          { name: '老人票', price: 148 }
        ],
        policy: '1. 开船时间：19:30-21:30；2. 航程约90分钟；3. 请提前30分钟到达码头检票。'
      },
      8: {
        id: 8,
        name: '户外登山装备',
        desc: '专业户外装备套装',
        price: '399',
        originalPrice: '499',
        sales: '',
        tag: '装备',
        category: 'equipment',
        image: 'https://picsum.photos/seed/guilin-equip1/400/300',
        stock: 150,
        images: [
          'https://picsum.photos/seed/guilin-equip1/800/600',
          'https://picsum.photos/seed/guilin-equip1a/800/600'
        ],
        detail: '专业户外登山装备套装，包含登山鞋、登山杖、背包、水壶等必备装备，适合各种户外场景。',
        specs: [
          { name: '基础套装', price: 399 },
          { name: '专业套装', price: 699 }
        ],
        policy: '1. 支持7天无理由退换；2. 登山鞋尺码标准，请按正常尺码购买；3. 颜色以实物为准。'
      },
      9: {
        id: 9,
        name: '桂林市中心酒店',
        desc: '星级酒店，交通便利',
        price: '458',
        originalPrice: '558',
        sales: '',
        tag: '推荐',
        category: 'hotel',
        image: 'https://picsum.photos/seed/guilin-hotel2/400/300',
        stock: 40,
        images: [
          'https://picsum.photos/seed/guilin-hotel2/800/600',
          'https://picsum.photos/seed/guilin-hotel2a/800/600'
        ],
        detail: '位于桂林市中心，交通便利，步行可达象鼻山、两江四湖等景点。酒店配备健身房、游泳池、餐厅等设施。',
        specs: [
          { name: '标准间', price: 458 },
          { name: '豪华间', price: 588 },
          { name: '套房', price: 888 }
        ],
        policy: '1. 入住时间：14:00后；2. 退房时间：12:00前；3. 押金：500元；4. 提供免费停车。'
      },
      10: {
        id: 10,
        name: '十里画廊观光车',
        desc: '阳朔十里画廊景区游览',
        price: '68',
        originalPrice: '88',
        sales: '',
        tag: '必游',
        category: 'car',
        image: 'https://picsum.photos/seed/guilin-car2/400/300',
        stock: 100,
        images: [
          'https://picsum.photos/seed/guilin-car2/800/600',
          'https://picsum.photos/seed/guilin-car2a/800/600'
        ],
        detail: '阳朔十里画廊观光车，随上随下，方便游览沿途景点。途经大榕树、月亮山、蝴蝶泉等景点。',
        specs: [
          { name: '成人票', price: 68 },
          { name: '儿童票', price: 34 }
        ],
        policy: '1. 票价为单日通票；2. 凭票可在各站点上下车；3. 运营时间：8:00-18:00。'
      },
      11: {
        id: 11,
        name: '银子岩溶洞门票',
        desc: '世界溶洞奇观，钟乳石美景',
        price: '80',
        originalPrice: '100',
        sales: '',
        tag: '必游',
        category: 'scenic',
        image: 'https://picsum.photos/seed/guilin-scenic3/400/300',
        stock: 180,
        images: [
          'https://picsum.photos/seed/guilin-scenic3/800/600',
          'https://picsum.photos/seed/guilin-scenic3a/800/600'
        ],
        detail: '银子岩溶洞，被誉为"世界溶洞奇观"，洞内钟乳石洁白如银，晶莹剔透。游览全程约1小时。',
        specs: [
          { name: '成人票', price: 80 },
          { name: '儿童票', price: 40 },
          { name: '老人票', price: 60 }
        ],
        policy: '1. 入园时间：8:00-17:30；2. 洞内较凉爽，请带一件外套；3. 请勿触摸钟乳石。'
      },
      12: {
        id: 12,
        name: '旅游摄影套装',
        desc: '专业摄影装备，记录美好瞬间',
        price: '599',
        originalPrice: '799',
        sales: '',
        tag: '装备',
        category: 'equipment',
        image: 'https://picsum.photos/seed/guilin-equip2/400/300',
        stock: 70,
        images: [
          'https://picsum.photos/seed/guilin-equip2/800/600',
          'https://picsum.photos/seed/guilin-equip2a/800/600'
        ],
        detail: '专业旅游摄影套装，包含相机、镜头、三脚架、滤镜等配件，适合旅行摄影爱好者。',
        specs: [
          { name: '入门套装', price: 599 },
          { name: '专业套装', price: 1299 }
        ],
        policy: '1. 支持7天无理由退换；2. 提供一年质保；3. 赠送相机包和清洁套装。'
      }
    }
    
    this.setData({
      product: mockProducts[productId] || mockProducts[1]
    }, function() {
      this.recordHistory(this.data.product)
    })
  },

  recordHistory(product) {
    if (!product || !product.id) {
      return
    }

    var historyItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      tag: product.tag || '',
      image: product.image,
      viewedAt: Date.now()
    }

    if (getApp().checkLogin()) {
      this.saveRemoteHistory(historyItem)
      return
    }

    this.saveLocalHistory(historyItem)
  },

  saveRemoteHistory(historyItem) {
    var token = wx.getStorageSync('token') || ''

    wx.request({
      url: API.history.create,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      data: historyItem,
      timeout: 10000,
      fail: function() {
        this.saveLocalHistory(historyItem)
      }.bind(this)
    })
  },

  saveLocalHistory(historyItem) {
    var history = wx.getStorageSync('history') || []
    var nextHistory = history.filter(function(item) {
      return String(item.id || item.productId) !== String(historyItem.id)
    })

    nextHistory.unshift(historyItem)

    wx.setStorageSync('history', nextHistory.slice(0, 30))
  },

  onQuantityChange(e) {
    var delta = e.currentTarget.dataset.delta
    var quantity = this.data.quantity + delta
    if (quantity < 1) quantity = 1
    if (this.data.product && this.data.product.stock && quantity > this.data.product.stock) {
      quantity = this.data.product.stock
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
    }
    this.setData({
      quantity: quantity
    })
  },

  onSpecSelect(e) {
    var specIndex = e.currentTarget.dataset.index
    var specs = this.data.product.specs
    this.setData({
      selectedSpecs: {
        index: specIndex,
        spec: specs[specIndex]
      }
    })
  },

  onAddToCart() {
    if (!getApp().requireLogin({
      content: '加入购物车需要登录后才能使用'
    })) {
      return
    }

    if (!this.data.selectedSpecs.spec) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }

    var cartItem = {
      productId: this.data.product.id,
      name: this.data.product.name,
      image: this.data.product.image,
      price: this.data.selectedSpecs.spec.price,
      spec: this.data.selectedSpecs.spec.name,
      quantity: this.data.quantity
    }

    var cart = wx.getStorageSync('cart') || []
    var existingIndex = cart.findIndex(function(item) {
      return item.productId === cartItem.productId && item.spec === cartItem.spec
    })

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += cartItem.quantity
    } else {
      cart.push(cartItem)
    }

    wx.setStorageSync('cart', cart)

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  onBuyNow() {
    if (!getApp().requireLogin({
      content: '立即购买需要登录后才能使用'
    })) {
      return
    }

    if (!this.data.selectedSpecs.spec) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }

    this.submitOrder()
  },

  submitOrder() {
    this.setData({ isSubmitting: true })

    var orderData = {
      productId: this.data.product.id,
      productName: this.data.product.name,
      productImage: this.data.product.image,
      spec: this.data.selectedSpecs.spec.name,
      price: this.data.selectedSpecs.spec.price,
      quantity: this.data.quantity,
      totalPrice: this.data.selectedSpecs.spec.price * this.data.quantity
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
          wx.showToast({
            title: '下单失败',
            icon: 'none'
          })
        }
      }.bind(this),
      fail: function() {
        this.handleOrderSuccess({
          orderId: 'ORD' + Date.now(),
          ...orderData
        })
      }.bind(this),
      complete: function() {
        this.setData({ isSubmitting: false })
      }.bind(this)
    })
  },

  handleOrderSuccess(order) {
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

  onShow() {
    this.loadFavoriteStatus()
    this.loadCartCount()
  },

  loadFavoriteStatus() {
    if (!getApp().checkLogin()) {
      this.setData({ isFavorite: false })
      return
    }

    var favorites = wx.getStorageSync('favorites') || []
    var isFavorite = favorites.some(function(item) {
      return item.id === parseInt(this.data.productId)
    }.bind(this))
    this.setData({ isFavorite: isFavorite })
  },

  loadCartCount() {
    if (!getApp().checkLogin()) {
      this.setData({ cartCount: 0 })
      return
    }

    var cart = wx.getStorageSync('cart') || []
    var count = cart.reduce(function(sum, item) {
      return sum + item.quantity
    }, 0)
    this.setData({ cartCount: count })
  },

  onToggleFavorite() {
    if (!getApp().requireLogin({
      content: '收藏商品需要登录后才能使用'
    })) {
      return
    }

    var product = this.data.product
    var favorites = wx.getStorageSync('favorites') || []
    var index = favorites.findIndex(function(item) {
      return item.id === product.id
    })

    if (index >= 0) {
      favorites.splice(index, 1)
      this.setData({ isFavorite: false })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favorites.push(product)
      this.setData({ isFavorite: true })
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    wx.setStorageSync('favorites', favorites)
  },

  onCartTap() {
    if (!getApp().requireLogin({
      content: '查看购物车需要登录后才能使用'
    })) {
      return
    }

    wx.navigateTo({
      url: '/pages/cart/list'
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.product ? this.data.product.name : '绣绣AI',
      path: '/pages/product/detail?id=' + this.data.productId
    }
  }
})
