<template>
    <div class="create-wrapper clearfix">
        <input type="text" class="title" placeholder="请输入标题" v-model="title">
        <textarea class="content" placeholder="请输入内容" v-model="content"></textarea>
        <div class="categoryList">
            <span class="category" :class="{active: category === item.category}" v-for="item in categoryList" @click="setCategory(item.category)">{{item.category}}</span>
        </div>
        <input type="text" class="tags" v-model="tagsText" placeholder="请输入标签，多个标签之间以空格分隔!">
        <span class="btn" @click="checked">发布</span>
        <tip :tipText="tipText" ref="tip"></tip>
    </div>
</template>

<script>
    import {create, getRawPost, updatePost} from '../../api/post'
    import {trim, ERR_OK} from '../../common/js/util'
    import Tip from '../../base/tip.vue'

    export default {
        name: 'postCreate',
        data() {
            return {
                title: '',
                content: '',
                tipText: '',
                category: '',
                tagsText: '',
                isEdit: !!this.$route.params.postId,
                postId: this.$route.params.postId,
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
            checked() {
                let title = trim(this.title)
                let content = trim(this.content)

                if (!title) {
                    this.showTip('请输入标题')
                    return
                }

                if (!content) {
                    this.showTip('请输入内容')
                    return
                }

                this.send(title, content)
            },
            send(title, content) {
                let sendFunc = this.isEdit ? updatePost : create
                let tagsText = trim(this.tagsText)
                let tags = tagsText ? tagsText.split(/\s+/) : []

                let post = {
                    title,
                    content,
                    postId: this.postId,
                    tags,
                    category: this.category
                }

                sendFunc(post)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            if (this.isEdit) {
                                this.$router.go(-1)
                            } else {
                                this.$router.push('/user/post')
                            }
                        }
                    })
                    .catch(console.log)
            },
            showTip(text) {
                this.tipText = text
                this.tip.show()
            },
            _getRawPost() {
                getRawPost(this.postId)
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            let post = data.data
                            this.content = post.content
                            this.title = post.title
                            this.category = post.category
                            this.tagsText = post.tags.join(' ')
                        }
                    })
                    .catch(console.log)
            },
            setCategory(category) {
                this.category = category
            }
        },
        created() {
            this.isEdit && this._getRawPost()
        },
        mounted() {
            this.tip = this.$refs.tip
        },
        components: {
            Tip,
        }
    }
</script>

<style lang="stylus" scoped>
    .create-wrapper
        padding-top 60px
        width 80%
        margin 0 auto
        .title
            border 1px solid #eeeeee
            border-radius 5px
            width 100%
            height 40px
            font-size 14px
            padding 0 10px
            margin-bottom 20px
            box-sizing border-box
            outline none
            color #333
        .content
            width 100%
            height 150px
            box-sizing border-box
            padding 10px
            margin-bottom 20px
            outline none
            color #333
            border 1px solid #eeeeee
        .categoryList
            font-size 0
            margin-bottom 10px
            .category
                font-size 14px
                display inline-block
                padding 5px
                border 1px solid #cccccc
                border-radius 5px
                margin 0 10px 10px 0
                &.active
                    color #007fff
                    border 1px solid #007fff
        .tags
            width 100%
            height 30px
            font-size 14px
            border none
            border-bottom 1px solid #cccccc
            outline none
            margin-bottom 20px
        .btn
            padding 7px 15px
            font-size 14px
            color #ffffff
            background-color #007fff
            border-radius 5px
            float right

</style>
