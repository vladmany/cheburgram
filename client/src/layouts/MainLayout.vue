<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <chat-header/>

      <chat-sidebar/>

      <q-page-container>
        <q-page v-if="!isChatActive()" class="flex flex-center">
          <h1 class="text-bold">CheburGram</h1>
        </q-page>
        <template v-if="peerData && (!peerData.localStream && !peerData.remoteStream)">
          <router-view/>
        </template>
        <template v-else>
          <call-window/>
        </template>
      </q-page-container>

      <chat-footer/>
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

export default {
  name: 'WhatsappLayout',
  components: {CallWindow, ChatFooter, ChatHeader, ChatSidebar, SignedOut, RedirectToSignIn },

  setup () {
    const $q = useQuasar();
    const route = useRoute();

    const message = ref('');

    const peerData = inject("peerData");

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
      peerData,
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
