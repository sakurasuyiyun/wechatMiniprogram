// api.js

const BASE_URL = 'http://1.12.73.162/WechatMiniprogramApi'; // 你的接口基础URL

function request(url, method, data, header = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_URL + url,
            method: method,
            data: data,
            header: header,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}

module.exports = {
    get: async (url, data = {}, header = {}) => {
        try {
            const res = await request(url, 'GET', data, header);
            return res;
        } catch (error) {
            throw error;
        }
    },
    post: async (url, data = {}, header = {}) => {
        try {
            const res = await request(url, 'POST', data, header);
            return res;
        } catch (error) {
            throw error;
        }
    },
    // 可以根据需要添加更多的请求方法，如PUT、DELETE等
};
