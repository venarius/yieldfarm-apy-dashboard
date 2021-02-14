export const state = () => ({
  isLoading: true,
  APYs: []
})

export const mutations = {
  setIsLoading (state, bool) {
    state.isLoading = bool
  },
  setAPYs (state, APYs) {
    state.APYs = APYs
  }
}
