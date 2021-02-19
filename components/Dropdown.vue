<template>
  <div class="dropdown inline-block relative">
    <button class="font-semibold rounded flex items-center w-full" :class="{ 'focus:outline-none p-0': noOutline, 'p-2': !noOutline }" @click="showDropdown = !showDropdown">
      <slot class="mr-1" name="selected" />
      <svg class="fill-current h-4 w-4 ml-auto dropdown-icon" :class="{ open: showDropdown }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
    </button>
    <ul class="dropdown-menu absolute text-gray-700 pt-1 z-10 right-0 min-w-full shadow bg-white" :class="{ hidden: !showDropdown }">
      <slot name="items" />
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    noOutline: { type: Boolean, default: false }
  },
  data () {
    return {
      showDropdown: false
    }
  },
  mounted () {
    document.addEventListener('click', this.toggleDropdown)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.toggleDropdown)
  },
  methods: {
    hasClass (element: HTMLElement, className: string): any {
      if (element.classList.contains('dropdown-item')) { return true }
      if (element.parentElement) { return this.hasClass(element.parentElement, className) }
    },
    toggleDropdown (event: any) {
      if (!this.$el.contains(event.target) || this.hasClass(event.target, 'dropdown-item')) {
        this.showDropdown = false
      }
    }
  }
})
</script>
