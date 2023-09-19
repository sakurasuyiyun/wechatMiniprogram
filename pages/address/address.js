const app = getApp()
Page({

    data: {
        list: []
    },

    onLoad(options) {
        this.getData()
    },
    jump: function (e) {
        const url = e.currentTarget.dataset.link
        app.router.navigateTo(`/pages/${url}/${url}`)
    },
    getData: async function () {
        const token = app.token
        const res = await app.api.get('/getUserAddress', {
            token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                list: res.data
            })
            this.formatData()
        }
    },
    formatData: function () {
        this.data.list.forEach((item,index) => {
            if(item.isDefault === '1'){
                const del = this.data.list.splice(index,1)
                this.data.list.unshift(del[0])
            }
        })
        console.log(this.data.list)
        this.setData({
            list: this.data.list
        })
    },
    editAddress: function (e){
        const address_id = e.currentTarget.dataset.address_id
        app.router.navigateTo(`/pages/editAddress/editAddress?addressId=${address_id}`)
    },
    onShow: function () {
        this.getData()
    }
})