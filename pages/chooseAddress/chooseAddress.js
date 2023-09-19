const storage = require("../../utils/store");
const app = getApp()
Page({

    data: {
        shopId: 0,
        addressId: 0,
        list: [],
        active: 0
    },

    onLoad(options) {
        storage.getStorageData('shopId').then(res => {
            this.data.shopId = res
        })
        storage.getStorageData('addressId').then(res => {
            this.data.addressId = res
        })
        storage.getStorageData('activeIndex').then(res => {
            this.setData({
                active: res
            })
        })
        this.getData()
    },
    getData: async function () {
        const res = await app.api.get('/getUserAddress', {
            token: app.token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                list: res.data
            })
        }
    },
    choose: function (e) {
        const addressId = e.currentTarget.dataset.addressid
        const index = e.currentTarget.dataset.index
        this.setData({
            active: index
        })
        storage.setStorageData('addressId', addressId)
        storage.setStorageData('activeIndex', index)
        app.router.navigateTo(`/pages/orderConfirm/orderConfirm?shopId=${this.data.shopId}&addressId=${this.data.addressId}`)
    },
    onShow: function () {

    }
})