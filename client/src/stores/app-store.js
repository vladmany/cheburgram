import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    leftDrawerOpen: false,
  }),

  getters: {

  },

  actions: {
    toggleLeftDrawerOpen() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    setLeftDrawerOpen(val) {
      this.leftDrawerOpen = val;
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
