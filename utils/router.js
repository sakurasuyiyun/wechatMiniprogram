// router.js

module.exports = {
    // 页面跳转方法
    navigateTo: function (url) {
        return new Promise((resolve, reject) => {
            wx.navigateTo({
                url: url,
                success: resolve,
                fail: reject,
            });
        });
    },

    redirectTo: function (url) {
        return new Promise((resolve, reject) => {
            wx.redirectTo({
                url: url,
                success: resolve,
                fail: reject,
            });
        });
    },

    switchTab: function (url) {
        return new Promise((resolve, reject) => {
            wx.switchTab({
                url: url,
                success: resolve,
                fail: reject,
            });
        });
    },

    reLaunch: function (url) {
        return new Promise((resolve, reject) => {
            wx.reLaunch({
                url: url,
                success: resolve,
                fail: reject,
            });
        });
    },

    navigateBack: function (delta = 1) {
        return new Promise((resolve, reject) => {
            wx.navigateBack({
                delta: delta,
                success: resolve,
                fail: reject,
            });
        });
    },
};
