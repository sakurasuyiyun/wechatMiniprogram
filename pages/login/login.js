const app = getApp()
Page({
    data: {
        username: '',
        password: '',
        isAllow: false,
        userInfo: {},
        loadingText: '登陆中...',
        isLoading: false
    },
    changeAllow: function () {
        this.setData({
            isAllow: !this.data.isAllow
        })
    },
    wxLogin: function () {
        if (!this.data.isAllow) {
            wx.showToast({
                title: '请先勾选用户协议',
                icon: "none",
                duration: 1000,
                mask: true
            })
            return;
        }
        this.showLoginConfirm()
    },
    // 获取用户登陆信息
    showLoginConfirm: async function () {
        this.setData({
            isLoading: true
        })
        await wx.getUserProfile({
            desc: '获取您的微信个人信息'
        }).then(res => {
            console.log(res)
            app.globalData.userInfo = res.userInfo
            this.setData({
                userInfo: res.userInfo
            })
            this.wechatLogin(this.data.userInfo.nickName)
        }).catch(err => {
            console.log(err)
            wx.showToast({
                title: '您拒绝了获取用户信息',
                icon: "none",
                duration: 1500,
                mask: true
            })
            this.setData({
                isLoading: false
            })
        })
    },
    login: async function () {
        if (!this.data.isAllow) return;
        const _this = this
        this.setData({
            isLoading: true,
        })
        const username = this.data.username
        const password = this.data.password
        const res = await app.api.post('/login', {
            username: username,
            password: password,
            wx: false
        })

        console.log(res)
        if (res?.errno === 1 && res?.msg !== "账号或密码错误，请重试") {
            this.setData({
                loadingText: '正在注册...'
            })
            this.register(username, password)
        } else {
            app.token = res.token
            wx.setStorage({
                key: "token",
                data: res.token
            })
            this.setData({
                loadingText: res?.msg
            })
            setTimeout(() => {
                _this.setData({
                    isLoading: false,
                    loadingText: '登陆中...'
                })
                app.router.switchTab('/pages/home/home')
            }, 1000)
        }
    },
    wechatLogin: async function (username) {
        const _this = this
        const res = await app.api.post('/login', {
            username: username,
            wx: true
        })
        console.log(res)
        if (res?.errno === 1) {
            this.setData({
                loadingText: '正在注册...'
            })
            this.wechatRegister(username)
        } else {
            this.setData({
                loadingText: res.msg
            })
            app.token = res.token
            wx.setStorage({
                key: "token",
                data: res.token
            })
            setTimeout(() => {
                _this.setData({
                    isLoading: false,
                    loadingText: '登陆中...'
                })
                app.router.switchTab('/pages/home/home')
            }, 1000)
        }
    },
    wechatRegister: async function (username) {
        const _this = this
        const res = await app.api.post('/register', {
            username: username,
            wx: true
        })
        console.log(res)
        this.setData({
            loadingText: res.msg
        })
        setTimeout(() => {
            _this.setData({
                isLoading: false
            })
        }, 1000)
    },
    register: async function (username, password) {
        const _this = this
        const res = await app.api.post('/register', {
            username,
            password
        })

        console.log(res)
        if (res?.errno === 1) {
            this.setData({
                loadingText: res.msg
            })
            setTimeout(() => {
                _this.setData({
                    isLoading: false,
                    loadingText: '登陆中...'
                })
            }, 1000)
        } else {
            this.setData({
                loadingText: res.msg
            })
            setTimeout(() => {
                _this.setData({
                    isLoading: false,
                    loadingText: '登陆中...'
                })
            }, 1000)
        }
    },
    showToast: function () {

    }
})