const app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({
    data: {
        list: [
            {id: 1, imgurl: '../../assets/签到.png', title: '签到'},
            {id: 2, imgurl: '../../assets/医药健康.png', title: '医药健康'},
            {id: 3, imgurl: '../../assets/大牌免运.png', title: '大牌免运'},
            {id: 4, imgurl: '../../assets/家居.png', title: '家居'},
            {id: 5, imgurl: '../../assets/水果店.png', title: '水果店'},
            {id: 6, imgurl: '../../assets/红包.png', title: '红包'},
            {id: 7, imgurl: '../../assets/菜市场.png', title: '菜市场'},
            {id: 8, imgurl: '../../assets/蛋糕.png', title: '蛋糕'},
            {id: 9, imgurl: '../../assets/超市.png', title: '超市'},
            {id: 10, imgurl: '../../assets/鲜花.png', title: '鲜花'},
        ],
        shopList: [],
    },
    onLoad: function (options) {
        // this.getLocation()
        // this.test()
        this.getShopList()
    },
    getLocation: function () {
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                console.log(res)
            }
        })
    },
    getShopList: async function () {
        const res = await app.api.get('/getShop')
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                shopList: res.data
            })
        } else {
            Toast('获取数据失败，请检查网络后重试');
        }
    },
    jump(e) {
        const shop_id = e.currentTarget.dataset.shopid
        const shop_name = e.currentTarget.dataset.shopname
        app.router.navigateTo(`/pages/shop/shop?shop_id=${shop_id}&shop_name=${shop_name}`)
    }
})