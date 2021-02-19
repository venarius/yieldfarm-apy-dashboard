<template>
  <div class="container mx-auto">
    <loader />
    <div v-if="!isLoading">
      <p class="text-2xl font-semibold text-gray-800 text-center mb-8 title">{{ $t('apyListTitle') }}</p>

      <!-- Search & Sort -->
      <div class="flex mb-2">
        <input v-model="search" type="text" :placeholder="$t('searchPlaceholder')" class="text-input">
      </div>
      <!-- Search & Sort END -->

      <apy-card v-for="(apy, index) in APYs" :key="index" :apy="apy" class="mb-2" />
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
      search: ''
    }
  },
  computed: {
    APYs (): any[] {
      if (this.search) {
        let lookupSyms: string[] = []

        Object.keys(Symbols).forEach((s: string) => {
          // @ts-ignore
          const value: string = Symbols[s]
          if (s.toLowerCase().includes(this.search.toLowerCase()) || value.toLowerCase().includes(this.search.toLowerCase())) { lookupSyms.push(s) }
        })
        console.log(lookupSyms)

        return this.$store.state.apy.APYs.filter((apy: any) => !!lookupSyms.find(s => apy.lpSymbol.toLowerCase().includes(s.toLowerCase())))
      } else {
        return this.$store.state.apy.APYs
      }
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
