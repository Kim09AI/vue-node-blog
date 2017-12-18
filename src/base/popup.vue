<template>
    <transition name="fade">
        <div class="popup-wrapper" v-show="state" @click="coverClick">
            <div class="content" @click.stop="" :style="{width}">
                <slot>
                    <h3 class="title" v-if="title">{{title}}</h3>
                    <p class="describe" v-if="describe">{{describe}}</p>
                    <div class="footer">
                        <span class="btn" @click="hide">{{cancel}}</span>
                        <span class="btn" @click="confirmBtn">{{confirm}}</span>
                    </div>
                </slot>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'basePopup',
        props: {
            title: {
                type: String,
                default: ''
            },
            describe: {
                type: String,
                default: ''
            },
            cancel: {
                type: String,
                default: '取消'
            },
            confirm: {
                type: String,
                default: '确定'
            },
            coverClickHide: { // 点击背景是否隐藏弹窗，主要是在异步提交时禁用点击背景隐藏
                type: Boolean,
                default: true
            },
            width: {
                type: String,
                default: '70%'
            }
        },
        data() {
            return {
                state: false,
            }
        },
        methods: {
            show() {
                this.state = true
            },
            hide() {
                this.state = false
            },
            confirmBtn() {
                this.hide()
                this.$emit('confirm')
            },
            coverClick() {
                this.coverClickHide && this.hide()
                this.$emit('coverClick')
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .popup-wrapper
        position fixed
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        background-color rgba(120, 120, 120, 0.4)
        display flex
        align-items center
        .content
            position relative
            width 70%
            margin 0 auto
            background-color #ffffff
            border-radius 5px
            overflow hidden
            text-align center
            padding-top 20px
            .title
                color #333333
                font-size 18px
                margin-bottom 15px
                padding 0 15px
            .describe
                color #999
                font-size 16px
                margin-bottom 15px
                padding 0 15px
                word-break break-all
            .footer
                display flex
                border-top 0.5px solid #cccccc
                .btn
                    font-size 16px
                    color #696969
                    flex 1
                    padding 7px 0
                .btn + .btn
                    border-left 0.5px solid #cccccc

    animateTime = 0.3s
    .fade-enter-active, .fade-leave-active
        transition all animateTime
        .content
            animation scale animateTime ease
    .fade-enter, .fade-leave-to
        opacity 0

    @keyframes scale {
        0% {
            transform scale(0)
        }

        60% {
            transform scale(1.1)
        }

        100% {
            transform scale(1)
        }
    }
</style>

