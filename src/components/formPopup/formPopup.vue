<template>
    <popup :coverClickHide="coverClickHide" :width="width" @coverClick="close" ref="popup">
        <div class="wrapper">
            <div class="header">
                <h3 class="popup-title">{{info.title}}</h3>
                <i class="iconfont close-btn" @click="close">&#xe624;</i>
            </div>
            <form class="form" ref="form">
                <input :type="item.type" :placeholder="item.placeholder" :name="item.name" v-for="item in info.input">
                <span class="submit-btn" @click="submitChecked">{{info.submitText}}</span>
            </form>
            <p class="tipsinfo" v-show="tipsinfo">{{tipsinfo}}</p>
            <div class="signup-tip" v-if="currentType === 'signin'">
                <span class="text">没有账号&nbsp;?</span>
                <span class="signup-btn" @click="toggleType">注册</span>
            </div>
            <div class="signin-tip" v-else>
                <span class="signin-btn" @click="toggleType">已有账号登录</span>
            </div>
            <div class="signin-other">
                <span>第三方账号登录</span>
                <i class="iconfont github" @click="_githubLogin">&#xe625;</i>
            </div>
        </div>
    </popup>
</template>

<script>
    import {mapMutations, mapActions} from 'vuex'
    import popup from '../../base/popup.vue'
    import {trim, ERR_OK} from '../../common/js/util'
    import {submit, githubLogin} from '../../api/sign'

    export default {
        name: 'formPopup',
        props: {
            type: {
                type: String,
                default: 'signin'
            },
            state: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                coverClickHide: true, // 点击关闭时是否关闭弹窗
                currentType: '',
                width: '85%',
                signin: {
                    title: '登录',
                    input: [{
                        type: 'text',
                        placeholder: '请输入用户名',
                        name: 'name'
                    },{
                        type: 'password',
                        placeholder: '请输入密码',
                        name: 'password'
                    }],
                    submitText: '登录',
                },
                signup: {
                    title: '注册',
                    input: [{
                        type: 'text',
                        placeholder: '请输入用户名',
                        name: 'name'
                    },{
                        type: 'password',
                        placeholder: '请输入密码',
                        name: 'password'
                    },{
                        type: 'password',
                        placeholder: '请再次输入密码',
                        name: 'repassword'
                    }],
                    submitText: '注册',
                },
                tipsinfo: '',
            }
        },
        created() {
            this.currentType = this.type
        },
        mounted() {
            this.popup = this.$refs.popup // 弹窗组件
            this.form = this.$refs.form // form表单

            this.state && this.popup.show()
        },
        methods: {
            submitChecked() {
                let form = this.form
                let name = trim(form.name.value)
                let password = trim(form.password.value)
                let repassword

                if (name.length < 1 || name.length > 10) {
                    return this.tipsinfo = '名字请限制在 1-10 个字符'
                }

                if (password.length < 6) {
                    return this.tipsinfo = '密码至少 6 个字符'
                }

                if (this.currentType !== 'signin') {
                    repassword = trim(form.repassword.value)
                    if (password !== repassword) {
                        return this.tipsinfo = '两次输入密码不一致'
                    }
                }
                this.tipsinfo = '' // 重置

                this._submit(name, password, repassword)
            },
            _submit(name, password, repassword) {
                // 点击关闭按钮或背景不隐藏弹窗
                this.coverClickHide = false

                submit(name, password, repassword, this.currentType)
                    .then(({data}) => {
                        this.coverClickHide = true

                        if (data.code === ERR_OK) {
                            if (this.currentType === 'signin') {
                                // this.saveUserInfo({user: data.data, loginState: true})
                                this.close()
                                // 刷新页面
                                window.location.reload()
                            } else {
                                this.currentType = 'signin'
                            }
                        } else {
                            data.msg && (this.tipsinfo = data.msg)
                        }
                    })
                    .catch((err) => {
                        this.coverClickHide = true
                        console.log(err)
                    })
            },
            toggleType() {
                this.currentType = this.currentType === 'signin' ? 'signup' : 'signin'
            },
            _githubLogin() {
                githubLogin()
            },
            close() {
                this.coverClickHide && this.setSignPopup()
            },
            ...mapMutations({
                setSignPopup: 'SET_SIGN_POPUP'
            }),
            ...mapActions([
                'saveUserInfo'
            ])
        },
        computed: {
            info() {
                if (this.currentType === 'signin') {
                    return this.signin
                }
                return this.signup
            }
        },
        components: {
            popup
        }
    }
</script>

<style lang="stylus" scoped>
    .wrapper
        padding 0 15px
        .header
            display flex
            align-items center
            justify-content space-between
            margin-bottom 15px
            .popup-title
                color #333
                font-size 18px
            .close-btn
                font-size 14px
                color #999999
        .form
            input
                width 100%
                height 35px
                box-sizing border-box
                padding 0 10px
                border-radius 5px
                color #333333
                font-size 14px
                margin-bottom 15px
                box-shadow 0 0 1px #999999
                outline none
            .submit-btn
                color #ffffff
                font-size 14px
                border-radius 5px
                display inline-block
                width 100%
                padding 10px 0
                background-color #007fff
                margin-bottom 15px
        .tipsinfo
            color red
            font-size 12px
            margin-bottom 15px
        .signup-tip
            font-size 14px
            margin-bottom 15px
            text-align left
            .text
                color #999999
                margin-right 5px
            .signup-btn
                color #007fff
        .signin-tip
            font-size 14px
            margin-bottom 15px
            .signin-btn
                color #007fff
        .signin-other
            font-size 14px
            color #999999
            text-align left
            margin-bottom 15px
            display flex
            align-items center
            .github
                color #cccccc
                font-size 20px
            span
                margin-right 15px
</style>
