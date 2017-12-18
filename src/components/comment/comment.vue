<template>
    <div>
        <div class="comment-wrapper">
            <div class="info">
                <span class="name" v-if="comment.author">{{comment.author.originName || comment.author.name}}</span>
                <span class="time">{{comment.created_at}}</span>
            </div>
            <div class="content" v-html="comment.content"></div>
        </div>
        <comment-list :isLevel="isLevel" :commentList="levelCommentList"></comment-list>
        <comment-box @submit="checked" ref="commentBox"></comment-box>
        <tip :tipText="tipText" ref="tip"></tip>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {trim, ERR_OK, format} from '../../common/js/util'
    import {pullupMixin} from '../../common/js/mixin'
    import Tip from '../../base/tip.vue'
    import {getCommentById, createLevelComment, getLevelComment} from '../../api/comment'
    import CommentBox from '../commentBox/commentBox.vue'
    import CommentList from './commentList.vue'

    export default {
        name: 'comment',
        mixins: [pullupMixin],
        data() {
            return {
                commentId: this.$route.params.commentId,
                comment: {},
                isLevel: true,
                levelCommentList: [],
                tipText: '',
                page: 1,
                hasMore: true
            }
        },
        methods: {
            addNewComment(comment) {
                let _comment = Object.assign({}, comment)
                _comment.author = this.user
                _comment.created_at = format('yy-MM-dd hh-mm')

                this.levelCommentList.push(_comment)
            },
            checked(content) {
                content = trim(content)
                if (!content) {
                    this.tipText = '请输入内容'
                    this.tip.show()
                }

                this._createLevelComment(content)
            },
            _createLevelComment(content) {
                createLevelComment(this.commentId, content)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.tipText = '评论成功'
                            this.tip.show()
                            this.$refs.commentBox.clear()
                            this.addNewComment(data.data)
                        }
                    })
                    .catch(console.log)
            },
            _getCommentById() {
                getCommentById(this.commentId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.comment = data.data
                        }
                    })
                    .then(() => {
                        this._getLevelComment()
                    })
                    .catch(console.log)
            },
            _getLevelComment() {
                if (!this.hasMore) {
                    return
                }

                getLevelComment(this.commentId, this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.page++
                            if (data.data.length > 0) {
                                this.levelCommentList = this.levelCommentList.concat(data.data)
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
                    .catch(console.log)
            }
        },
        created() {
            this._getCommentById()

            this.pullup(this._getLevelComment)
        },
        mounted() {
            this.tip = this.$refs.tip
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        components: {
            Tip,
            CommentBox,
            CommentList
        }
    }
</script>

<style lang="stylus">
    .comment-wrapper
        padding 30px 20px 20px
        .info
            display flex
            align-items center
            margin-bottom 10px
            .name
                font-size 16px
                color #222
                margin-right 10px
            .time
                color #cccccc
                font-size 12px
        .content
            color #333
</style>
