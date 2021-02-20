<template>
  <div class="container mx-auto">
    <loader />
    <div v-if="!isLoading">
      <p class="text-xl text-gray-600 favorites-title">{{ $t('favoritesTitle') }}</p>
      <div class="rounded-lg bg-gray-200 w-full py-24 favorites">
        <p class="text-center text-gray-600 font-light">{{ $t('favoritesEmpty') }}</p>
      </div>

      <!-- Search & Sort -->
      <div class="flex mb-2 mt-8">
        <input v-model="search" type="text" :placeholder="$t('searchPlaceholder')" class="text-input searchbar">
      </div>
      <!-- Search & Sort END -->

      <div class="grid grid-cols-3 gap-3">
        <apy-card v-show="searchPIDs.length === 0 || searchPIDs.includes(apy.pid)" v-for="(apy, index) in APYs" :key="index" :apy="apy" :history="historyData.filter(h => h.lp === apy.lpSymbol)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Symbols from '../config/constants/symbols'
import { fetchAPYs } from '../apy/fetcher'

export default Vue.extend({
  data () {
    return {
      search: '',
      historyData: []
    }
  },
  computed: {
    APYs (): any[] {
      return this.$store.state.apy.APYs
    },
    searchPIDs (): any[] {
      if (this.search) {
        let lookupSyms: string[] = []

        Object.keys(Symbols).forEach((s: string) => {
          // @ts-ignore
          const value: string = Symbols[s]
          if (s.toLowerCase().includes(this.search.toLowerCase()) || value.toLowerCase().includes(this.search.toLowerCase())) { lookupSyms.push(s) }
        })

        return this.$store.state.apy.APYs.filter((apy: any) => !!lookupSyms.find(s => apy.lpSymbol.toLowerCase().includes(s.toLowerCase()))).map((apy: any) => apy.pid)
      } else {
        return []
      }
    },
    isLoading (): boolean {
      return this.$store.state.apy.isLoading
    }
  },
  async mounted () {
    const response = await fetch('//localhost:8080/history')
    const dat = await response.json()
    this.historyData = dat.history

    const apys: any[] = await fetchAPYs()
    this.$store.commit('apy/setAPYs', apys)
    this.$store.commit('apy/setIsLoading', false)
  }
})
</script>
