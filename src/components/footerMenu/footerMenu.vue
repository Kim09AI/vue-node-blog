<template>
    <div class="footer-menu-wrapper">
        <div class="footer-menu">
            <span class="item" :class="{active: currentIndex === index}" v-for="(item, index) in list" @click="click(index)">
                <i class="iconfont icon" v-html="item.icon"></i>
                <span class="text">{{item.text}}</span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'footerMenu',
        data() {
            return {
                list: [{
                    text: '首页',
                    icon: '&#xe602;',
                    url: '/'
                },{
                    text: '分类',
                    icon: '&#xe7f9;',
                    url: '/category'
                },{
                    text: '个人中心',
                    icon:'&#xe619;',
                    url: '/user'
                }],
                currentIndex: -1
            }
        },
        methods: {
            initCurrentIndex() {
                let path = this.$route.path
                let index = this.list.findIndex((item) => {
                    return item.url === path
                })

                this.currentIndex = index
            },
            click(index) {
                let url = this.list[index].url
                this.currentIndex = index
                this.$router.push(url)
            }
        },
        created() {
            this.initCurrentIndex()
        },
        watch: {
            '$route'() {
                this.initCurrentIndex()
            }
        }
    }
</script>

<style lang="stylus" scoped>
    height = 45px

    .footer-menu-wrapper
        height height
        .footer-menu
            position fixed
            left 0
            bottom 0
            width 100%
            height height
            background-color #ffffff
            display flex
            align-items center
            text-align center
            box-shadow 0 0 1px #a0a0a0
            .item
                flex 1
                color #cccccc
                .icon
                    font-size 16px
                    margin-bottom 2px
                    display inline-block
                .text
                    display inline-block
                    width 100%
                    font-size 12px
                &.active
                    color #007fff
</style>
