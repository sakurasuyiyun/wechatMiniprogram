const app = getApp()
const options = [
    {
        text: '广东省',
        value: '440000',
        children: [
            {
                text: '广州市',
                value: '440100',
                children: [
                    {text: '越秀区', value: '440104'},
                    {text: '荔湾区', value: '440103'},
                    {text: '天河区', value: '440106'},
                    {text: '海珠区', value: '440105'},
                    {text: '白云区', value: '440111'},
                    {text: '黄埔区', value: '440112'},
                    {text: '番禺区', value: '440113'},
                    {text: '花都区', value: '440114'},
                    {text: '南沙区', value: '440115'},
                    {text: '增城区', value: '440118'},
                    {text: '从化区', value: '440117'},
                ],
            },
            {
                text: '深圳市',
                value: '440300',
                children: [
                    {text: '福田区', value: '440304'},
                    {text: '南山区', value: '440305'},
                    {text: '宝安区', value: '440306'},
                    // 添加更多区县数据
                ],
            },
            // 可以继续添加广东省内其他城市的数据
        ],
    },
    {
        text: '浙江省',
        value: '330000',
        children: [
            {
                text: '杭州市',
                value: '330100',
                children: [
                    {text: '西湖区', value: '330106'},
                    {text: '上城区', value: '330102'},
                    {text: '下城区', value: '330103'},
                    // 添加更多区县数据
                ],
            },
            // 可以继续添加杭州市之外的其他城市
        ],
    },
    {
        text: '江苏省',
        value: '320000',
        children: [
            {
                text: '南京市',
                value: '320100',
                children: [
                    {text: '玄武区', value: '320102'},
                    {text: '秦淮区', value: '320104'},
                    {text: '鼓楼区', value: '320106'},
                ],
            },
        ],
    },
];
import Dialog from '@vant/weapp/dialog/dialog';

Page({

    data: {
        addressId: 0,
        list: [],
        name: '',
        phone: '',
        fieldValue: '',
        addressDetail: '',
        activeIndex: -1,
        isDefault: false,
        tag: '',
        cascaderValue: '',
        options,
        token: ''
    },

    onLoad(options) {
        this.data.token = app.token
        this.data.addressId = options.addressId
        this.getData()
    },
    getData: async function () {
        const token = await app.token
        const res = await app.api.get('/getUserAddressDetail', {
            token,
            addressId: this.data.addressId
        });

        console.log(res)
        if (res?.errno === 0) {
            this.setData({
                name: res.data.name,
                phone: res.data.phone_number,
                addressDetail: res.data.detail,
                fieldValue: res.data.city,
                isDefault: res.data.isDefault === "1" ? true : false,
                tag: res.data.tag
            })
            this.formatData()
        }
    },
    formatData: function () {
        if (this.data.tag === '家') {
            this.setData({
                activeIndex: 0
            })
        } else if (this.data.tag === '公司') {
            this.setData({
                activeIndex: 1
            })
        } else if (this.data.tag === '学校') {
            this.setData({
                activeIndex: 2
            })
        } else {
            this.setData({
                activeIndex: -1
            })
        }
    },
    onClick() {
        this.setData({
            show: true,
        });
    },

    onClose() {
        this.setData({
            show: false,
        });
    },

    onFinish(e) {
        const {selectedOptions, value} = e.detail;
        const fieldValue = selectedOptions
            .map((option) => option.text || option.name)
            .join(' ');
        this.setData({
            fieldValue,
            cascaderValue: value,
            show: false,
        })
        console.log(fieldValue)
    },
    tagClick: function (e) {
        const {currentTarget} = e
        const {index, tag} = currentTarget.dataset
        if (this.data.activeIndex === Number(index)) {
            this.setData({
                activeIndex: -1,
                tag: ''
            })
            console.log(this.data.tag)
            return;
        }
        this.setData({
            activeIndex: Number(index),
            tag: tag
        })
        console.log(this.data.tag)
    },
    defaultChange({detail}) {
        this.setData({isDefault: detail});
        console.log(this.data.isDefault)
    },
    input: function (e) {
        const {detail, currentTarget} = e
        this.data[currentTarget.dataset.name] = detail
    },
    submit: async function () {
        const token = this.data.token
        const name = this.data.name
        const phone = this.data.phone
        const fieldValue = this.data.fieldValue
        const addressDetail = this.data.addressDetail
        const tag = this.data.tag
        const isDefault = this.data.isDefault
        const addressId = this.data.addressId

        const res = await app.api.get('/updateUserAddressDetail', {
            token,
            name,
            phone,
            fieldValue,
            addressDetail,
            tag,
            isDefault,
            addressId
        })

        console.log(res)
        wx.showToast({
            title: res.msg,
            mask: true,
            icon: 'none',
            duration: 1000
        })
        if (res?.errno === 0) {
            setTimeout(() => {
                app.router.navigateBack()
            }, 500)
        }
    },
    del: async function () {
        const {addressId, token} = this.data
        const res = await app.api.get('/deleteUserAddress', {
            addressId,
            token
        })

        console.log(res)
        wx.showToast({
            title: res.msg,
            mask: true,
            icon: 'none',
            duration: 1000
        })

        if (res?.errno === 0) {
            setTimeout(() => {
                app.router.navigateBack()
            }, 500)
        }
    },
    confirm: function () {
        Dialog.confirm({
            title: '警告',
            message: '是否确认删除',
        })
            .then(() => {
                // on confirm
                this.del()
            })
            .catch(() => {
                console.log('用户点击取消')
            });
    }
})