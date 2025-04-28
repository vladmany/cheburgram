<script setup>

import { SignedIn, UserButton } from '@clerk/vue'
import {createChat} from "src/apollo/requests/chat.js";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useUsersStore} from "stores/users-store.js";
import {useQuasar} from "quasar";
import {useAppStore} from "stores/app-store.js";
import moment from "moment/moment.js";

const $q = useQuasar();
const router = useRouter();
const appStore = useAppStore();
const usersStore = useUsersStore();

const authUser = computed(() => usersStore.getAuthUser);
const currentUser = computed(() => usersStore.getCurrentUser);

const leftDrawerOpen = computed({
  get() {
    return appStore.leftDrawerOpen;
  },
  set(val) {
    appStore.setLeftDrawerOpen(val);
  }
});
const search = ref('');

const users = computed(() => usersStore.getUsers);

const onlineUsers = computed(() => usersStore.getOnlineUsers);

function checkOnline(userId) {
  return onlineUsers.value.includes(userId);
}

async function newChat(user) {
  $q.loading.show();

  createChat(user.id)
    .then(async (result) => {
      usersStore.setUserChat(user.id, result.createChat);
      await router.push(`/chat/${result.createChat.id}`);
    })
    .finally(() => $q.loading.hide());
}

function getAuthorUserId(chat, message) {
  const res = chat.participants.find(p => p.id == message.participant_id)?.user_id;

  return res;
}

function isOwn(chat, message) {
  return getAuthorUserId(chat, message) == authUser.value.id
}

function formatShortMessage(message) {
  return message.length > 20 ? message.slice(0, 20) + '...' : message;
}

function getUnreadMessages(user) {
  return user.chat?.messages.filter(m => !m.read_at && !isOwn(user.chat, m)) ?? [];
}

function dateFormat(timestamp) {
  const time = isNaN(+timestamp) ? timestamp : +timestamp;


  return moment(time).format('h:mm');
}
</script>

<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    :breakpoint="690"
  >
    <q-toolbar class="bg-grey-3">
      <router-link to="/">
        <q-avatar class="cursor-pointer">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
        </q-avatar>
      </router-link>

      <q-space />

      <signed-in>
        <user-button/>
      </signed-in>

      <q-btn
        round
        flat
        icon="close"
        class="WAL__drawer-close"
        @click="appStore.toggleLeftDrawerOpen()"
      />
    </q-toolbar>

    <q-toolbar class="bg-grey-2">
      <q-input rounded outlined dense class="WAL__field full-width" bg-color="white" v-model="search" placeholder="Search or start a new conversation">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <q-scroll-area style="height: calc(100% - 100px)">
      <q-list>
        <q-item
          v-for="(user) in users"
          :key="user.id"
          clickable
          v-ripple
          v-on:click="!user.chat ? newChat(user) : undefined"
          v-bind:to="user.chat ? `/chat/${user.chat.id}` : undefined"
        >

          <q-item-section class="relative-position" avatar>
            <q-avatar>
                <img :src="user.image_url">
            </q-avatar>
            <div class="absolute absolute-bottom-right" :class="checkOnline(user.id) ? 'bg-green-9' : 'bg-grey-9'" style="width: 15px; height: 15px; border-radius: 50%; margin-right: 12px; border: 2px solid white;"></div>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ `${user.first_name} ${user.last_name}` }}
            </q-item-label>
            <q-item-label class="conversation__summary" caption>
              <span v-if="user.chat && user.chat.messages.length">{{ formatShortMessage(user.chat.messages[user.chat.messages.length-1].text) }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label v-if="user.chat?.messages.length" caption>
              {{ dateFormat(user.chat.messages[user.chat.messages.length-1].send_at) }}
            </q-item-label>
            <template v-if="user.chat?.messages.length">
              <template v-if="getUnreadMessages(user).length && (user.id !== currentUser.id)">
                <div class="flex justify-center" style="width: 20px; height: 20px; background: var(--q-primary); border-radius: 50%; margin-right: 5px;">
                  <span class="text-white text-bold text-center">{{ getUnreadMessages(user).length }}</span>
                </div>
              </template>
              <template v-else><q-icon name="check"/></template>
            </template>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<style scoped lang="sass">

</style>
