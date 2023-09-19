const app = getApp()
Page({

    data: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        token: ''
    },

    onLoad(options) {
        this.data.token = app.token
    },
    submit: async function () {
        console.log(this.data.oldPwd, this.data.newPwd, this.data.confirmPwd)
        const res = await app.api.post('/changePwd', {
            token: this.data.token,
            oldPwd: this.data.oldPwd,
            newPwd: this.data.newPwd,
        })

        console.log(res)
        if (res?.errno === 0) {
            wx.showToast({
                title: '修改密码成功',
                icon: 'none',
                duration: 2000,
                mask: true
            })
            setTimeout(() => {
                wx.clearStorage()
                app.router.reLaunch('/pages/home/home')
            }, 500)
        }
    },
    input: function (e) {
        const name = e.currentTarget.dataset.name
        const value = e.detail
        this.data[name] = value
    }
})