<template>
  <div class="topbar">
    <div class="px-4 py-2 bg-white border-b border-gray-300 flex items-center justify-between">
      <p class="text-xs text-gray-700 font-light">Made with ❤️ for Binance Hackathon: The Future is now</p>
      <p class="text-xs text-gray-700 font-light">Next refresh: {{ timer }} sec(s)</p>
    </div>
    <div class="p-4 bg-white border-b border-gray-300 flex items-center justify-between">
      <p class="text-xl font-bold">YieldFarm Dashboard</p>
      <darkmode />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { fetchAPYs } from '../apy/fetcher'

export default Vue.extend({
  data () {
    return {
      timer: 60,
      timerInterval: setInterval(() => {}, 1000)
    }
  },
  mounted () {
    this.startTimer()
  },
  beforeDestroy () {
    clearInterval(this.timerInterval)
  },
  methods: {
    startTimer () {
      this.timerInterval = setInterval(() => {
        this.timer -= 1
        if (this.timer === -1) {
          this.timer = 60
        }
        if (this.timer === 2) {
          this.refreshAPYs()
        }
      }, 1000, this)
    },
    async refreshAPYs () {
      const apys: any[] = await fetchAPYs()
      this.$store.commit('apy/setAPYs', apys)
    }
  }
})
</script>
