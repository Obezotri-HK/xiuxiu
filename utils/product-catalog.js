var PRODUCTS = [
  {
    id: 1,
    name: '漓江精华段游船',
    desc: '桂林至阳朔，百里画廊风光',
    price: '198',
    sales: '',
    tag: '必游',
    category: 'boat',
    image: 'https://picsum.photos/seed/guilin-boat1/400/300',
    stock: 100,
    keywords: ['漓江', '游船', '桂林游船', '山水', '船票', '阳朔']
  },
  {
    id: 2,
    name: '阳朔遇龙河竹筏',
    desc: '双人竹筏，体验水乡风情',
    price: '258',
    sales: '',
    tag: '网红',
    category: 'boat',
    image: 'https://picsum.photos/seed/guilin-boat2/400/300',
    stock: 50,
    keywords: ['遇龙河', '竹筏', '漂流', '阳朔', '双人筏']
  },
  {
    id: 3,
    name: '象鼻山门票',
    desc: '桂林城徽地标，必游景点',
    price: '55',
    sales: '',
    tag: '必游',
    category: 'scenic',
    image: 'https://picsum.photos/seed/guilin-scenic1/400/300',
    stock: 200,
    keywords: ['象鼻山', '象山公园', '象山', '象山景区', '门票', '景点']
  },
  {
    id: 4,
    name: '阳朔西街特色民宿',
    desc: '临溪而居，静谧舒适',
    price: '299',
    sales: '',
    tag: '推荐',
    category: 'hotel',
    image: 'https://picsum.photos/seed/guilin-hotel1/400/300',
    stock: 30,
    keywords: ['阳朔', '西街', '民宿', '住宿', '酒店']
  },
  {
    id: 5,
    name: '桂林自驾租车',
    desc: '舒适SUV，自由畅游桂林',
    price: '288',
    sales: '',
    tag: '热门',
    category: 'car',
    image: 'https://picsum.photos/seed/guilin-car1/400/300',
    stock: 20,
    keywords: ['租车', '自驾', 'SUV', '包车', '交通']
  },
  {
    id: 6,
    name: '龙脊梯田一日游',
    desc: '含往返车费+门票+导游',
    price: '168',
    sales: '',
    tag: '必游',
    category: 'scenic',
    image: 'https://picsum.photos/seed/guilin-scenic2/400/300',
    stock: 80,
    keywords: ['龙脊梯田', '梯田', '一日游', '门票', '导游']
  },
  {
    id: 7,
    name: '两江四湖夜游',
    desc: '乘船夜游桂林城，灯光璀璨',
    price: '185',
    sales: '',
    tag: '夜景',
    category: 'boat',
    image: 'https://picsum.photos/seed/guilin-night1/400/300',
    stock: 60,
    keywords: ['两江四湖', '夜游', '夜景', '桂林夜景', '游船']
  },
  {
    id: 8,
    name: '户外登山装备',
    desc: '专业户外装备套装',
    price: '399',
    sales: '',
    tag: '装备',
    category: 'equipment',
    image: 'https://picsum.photos/seed/guilin-equip1/400/300',
    stock: 150,
    keywords: ['登山', '装备', '徒步', '户外', '旅行装备']
  },
  {
    id: 9,
    name: '桂林市中心酒店',
    desc: '星级酒店，交通便利',
    price: '458',
    sales: '',
    tag: '推荐',
    category: 'hotel',
    image: 'https://picsum.photos/seed/guilin-hotel2/400/300',
    stock: 40,
    keywords: ['酒店', '住宿', '桂林市中心', '住哪', '便利']
  },
  {
    id: 10,
    name: '十里画廊观光车',
    desc: '阳朔十里画廊景区游览',
    price: '68',
    sales: '',
    tag: '必游',
    category: 'car',
    image: 'https://picsum.photos/seed/guilin-car2/400/300',
    stock: 100,
    keywords: ['十里画廊', '观光车', '阳朔', '景区游览']
  },
  {
    id: 11,
    name: '银子岩溶洞门票',
    desc: '世界溶洞奇观，钟乳石美景',
    price: '80',
    sales: '',
    tag: '必游',
    category: 'scenic',
    image: 'https://picsum.photos/seed/guilin-scenic3/400/300',
    stock: 180,
    keywords: ['银子岩', '溶洞', '门票', '钟乳石', '景点']
  },
  {
    id: 12,
    name: '旅游摄影套装',
    desc: '专业摄影装备，记录美好瞬间',
    price: '599',
    sales: '',
    tag: '装备',
    category: 'equipment',
    image: 'https://picsum.photos/seed/guilin-equip2/400/300',
    stock: 70,
    keywords: ['摄影', '相机', '旅行拍照', '装备', '拍照']
  }
]

var CATEGORY_KEYWORDS = {
  scenic: ['景点', '景区', '门票', '去哪玩', '去玩', '游玩', '打卡', '公园'],
  hotel: ['酒店', '民宿', '住宿', '住哪', '住哪里'],
  boat: ['游船', '竹筏', '漂流', '夜游', '坐船'],
  car: ['租车', '自驾', '观光车', '交通', '包车'],
  equipment: ['装备', '登山', '徒步', '摄影', '拍照']
}

function normalizeText(text) {
  return (text || '').toLowerCase().replace(/\s+/g, '')
}

function cloneProducts(products) {
  return (products || []).map(function(item) {
    return Object.assign({}, item)
  })
}

function getCategoryBoost(query, product) {
  var score = 0
  var categoryWords = CATEGORY_KEYWORDS[product.category] || []

  categoryWords.forEach(function(keyword) {
    if (query.indexOf(keyword) > -1) {
      score += 2
    }
  })

  return score
}

function getRelatedProducts(query, limit) {
  var normalizedQuery = normalizeText(query)

  if (!normalizedQuery) {
    return []
  }

  var result = PRODUCTS.map(function(product) {
    var searchableTexts = [
      product.name,
      product.desc,
      product.tag,
      product.category
    ].concat(product.keywords || [])

    var score = getCategoryBoost(normalizedQuery, product)

    searchableTexts.forEach(function(text) {
      var normalizedText = normalizeText(text)

      if (!normalizedText) {
        return
      }

      if (normalizedQuery.indexOf(normalizedText) > -1 || normalizedText.indexOf(normalizedQuery) > -1) {
        score += 8
        return
      }

      if (normalizedText.length >= 2 && normalizedQuery.indexOf(normalizedText) > -1) {
        score += 4
      }
    })

    return {
      product: Object.assign({}, product),
      score: score
    }
  }).filter(function(item) {
    return item.score > 0
  }).sort(function(a, b) {
    return b.score - a.score
  }).slice(0, limit || 3).map(function(item) {
    return item.product
  })

  return result
}

module.exports = {
  products: cloneProducts(PRODUCTS),
  cloneProducts: cloneProducts,
  getRelatedProducts: getRelatedProducts
}
