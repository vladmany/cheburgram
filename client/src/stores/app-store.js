import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    leftDrawerOpen: true,
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
