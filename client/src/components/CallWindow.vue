<template>
  <div class="call-container bg-grey-4">
    <div class="full-height">
      <div class="full-height flex column justify-start q-pt-lg">
        <div class="flex row justify-center q-gutter-md">
          <div class="video-container">
            <video
              ref="remoteVideo"
              class=""
              autoplay
              playsinline
            ></video>
          </div>
          <div class="video-container">
            <video
              ref="localVideo"
              class=""
              autoplay
              muted
              playsinline
            ></video>
          </div>
        </div>
      </div>
      <div class="flex justify-center q-my-sm q-gutter-x-lg">
        <q-btn @click="toggleMic" push color="white" text-color="black" round :icon="isMicEnabled ? 'mic_off' : 'mic'" size="lg" />
        <q-btn @click="peer.cancelCall" push color="red" text-color="white" icon="call_end" size="lg" />
        <q-btn @click="toggleCam" push color="white" text-color="black" round :icon="isCamEnabled ? 'videocam_off' : 'videocam'" size="lg"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, inject, watch, onMounted} from 'vue';

const localVideo = ref(null);
const remoteVideo = ref(null);

const peer = inject('peer');

const isMicEnabled = ref(peer.localStream.value.getAudioTracks()[0].enabled);
const isCamEnabled = ref(peer.localStream.value.getVideoTracks()[0].enabled);

function toggleMic() {
  peer.instance.value.connections[Object.keys(peer.instance.value.connections)[0]][0].peerConnection.getSenders().forEach(sender => {
    if (sender.track.kind === 'audio') {
      const newAudioTrack = peer.localStream.value.getAudioTracks()[0];
      newAudioTrack.enabled = !isMicEnabled.value;
      sender.replaceTrack(newAudioTrack);
      isMicEnabled.value = newAudioTrack.enabled;
    }
  })
}

function toggleCam() {
  peer.instance.value.connections[Object.keys(peer.instance.value.connections)[0]][0].peerConnection.getSenders().forEach(sender => {
    if (sender.track.kind === 'video') {
      const newVideoTrack = peer.localStream.value.getVideoTracks()[0];
      newVideoTrack.enabled = !isCamEnabled.value;
      sender.replaceTrack(newVideoTrack);
      isCamEnabled.value = newVideoTrack.enabled;
    }
  })
}

watch(() => peer, (p) => {
  if (localVideo.value && p.localStream.value) {
    localVideo.value.srcObject = p.localStream.value;
  }

  if (remoteVideo.value && p.remoteStream.value) {
    remoteVideo.value.srcObject = p.remoteStream.value;
  }
}, {deep: true});


onMounted(() => {
  if (localVideo.value && peer.localStream.value) {
    localVideo.value.srcObject = peer.localStream.value;
  }

  if (remoteVideo.value && peer.remoteStream.value) {
    remoteVideo.value.srcObject = peer.remoteStream.value;
  }
});

</script>

<style scoped lang="sass">
.call-container
  max-height: 100vh - 6
.video-container
  max-width: 100vh
  max-height: 100vh - 67
  height: 100%
  width: 100%
  display: flex
  justify-content: center
  background: #000000
  margin-right: 10px
  margin-left: 25px
  border-radius: 15px
  video
    max-width: inherit
    max-height: inherit
    transform: scaleX(-1)
</style>
