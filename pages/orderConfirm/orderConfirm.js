const app = getApp()
const storage = require("../../utils/store");
Page({

    data: {
        shopId: 0,
        token: '',
        data: [],
        totalPrice: 0,
        shopFreight: 0,
        isShow: false,
        actions: [
            {
                name: '微信支付',
            },
            {
                name: '余额',
            },
        ],
        payment: '微信支付',
        arriveTime: '',
        address: {},
        isEmpty: false,
        showMask: false,
        pwd: '',
        loading: false,
        addressId: 0
    },

    onLoad(options) {
        if (!options.addressId) {
            this.data.shopId = options.shopId
            this.data.token = app.token
            storage.setStorageData('shopId', options.shopId)
            this.getShop()
            this.getTime()
            this.getUserAddress()
        } else {
            this.data.token = app.token
            this.change()
        }
    },
    getData: async function () {
        const token = this.data.token
        const res = await app.api.get('/getShopCartProducts', {
            token,
            shopId: this.data.shopId
        })

        console.log(res)
        if (res?.errno === 0) {
            const a = res.data.filter(item => item.count !== 0)
            this.setData({
                data: a
            })
            this.computedPrice()
        }
    },
    computedPrice: function () {
        let price = this.data.data.reduce((num, item) => {
            return num + item.product_price * item.count
        }, 0)
        price += this.data.shopFreight
        this.setData({
            totalPrice: price
        })
    },
    getShop: async function () {
        console.log(this.data.shopId)
        const res = await app.api.get('/getShopInfo', {
            shopId: this.data.shopId
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                shopFreight: res.data.shop_freight
            })
            await this.getData()
        }
    },
    showChoose: function () {
        this.setData({
            isShow: true
        })
    },
    onClose: function () {
        this.setData({
            isShow: false
        })
    },
    onSelect(event) {
        const type = event.detail.name
        this.setData({
            payment: type
        })
    },
    getTime: function () {
        const date = new Date()
        let hour = date.getHours()
        let minute = date.getMinutes() + 30
        if (minute >= 60) {
            minute -= 60
            hour += 1
        }
        hour = hour < 10 ? `0${hour}` : hour >= 24 ? 0 : hour
        minute = minute < 10 ? `0${minute}` : minute
        this.setData({
            arriveTime: `${hour}:${minute}`
        })
    },
    getUserAddress: async function () {
        const token = this.data.token
        const res = await app.api.get('/getUserAddress', {
            token
        })

        console.log(res)
        if (res?.errno === 0) {
            res.data.forEach((item, index) => {
                if (item.isDefault == 1) {
                    this.setData({
                        address: res.data[index]
                    })
                    wx.setStorage({
                        key: 'addressId',
                        data: item._id
                    })
                }
            })
        } else {
            this.setData({
                isEmpty: true
            })
        }
    },
    onSubmit: async function (status) {
        const token = this.data.token
        const shopId = this.data.shopId
        const payment = this.data.payment
        const arriveTime = this.data.arriveTime
        const orderPrice = this.data.totalPrice
        const userAddress = this.data.address._id
        const isPay = status

        const res = await app.api.post('/orderSubmit', {
            token,
            shopId,
            payment,
            arriveTime,
            orderPrice,
            userAddress,
            isPay
        })

        console.log(res)
        wx.showToast({
            title: res.msg,
            icon: 'none',
            mask: true,
            duration: 1000
        })
        await storage.deleteStorageData('shopId')
        await storage.deleteStorageData('addressId')
        await storage.deleteStorageData('activeIndex')

        if (res?.errno === 0) {
            setTimeout(() => {
                app.router.switchTab('/pages/order/order')
            }, 500)
        } else {
            this.setData({
                loading: false
            })
        }
    },
    addAddress: function () {
        app.router.navigateTo('/pages/address/address')
    },
    maskClose: function () {
        this.setData({
            showMask: false,
            pwd: ''
        })
    },
    maskShow: function () {
        this.setData({
            showMask: true
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
        const token = this.data.token
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
                showMask: false,
                loading: true
            })
            await this.onSubmit(true)
        }
    },
    changeAddress: function () {
        app.router.navigateTo(`/pages/chooseAddress/chooseAddress?shopId=${this.data.shopId}`)
    },
    onShow: function (e) {
        console.log('页面展示了')
        this.getShop()
        this.getTime()
    },
    change: async function () {
        const token = app.token
        await storage.getStorageData('shopId').then(res => {
            this.data.shopId = res
            this.getData()
            this.getShop()
        })

        await storage.getStorageData('addressId').then(res => {
            this.data.addressId = res
        })

        const res = await app.api.get('/changeAddress', {
            token,
            addressId: this.data.addressId
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                address: res.data
            })
        }
    },
    onUnload() {
        console.log('页面隐藏了')
        this.onSubmit(false)
    },
})