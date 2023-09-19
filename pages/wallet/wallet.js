const app = getApp()
Page({

    data: {
        balance: 0,
        show: false,
        add: '',
        pwd: '',
        showMask: false
    },

    onLoad(options) {
        this.getUserInfo()
    },
    getUserInfo: async function () {
        const res = await app.api.get('/recharge', {
            token: app.token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                balance: res.data.balance
            })
        }
    },
    onClose: function () {
        this.setData({
            show: false
        })
    },
    showPop: function () {
        this.setData({
            show: true
        })
    },
    onChange: function (e) {
        console.log(e)
        const name = e.currentTarget.dataset.name
        const value = e.detail.value
        const reg = /^[0-9]*$/g
        this.data[name] = value
        if (reg.test(value)) {
            if (name === 'pwd' && value.length === 6 && this.data.add !== '') {
                this.setData({
                    showMask: true
                })
                this.reCharge()
            }
        } else {
            wx.showToast({
                title: '输入的类型不正确,请重新输入',
                mask: true,
                duration: 1000,
                icon: 'none'
            })
            this.data[name] = ''
            this.setData({
                add: this.data.add,
                pwd: this.data.pwd
            })
        }
    },
    reCharge: async function () {
        const res = await app.api.post('/reChargeMoney', {
            token: app.token,
            pwd: this.data.pwd,
            add: this.data.add
        })

        console.log(res)
        wx.showToast({
            title: res.msg,
            duration: 1000,
            mask: true,
            icon: 'none'
        })
        if (res?.errno === 0) {
            setTimeout(() => {
                this.setData({
                    showMask: false,
                    add: '',
                    pwd: '',
                    show: false
                })
            }, 500)
            this.getUserInfo()
        } else {
            setTimeout(() => {
                this.setData({
                    showMask: false,
                    add: '',
                    pwd: '',
                    show: false
                })
            }, 500)
        }
    }
})