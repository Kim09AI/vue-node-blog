<template>
    <div class="header-wrapper">
        <div class="content">
            <div class="left" @click="home">
                <img src="/static/images/logo.png" class="logo">
                <span class="name">{{name}}</span>
            </div>
            <div class="right" v-if="!isLogin">
                <span class="text" @click="signin">登录</span>
                <span class="text" @click="signup">注册</span>
            </div>
            <div class="right" v-else>
                <span class="avatar" v-if="user.avatar" :style="{'background-image': user.avatar}" @click="avatarClick"></span>
                <i class="iconfont icon" v-else @click="avatarClick">&#xe603;</i>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'commonHeader',
        data() {
            return {
                name: 'vue-node'
            }
        },
        methods: {
            home() {
                this.$router.push('/')
            },
            avatarClick() {
                this.$router.push('/user')
            },
            signin() {
                this.setSignPopup('signin')
            },
            signup() {
                this.setSignPopup('signup')
            },
            ...mapActions([
                'setSignPopup'
            ])
        },
        computed: {
            ...mapGetters([
                'isLogin',
                'user'
            ]),
        }
    }
</script>

<style lang="stylus" scoped>
    height = 45px

    .header-wrapper
        height height
        .content
            position fixed
            left 0
            top 0
            width 100%
            height height
            display flex
            justify-content space-between
            align-items center
            padding 0 10px
            box-sizing border-box
            box-shadow 0 0 2px #a0a0a0
            background-color #ffffff
            z-index 10
            .left
                display flex
                align-items center
                .logo
                    width 25px
                    margin-right 5px
                .name
                    font-size 18px
                    color #007fff
            .right
                display flex
                align-items center
                .text
                    font-size 16px
                    color #007fff
                .text + .text
                    margin-left 10px
                .avatar
                    width 30px
                    height 30px
                    border-radius 50%
                    background-repeat no-repeat
                    background-position center
                    background-size cover
                    background-color #cccccc
                .icon
                    font-size 30px
                    color #ccc


</style>
