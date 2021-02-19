<template>
  <div>
    <Dropdown>
      <div slot="selected">
        <span :class="`flag-icon flag-icon-${langToFlag($i18n.locale)} mr-1`" />
      </div>
      <div slot="items">
        <li v-for="lang in otherLangs" :key="lang" class="dropdown-item cursor-pointer" @click="selectLang(lang)">
          <span :class="`flag-icon flag-icon-${langToFlag(lang)}`" />
        </li>
      </div>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    otherLangs (): string[] {
      const langs = ['en', 'de']

      const index = langs.indexOf(this.$i18n.locale)
      if (index > -1) {
        langs.splice(index, 1)
      }

      return langs
    }
  },
  methods: {
    selectLang (lang: string) {
      this.$i18n.locale = lang
    },
    langToFlag (lang: keyof { en: 'gb', de: 'de' }): string {
      return { en: 'gb', de: 'de' }[lang]
    }
  }
})
</script>
