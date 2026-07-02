var API = require('../../utils/api.js')
var productCatalog = require('../../utils/product-catalog.js')

Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'car', name: '租车' },
      { id: 'boat', name: '游船' },
      { id: 'hotel', name: '酒店' },
      { id: 'scenic', name: '景区景点' },
      { id: 'equipment', name: '装备' }
    ],
    activeCategory: 'all',
    searchText: '',
    products: [],
    filteredProducts: [],
    isLoading: false,
    favorites: []
  },

  onLoad() {
    console.log('商城页面加载')
    this.loadProducts()
  },

  onShow() {
    console.log('商城页面显示')
    this.updateTabBar(1)
    this.loadFavorites()
  },

  updateTabBar(selected) {
    if (typeof this.getTabBar !== 'function') return

    var tabBar = this.getTabBar()
    if (tabBar && typeof tabBar.setData === 'function') {
      tabBar.setData({ selected: selected })
    }
  },

  loadProducts() {
    this.setData({ isLoading: true })
    
    wx.request({
      url: API.products.list,
      method: 'GET',
      data: {
        category: this.data.activeCategory === 'all' ? '' : this.data.activeCategory,
        keyword: this.data.searchText
      },
      timeout: 10000,
      success: function(res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          var products = res.data.data
          this.setData({
            products: this.addFavoriteStatus(products),
            filteredProducts: this.addFavoriteStatus(products)
          })
        } else {
          this.loadMockProducts()
        }
      }.bind(this),
      fail: function() {
        this.loadMockProducts()
      }.bind(this),
      complete: function() {
        this.setData({ isLoading: false })
      }.bind(this)
    })
  },

  loadMockProducts() {
    var mockProducts = productCatalog.cloneProducts(productCatalog.products)

    this.setData({
      products: this.addFavoriteStatus(mockProducts),
      filteredProducts: this.addFavoriteStatus(mockProducts)
    })
  },

  switchCategory(e) {
    var categoryId = e.currentTarget.dataset.id
    this.setData({
      activeCategory: categoryId
    })
    this.filterProducts()
  },

  onSearch(e) {
    var searchText = e.detail.value
    this.setData({
      searchText: searchText
    })
    this.filterProducts()
  },

  filterProducts() {
    var products = this.data.products
    var activeCategory = this.data.activeCategory
    var searchText = this.data.searchText
    
    if (activeCategory !== 'all') {
      products = products.filter(function(item) {
        return item.category === activeCategory
      })
    }

    if (searchText) {
      var text = searchText.toLowerCase()
      products = products.filter(function(item) {
        return item.name.toLowerCase().includes(text) || item.desc.toLowerCase().includes(text)
      })
    }

    this.setData({
      filteredProducts: products
    })
  },

  handleProductClick(e) {
    var product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: '/pages/product/detail?id=' + product.id
    })
  },

  loadFavorites() {
    if (!getApp().checkLogin()) {
      this.setData({ favorites: [] })
      return
    }

    var favorites = wx.getStorageSync('favorites') || []
    this.setData({ favorites: favorites })
  },

  addFavoriteStatus(products) {
    var favorites = this.data.favorites
    return products.map(function(item) {
      item.isFavorite = favorites.some(function(f) {
        return f.id === item.id
      })
      return item
    })
  },

  toggleFavorite(e) {
    if (!getApp().requireLogin({
      content: '收藏商品需要登录后才能使用'
    })) {
      return
    }

    var product = e.currentTarget.dataset.product
    var favorites = this.data.favorites
    var index = favorites.findIndex(function(item) {
      return item.id === product.id
    })

    if (index >= 0) {
      favorites.splice(index, 1)
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favorites.push(product)
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    wx.setStorageSync('favorites', favorites)
    this.setData({ 
      favorites: favorites,
      products: this.addFavoriteStatus(this.data.products),
      filteredProducts: this.addFavoriteStatus(this.data.filteredProducts)
    })
  }
})
