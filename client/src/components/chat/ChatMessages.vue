<script setup>

</script>

<template>
  <div class="chat-container bg-grey-3">
    <q-scroll-area class="chat-messages">
      <div class="q-pa-md">
        <q-chat-message
          label="Sunday, 19th"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<style scoped lang="sass">
.chat-container
  height: 770px
  display: flex
  overflow: hidden!important

.chat-messages
  display: flex
  flex: 1
  flex-direction: column
  justify-content: flex-end
</style>

<style lang="sass">
.chat-messages .q-scrollarea__content
  display: flex
  flex-direction: column
  justify-content: end
</style>
