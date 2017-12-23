<template>
    <div>
        <h3 class="title">最新文章</h3>
        <post-list :list="list" :showBtn="showBtn" @postClick="postClick"></post-list>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PostList from '../post/postList.vue'
    import {getPosts} from '../../api/post'
    import {ERR_OK} from '../../common/js/util'
    import {pullupMixin, timeFormatMixin} from '../../common/js/mixin'

    export default {
        name: 'home',
        mixins: [pullupMixin, timeFormatMixin],
        data() {
            return {
                list: [],
                page: 1,
                hasMore: true,
                showBtn: false,
            }
        },
        methods: {
            _getPosts() {
                if (!this.hasMore) {
                    return
                }

                getPosts(null, this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.page++
                            if (data.data.length > 0) {
                                this.list = this.list.concat(this.timeFormat(data.data))
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
                    .catch(console.log)
            },
            postClick(index) {
                let postId = this.list[index]._id
                this.$router.push(`/post/${postId}`)
            }
        },
        created() {
            this._getPosts()

            this.pullup(this._getPosts)
        },
        activated() {
            // 前进后退或首次加载组件
            if (this.isPopState || !this.intoPageCount++) return
            
            // 重置初始数据状态并获取数据
            this.list = []
            this.page = 1
            this.hasMore = true
            this._getPosts()
        },
        computed: {
            ...mapGetters([
                'isPopState'
            ])
        },
        components: {
            PostList
        }
    }
</script>

<style lang="stylus" scoped>
    .title
        font-size 16px
        color #222
        padding 10px 20px
        border-bottom 1px solid #f6f6f6
</style>
