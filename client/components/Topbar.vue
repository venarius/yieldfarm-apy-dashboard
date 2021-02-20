<template>
  <div class="topbar">
    <div class="bar px-4 py-2 bg-white border-b border-gray-300 flex items-center justify-between">
      <p class="text-xs text-gray-700 font-light hidden sm:block made-with-love">{{ $t('madeWithLove') }}</p>
      <div class="flex items-center">
        <p class="text-xs text-gray-700 font-light next-refresh">{{ $t('nextRefresh', { seconds: timer }) }}</p>
        <div class="online-dot ml-2 relative">
          <div class="dot absolute inset-0" />
          <div class="pulse-dot absolute inset-0" />
        </div>
      </div>
    </div>
    <div class="bar p-4 bg-white border-b border-gray-300 flex items-center justify-between">
      <div class="flex items-center">
        <img alt="binance logo" src="/img/binance.png" class="mr-2 h-8" />
        <p class="text-xl font-semibold title whitespace-nowrap" v-html="$t('title')" />
      </div>
      <div class="flex items-center">
        <language-selector />
        <darkmode class="ml-2" />
      </div>
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
  computed: {
    selectedProvider (): string {
      return this.$store.state.apy.selectedProvider
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
      const apys: any[] = await fetchAPYs(this.selectedProvider as any)
      this.$store.commit('apy/setAPYs', apys)
    }
  }
})
</script>
