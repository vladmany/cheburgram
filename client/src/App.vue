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

  const API_HOST = import.meta.env.VITE_API_HOST ?? 'localhost';
  const API_PORT = import.meta.env.VITE_API_PORT ?? '4000';

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const socket = ref(null);
  const peerData = ref(null);

  const usersStore = useUsersStore();
  const { initPeer, peer, localStream, remoteStream, callUser} = usePeer();

  watch(isLoaded, async (loaded) => {
    if (loaded && isSignedIn) {
      usersStore.setAuthUser(user.value);

      socket.value = io(`http://${API_HOST}:${API_PORT}`, {
        query: {
          userId: user.value.id,
        }
      });

      const users = await getAllUsers();
      usersStore.setUsers(users.users);

      setCurrentUser();

      socket.value.on('new-message', (message) => {
        usersStore.addChatMessage(message.chat_id, message);
      });

      socket.value.on('online-users', (onlineUsers) => {
        usersStore.setOnlineUsers(onlineUsers);
      });

      socket.value.on('read-message', (messageId) => {
        usersStore.markMessageAsRead(messageId);
      });

      initPeer(user.value.id);

      peerData.value = {
        peer,
        localStream,
        remoteStream,
        callUser,
      };
    }
  });

  provide('socket', socket);
  provide('peerData', peerData);

  const route = useRoute();

  function setCurrentUser() {
    const currentUser = usersStore.findUserByChatId(route.params.id);
    usersStore.setCurrentUserId(currentUser?.id);
  }

  watch(() => route.params.id, () => {
    setCurrentUser();
  });

</script>
