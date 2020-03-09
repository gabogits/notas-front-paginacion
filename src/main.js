import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
//cada vez que hagamos una solicitud en el backend ya va tener incorporada esta rura 'http://localhost:3000/api' ya no vamos a  tener que rescribirla
axios.defaults.baseURL = 'http://localhost:3000/api';
//axios.defaults.baseURL = 'https://app-mevn-gabo.herokuapp.com/api';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 