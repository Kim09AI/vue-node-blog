<template>
    <div>
        <other-header :title="title"></other-header>
        <div>
            <input type="text" placeholder="请输入用户名" v-model="name">
            <input type="text" placeholder="介绍" v-model="describe">
            <input type="file">
            <input type="email" v-model="email">
            <span class="save-btn" @click="checked">保存</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {editUserInfo} from '../../api/user'
    import {ERR_OK, trim} from '../../common/js/util'
    import OtherHeader from '../header/otherHeader'

    export default {
        name: 'edit',
        data() {
            return {
                title: '',
                name: '',
                describe: '',
                avatar: '',
                email: ''
            }
        },
        methods: {
            initUserInfo() {
                let user = this.user

                this.name = user.name
                this.describe = user.describe
                this.avatar = user.avatar
                this.email = user.email
            },
            checkEmail(email) {
                let pattern = /^[\w\d_-]+@[\w\d]{2,4}(.[\w\d]{2,4})+$/
                return pattern.test(email)
            },
            checked() {

            },
            _editUserInfo() {
                editUserInfo()
                    .then(({data}) => {
                        if (data.code === ERR_OK) {

                        }
                    })
                    .catch(console.log)
            }
        },
        created() {
            this.initUserInfo()
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        components: {
            OtherHeader
        }
    }
</script>

<style lang="stylus" scoped>

</style>
