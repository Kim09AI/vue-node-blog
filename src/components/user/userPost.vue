<template>
    <div>
        <other-header :title="title"></other-header>
        <post-list :list="list" :showBtn="showBtn" :showUpdateBtn="showUpdateBtn" @delByIndex="_delPostById" @postClick="postClick" @updateIndex="postUpdate"></post-list>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import OtherHeader from '../header/otherHeader'
    import PostList from '../post/postList'
    import {getPosts, delPostById} from '../../api/post'
    import {ERR_OK} from '../../common/js/util'
    import {pullupMixin, timeFormatMixin} from '../../common/js/mixin'

    export default {
        name: 'userPost',
        mixins: [pullupMixin, timeFormatMixin],
        data() {
            return {
                title: this.$route.params.followAuthor ? '全部文章' : '我的文章',
                list: [],
                page: 1,
                hasMore: true,
                showUpdateBtn: true,
                showBtn: !this.$route.params.followAuthor,
                isSelf: !this.$route.params.followAuthor,
            }
        },
        methods: {
            _getPosts() {
                if (!this.hasMore) {
                    return
                }

                let author = this.isSelf ? this.user._id : this.$route.params.followAuthor
                getPosts(author, this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.length > 0) {
                                this.page++
                                this.list = this.list.concat(this.timeFormat(data.data))
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
                    .catch(console.log)
            },
            _delPostById(index) {
                let postId = this.list[index]._id
                delPostById(postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.list.splice(index, 1)
                        }
                    })
                    .catch(console.log)
            },
            postClick(index) {
                let postId = this.list[index]._id
                this.$router.push(`/post/${postId}`)
            },
            postUpdate(index) {
                let postId = this.list[index]._id
                this.$router.push(`/post/${postId}/update`)
            }
        },
        created() {
            this._getPosts()

            this.pullup(this._getPosts)
        },
        activated() {
            if (this.isPopState || !this.intoPageCount++) return

            this.title = this.$route.params.followAuthor ? '全部文章' : '我的文章'
            this.list = []
            this.page = 1
            this.hasMore = true
            this.showBtn = !this.$route.params.followAuthor
            this.isSelf = !this.$route.params.followAuthor
            this._getPosts()
        },
        computed: {
            ...mapGetters([
                'user',
                'isPopState'
            ])
        },
        components: {
            OtherHeader,
            PostList
        }
    }
</script>

<style lang="stylus" scoped>

</style>
