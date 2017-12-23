<template>
    <div>
        <other-header :title="title"></other-header>
        <transition-group tag="div" v-if="followAuthorList.length" class="follow-list-wrapper" name="slide-out">
            <div v-for="(item, index) in followAuthorList" class="follow-list" :key="item._id">
                <div class="left">
                    <p class="user-info">
                        <span class="name" @click="followAuthorClick(index)" data-shouldLogin="true">{{item.followAuthor.originName || item.followAuthor.name}}</span>
                        <span class="info">{{`${item.followAuthor.postCount}篇文章`}}</span>
                        <span class="info">{{item.time}}</span>
                    </p>
                    <p class="describe">{{item.followAuthor.describe || '暂无描述!'}}</p>
                </div>
                <i class="iconfont icon" @click="followCancel(index)" data-shouldLogin="true">&#xe637;</i>
            </div>
        </transition-group>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import OtherHeader from '../header/otherHeader'
    import {ERR_OK} from '../../common/js/util'
    import {timeFormatMixin} from '../../common/js/mixin'
    import {getFollowAuthor, followAuthorCancel} from '../../api/followAuthor'

    export default {
        name: 'followAuthor',
        mixins: [timeFormatMixin],
        data() {
            return {
                title: '关注的人',
                followAuthorList: []
            }
        },
        methods: {
            _getFollowAuthor() {
                getFollowAuthor()
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.followAuthorList = this.timeFormat(data.data)
                        }
                    })
                    .catch(console.log)
            },
            followCancel(index) {
                followAuthorCancel(this.followAuthorList[index].followAuthor._id)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.followAuthorList.splice(index, 1)
                        }
                    })
                    .catch(console.log)
            },
            followAuthorClick(index) {
                let followAuthor = this.followAuthorList[index].followAuthor._id

                this.$router.push(`/user/followAuthor/${followAuthor}`)
            }
        },
        created() {
            this._getFollowAuthor()
        },
        activated() {
            if (this.isPopState || !this.intoPageCount++) return

            this.followAuthorList = []
            this._getFollowAuthor()
        },
        computed: {
            ...mapGetters([
                'isPopState'
            ])
        },
        components: {
            OtherHeader
        }
    }
</script>

<style lang="stylus" scoped>
    .follow-list-wrapper
        padding-top 20px
        .follow-list
            display flex
            justify-content space-between
            padding 10px 20px
            border-bottom 1px solid #f7f7f7
            &:last-child
                border-bottom none
            .left
                margin-right 10px
                .user-info
                    margin-bottom 5px
                    display flex
                    align-items center
                    .name
                        font-size 16px
                        color #222
                    .info
                        font-size 12px
                        color #cccccc
                        margin-left 10px
                .describe
                    font-size 12px
                    color #cccccc
                    max-height 2.4em
                    overflow hidden
                    line-height 1.2
            .icon
                color #007fff
                font-size 20px

</style>

