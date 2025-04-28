<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <chat-header/>

      <chat-sidebar/>

      <q-page-container>
        <q-page v-if="!isChatActive()" class="flex flex-center">
          <h1 class="text-bold">CheburGram</h1>
        </q-page>
        <router-view/>
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
import {ref, computed, provide} from 'vue'
import { RedirectToSignIn, SignedOut } from '@clerk/vue'
import { useRoute } from "vue-router";
import ChatSidebar from "components/chat/ChatSidebar.vue";
import ChatHeader from "components/chat/ChatHeader.vue";
import ChatFooter from "components/chat/ChatFooter.vue";

const conversations = [
  {
    id: 1,
    person: 'Razvan Stoenescu',
    avatar: 'https://cdn.quasar.dev/team/razvan_stoenescu.jpeg',
    caption: 'I\'m working on Quasar!',
    time: '15:00',
    sent: true
  },
  {
    id: 2,
    person: 'Dan Popescu',
    avatar: 'https://cdn.quasar.dev/team/dan_popescu.jpg',
    caption: 'I\'m working on Quasar!',
    time: '16:00',
    sent: true
  },
  {
    id: 3,
    person: 'Jeff Galbraith',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
    caption: 'I\'m working on Quasar!',
    time: '18:00',
    sent: true
  },
  {
    id: 4,
    person: 'Allan Gaunt',
    avatar: 'https://cdn.quasar.dev/team/allan_gaunt.png',
    caption: 'I\'m working on Quasar!',
    time: '17:00',
    sent: true
  }
]

export default {
  name: 'WhatsappLayout',
  components: {ChatFooter, ChatHeader, ChatSidebar, SignedOut, RedirectToSignIn },

  setup () {
    const $q = useQuasar();
    const route = useRoute();

    const message = ref('');

    function isChatActive() {
      return route.name === 'chat';
    }

    provide('isChatActive', isChatActive);

    const style = computed(() => ({
      height: $q.screen.height + 'px'
    }));

    return {
      message,
      conversations,
      style,
      isChatActive,
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
