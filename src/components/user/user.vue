<template>
    <div>
        <other-header :showBackBtn="showBackBtn" :title="title"></other-header>
        <div class="user-login-wrapper" v-if="!isLogin">
            <span class="btn" @click="signin">登录</span>
            <span class="btn" @click="signup">注册</span>
        </div>
        <div class="user-wrapper" v-else>
            <span class="avatar" v-if="user.avatar" :style="{'background-image': `url(${user.avatar})`}"></span>
            <i class="iconfont icon">&#xe603;</i>
            <div class="user">
                <span class="name">{{user.originName || user.name}}</span>
                <p class="describe">{{user.describe || describe}}</p>
            </div>
        </div>
        <div class="user-list">
            <div class="item" v-for="(item, index) in list" @click="itemClick(item.url, item.unBaseUrl)">
                <i class="iconfont icon" v-html="item.icon"></i>
                <span class="text">{{item.text}}</span>
            </div>
            <div class="item" @click="loginOut" v-if="isLogin">
                <i class="iconfont icon">&#xe642;</i>
                <span class="text">退出登录</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import OtherHeader from '../header/otherHeader'
    import {signout} from '../../api/sign'
    import {ERR_OK} from '../../common/js/util'

    export default {
        name: 'user',
        data() {
            return {
                title: '用户中心',
                showBackBtn: false,
                baseUrl: '/user',
                describe: '这个人很懒,什么也没有留下!',
                list: [{
                    icon: '&#xe6a8;',
                    text: '个人资料',
                    url: ''
                },{
                    icon: '&#xe651;',
                    text: '修改个人资料',
                    url: '/edit'
                },{
                    icon: '&#xe68f;',
                    text: '写文章',
                    url: '/post/create',
                    unBaseUrl: true
                },{
                    icon: '&#xe600;',
                    text: '我的文章',
                    url: '/post'
                },{
                    icon: '&#xe623;',
                    text: '收藏的文章',
                    url: '/collection'
                },{
                    icon: '&#xe637;',
                    text: '关注的人',
                    url: '/follow'
                },{
                    icon: '&#xe61c;',
                    text: '历史记录',
                    url: '/history'
                }]
            }
        },
        methods: {
            signin() {
                this.setSignPopup('signin')
            },
            signup() {
                this.setSignPopup('signup')
            },
            itemClick(url, unBaseUrl) {
                url = unBaseUrl ? url : this.baseUrl + url
                this.$router.push(url)
            },
            loginOut() {
                signout()
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.saveUserInfo({user: null, loginState: false})
                            console.log(this.isLogin)
                            this.$router.push('/')
                        }
                    })
                    .catch(console.log)
            },
            ...mapActions([
                'setSignPopup',
                'saveUserInfo'
            ])
        },
        computed: {
            ...mapGetters([
                'isLogin',
                'user'
            ])
        },
        components: {
            OtherHeader
        }
    }
</script>

<style lang="stylus" scoped>
    .user-login-wrapper
        font-size 0
        box-sizing border-box
        text-align center
        padding 40px 20px
        .btn
            display inline-block
            margin 0 15px
            font-size 14px
            border-radius 5px
            background-color #007fff
            padding 10px 20px
            color #ffffff
    .user-wrapper
        display flex
        padding 30px 20px
        align-items center
        .avatar
            width 60px
            height 60px
            background-color #cccccc
            background-repeat no-repeat
            background-size cover
            background-position center
        .icon
            font-size 60px
            color #cccccc
            margin-right 10px
        .user
            .name
                font-size 16px
                color #222222
                margin-bottom 5px
                display inline-block
            .describe
                font-size 14px
                color #cccccc
    .user-list
        margin-bottom 20px
        .item
            display flex
            border-bottom 1px solid #f6f6f6
            padding 0 20px
            color #404040
            height 40px
            align-items center
            .text
                font-size 14px
            .icon
                margin-right 10px
</style>
