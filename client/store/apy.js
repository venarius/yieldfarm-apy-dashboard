export const state = () => ({
  isLoading: true,
  APYs: [],
  darkModeActive: false
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
  }
}
