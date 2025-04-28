<script setup>
  import {ref} from "vue";
  import {SignIn} from "@clerk/vue";

  const modal = ref(false);
</script>

<template>
  <q-btn @click="modal = true" round flat icon="login" />

  <q-dialog v-model="modal">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Sign In</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <sign-in/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>
