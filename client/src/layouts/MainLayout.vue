<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <template v-if="authUser && users" >
        <chat-header v-if="currentUser" />

        <chat-sidebar/>

        <q-page-container>
          <template v-if="peer.isCallActive.value">
            <call-window/>
          </template>
          <template v-else-if="peer.incomingCall.value || peer.outgoingCall.value">
            <call-prepare-window :peer-id="callPeer" :call-type="callType"/>
          </template>
          <q-page v-if="!isChatActive()" class="flex flex-center">
            <h1 class="text-bold">CheburGram</h1>
          </q-page>
          <template v-else-if="!peer.isCallActive.value && !(peer.incomingCall.value || peer.outgoingCall.value)">
            <router-view/>
          </template>
        </q-page-container>
        <chat-footer v-if="currentUser && !peer.isCallActive.value && !inCall && !outCall"/>
      </template>
    </q-layout>

    <signed-out>
      <redirect-to-sign-in/>
    </signed-out>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import {ref, computed, provide, inject} from 'vue'
import { RedirectToSignIn, SignedOut } from '@clerk/vue'
import { useRoute } from "vue-router";
import ChatSidebar from "components/chat/ChatSidebar.vue";
import ChatHeader from "components/chat/ChatHeader.vue";
import ChatFooter from "components/chat/ChatFooter.vue";
import CallWindow from "components/CallWindow.vue";
import CallPrepareWindow from "components/CallPrepareWindow.vue";
import {useUsersStore} from "stores/users-store.js";

export default {
  name: 'WhatsappLayout',
  components: {CallPrepareWindow, CallWindow, ChatFooter, ChatHeader, ChatSidebar, SignedOut, RedirectToSignIn },

  setup () {
    const $q = useQuasar();
    const route = useRoute();
    const usersStore = useUsersStore();

    const authUser = computed(() => usersStore.getAuthUser);
    const users = computed(() => usersStore.getUsers);
    const currentUser = computed(() => usersStore.getCurrentUser);

    $q.loading.show();

    const message = ref('');

    const peer = inject("peer");

    const callType = computed(() => {
      if (peer.incomingCall.value)
        return 'in';
      else if (peer.outgoingCall.value)
        return 'out';

      return null;
    });

    const callPeer = computed(() => {
      if (peer.incomingCall.value)
        return peer.incomingCall.value.peer;
      else if (peer.outgoingCall.value)
        return peer.outgoingCall.value.peer;

      return null;
    });

    const inCall = computed(() => peer.incomingCall.value);
    const outCall = computed(() => peer.outgoingCall.value);

    function isChatActive() {
      return route.name === 'chat';
    }

    provide('isChatActive', isChatActive);

    const style = computed(() => ({
      height: $q.screen.height + 'px'
    }));

    return {
      message,
      style,
      isChatActive,
      peer,
      callPeer,
      callType,
      inCall,
      outCall,
      authUser,
      users,
      currentUser,
    };
  }
}
</script>

<style lang="sass">

.WAL
  width: 100%

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    border-radius: 5px

  .chat-toolbar
    display: flex
    justify-content: center

  .chat-tools
    width: 100%
    max-width: 950px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
