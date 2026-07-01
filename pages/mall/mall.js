Page({
  data: {
    products: [
      {
        id: 1,
        name: '漓江精华段游船',
        desc: '桂林至阳朔，百里画廊风光',
        price: '198',
        sales: '5230',
        tag: '必游',
        image: 'https://picsum.photos/400/300?random=1'
      },
      {
        id: 2,
        name: '阳朔遇龙河竹筏',
        desc: '双人竹筏，体验水乡风情',
        price: '258',
        sales: '3890',
        tag: '网红',
        image: 'https://picsum.photos/400/300?random=2'
      },
      {
        id: 3,
        name: '象鼻山门票',
        desc: '桂林城徽地标，必游景点',
        price: '55',
        sales: '8760',
        tag: '必游',
        image: 'https://picsum.photos/400/300?random=3'
      },
      {
        id: 4,
        name: '阳朔西街特色民宿',
        desc: '临溪而居，静谧舒适',
        price: '299',
        sales: '2150',
        tag: '推荐',
        image: 'https://picsum.photos/400/300?random=4'
      },
      {
        id: 5,
        name: '正宗桂林米粉',
        desc: '卤菜粉+卤蛋+酸笋',
        price: '18',
        sales: '12450',
        tag: '美食',
        image: 'https://picsum.photos/400/300?random=5'
      },
      {
        id: 6,
        name: '龙脊梯田一日游',
        desc: '含往返车费+门票+导游',
        price: '168',
        sales: '4520',
        tag: '必游',
        image: 'https://picsum.photos/400/300?random=6'
      },
      {
        id: 7,
        name: '两江四湖夜游',
        desc: '乘船夜游桂林城，灯光璀璨',
        price: '185',
        sales: '3420',
        tag: '夜景',
        image: 'https://picsum.photos/400/300?random=7'
      },
      {
        id: 8,
        name: '阳朔啤酒鱼',
        desc: '正宗漓江鱼，外酥里嫩',
        price: '88',
        sales: '6780',
        tag: '美食',
        image: 'https://picsum.photos/400/300?random=8'
      }
    ]
  },

  onLoad() {
    console.log('商城页面加载')
  },

  onShow() {
    console.log('商城页面显示')
    this.updateTabBar(1)
  },

  updateTabBar(selected) {
    if (typeof this.getTabBar !== 'function') return

    const tabBar = this.getTabBar()
    if (tabBar && typeof tabBar.setData === 'function') {
      tabBar.setData({ selected })
    }
  }
})
