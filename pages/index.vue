<template>
  <div>
    <loader />
    {{ APYs }}
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
    }
  },
  async mounted () {
    const apys: APY[] = await fetchAPYs()
    this.$store.commit('apy/setAPYs', apys)
    this.$store.commit('apy/setIsLoading', false)
  }
})
</script>
