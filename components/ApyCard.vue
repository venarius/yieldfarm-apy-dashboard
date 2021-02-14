<template>
  <div class="border border-gray-400 p-2 shadow rounded">
    <div class="flex items-center">
      <img :src="`https://bscscan.com/token/images/${apy.imagelink}`">
      <p class="text-lg ml-1">{{ apy.title }}</p>
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
