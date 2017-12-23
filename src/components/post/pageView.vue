<template>
    <div>
        <div class="title-wrapper">
            <h3 class="title">{{post.title}}</h3>
            <div class="post-info">
                <span v-if="post.author">作者: {{post.author.originName || post.author.name}}</span>
                <span>发布时间: {{post.created_at}}</span>
                <span>浏览量: {{post.pv || 0}}</span>
            </div>
        </div>
        <div class="content markdown-body" v-html="post.content"></div>
        <div class="post-other">
            <div class="left">
                <i class="iconfont like" v-html="post.isUserLike ? '&#xe611;' : '&#xe61b;'" @click="postLike" data-shouldLogin="true"></i>
                <span class="num">{{post.postLikeCount}}</span>
            </div>
            <div class="right">
                <i class="iconfont collection" :class="{active: post.isUserCollection}" @click="postCollection" data-shouldLogin="true">&#xe717;</i>
                <i class="iconfont follow" v-if="!isSelf" :class="{active: isFollow}" @click="follow" data-shouldLogin="true">&#xe637;</i>
            </div>
        </div>
        <comment-list :commentList="commentList" @levelComment="levelComment" @likeClick="likeClick"></comment-list>
        <comment-box @submit="checked" ref="commentBox"></comment-box>
        <tip :tipText="tipText" ref="tip"></tip>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getPostById} from '../../api/post'
    import {getUserPostLikeByPostId, postLikeCreate, postLikeCancel} from '../../api/postLike'
    import {getUserPostCollectionByPostId, postCollectionCreate, postCollectionCancel} from '../../api/postCollection'
    import {createComment, getComments, getUserCommentLikeByPostId, commentLikeCreate, commentLikeCancel} from '../../api/comment'
    import {getByFollowAuthor, followAuthorCreate, followAuthorCancel} from '../../api/followAuthor'
    import {trim, ERR_OK, format} from '../../common/js/util'
    import {pullupMixin} from '../../common/js/mixin'
    import CommentBox from '../commentBox/commentBox.vue'
    import Tip from '../../base/tip.vue'
    import CommentList from '../comment/commentList.vue'
    import '../../common/css/marked.css'

    export default {
        name: 'pageView',
        mixins: [pullupMixin],
        data() {
            return {
                post: {},
                tipText: '',
                commentList: [],
                userCommentLikeList: [],
                page: 1,
                hasMore: true,
                postId: this.$route.params.postId,
                isFollow: false
            }
        },
        methods: {
            addNewComment(comment) {
                let _comment = Object.assign({}, comment)
                _comment.author = this.user
                _comment.created_at = format('yy-MM-dd hh-mm')
                _comment.commentLikeCount = 0

                this.commentList.push(_comment)
            },
            _getPostInfo() {
                getPostById(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.post = data.data
                        }
                    })
                    .then(() => {
                        return this._getComments()
                    })
                    .then(() => {
                        if (!this.isLogin) {
                            // 没登录就跳过后面的then
                            throw new Error('noLogin')
                        }

                        return this._getUserPostCollectionByPostId()
                    })
                    .then(() => {
                        return this._getByFollowAuthor()
                    })
                    .then(() => {
                        return this._getUserPostLikeByPostId()
                    })
                    .then(() => {
                        return this._getUserCommentLikeByPostId()
                    })
                    .catch((err) =>{
                        if (err.message !== 'noLogin') {
                            console.log(err)
                        }
                    })
            },
            checked(content) {
                content = trim(content)
                if (!content) {
                    this.tipText = '请输入内容'
                    this.tip.show()
                }

                this._createComment(content)
            },
            _createComment(content) {
                createComment(this.postId, content)
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
            _getComments() {
                if (!this.hasMore) {
                    return
                }

                return getComments(this.postId, this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.length > 0) {
                                this.page++
                                this.commentList = this.commentList.concat(this.setCommentLikeState(data.data))
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
            },
            _getUserCommentLikeByPostId() {
                if (this.isLogin) {
                    return getUserCommentLikeByPostId(this.postId)
                        .then(({data}) => {
                            if (data.code === ERR_OK) {
                                this.userCommentLikeList = data.data.map((item) => {
                                    return item.commentId
                                })
                                this.commentList = this.setCommentLikeState(this.commentList)
                            }
                        })
                        .catch(console.log)
                }
            },
            _getUserPostLikeByPostId() {
                return getUserPostLikeByPostId(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.postId === this.postId) {
                                this.$set(this.post, 'isUserLike', true)
                            }
                        }
                    })
            },
            _getUserPostCollectionByPostId() {
                return getUserPostCollectionByPostId(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.postId === this.postId) {
                                this.$set(this.post, 'isUserCollection', true)
                            }
                        }
                    })
            },
            _getByFollowAuthor() {
                return getByFollowAuthor(this.post.author._id)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.followAuthor === this.post.author._id) {
                                this.isFollow = true
                            }
                        }
                    })
            },
            follow() {
                let followFunc = this.isFollow ? followAuthorCancel : followAuthorCreate

                followFunc(this.post.author._id)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.isFollow = !this.isFollow
                        }
                    })
                    .catch(console.log)
            },
            levelComment(commentId) {
                this.$router.push(`/post/${this.postId}/comment/${commentId}`)
            },
            likeClick(index) {
                let currentItem = this.commentList[index]
                let likeFunc = currentItem.isUserLike ? commentLikeCancel : commentLikeCreate
                let data = {
                    postId: this.postId,
                    commentId: currentItem._id
                }

                likeFunc(data)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            currentItem.isUserLike ? currentItem.commentLikeCount-- : currentItem.commentLikeCount++
                            this.$set(currentItem, 'isUserLike', !currentItem.isUserLike)
                        }
                    })
                    .catch(console.log)
            },
            postLike() {
                let postLikeFunc = this.post.isUserLike ? postLikeCancel : postLikeCreate

                postLikeFunc(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.post.isUserLike ? this.post.postLikeCount-- : this.post.postLikeCount++
                            this.$set(this.post, 'isUserLike', !this.post.isUserLike)
                        }
                    })
                    .catch(console.log)
            },
            postCollection() {
                let postCollectionFunc = this.post.isUserCollection ? postCollectionCancel : postCollectionCreate

                postCollectionFunc(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.$set(this.post, 'isUserCollection', !this.post.isUserCollection)
                        }
                    })
                    .catch(console.log)
            },
            setCommentLikeState(list) {
                if (!this.isLogin || !this.userCommentLikeList.length) {
                    return list
                }

                let userCommentLikeList = this.userCommentLikeList
                list.forEach((item, index) => {
                    if (userCommentLikeList.indexOf(item._id) > -1) {
                        this.$set(list[index], 'isUserLike', true)
                    }
                })

                return list
            }
        },
        created() {
            this._getPostInfo()

            this.pullup(this._getComments)
        },
        mounted() {
            this.tip = this.$refs.tip
        },
        activated() {
            if (this.isPopState || !this.intoPageCount++) return

            this.post = {}
            this.tipText = ''
            this.commentList = []
            this.userCommentLikeList = []
            this.page = 1
            this.hasMore = true
            this.postId = this.$route.params.postId
            this.isFollow = false
            this._getPostInfo()
        },
        computed: {
            isSelf() {
                if (this.isLogin && this.user && this.post.author) {
                    if (this.user._id === this.post.author._id) {
                        return true
                    }
                }

                return false
            },
            ...mapGetters([
                'user',
                'isLogin',
                'isPopState'
            ])
        },
        components: {
            Tip,
            CommentBox,
            CommentList
        }
    }
</script>

<style lang="stylus" scoped>
    .title-wrapper
        padding 30px 20px 0
        text-align center
        margin-bottom 10px
        .title
            font-size 16px
            color #222222
            font-weight bold
            margin-bottom 10px
            line-height 1.5
        .post-info
            font-size 0px
            color #cccccc
            span
                font-size 12px
                margin 0 5px
    .content
        padding 20px

    .post-other
        display flex
        justify-content space-between
        padding 0 20px
        margin-bottom 10px
        .left
            display flex
            align-items center
            color #37c700
            .like
                font-size 20px
                margin-right 10px
            .num
                font-size 16px
        .right
            color #999
            display flex
            align-items center
            .collection
                font-size 18px
                &.active
                    color #007fff
            .follow
                font-size 20px
                &.active
                    color #007fff
            i + i
                margin-left 20px

</style>
