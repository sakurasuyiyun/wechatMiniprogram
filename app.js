const api = require('./utils/request');
const router = require('./utils/router')
const storage = require('./utils/store.js');

// app.js
App({
    onLaunch() {
        storage.getStorageData('token')
            .then((data) => {
                if (data) {
                    this.token = data
                } else {
                    console.log('本地存储中没有该数据');
                }
            })
            .catch((error) => {
                console.error('读取本地存储数据失败', error);
            });
    },
    globalData: {},
    api: api,
    router: router,
    token: ''
})
