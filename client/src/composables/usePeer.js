import {ref} from 'vue';
import Peer from 'peerjs';

export function usePeer() {
  const instance = ref(null);
  const isLoaded = ref(false);
  const incomingCall = ref(null);
  const outgoingCall = ref(null);
  const localStream = ref(null);
  const remoteStream = ref(null);
  const isCallActive = ref(false);

  const init = (userId) => {
    const peerId = `peer-${userId}`;
    instance.value = new Peer(peerId);

    instance.value.on('open', () => {
      isLoaded.value = true;
    });

    instance.value.on('call', async (call) => {
      incomingCall.value = call;
    });
  };

  async function acceptCall() {
    if (incomingCall.value) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.value = stream;

      incomingCall.value.answer(stream);

      incomingCall.value.on('stream', (remoteStreamData) => {
        remoteStream.value = remoteStreamData;
        isCallActive.value = true;
      });

      incomingCall.value.on('close', () => {
        incomingCall.value = null;
        outgoingCall.value = null;
        reset();
      });
    }
  }

  function cancelCall() {
    if (incomingCall.value) {
      incomingCall.value.close();
    }

    if (outgoingCall.value) {
      outgoingCall.value.close();
    }
  }

  function reset() {
    isCallActive.value = false;
    remoteStream.value = null;
    localStream.value = null;
  }

  const callUser = async (otherPeerId) => {
    if (isCallActive.value)
      return false;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.value = stream;

    outgoingCall.value = instance.value.call(otherPeerId, stream);

    outgoingCall.value.on('stream', (remoteStreamData) => {
      isCallActive.value = true;
      remoteStream.value = remoteStreamData;
    });

    outgoingCall.value.on('close', () => {
      outgoingCall.value = null;
      incomingCall.value = null;
      reset();
    });
  };

  return {
    instance,
    localStream,
    remoteStream,
    init,
    callUser,
    isLoaded,
    isCallActive,
    incomingCall,
    outgoingCall,
    cancelCall,
    acceptCall,
  };
}
