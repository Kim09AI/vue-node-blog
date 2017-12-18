<template>
    <div class="comment-list" v-if="commentList.length">
        <h3 class="title">评论</h3>
        <div class="list" v-for="(item, index) in commentList">
            <div class="info">
                <span class="name">{{item.author.originName || item.author.name}}</span>
                <span class="time">{{item.created_at}}</span>
            </div>
            <div class="comment">{{item.content}}</div>
            <div class="icon-wrapper" v-if="!isLevel">
                <span class="item" :class="{active: item.isUserLike}" @click="likeClick(index)" data-shouldLogin="true">
                    <i class="iconfont heart-icon" data-shouldLogin="true">&#xe61b;</i>
                    <span data-shouldLogin="true">{{item.commentLikeCount || 0}}</span>
                </span>
                <span class="item" @click="levelComment(item._id)">
                    <i class="iconfont comment-icon">&#xe632;</i>
                    <span>{{item.levelCommentCount || 0}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'commentList',
        props: {
            commentList: {
                type: Array,
                default: () => []
            },
            isLevel: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            levelComment(commentId) {
                this.$emit('levelComment', commentId)
            },
            likeClick(index) {
                this.$emit('likeClick', index)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .comment-list
        .title
            font-size 16px
            color #222222
            padding 10px 20px
            border-bottom 1px solid #f7f7f7
        .list
            padding 15px 20px
            border-bottom 1px solid #f7f7f7
            &:last-child
                border-bottom none
            .info
                display flex
                align-items center
                margin-bottom 10px
                .name
                    font-size 14px
                    color #333333
                    margin-right 10px
                .time
                    color #cccccc
                    font-size 12px
            .comment
                font-size 14px
                font-size #999999
                margin-bottom 5px
            .icon-wrapper
                font-size 12px
                color #cccccc
                .item
                    .heart-icon
                        font-size 14px
                        position relative
                        top 1px
                    .comment-icon
                        font-size 18px
                        position relative
                        top 2px
                    &.active
                        color pink
                .item + .item
                    margin-left 10px
</style>
