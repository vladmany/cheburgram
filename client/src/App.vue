<template>
  <router-view />
</template>

<script setup>
  import {useAuth, useUser} from "@clerk/vue";
  import {provide, ref, watch} from "vue";
  import {getAllUsers} from "src/apollo/requests/user.js";
  import {useUsersStore} from "stores/users-store.js";
  import { useRoute } from 'vue-router';
  import {io} from "socket.io-client";
  import {usePeer} from "src/composables/usePeer.js";
  import {useQuasar} from "quasar";

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  const $q = useQuasar();

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const socket = ref(null);

  const usersStore = useUsersStore();
  const peer = usePeer();

  watch(isLoaded, async (loaded) => {
    if (loaded && isSignedIn) {
      usersStore.setAuthUser(user.value);

      socket.value = io(API_URL, {
        query: {
          userId: user.value.id,
        },
        extraHeaders: {'ngrok-skip-browser-warning': true},
      });

      const users = await getAllUsers();
      usersStore.setUsers(users.users);

      $q.loading.hide();

      setCurrentUser();

      socket.value.on('new-chat', ({userId, chat}) => {
        usersStore.setUserChat(userId, chat);
      });

      socket.value.on('new-message', (message) => {
        usersStore.addChatMessage(message.chat_id, message);
      });

      socket.value.on('online-users', (onlineUsers) => {
        usersStore.setOnlineUsers(onlineUsers);
      });

      socket.value.on('read-message', (messageId) => {
        usersStore.markMessageAsRead(messageId);
      });

      peer.init(user.value.id);
    }
  });

  provide('socket', socket);
  provide('peer', peer);

  const route = useRoute();

  function setCurrentUser() {
    const currentUser = usersStore.findUserByChatId(route.params.id);
    usersStore.setCurrentUserId(currentUser?.id);
  }

  watch(() => route.params.id, () => {
    setCurrentUser();
  });

</script>
