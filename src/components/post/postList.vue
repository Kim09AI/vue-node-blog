<template>
    <transition-group tag="div" :name="animateName">
        <div class="post" v-for="(item, index) in list" :key="item._id">
            <div class="title-wrapper">
                <div class="post-info">
                    <h3 class="title" @click="postClick(index)">{{item.title}}</h3>
                    <span class="category" v-if="item.category">{{item.category}}</span>
                    <span class="tags" v-if="item.tags && item.tags.length">
                        <span v-for="(tag, index) in item.tags" v-if="index < 2">
                            <span class="circle" v-if="index >= 1"></span>
                            <span class="tag">{{tag}}</span>
                        </span>
                    </span>
                </div>
                <div v-if="showBtn">
                    <i class="iconfont update" @click="updateIndex(index)" v-if="showUpdateBtn" data-shouldLogin="true">&#xe615;</i>
                    <i class="iconfont collection" @click="collectionIndex(index)" v-if="showCollectionBtn" data-shouldLogin="true">&#xe717;</i>
                    <i class="iconfont icon" @click="delByIndex(index)" v-if="showDelBtn" data-shouldLogin="true">&#xe60e;</i>
                </div>
            </div>
            <div class="post-other-info">
                <span>{{item.author.originName || item.author.name}}</span>
                <span>{{item.time}}</span>
                <span v-if="item.pv">浏览量: {{item.pv}}</span>
                <span v-if="item.commentCount">评论: {{item.commentCount}}</span>
            </div>
        </div>
    </transition-group>
</template>

<script>
    export default {
        name: 'postList',
        props: {
            list: {
                type: Array,
                default: () => []
            },
            showBtn: {
                type: Boolean,
                default: true
            },
            showUpdateBtn: {
                type: Boolean,
                default: false
            },
            showDelBtn: {
                type: Boolean,
                default: true
            },
            showCollectionBtn: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                animateName: 'slide-out'
            }
        },
        methods: {
            postClick(index) {
                this.$emit('postClick', index)
            },
            delByIndex(index) {
                this.$emit('delByIndex', index)
            },
            updateIndex(index) {
                this.$emit('updateIndex', index)
            },
            collectionIndex(index) {
                this.$emit('collectionIndex', index)
            }
        },
        watch: {
            list(newList) {
                if (newList.length === 0) {
                    this.animateName = ''
                } else {
                    this.animateName = 'slide-out'
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .post
        padding 15px 20px
        border-bottom 1px solid #f6f6f6
        &:last-child
            border-bottom none
        .title-wrapper
            display flex
            justify-content space-between
            align-items center
            margin-bottom 5px
            .post-info
                display flex
                align-items center
                .title
                    font-size 15px
                    color #222
                    font-weight bold
                    height 1em
                    overflow hidden
                    word-break break-all
                .category
                    font-size 12px
                    color #cccccc
                    margin-left 10px
                    white-space nowrap
                .tags
                    font-size 0
                    color #cccccc
                    margin-left 10px
                    white-space nowrap
                    .tag
                        font-size 12px
                    .circle
                        display inline-block
                        width 2px
                        height 2px
                        border-radius 50%
                        background-color #cccccc
                        position relative
                        top -3px
                        margin 0 5px
            .update
                color #cccccc
                font-size 14px
                position relative
                top -2px
            .collection
                color #007fff
                font-size 14px
            .icon
                color #ccc
            i
                margin-left 5px
        .post-other-info
            font-size 0
            color #b2bac2
            span
                font-size 12px
            span + span
                margin-left 10px


</style>
