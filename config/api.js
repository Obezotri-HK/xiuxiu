let localConfig = null

try {
  localConfig = require('./api.local.js')
} catch (e) {
  localConfig = null
}

const config = Object.assign({
  WEATHER_API_KEY: 'your-weather-api-key',
  WEATHER_API_BASE_URL: 'https://devapi.qweather.com',
  MAP_API_KEY: 'your-map-api-key',
  MAP_API_BASE_URL: 'https://apis.map.qq.com'
}, localConfig || {})

module.exports = config
