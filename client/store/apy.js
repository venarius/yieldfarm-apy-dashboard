export const state = () => ({
  isLoading: true,
  APYs: [],
  darkModeActive: false,
  selectedProvider: 'pancake',
  favorites: localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : []
})

export const mutations = {
  setIsLoading (state, bool) {
    state.isLoading = bool
  },
  setAPYs (state, APYs) {
    state.APYs = APYs
  },
  setDarkModeActive (state, bool) {
    state.darkModeActive = bool
  },
  favorite (state, apy) {
    if (state.favorites.includes(apy)) {
      state.favorites = state.favorites.filter(f => f !== apy)
    } else {
      state.favorites.push(apy)
    }

    localStorage.setItem('favorites', JSON.stringify(state.favorites))
  },
  setSelectedProvider (state, provider) {
    state.selectedProvider = provider
  }
}
