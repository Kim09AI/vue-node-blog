<template>
    <div>
        <other-header :title="title"></other-header>
        <post-list :list="list" :showBtn="showBtn" @postClick="postClick"></post-list>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import OtherHeader from '../header/otherHeader'
    import PostList from '../post/postList'
    import {getPostByCategory} from '../../api/post'
    import {ERR_OK} from '../../common/js/util'
    import {pullupMixin, timeFormatMixin} from '../../common/js/mixin'

    export default {
        name: 'categoryPost',
        mixins: [pullupMixin, timeFormatMixin],
        data() {
            return {
                title: this.$route.params.category,
                category: this.$route.params.category,
                list: [],
                page: 1,
                hasMore: true,
                showBtn: false,
            }
        },
        methods: {
            postClick(index) {
                let postId = this.list[index]._id
                this.$router.push(`/category/${this.category}/post/${postId}`)
            },
            _getPostByCategory() {
                if (!this.hasMore || this.isGetDataNow) {
                    return
                }
                this.isGetDataNow = true

                getPostByCategory(this.category, this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.length) {
                                this.page++
                                this.list = this.list.concat(this.timeFormat(data.data))
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
                    .catch(console.log)
                    .finally(() => this.isGetDataNow = false)
            }
        },
        created() {
            this._getPostByCategory()

            this.pullup(this._getPostByCategory)
        },
        activated() {
            if (this.isPopState || !this.intoPageCount++) return

            // 重置状态并获取数据
            this.title = this.$route.params.category
            this.category = this.$route.params.category
            this.list = []
            this.page = 1
            this.hasMore = true
            this._getPostByCategory()
        },
        computed: {
            ...mapGetters([
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
