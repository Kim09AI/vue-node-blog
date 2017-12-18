<template>
    <div>
        <other-header :showBackBtn="showBackBtn" :title="title"></other-header>
        <div class="category-list">
            <div class="category" v-for="(item, index) in categoryList">
                <span @click="categoryClick(item.category)">{{item.category}}</span>
                <i class="iconfont" :class="{add: item.isAdded}" v-html="item.isAdded ? '&#xe63e;' : '&#xe601;'" @click="addCategory(index)" data-shouldLogin="true"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import OtherHeader from '../header/otherHeader'
    import {mapGetters} from 'vuex'
    import {ERR_OK} from '../../common/js/util'
    import {getCategoryFollow, categoryFollowCreate, categoryFollowCancel} from '../../api/categoryFollow'

    export default {
        name: 'category',
        data() {
            return {
                showBackBtn: false,
                title: '分类',
                categoryList: [
                    {
                        category: '前端'
                    },{
                        category: 'node.js'
                    },{
                        category: 'Vue'
                    },{
                        category: 'iOS'
                    },{
                        category: 'Android'
                    },{
                        category: 'Angularjs'
                    },{
                        category: 'Mongodb'
                    },{
                        category: 'Java'
                    },{
                        category: 'Php'
                    },{
                        category: 'react'
                    },{
                        category: '后端'
                    },{
                        category: '设计'
                    },{
                        category: '产品'
                    }
                ]
            }
        },
        methods: {
            categoryClick(category) {
                this.$router.push(`/category/${category}`)
            },
            addCategory(index) {
                let currentItem = this.categoryList[index]
                let categoryFollowFunc = currentItem.isAdded ? categoryFollowCancel : categoryFollowCreate

                categoryFollowFunc(this.categoryList[index].category)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.$set(currentItem, 'isAdded', !currentItem.isAdded)
                        }
                    })
                    .catch(console.log)
            },
            setCategoryFollow(followList) {
                this.categoryList.forEach((categoryItem) => {
                    followList.forEach((followItem) => {
                        if (categoryItem.category === followItem.category) {
                            this.$set(categoryItem, 'isAdded', true)
                        }
                    })
                })
            },
            _getCategoryFollow() {
                if (!this.isLogin) {
                    return
                }

                getCategoryFollow()
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            data.data.length && this.setCategoryFollow(data.data)
                        }
                    })
                    .catch(console.log)
            }
        },
        created() {
            this._getCategoryFollow()
        },
        computed: {
            ...mapGetters([
                'isLogin'
            ])
        },
        components: {
            OtherHeader
        }
    }
</script>

<style lang="stylus" scoped>
    .category-list
        padding 20px
        .category
            font-size 16px
            font-size #222222
            display flex
            justify-content space-between
            padding 10px 0
            border-bottom 1px solid #f7f7f7
            .add
                color #007fff
</style>
