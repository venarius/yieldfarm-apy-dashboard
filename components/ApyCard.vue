<template>
  <div class="border bg-white p-4 shadow-lg rounded-lg" style="border-color: #eaeaea;">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img :src="`https://bscscan.com/${token1Image}`" style="height:32px;width:32px;">
        <img src="/img/swap.svg" class="mx-3 h-6">
        <img :src="`https://bscscan.com/${token2Image}`" style="height:32px;width:32px;">
      </div>
      <p class="text-lg ml-1">{{ apy.lpSymbol }}</p>
    </div>
    {{ apy.apy }}%
    Total in quote: {{ parseInt(apy.lpTotalInQuoteToken).toFixed(2) }}
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { lpSymbolToImage } from '../helpers'

export default Vue.extend({
  props: {
    apy: {
      type: Object,
      required: true,
    } as PropOptions<any>
  },
  computed: {
    token1Image () {
      return lpSymbolToImage(this.apy.lpSymbol, 0)
    },
    token2Image () {
      return lpSymbolToImage(this.apy.lpSymbol, 1)
    }
  }
})
</script>
