const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        productsBackup: [],
        newData: {},
        shopName: {},
        show: false,
        pwd: '',
        order: '',
        type: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getOrders()
    },
    getOrders: async function () {
        const token = await app.token
        const res = await app.api.get('/geiOrders', {
            token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                products: res.data
            })
            this.formatData()
            wx.stopPullDownRefresh()
        }
    },
    formatData: function () {
        this.data.newData = {}
        this.data.products.forEach((item, index) => {
            if (!this.data.newData.hasOwnProperty(item.order_id)) {
                this.data.shopName[item.shop_name] = item.shop_name;
                this.data.newData[item.order_id] = [];
            }
        })

        this.data.products.forEach((element) => {
            for (let item in this.data.newData) {
                if (element.order_id === item) {
                    this.data.newData[item] = [...this.data.newData[item], element];
                }
            }
        });

        this.setData({
            newData: this.data.newData
        })
        console.log((this.data.newData))
    },
    onShow: function () {
        this.getOrders()
    },
    changeOrderStatus: async function (e) {
        const type = e.currentTarget.dataset.type
        const orderId = e.currentTarget.dataset.order

        const res = await app.api.post('/changeOrderStatus', {
            orderId,
            type,
            token: app.token
        })

        console.log(res)
        if (res?.errno === 0) {
            wx.showToast({
                title: res.msg,
                icon: 'none',
                mask: true,
                duration: 1000
            })
            this.getOrders()
        }
    },
    pay: async function () {
        const type = this.data.type
        const orderId = this.data.order
        const res = await app.api.post('/changeOrderStatus', {
            orderId,
            type,
            token: app.token
        })

        console.log(res)
        if (res?.errno === 0) {
            wx.showToast({
                title: res.msg,
                icon: 'none',
                mask: true,
                duration: 1000
            })
            this.getOrders()
        }
    },
    showMask: function (e) {
        const order = e.currentTarget.dataset.order
        const type = e.currentTarget.dataset.type
        this.setData({
            show: true,
            order: order,
            type: type
        })
    },
    pwdChange: function (e) {
        const value = e.detail.value
        this.setData({
            pwd: value
        })
        if (value.length === 6) {
            this.checkPwd()
            this.setData({
                pwd: ''
            })
        }
    },
    checkPwd: async function () {
        const token = app.token
        const pwd = this.data.pwd

        const res = await app.api.post('/checkPayPwd', {
            token,
            pwd
        })

        console.log(res)
        wx.showToast({
            title: res.msg,
            mask: true,
            duration: 1000,
            icon: 'none'
        })
        if (res?.errno === 0) {
            this.setData({
                show: false,
            })
            await this.pay()
        }
    },
    onPullDownRefresh: function () {
        // 下拉刷新时需要执行的操作
        // 通常是发送请求获取最新数据
        // 然后在请求成功后，调用wx.stopPullDownRefresh()停止刷新动画
        this.getOrders()

    },
})