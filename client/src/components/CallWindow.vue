<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center z-50">
    <div class="text-white text-xl mb-4">
      {{ callStateText }}
    </div>

    <div class="relative w-full max-w-3xl flex justify-center items-center">
      <video ref="remoteVideo" class="w-3/4 rounded-xl" autoplay playsinline></video>
      <video
        ref="localVideo"
        class="absolute bottom-4 right-4 w-1/4 border-2 border-white rounded-xl shadow-lg"
        autoplay
        playsinline
      ></video>
    </div>

    <div class="mt-6 flex space-x-6">
      <button
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow"
        @click="endCall"
      >
        Завершить
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed, inject} from 'vue';

const localVideo = ref(null);
const remoteVideo = ref(null);

const callStatus = ref('connecting'); // 'connecting', 'ringing', 'in-call'

const peerData = inject('peerData');

const callStateText = computed(() => {
  switch (callStatus.value) {
    case 'connecting':
      return 'Подключение...';
    case 'ringing':
      return 'Дозвон...';
    case 'in-call':
      return 'Разговор активен';
    default:
      return '';
  }
});

watch(peerData, (data) => {
  if (localVideo.value && data.localStream) {
    console.log(111);
    localVideo.value.srcObject = data.localStream;
  }

  if (remoteVideo.value && data.remoteStream) {
    console.log(222);
    localVideo.value.srcObject = data.remoteStream;
  }
}, {deep: true});


function endCall() {
  window.location.reload(); // Быстрое завершение звонка — можно заменить на router push
}
</script>
