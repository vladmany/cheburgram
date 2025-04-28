import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    authUser: null,
    currentUserId: null,
    onlineUsers: [],
  }),

  getters: {
    getUsers: (state) => state.users,
    findUserByChatId: (state) => (chatId) => state.users.find(u => u.chat?.id === chatId),
    getAuthUser: (state) => state.authUser,
    getCurrentUser: (state) => state.users.find(u => u.id === state.currentUserId),
    getOnlineUsers: (state) => state.onlineUsers,
  },

  actions: {
    setUsers(users) {
      this.users = users;
    },
    setUserChat(userId, chat) {
      const userIndex = this.users.findIndex(user => user.id === userId);

      this.users[userIndex].chat = chat;
    },
    setAuthUser(user) {
      this.authUser = user;
    },
    setCurrentUserId(userId) {
      this.currentUserId = userId;
    },
    addChatMessage(chatId, message) {
      const userIndex = this.users.findIndex(u => +u.chat?.id === +chatId);

      this.users[userIndex]?.chat.messages.push(message);
    },
    markMessageAsRead(messageId) {
      const user = this.users.find(u =>
        u.chat?.messages.some(m => m.id == messageId)
      );

      if (user) {
        const message = user.chat.messages.find(m => m.id == messageId);
        if (message) {
          message.read_at = new Date();
        }
      }
    },
    setOnlineUsers(users) {
      this.onlineUsers = users;
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
