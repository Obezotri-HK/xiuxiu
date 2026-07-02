var BASE_URL = 'https://your-api-domain.com'

var API = {
  products: {
    list: BASE_URL + '/api/products',
    detail: BASE_URL + '/api/products/'
  },
  orders: {
    list: BASE_URL + '/api/orders',
    create: BASE_URL + '/api/orders',
    detail: BASE_URL + '/api/orders/'
  },
  favorites: {
    list: BASE_URL + '/api/favorites',
    toggle: BASE_URL + '/api/favorites'
  },
  history: {
    list: BASE_URL + '/api/history',
    create: BASE_URL + '/api/history',
    clear: BASE_URL + '/api/history'
  },
  cart: {
    list: BASE_URL + '/api/cart',
    add: BASE_URL + '/api/cart',
    update: BASE_URL + '/api/cart/',
    delete: BASE_URL + '/api/cart/'
  },
  user: {
    info: BASE_URL + '/api/user/info',
    login: BASE_URL + '/api/user/login',
    logout: BASE_URL + '/api/user/logout',
    register: BASE_URL + '/api/user/register'
  },
  location: {
    weather: 'https://devapi.qweather.com/v7/weather/now',
    geocoder: 'https://apis.map.qq.com/ws/geocoder/v1'
  }
}

module.exports = API
