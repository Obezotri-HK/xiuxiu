const app = getApp()

Page({
  data: {
    activeTab: 'phone',
    phone: '',
    code: '',
    countdown: 0,
    agreed: false,
    remainingCount: 50,
    mockCode: ''
  },

  onLoad() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false

    if (isLoggedIn) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
      return
    }

    const remainingCount = wx.getStorageSync('remainingCount') || 50
    this.setData({
      remainingCount: remainingCount
    })
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab
    })
  },

  toggleAgreement() {
    this.setData({
      agreed: !this.data.agreed
    })
  },

  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },

  validatePhone(phone) {
    const phoneReg = /^1[3-9]\d{9}$/
    return phoneReg.test(phone)
  },

  sendCode() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      })
      return
    }

    const phone = this.data.phone
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!this.validatePhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (this.data.countdown > 0) {
      return
    }

    wx.showLoading({
      title: '发送中...',
      mask: true
    })

    setTimeout(() => {
      wx.hideLoading()
      
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
      this.setData({
        mockCode: mockCode
      })

      wx.showModal({
        title: '验证码',
        content: `您的验证码是：${mockCode}（模拟发送）`,
        showCancel: false,
        confirmText: '知道了'
      })

      this.startCountdown()
    }, 800)
  },

  startCountdown() {
    let countdown = 60
    this.setData({
      countdown: countdown
    })

    this.timer = setInterval(() => {
      countdown--
      if (countdown <= 0) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.setData({
        countdown: countdown
      })
    }, 1000)
  },

  phoneLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      })
      return
    }

    const phone = this.data.phone
    const code = this.data.code

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!this.validatePhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    if (code.length !== 6) {
      wx.showToast({
        title: '验证码格式错误',
        icon: 'none'
      })
      return
    }

    if (code !== this.data.mockCode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    wx.login({
      success: (loginRes) => {
        const wechatCode = loginRes.code || ''
        this.handleLoginSuccess(phone, wechatCode)
      },
      fail: () => {
        this.handleLoginSuccess(phone, '')
      }
    })
  },

  handleLoginSuccess(phone, wechatCode) {
    const mockUserInfo = {
      nickname: '用户' + phone.slice(-4),
      avatarUrl: '',
      phone: phone.slice(0, 3) + '****' + phone.slice(-4),
      isVip: true,
      vipExpire: '2026-12-31'
    }

    setTimeout(() => {
      wx.hideLoading()
      
      wx.setStorageSync('userInfo', mockUserInfo)
      wx.setStorageSync('token', 'mock_token_' + Date.now())
      wx.setStorageSync('isLoggedIn', true)
      wx.setStorageSync('remainingCount', 9999)

      app.globalData.userInfo = mockUserInfo
      app.globalData.isLoggedIn = true
      app.globalData.remainingCount = 9999

      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }

      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })

      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }, 1500)
    }, 1000)
  },

  onGetPhoneNumber(e) {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      })
      return
    }

    if (e.detail.errMsg === 'getPhoneNumber:ok' && e.detail.code) {
      wx.showLoading({
        title: '登录中...',
        mask: true
      })

      const phoneCode = e.detail.code
      
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            this.doWechatLogin(loginRes.code, phoneCode)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '登录失败，请重试',
              icon: 'none'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          })
        }
      })
    } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '已取消授权',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '授权失败，请重试',
        icon: 'none'
      })
    }
  },

  doWechatLogin(loginCode, phoneCode) {
    const mockUserInfo = {
      nickname: '微信用户',
      avatarUrl: '',
      phone: '138****8888',
      isVip: true,
      vipExpire: '2026-12-31'
    }

    setTimeout(() => {
      wx.hideLoading()
      
      wx.setStorageSync('userInfo', mockUserInfo)
      wx.setStorageSync('token', 'mock_token_' + Date.now())
      wx.setStorageSync('isLoggedIn', true)
      wx.setStorageSync('remainingCount', 9999)

      app.globalData.userInfo = mockUserInfo
      app.globalData.isLoggedIn = true
      app.globalData.remainingCount = 9999

      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })

      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }, 1500)
    }, 1000)
  },

  goToAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    })
  },

  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  },

  guestLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    wx.login({
      success: (res) => {
        const guestInfo = {
          nickname: '游客用户',
          avatarUrl: '',
          isGuest: true
        }

        setTimeout(() => {
          wx.hideLoading()
          
          wx.setStorageSync('userInfo', guestInfo)
          wx.setStorageSync('isGuest', true)
          wx.setStorageSync('remainingCount', 50)

          app.globalData.userInfo = guestInfo
          app.globalData.isGuest = true
          app.globalData.remainingCount = 50

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })

          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }, 1500)
        }, 800)
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    })
  }
})
