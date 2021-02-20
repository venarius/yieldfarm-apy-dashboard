<template>
  <div class="flex provider-select">
    <div
      v-for="(provider, index) in availableProviders"
      :key="index"
      class="rounded-lg text-sm py-1 px-4 bg-blue-100 mr-2 flex items-center cursor-pointer provider shadow hover:shadow-lg transition duration-200"
      :class="{ 'text-blue-500': selectedProvider === provider, 'text-blue-300': selectedProvider !== provider }"
      @click="selectedProvider = provider"
    >
      <div v-if="selectedProvider === provider" class="h-2 w-2 rounded-full bg-blue-500 mr-2 active-dot" />
      {{ $t(`providers.${provider}`) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      availableProviders: ['pancake', 'dankswap']
    }
  },
  computed: {
    selectedProvider: {
      get: function () { return this.$store.state.apy.selectedProvider },
      set: function (val) { this.$store.commit('apy/setSelectedProvider', val) }
    }
  }
})
</script>