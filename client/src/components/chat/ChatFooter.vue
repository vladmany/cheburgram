<script setup>
import {computed, ref} from "vue";
import {useUsersStore} from "stores/users-store.js";
import {createMessage} from "src/apollo/requests/message.js";

const message = ref('');
const usersStore = useUsersStore();

const currentUser = computed(() => usersStore.getCurrentUser);

const chat = computed(() => currentUser.value?.chat);

async function send() {
  if (message.value.length) {
    createMessage(chat.value.id, message.value)
      .then((response) => {
        usersStore.addChatMessage(chat.value.id, response.createMessage);

        message.value = '';
      });
  }
}
</script>

<template>
  <q-footer>
    <q-toolbar class="chat-toolbar bg-grey-3 text-black row">
      <q-form @submit="send" class="chat-tools row">
        <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
        <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="message" placeholder="Type a message" />
        <q-btn v-if="!message.length" round flat icon="mic" />
        <q-btn v-else type="submit" round flat icon="send" />
      </q-form>
    </q-toolbar>
  </q-footer>
</template>

<style scoped lang="sass">

</style>
