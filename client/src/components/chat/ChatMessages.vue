<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {useUsersStore} from "stores/users-store.js";
import moment from "moment";
import {markAsRead} from "src/apollo/requests/message.js";

const usersStore = useUsersStore();

const scrollArea = ref(null);

const authUser = computed(() => usersStore.getAuthUser);
const currentUser = computed(() => usersStore.getCurrentUser);

const chat = computed(() => {
  const val = currentUser.value?.chat;

  if (val && scrollArea.value) {
    scrollToBottom();

    nextTick(() => val.messages.forEach(m => readMessage(m)));
  }

  return val;
});

function getAuthorUserId(message) {
  const res = chat.value.participants.find(p => p.id == message.participant_id)?.user_id;

  return res;
}

function isOwn(message) {
  return getAuthorUserId(message) == authUser.value.id
}

function dateFormat(timestamp) {
  const time = isNaN(+timestamp) ? timestamp : +timestamp;


  return moment(time).format('h:mm');
}

function scrollToBottom() {
  if (scrollArea.value) {
    scrollArea.value.setScrollPercentage('vertical', 100);
  }
}

function readMessage(message) {
  if (!isOwn(message) && !message.read_at) {
    markAsRead(message.id)
      .then(() => usersStore.markMessageAsRead(message.id));
  }
}

watch(() => chat.value?.messages, (newMessages, oldMessages) => {
  newMessages.forEach(async (newMessage) => {
    readMessage(newMessage);

    if (oldMessages && !oldMessages.find((oldMessage) => oldMessage.id == newMessage.id)) {
      await nextTick(() => scrollToBottom());
    }
  });
}, {deep: true});

// const peerData = inject('peerData');

</script>

<template>
  <div class="chat-container bg-grey-3">
    <q-scroll-area ref="scrollArea" class="chat-messages">
      <div class="q-pa-md" v-if="currentUser && authUser">
<!--        <q-chat-message-->
<!--          label="Sunday, 19th"-->
<!--        />-->
        <q-chat-message
          v-for="message in chat.messages"
          :key="message.id"
          :avatar="isOwn(message) ? authUser.imageUrl : currentUser.image_url"
          :text="[message.text]"
          :sent="isOwn(message)"
          :stamp="dateFormat(message.sent_at)"
        >
          <template v-slot:stamp>
            <div class="flex justify-between">
              <div style="margin-right: 10px">{{ dateFormat(message.sent_at) }}</div>
              <q-icon v-if="isOwn(message) && message.read_at" name="check" size="15px"/>
            </div>
          </template>
        </q-chat-message>
<!--        {{ peerData }}-->
<!--        <q-chat-message-->
<!--          avatar="https://cdn.quasar.dev/img/avatar3.jpg"-->
<!--          :text="['doing fine, how r you?']"-->
<!--          stamp="4 minutes ago"-->
<!--        />-->
      </div>
    </q-scroll-area>
  </div>
</template>

<style scoped lang="sass">
.chat-container
  height: 810px
  display: flex
  overflow: hidden!important
  justify-content: center

.chat-messages
  display: flex
  flex: 1
  flex-direction: column
  justify-content: flex-end
  width: 90%
  max-width: 950px
</style>

<style lang="sass">
.chat-messages .q-scrollarea__content
  display: flex
  flex-direction: column
  justify-content: end
</style>
