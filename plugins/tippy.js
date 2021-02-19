import Vue from 'vue'
import VueTippy, { TippyComponent } from 'vue-tippy'
import 'tippy.js/themes/light.css'

Vue.use(VueTippy)
Vue.component('tippy', TippyComponent)