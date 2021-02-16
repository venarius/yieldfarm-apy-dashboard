<template>
  <div class="app" :class="{ dark: darkModeActive }">
    <topbar />
    <div class="gradient-top py-8">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    darkModeActive (): boolean {
      return this.$store.state.apy.darkModeActive
    }
  }
})
</script>
