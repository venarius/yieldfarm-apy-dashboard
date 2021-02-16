<template>
  <div class="text-gray-600 cursor-pointer" @click="toggleDarkmode()">
    <sun-icon v-if="darkmodeActive" />
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
  data () {
    return {
      darkmodeActive: false
    }
  },
  methods: {
    toggleDarkmode () {
      this.darkmodeActive = !this.darkmodeActive
    }
  }
})
</script>
