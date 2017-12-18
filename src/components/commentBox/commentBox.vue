<template>
    <div class="comment-box-wrapper">
        <div class="content">
            <input class="comment" v-model="content" placeholder="请输入评论" />
            <span class="btn" @click="click" data-shouldLogin="true">{{submitText}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'commentBox',
        props: {
            submitText: {
                type: String,
                default: '评论'
            }
        },
        data() {
            return {
                content: '',
            }
        },
        methods: {
            click() {
                this.$emit('submit', this.content)
            },
            clear() {
                this.content = ''
            }
        }
    }
</script>

<style lang="stylus" scoped>
    height = 50px

    .comment-box-wrapper
        height height
        .content
            position fixed
            bottom 0
            left 0
            width 100%
            height height
            background-color #ffffff
            display flex
            box-sizing border-box
            padding 0 20px
            align-items center
            box-shadow 0 0 1px #a0a0a0
            .comment
                flex 1
                height 35px
                font-size 14px
                box-sizing border-box
                padding 0 10px
                margin-right 10px
                outline none
                color #333
                border 1px solid #eeeeee
                border-radius 5px
            .btn
                padding 7px 15px
                font-size 14px
                color #ffffff
                background-color #007fff
                border-radius 5px
</style>
