const app = getApp()

const WEATHER_API_KEY = ''
const QQ_MAP_KEY = ''

Page({
  data: {
    isLoggedIn: false,
    userInfo: {},
    remainingCount: 50,
    location: '桂林市·象山区',
    weather: '多云',
    temperature: '28°',
    weatherIcon: '⛅',
    inputValue: '',
    locationLoading: false,
    latitude: null,
    longitude: null
  },

  onLoad() {
    this.loadUserStatus()
    this.getLocationAndWeather()
  },

  onShow() {
    this.loadUserStatus()
  },

  getLocationAndWeather() {
    this.setData({ locationLoading: true })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
        this.reverseGeocoder(latitude, longitude)
        this.getWeather(latitude, longitude)
      },
      fail: (err) => {
        console.error('获取位置失败', err)
        this.setData({ locationLoading: false })
        wx.showToast({
          title: '定位失败，显示默认位置',
          icon: 'none'
        })
      }
    })
  },

  reverseGeocoder(latitude, longitude) {
    if (!QQ_MAP_KEY) {
      console.log('未配置腾讯地图Key，使用默认位置')
      return
    }

    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: QQ_MAP_KEY,
        get_poi: 0
      },
      success: (res) => {
        if (res.data.status === 0) {
          const result = res.data.result
          const city = result.address_component.city || ''
          const district = result.address_component.district || ''
          const locationStr = city && district ? `${city}·${district}` : (city || '桂林市·象山区')
          this.setData({
            location: locationStr
          })
        }
      },
      fail: (err) => {
        console.error('逆地理编码失败', err)
      }
    })
  },

  getWeather(latitude, longitude) {
    if (!WEATHER_API_KEY) {
      console.log('未配置天气API Key，使用模拟天气')
      this.mockWeather()
      this.setData({ locationLoading: false })
      return
    }

    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now',
      data: {
        location: `${longitude},${latitude}`,
        key: WEATHER_API_KEY
      },
      success: (res) => {
        if (res.data.code === '200') {
          const now = res.data.now
          const weatherMap = {
            '晴': '☀️',
            '多云': '⛅',
            '阴': '☁️',
            '小雨': '🌧️',
            '中雨': '🌧️',
            '大雨': '⛈️',
            '雷阵雨': '⛈️',
            '小雪': '🌨️',
            '中雪': '🌨️',
            '大雪': '❄️',
            '雾': '🌫️'
          }
          this.setData({
            weather: now.text,
            temperature: `${now.temp}°`,
            weatherIcon: weatherMap[now.text] || '🌤️'
          })
        }
        this.setData({ locationLoading: false })
      },
      fail: (err) => {
        console.error('获取天气失败', err)
        this.mockWeather()
        this.setData({ locationLoading: false })
      }
    })
  },

  mockWeather() {
    const weathers = [
      { text: '晴', icon: '☀️' },
      { text: '多云', icon: '⛅' },
      { text: '阴', icon: '☁️' },
      { text: '小雨', icon: '🌧️' }
    ]
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]
    const temp = 22 + Math.floor(Math.random() * 10)
    this.setData({
      weather: randomWeather.text,
      temperature: `${temp}°`,
      weatherIcon: randomWeather.icon
    })
  },

  refreshLocation() {
    this.getLocationAndWeather()
  },

  loadUserStatus() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false
    const userInfo = wx.getStorageSync('userInfo') || {}
    const remainingCount = wx.getStorageSync('remainingCount') || 50
    
    this.setData({
      isLoggedIn: isLoggedIn,
      userInfo: userInfo,
      remainingCount: remainingCount
    })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  onUserTap() {
    if (this.data.isLoggedIn) {
      wx.showActionSheet({
        itemList: ['退出登录'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.logout()
          }
        }
      })
    } else {
      this.goToLogin()
    }
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  },

  newChat() {
    wx.showToast({
      title: '新对话',
      icon: 'none'
    })
  },

  makeCard() {
    wx.showToast({
      title: '制作收集卡',
      icon: 'none'
    })
  },

  aiPlan() {
    wx.showToast({
      title: 'AI规划',
      icon: 'none'
    })
  },

  openMenu() {
    wx.showToast({
      title: '菜单',
      icon: 'none'
    })
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) {
      return
    }

    if (this.data.isLoggedIn) {
      this.setData({
        inputValue: ''
      })
      wx.showToast({
        title: '消息已发送',
        icon: 'none'
      })
      return
    }

    const remaining = this.data.remainingCount - 1
    if (remaining >= 0) {
      this.setData({
        remainingCount: remaining,
        inputValue: ''
      })
      wx.setStorageSync('remainingCount', remaining)
      app.globalData.remainingCount = remaining
      wx.showToast({
        title: '消息已发送',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '对话次数已用完，请登录后继续使用',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin()
          }
        }
      })
    }
  }
})
