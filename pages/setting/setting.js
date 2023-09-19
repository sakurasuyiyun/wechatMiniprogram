const app = getApp()
Page({

    data: {},

    onLoad(options) {

    },
    logout: function () {
        wx.clearStorage()
        setTimeout(() => {
            wx.showToast({
                title: '您已成功退出',
                icon: 'none',
                duration: 1000,
                mask: true
            })
        }, 1000)
        wx.reLaunch({
            url: '/pages/home/home',
        })
    },
    jump: function (e){
        const link = e.currentTarget.dataset.link
        app.router.navigateTo(`/pages/userInfoChange/${link}/${link}`)
    }
})