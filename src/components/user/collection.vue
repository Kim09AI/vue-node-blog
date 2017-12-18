<template>
    <div>
        <other-header :title="title"></other-header>
        <post-list :list="list" :showCollectionBtn="showCollectionBtn" :showDelBtn="showDelBtn" @collectionIndex="delCollection" @postClick="postClick"></post-list>
    </div>
</template>

<script>
    import OtherHeader from '../header/otherHeader'
    import PostList from '../post/postList'
    import {ERR_OK} from '../../common/js/util'
    import {pullupMixin, timeFormatMixin, postFormatMixin} from '../../common/js/mixin'
    import {getUserPostCollection, postCollectionCancel} from '../../api/postCollection'

    export default {
        name: 'sollection',
        mixins: [pullupMixin, timeFormatMixin, postFormatMixin],
        data() {
            return {
                list: [],
                title: '收藏的文章',
                page: 1,
                hasMore: true,
                showCollectionBtn: true,
                showDelBtn: false,
            }
        },
        methods: {
            postClick(index) {
                let postId = this.list[index].postId
                this.$router.push(`/post/${postId}`)
            },
            delCollection(index) {
                let postId = this.list[index].postId
                postCollectionCancel(postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.list.splice(index, 1)
                        }
                    })
                    .catch(console.log)
            },
            _getUserPostCollection() {
                if (!this.hasMore) {
                    return
                }

                getUserPostCollection(this.page)
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
            }
        },
        created() {
            this._getUserPostCollection()

            this.pullup(this._getUserPostCollection)
        },
        components: {
            OtherHeader,
            PostList
        }
    }
</script>

<style lang="stylus" scoped>

</style>
