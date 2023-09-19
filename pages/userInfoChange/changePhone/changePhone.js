const app = getApp()
Page({

    data: {
        token: '',
        username: ''
    },
    onLoad: function () {
        this.data.token = app.token
        this.getData()
    },
    getData: async function () {
        const res = await app.api.get('/userInfo', {
            token: this.data.token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                username: res.data.username
            })
        }
    }
})