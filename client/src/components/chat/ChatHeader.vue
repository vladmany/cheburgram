<script setup>
  import {useAppStore} from "stores/app-store.js";
  import {computed, inject} from "vue";
  import {useUsersStore} from "stores/users-store.js";

  const appStore = useAppStore();
  const usersStore = useUsersStore();

  const currentUser = computed(() => usersStore.getCurrentUser);

  const peerData = inject("peerData");
  const currentPeerId = computed(() => `peer-${currentUser.value.id}`);

  function call(voiceOnly = false) {
    peerData.value.callUser(currentPeerId.value);
  }

</script>

<template>
  <q-header elevated>
    <q-toolbar class="bg-grey-3 text-black">
      <q-btn
        round
        flat
        icon="keyboard_arrow_left"
        class="WAL__drawer-open q-mr-sm"
        @click="appStore.toggleLeftDrawerOpen()"
      />

      <q-btn round flat v-if="currentUser">
        <q-avatar>
          <img :src="currentUser.image_url">
        </q-avatar>
      </q-btn>

      <span class="q-subtitle-1 q-pl-md" v-if="currentUser">
        {{ `${currentUser.first_name} ${currentUser.last_name}` }}
      </span>

      <q-space/>
      <template v-if="peerData">
        <q-btn round flat icon="call" @click="call(true)" />
        <q-btn round flat icon="videocam" @click="call(false)" />
      </template>

      <q-btn round flat icon="search" />
      <q-btn round flat>
        <q-icon name="attachment" class="rotate-135" />
      </q-btn>
      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 0]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>Contact data</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Block</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Select messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Silence</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Clear messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Erase messages</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="sass">

</style>
