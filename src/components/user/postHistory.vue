<template>
    <div>
        <other-header :title="title"></other-header>
        <post-list :list="list" @delByIndex="_delHistoryById" @postClick="postClick"></post-list>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import OtherHeader from '../header/otherHeader'
    import PostList from '../post/postList'
    import {getPostHistory, delHistoryById} from '../../api/postHistory'
    import {ERR_OK} from '../../common/js/util'
    import {pullupMixin, timeFormatMixin, postFormatMixin} from '../../common/js/mixin'

    export default {
        name: 'postHistory',
        mixins: [pullupMixin, timeFormatMixin, postFormatMixin],
        data() {
            return {
                title: '历史记录',
                page: 1,
                hasMore: true,
                list: []
            }
        },
        methods: {
            _getPostHistory() {
                if (!this.hasMore) {
                    return
                }

                getPostHistory(this.page)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (data.data.length > 0) {
                                this.page++
                                let _list = this.timeFormat(this.postFormat(data.data))
                                this.list = this.list.concat(_list)
                            } else {
                                this.hasMore = false
                            }
                        }
                    })
                    .catch(console.log)
            },
            _delHistoryById(index) {
                let historyId = this.list[index]._id

                delHistoryById(historyId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.list.splice(index, 1)
                        }
                    })
                    .catch(console.log)
            },
            postClick(index) {
                let postId = this.list[index].postId
                this.$router.push(`/post/${postId}`)
            }
        },
        created() {
            this._getPostHistory()
            
            this.pullup(this._getPostHistory)
        },
        activated() {
            if (this.isPopState || !this.intoPageCount++) return

            this.page = 1
            this.hasMore = true
            this.list = []
            this._getPostHistory()
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
