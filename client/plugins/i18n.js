import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locales from '~/locales'
Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  messages: locales
})

export default ({ app }) => {
  app.i18n = i18n
}