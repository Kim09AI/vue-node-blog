import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const Home = () => import('../components/home/home')
const CommonHeader = () => import('../components/header/commonHeader')
const FooterMenu = () => import('../components/footerMenu/footerMenu')
const PostEdit = () => import('../components/post/postEdit')
const PostView = () => import('../components/post/pageView')
const Comment = () => import('../components/comment/comment')
const User = () => import('../components/user/user')
const Category = () => import('../components/category/category')
const UserPost = () => import('../components/user/userPost')
const PostHistory = () => import('../components/user/postHistory')
const Collection = () => import('../components/user/collection')
const FollowAuthor = () => import('../components/user/followAuthor')
const CategoryPost = () => import('../components/category/categoryPost')
const Edit = () => import('../components/user/edit')

Vue.use(Router)

// 检测浏览器的前进后退，判断是否需要重新获取数据，false要获取，true不需要
window.addEventListener('popstate', () => {
    store.commit('SET_POP_STATE', true)
})

const router =  new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        {
            path: '/',
            name: 'home',
            components: {
                default: Home,
                header: CommonHeader,
                footer: FooterMenu
            }
        },
        {
            path: '/post/create',
            name: 'postCreate',
            components: {
                default: PostEdit,
                header: CommonHeader
            },
            meta: {shouldLogin: true}
        },
        {
            path: '/post/:postId/update',
            name: 'postUpdate',
            components: {
                default: PostEdit,
                header: CommonHeader
            },
            meta: {shouldLogin: true}
        },
        {
            path: '/post/:postId',
            name: 'postView',
            components: {
                default: PostView,
                header: CommonHeader
            }
        },
        {
            path: '/post/:postId/comment/:commentId',
            name: 'comment',
            components: {
                default: Comment,
                header: CommonHeader
            }
        },
        {
            path: '/category',
            name: 'category',
            components: {
                default: Category,
                footer: FooterMenu
            }
        },
        {
            path: '/category/:category',
            name: 'categoryPost',
            component: CategoryPost
        },
        {
            path: '/category/:category/post/:postId',
            name: 'categoryPostView',
            components: {
                default: PostView,
                header: CommonHeader
            }
        },
        {
            path: '/user',
            name: 'user',
            components: {
                default: User,
                footer: FooterMenu
            }
        },
        {
            path: '/user/post',
            name: 'userPost',
            component: UserPost,
            meta: {shouldLogin: true}
        },
        {
            path: '/user/history',
            name: 'postHistory',
            component: PostHistory,
            meta: {shouldLogin: true}
        },
        {
            path: '/user/collection',
            name: 'collection',
            component: Collection,
            meta: {shouldLogin: true}
        },
        {
            path: '/user/follow',
            name: 'followAuthor',
            component: FollowAuthor,
            meta: {shouldLogin: true}
        },
        {
            path: '/user/followAuthor/:followAuthor',
            name: 'followAuthorPost',
            component: UserPost,
            meta: {shouldLogin: true}
        },
        {
            path: '/user/edit',
            name: 'edit',
            component: Edit,
            meta: {shouldLogin: true}
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

// 全局的页面级别的登录状态判断
router.beforeEach((to, from, next) => {
    let shouldLogin = to.meta.shouldLogin
    let isLogin = store.getters.isLogin

    if (shouldLogin && !isLogin) {
        store.dispatch('setSignPopup', 'signin')
        next({
            path: from.fullPath,
            query: {redirect: to.fullPath}
        })
    } else {
        next()
    }
})

export default router
