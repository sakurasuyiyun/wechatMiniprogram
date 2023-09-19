const app = getApp()

Page({

    data: {
        token: '',
        products: [],
        productsBackup: [],
        newData: {},
        shopName: {}
    },

    onLoad(options) {
        this.data.token = app.token
        this.getData()
    },
    getData: async function () {
        const token = this.data.token
        const res = await app.api.get('/getCart', {
            token
        })
        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                products: res.data,
                productsBackup: res.data
            })
            this.formatData()
        }
    },
    formatData: function () {
        this.data.newData = {}
        this.data.products.forEach((item,index) => {
            if(!this.data.newData.hasOwnProperty(item.shop_name)){
                this.data.shopName[item.shop_name] = item.shop_name;
                this.data.newData[item.shop_name] = [];
            }
        })
        this.data.products.forEach((element) => {
            for (let item in this.data.newData) {
                if (element.shop_name === item) {
                    this.data.newData[item] = [...this.data.newData[item], element];
                }
            }
        });
        console.log(this.data.newData,this.data.shopName)
    }
})