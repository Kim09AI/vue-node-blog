<template>
    <div class="tip" v-show="state">{{tipText}}</div>
</template>

<script>
    export default {
        name: 'tip',
        props: {
            time: {
                type: Number,
                default: 2000
            },
            tipText: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                state: false
            }
        },
        methods: {
            show() {
                clearTimeout(this.timer)
                this.state = true

                this.timer = setTimeout(() => {
                    this.state = false
                }, this.time)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .tip
        position fixed
        top 70%
        left 50%
        transform translateX(-50%)
        padding 10px 20px
        border-radius 30px
        color #ffffff
        background-color #cccccc
        font-size 14px
        z-index 200
        white-space nowrap
</style>
