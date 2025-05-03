<script setup>
import {computed, inject} from "vue";
import {useUsersStore} from "stores/users-store.js";
import {useRouter} from "vue-router";

const props = defineProps({
  peerId: String,
  callType: String,
});

const peer = inject('peer');
const socket = inject('socket');
const usersStore = useUsersStore();

const userId = props.peerId.slice(5);

const user = computed(() => usersStore.getUsers.find(u => u.id === userId));

function cancel() {
  peer.cancelCall();
  window.location.reload();
}
</script>

<template>
  <div v-if="user" class="call-container bg-grey-4">
    <div class="call-prepare flex justify-center items-center">
      <div class="text-center">
        <div class="call-avatar">
          <img :src="user.image_url">
        </div>
        <h4>{{ `${user.first_name} ${user.last_name}` }}</h4>
        <div v-if="callType === 'out'" class="q-pb-lg">
          <q-spinner-dots
            color="grey"
            size="6em"
          />
        </div>
        <div class="q-gutter-x-xl">
          <q-btn @click="peer.acceptCall" v-if="callType === 'in'" push color="green" text-color="white" icon="call" size="xl" />
          <q-btn @click="cancel" push color="red" text-color="white" icon="call_end" size="xl" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.call-container
  height: 100%
  .call-prepare
    height: 100vh - 30
  .call-avatar img
    max-width: 200px
    max-height: 200px
    border-radius: 50%
</style>
