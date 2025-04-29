import { ref } from 'vue';
import Peer from 'peerjs';

export function usePeer() {
  const peer = ref(null);
  const call = ref(null);
  const localStream = ref(null);
  const remoteStream = ref(null);

  const initPeer = (userId) => {
    const peerId = `peer-${userId}`;
    peer.value = new Peer(peerId);

    peer.value.on('open', (val) => {
      console.log('open', val);
    });

    peer.value.on('call', async (incomingCall) => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      localStream.value = stream;

      incomingCall.answer(stream);

      incomingCall.on('stream', (remoteStreamData) => {
        remoteStream.value = remoteStreamData;
      });

      call.value = incomingCall;
    });
  };

  const callUser = async (otherPeerId) => {
    console.log('Запрашиваю доступ к камере и микрофону...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    console.log('Поток получен:', stream)
    localStream.value = stream;

    const outgoingCall = peer.value.call(otherPeerId, stream);

    outgoingCall.on('stream', (remoteStreamData) => {
      remoteStream.value = remoteStreamData;
    });

    call.value = outgoingCall;
  };

  return {
    peer,
    localStream,
    remoteStream,
    initPeer,
    callUser,
  };
}
