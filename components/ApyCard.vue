<template>
  <div class="border border-gray-300 p-4 shadow rounded-lg">
    <div class="flex items-center">
      <img :src="`https://bscscan.com/token/images/${apy.imagelink}`">
      <p class="text-lg ml-1">{{ apy.title }}</p>
      {{ apy.balance }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { APY } from '../apy/models'

export default Vue.extend({
  props: {
    apy: {
      type: Object,
      required: true,
    } as PropOptions<APY>
  }
})
</script>
