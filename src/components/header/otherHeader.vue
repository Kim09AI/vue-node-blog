<template>
    <div class="other-header-wrapper">
        <div class="other-header">
            <i class="iconfont back-icon" v-if="showBackBtn" @click="goBack">&#xe61a;</i>
            <span class="title" v-if="title">{{title}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'otherHeader',
        props: {
            title: {
                type: String,
                default: ''
            },
            showBackBtn: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    height = 45px

    .other-header-wrapper
        height height
        .other-header
            position fixed
            top 0
            left 0
            width 100%
            height height
            background-color #ffffff
            z-index 10
            padding 0 10px
            box-sizing border-box
            box-shadow 0 0 2px #a0a0a0
            display flex
            align-items center
            justify-content center
            .title
                font-size 16px
                color #222222
            .back-icon
                position absolute
                left 20px
                font-size 20px
                color #999999
</style>
