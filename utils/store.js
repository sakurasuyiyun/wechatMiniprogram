// storage.js

// 读取本地存储数据
function getStorageData(key) {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: key,
            success: function (res) {
                if (res.data !== undefined) {
                    resolve(res.data);
                } else {
                    resolve(null); // 当键不存在时返回null
                }
            },
            fail: function (error) {
                reject(error);
            },
        });
    });
}

// 修改或新增本地存储数据
function setStorageData(key, data) {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key: key,
            data: data,
            success: function () {
                resolve();
            },
            fail: function (error) {
                reject(error);
            },
        });
    });
}

// 删除本地存储数据
function deleteStorageData(key) {
    return new Promise((resolve, reject) => {
        wx.removeStorage({
            key: key,
            success: function () {
                resolve();
            },
            fail: function (error) {
                reject(error);
            },
        });
    });
}

module.exports = {
    getStorageData: getStorageData,
    setStorageData: setStorageData,
    deleteStorageData: deleteStorageData,
};
