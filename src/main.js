// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.mixin({
    data() {
        return {
            intoPageCount: 0, // 判断是否是首次进入页面，是则跳过activated
        }
    }
})

Promise.prototype.finally = function(callback) {
    let P = this.constructor
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    )
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
