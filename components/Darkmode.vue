<template>
  <div class="text-gray-600 cursor-pointer" @click="toggleDarkmode()">
    <sun-icon v-if="darkModeActive" />
    <moon-icon v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { SunIcon, MoonIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    SunIcon,
    MoonIcon
  },
  computed: {
    darkModeActive: {
      get: function () { return this.$store.state.apy.darkModeActive },
      set: function (val) { this.$store.commit('apy/setDarkModeActive', val) }
    }
  },
  methods: {
    toggleDarkmode () {
      this.darkModeActive = !this.darkModeActive
    }
  }
})
</script>
