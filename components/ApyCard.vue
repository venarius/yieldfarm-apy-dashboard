<template>
  <div class="border border-gray-300 p-4 shadow rounded-lg">
    <div class="flex items-center">
      <img :src="`https://bscscan.com/${token1Image}`" style="height:32px;width:32px;">
      <p class="text-lg ml-1">{{ apy.lpSymbol }}</p>
      {{ apy.apy }}%
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Symbols from '../config/constants/symbols'

export default Vue.extend({
  props: {
    apy: {
      type: Object,
      required: true,
    } as PropOptions<any>
  },
  computed: {
    token1Image (): string {
      return Symbols[this.apy.lpSymbol.split('-')[0].toUpperCase()] ? 'token/images/' + Symbols[this.apy.lpSymbol.split('-')[0].toUpperCase()] + '_32.png' : 'images/main/empty-token.png'
    },
    token2Image (): string {
      return Symbols[this.apy.lpSymbol.split('-')[1].split(' ')[0].toUpperCase()] ? 'token/images/' + Symbols[this.apy.lpSymbol.split('-')[1].split(' ')[0].toUpperCase()] + '_32.png' : 'images/main/empty-token.png'
    }
  }
})
</script>
