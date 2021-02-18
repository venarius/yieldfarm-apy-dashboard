<template>
  <div class="border bg-white p-4 shadow-lg rounded-lg apy-card" style="border-color: #eaeaea;">
    <div class="flex items-start justify-between">
      <div class="flex items-center">
        <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
          <img :src="`https://bscscan.com/${token1Image}`" style="height:32px;width:32px;">
        </div>
        <repeat-icon class="mx-2" />
        <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
          <img :src="`https://bscscan.com/${token2Image}`" style="height:32px;width:32px;">
        </div>
      </div>
      <div class="flex items-center">
        <a class="text-lg ml-1 underline" target="_blank" :href="`https://exchange.pancakeswap.finance/#/add/ETH/${apy.address}`">{{ apy.lpSymbol }}</a>
        <a target="_blank" :href="`https://bscscan.com/address/${apy.address}`" class="ml-2"><img src="/img/bscscan.png" class="h-5"></a>
      </div>
    </div>
    <div class="mt-3">
      <p class="font-semibold text-xl text-pink-500">APY: {{ apy.apy ? apy.apy : '--' }}%</p>
      <p>Total: {{ parseInt(apy.tokenAmount).toFixed(2) }}</p>
      <p>Total in quote: {{ parseInt(apy.quoteTokenAmount).toFixed(2) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RepeatIcon } from 'vue-feather-icons'
import { lpSymbolToImage } from '../helpers'

export default Vue.extend({
  components: {
    RepeatIcon
  },
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
