<template>
  <router-view />
</template>

<script setup>
  import {useAuth, useUser} from "@clerk/vue";
  import { provide, watch} from "vue";
  import {getAllUsers} from "src/apollo/requests/user.js";
  import {useUsersStore} from "stores/users-store.js";
  import { useRoute } from 'vue-router';
  import {io} from "socket.io-client";

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const usersStore = useUsersStore();

  watch(isLoaded, async (loaded) => {
    if (loaded && isSignedIn) {
      usersStore.setAuthUser(user.value);

      const socket = io("http://localhost:4000", {
        query: {
          userId: user.value.id,
        }
      });
      provide('socket', socket);

      const users = await getAllUsers();
      usersStore.setUsers(users.users);

      setCurrentUser();

      socket.on('new-message', (message) => {
        usersStore.addChatMessage(message.chat_id, message);
      });

      socket.on('online-users', (onlineUsers) => {
        usersStore.setOnlineUsers(onlineUsers);
      });

      socket.on('read-message', (messageId) => {
        usersStore.markMessageAsRead(messageId);
      });
    }
  });

  const route = useRoute();

  function setCurrentUser() {
    const currentUser = usersStore.findUserByChatId(route.params.id);
    usersStore.setCurrentUserId(currentUser?.id);
  }

  watch(() => route.params.id, () => {
    setCurrentUser();
  });

</script>
