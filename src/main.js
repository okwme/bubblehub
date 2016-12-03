import Vue from 'vue'
import App from './App'
var VueFire = require('vuefire')
Vue.use(VueFire)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
