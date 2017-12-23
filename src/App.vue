<template>
    <div id="app" @click.capture="shouldCheckLoigin">
        <div>
            <router-view name="header" />
            <keep-alive>
                <router-view/>
            </keep-alive>
            <router-view name="footer" />
            <form-popup v-if="!isLogin && showSignPopup" :type="signType"></form-popup>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import formPopup from './components/formPopup/formPopup.vue'
    import {getUserInfo} from './api/user'
    import {ERR_OK, queryByKey} from './common/js/util'

    export default {
        name: 'app',
        computed: {
            ...mapGetters([
                'isLogin',
                'showSignPopup',
                'signType',
                'isPopState'
            ])
        },
        components: {
            formPopup
        },
        created() {
            this._getUserInfo()
            this.redirect()

            // 检测浏览器的前进后退，判断是否需要重新获取数据，false要获取，true不需要
            window.addEventListener('popstate', () => {
                this.setPopState(true)
            })
        },
        methods: {
            redirect() {
                let redirect = queryByKey('redirect')
                redirect && this.$router.push(decodeURIComponent(redirect))
            },
            shouldCheckLoigin(e) { // 全局的检查页面中需要登录才能执行的操作，如关注、收藏、评论等
                let shouldLogin = e.target.getAttribute('data-shouldLogin') === 'true'
                if (shouldLogin && !this.isLogin) {
                    // 弹窗并阻止事件传播
                    this.setSignPopup('signin')
                    e.stopPropagation()
                }
            },
            _getUserInfo() {
                this.isLogin && getUserInfo()
                    .then(({data}) => {
                        if (data.code === ERR_OK) {
                            this.setUserInfo(data.data)
                        }
                    })
                    .catch(console.log)
            },
            ...mapMutations({
                setUserInfo: 'SET_USER_INFO',
                setPopState: 'SET_POP_STATE'
            }),
            ...mapActions([
                'setSignPopup'
            ])
        },
        watch: {
            '$route'() {
                if (this.isPopState) {
                    // 在同步代码后执行，即组件的activated后面，等待activated判断完成，重置isPopState
                    setTimeout(() => {
                        this.setPopState(false)
                    }, 0)
                    return
                }
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
            }
        }
    }
</script>

<style lang="stylus">
    #app
        font-family: 'Avenir', Helvetica, Arial, sans-serif
        -webkit-font-smoothing: antialiased
        -moz-osx-font-smoothing: grayscale
        color: #2c3e50

</style>
