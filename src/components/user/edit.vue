<template>
    <div>
        <other-header :title="title"></other-header>
        <div class="form">
            <input type="text" placeholder="请输入用户名" v-model.trim="name" class="input">
            <input type="text" placeholder="介绍" v-model.trim="describe" class="input">
            <div class="avatar-box">
                <span class="text">选择头像</span>
                <input type="file" class="file" @change="setAvatar">
            </div>
            <input type="email" v-model.trim="email" placeholder="请输入邮箱" class="input">
            <span class="save-btn" @click="checked">保存</span>
        </div>
        <tip :tipText="tipText" ref="tip"></tip>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {editUserInfo} from '../../api/user'
    import {ERR_OK, trim} from '../../common/js/util'
    import OtherHeader from '../header/otherHeader'
    import Tip from '../../base/tip.vue'

    export default {
        name: 'edit',
        data() {
            return {
                title: '修改资料',
                name: '',
                describe: '',
                files: null,
                email: '',
                tipText: ''
            }
        },
        methods: {
            initUserInfo() {
                let user = this.user

                this.name = user.originName || user.name
                this.describe = user.describe
                this.email = user.email
            },
            checkEmail(email) {
                let pattern = /^[\w\d_-]+@[\w\d]{2,4}(.[\w\d]{2,4})+$/
                return pattern.test(email)
            },
            checked() {
                if (this.name.length < 1 || this.name.length > 10) {
                    return this.showTip('名字请限制在 1-10 个字符')
                }

                if (this.email && !this.checkEmail(this.email)) {
                    return this.showTip('邮箱格式不正确')
                }

                this._editUserInfo()
            },
            setAvatar(e) {
                this.files = e.target.files
            },
            showTip(text) {
                this.tipText = text
                this.tip.show()
            },
            _editUserInfo() {
                let formData = new FormData()
                formData.append('name', this.name)
                this.describe && formData.append('describe', this.describe)
                this.email && formData.append('email', this.email)
                this.files && formData.append('avatar', this.files[0])
                editUserInfo(formData)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.setUserInfo(data.data)
                            this.showTip('修改成功')
                            this.$router.go(-1)
                        } else {
                            this.showTip(data.msg)
                        }
                    })
                    .catch(console.log)
            },
            ...mapMutations({
                setUserInfo: 'SET_USER_INFO'
            }),
        },
        created() {
            this.initUserInfo()
        },
        mounted() {
            this.tip = this.$refs.tip
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        components: {
            OtherHeader,
            Tip
        }
    }
</script>

<style lang="stylus" scoped>
    .form
        padding 20px
        text-align right
        .input
            font-size 14px
            color #222
            height 30px
            margin-bottom 20px
            width 100%
            box-sizing border-box
            padding 0 10px
            border 1px solid #cccccc
            border-radius 5px
            outline none
        .avatar-box
            display flex
            margin-bottom 20px
            font-size 14px
            align-items center
            .text
                margin-right 10px
            .file
                flex 1
        .save-btn
            color #ffffff
            font-size 14px
            display inline-block
            padding 7px 15px
            background-color #007fff
            border-radius 5px
</style>
