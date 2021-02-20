<template>
  <div class="container mx-auto px-2 md:px-0">
    <loader />
    <div v-if="!isLoading">
      <p class="text-xl text-gray-600 favorites-title">{{ $t('favoritesTitle') }}</p>
      <div :class="{ 'py-24 bg-gray-200 rounded-lg w-full favorites': favoriteAPYs.length === 0 }">
        <p v-if="favoriteAPYs.length === 0" class="text-center text-gray-600 font-light">{{ $t('favoritesEmpty') }}</p>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <apy-card v-for="apy in favoriteAPYs" :key="`favorite${apy.pid}`" :apy="apy" :history="historyData.filter(h => h.lp === `${selectedProvider}:${apy.lpSymbol}`)" />
        </div>
      </div>

      <provider-select class="mt-8" />

      <!-- Search & Sort -->
      <div class="flex mb-2">
        <input v-model="search" aria-label="search" type="text" :placeholder="$t('searchPlaceholder')" class="text-input searchbar bg-gray-300 text-gray-900">
        
        <Dropdown class="sort-dropdown ml-2">
          <div slot="selected">
            <i class="fas fa-sort-amount-down text-gray-800 mr-1"></i>
          </div>
          <div slot="items">
            <li v-for="(sortD, index) in sortDirs" :key="index" class="dropdown-item cursor-pointer" :class="{ 'sort-active': sortDir === sortD }" @click="sortDir = sortD">
              <p>{{ $t(`sorting.${sortD}`) }}</p>
            </li>
          </div>
        </Dropdown>
      </div>
      <!-- Search & Sort END -->

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <apy-card v-show="searchPIDs.length === 0 || searchPIDs.includes(apy.pid)" v-for="apy in APYs" :key="`apy${apy.pid}`" :apy="apy" :history="historyData.filter(h => h.lp === `${selectedProvider}:${apy.lpSymbol}`)" />
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
      sortDirs: ['apyDesc', 'apyAsc', 'nameDesc', 'nameAsc', 'totalDesc', 'totalAsc'],
      sortDir: '',
      historyData: []
    }
  },
  computed: {
    APYs (): any[] {
      let apys = [...this.$store.state.apy.APYs]

      console.log(apys)
      switch (this.sortDir) {
        case 'apyAsc':
        case 'apyDesc': { apys = apys.sort((a: any, b: any) => a.apy.toString().localeCompare(b.apy.toString(), 'en', {numeric: true})); break }
        case 'nameAsc':
        case 'nameDesc': { apys = apys.sort((a: any, b: any) => a.lpSymbol.localeCompare(b.lpSymbol)); break }
        case 'totalAsc':
        case 'totalDesc': { apys = apys.sort((a: any, b: any) => a.tokenAmount.localeCompare(b.tokenAmount, 'en', { numeric: true })); break }
        default: {}
      }

      if (this.sortDir.includes('Desc')) {
        apys = apys.reverse()
      }

      return apys
    },
    searchPIDs (): any[] {
      if (this.search) {
        let lookupSyms: string[] = []

        Object.keys(Symbols).forEach((s: string) => {
          // @ts-ignore
          const value: string = Symbols[s]
          if (s.toLowerCase().includes(this.search.toLowerCase()) || value.toLowerCase().includes(this.search.toLowerCase())) { lookupSyms.push(s) }
        })

        return this.$store.state.apy.APYs.filter((apy: any) => {
          return apy.lpSymbol.toLowerCase().includes(this.search.toLowerCase()) || (lookupSyms.length > 0 && lookupSyms.filter(s => apy.lpSymbol.toLowerCase().includes(s.toLowerCase())).length > 0)
        }).map((apy: any) => apy.pid)
      } else {
        return []
      }
    },
    isLoading (): boolean {
      return this.$store.state.apy.isLoading
    },
    favorites (): string[] {
      return this.$store.state.apy.favorites
    },
    favoriteAPYs (): any[] {
      return this.APYs.filter(a => this.favorites.includes(`${this.selectedProvider}:${a.pid}`))
    },
    selectedProvider (): string {
      return this.$store.state.apy.selectedProvider
    }
  },
  watch: {
    async selectedProvider () {
      this.$store.commit('apy/setIsLoading', true)
      const apys: any[] = await fetchAPYs(this.$store.state.apy.selectedProvider)
      this.$store.commit('apy/setAPYs', apys)
      this.$store.commit('apy/setIsLoading', false)
    }
  },
  async mounted () {
    const response = await fetch('//binance-apy-dashboard-api.piktu.io/history')
    const dat = await response.json()
    this.historyData = dat.history

    const apys: any[] = await fetchAPYs(this.$store.state.apy.selectedProvider)
    this.$store.commit('apy/setAPYs', apys)
    this.$store.commit('apy/setIsLoading', false)
  }
})
</script>
