<template>
  <div class="container mx-auto">
    <loader />
    <div v-if="APYs.length > 0">
      <p class="text-2xl font-semibold text-gray-800 text-center mb-8 title">APY live dashboard</p>
      <apy-card v-for="(apy, index) in APYs" :key="index" :apy="apy" class="mb-2" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { fetchAPYs } from '../apy/fetcher'

export default Vue.extend({
  computed: {
    APYs (): any[] {
      return this.$store.state.apy.APYs
    },
    isLoading (): boolean {
      return this.$store.state.apy.isLoading
    }
  },
  async mounted () {
    const apys: any[] = await fetchAPYs()
    this.$store.commit('apy/setAPYs', apys)
    this.$store.commit('apy/setIsLoading', false)
  }
})
</script>
