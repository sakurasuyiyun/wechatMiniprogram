const app = getApp()
Page({

    data: {
        shopName: '',
        shopInfo: {},
        activeKey: 0,
        sideBarList: [],
        products: [],
        productsBackup: [],
        productCount: 0,
        token: '',
        shopId: 0,
        totalProduct: 0,
        totalPrice: 0,
        totalCount: 0
    },
    onLoad(options) {
        const userInfo = wx.getStorage({
            key: 'token'
        }).then(res => {
            const shop_id = options.shop_id
            this.data.shopId = shop_id
            this.data.token = res.data
            this.getShopInfo(shop_id)
        }).catch(err => {
            wx.showToast({
                title: '检测到您还没有登陆',
                icon: "none",
                duration: 1000,
                mask: true
            })
            setTimeout(() => {
                app.router.reLaunch('/pages/login/login')
            }, 500)
        })
        wx.setNavigationBarTitle({
            title: '麦肯牢',
        });
    },
    getShopInfo: async function (shop_id) {
        const res = await app.api.get('/getShopInfo', {
            shopId: shop_id
        })
        if (res?.errno === 0) {
            this.setData({
                shopInfo: res.data
            })
            this.getShopProduct(shop_id)
        }
    },
    getShopProduct: async function (shop_id) {
        const res = await app.api.get('/getProducts', {
            shopId: shop_id
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                products: res.data,
                productsBackup: res.data
            })
            this.getShopCategory(shop_id)
        }
    },
    getShopCategory: async function (shop_id) {
        const res = await app.api.get('/getShopCategory', {
            shopId: shop_id
        })
        if (res?.errno === 0) {
            this.setData({
                sideBarList: res.data
            })
            this.getShopCart()
        }
    },
    onChange: function (e) {
        const category = e.currentTarget.dataset.category
        const a = []
        this.data.productsBackup.forEach(item => {
            if (item.product_category === category) {
                a.push(item)
            }
        })
        this.data.products = [...a]
        this.setData({
            products: this.data.products
        })
    },
    changeCount: async function (e) {
        const add = e.currentTarget.dataset.add
        const productId = e.currentTarget.dataset.product_id
        const token = this.data.token
        const shopId = this.data.shopId
        console.log(add, productId)
        const res = await app.api.post('/addCart', {
            add,
            productId,
            token,
            shopId
        })

        wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 1000,
            mask: true
        })

        this.getShopInfo(this.data.shopId)
    },
    getShopCart: async function () {
        const token = this.data.token
        const res = await app.api.get('/getShopCart', {
            token
        })
        console.log('test',res)
        if (res?.errno === 0) {
            res.data.forEach(item => {
                this.data.products.forEach((productItem, index) => {
                    console.log(item,productItem)
                    if (item.product_id === productItem._id) {
                        this.data.products[index].count = item.count
                    }
                })
            })

            this.setData({
                products: this.data.products
            })

            console.log(this.data.products)
            this.computedCount()
        }
    },
    computedCount: function () {
        const total = this.data.products.reduce((num, item) => {
            return num + (item?.count || 0);
        }, 0);
        this.setData({
            totalProduct: total
        })
        this.computedPrice()

    },
    computedPrice: function () {
        const total = this.data.products.reduce((num, item) => {
            // console.log(num,item.count,item.product_price)
            return num + ((item?.count || 0) * item.product_price);
        }, 0);
        this.setData({
            totalPrice: total
        })
    },
    orderNow: function (){
        app.router.navigateTo(`/pages/orderConfirm/orderConfirm?shopId=${this.data.shopId}`)
    },
})