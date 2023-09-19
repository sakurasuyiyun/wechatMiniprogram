const app = getApp()
Page({
    data: {
        accountList: [
            {id: 1, imgUrl: '../../assets/vip.png', title: 'Vip10',link: ''},
            {id: 2, imgUrl: '../../assets/red-bag.png', title: '红包',link: ''},
            {id: 3, imgUrl: '../../assets/wallet.png', title: '钱包',link: 'wallet'},
        ],
        userInfo: {}
    },

    onLoad(options) {
        const userInfo = wx.getStorage({
            key: 'token'
        }).then(res => {
            this.checkToken(res.data)
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
    },
    checkToken: async function (token) {
        const res = await app.api.post('/checkToken', {
            token
        })

        if(res?.errno === 0){
            this.data.userInfo.username = res.username
            this.setData({
                userInfo: this.data.userInfo
            })
            this.getUserInfo(res.username)
        }
    },
    getUserInfo: async function (username){
        const res = await app.api.post('/getUserInfo', {
            username
        })

        if(res?.errno === 0){
            this.data.userInfo.avatar = res.data.avatar
            this.setData({
                userInfo: this.data.userInfo
            })
        }
    },
    jump: function (e) {
        const url = e.currentTarget.dataset.link
        app.router.navigateTo(`/pages/${url}/${url}`)
    },
})