<template>
  <div class="container mx-auto">
    <loader />
    <div v-if="APYs.length > 0">
      <apy-card v-for="(apy, index) in APYs" :key="index" :apy="apy" class="mb-2" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { APY } from '../apy/models'
import { fetchAPYs } from '../apy/fetcher'

export default Vue.extend({
  computed: {
    APYs (): APY[] {
      return this.$store.state.apy.APYs
    },
    isLoading (): boolean {
      return this.$store.state.apy.isLoading
    }
  },
  async mounted () {
    const apys: APY[] = await fetchAPYs()
    this.$store.commit('apy/setAPYs', apys)
    this.$store.commit('apy/setIsLoading', false)
  }
})
</script>
