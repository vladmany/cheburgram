import { mount } from '@vue/test-utils'
import CallWindow from 'src/components/CallWindow.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {installQuasarPlugin} from "@quasar/quasar-app-extension-testing-unit-vitest";
import {Loading} from "quasar";

installQuasarPlugin({plugins: {Loading}});

describe('CallWindow.vue', () => {
  let mockCancelCall
  let mockReplaceTrack
  let wrapper

  beforeEach(() => {
    Object.defineProperty(global.HTMLMediaElement.prototype, 'srcObject', {
      set() {},
      get() {
        return null
      }
    })

    mockCancelCall = vi.fn()
    mockReplaceTrack = vi.fn()

    const mockAudioTrack = { kind: 'audio', enabled: true }
    const mockVideoTrack = { kind: 'video', enabled: true }

    const mockSenderAudio = { track: mockAudioTrack, replaceTrack: mockReplaceTrack }
    const mockSenderVideo = { track: mockVideoTrack, replaceTrack: mockReplaceTrack }

    wrapper = mount(CallWindow, {
      global: {
        provide: {
          peer: {
            cancelCall: mockCancelCall,
            localStream: {
              value: {
                getAudioTracks: () => [mockAudioTrack],
                getVideoTracks: () => [mockVideoTrack]
              }
            },
            remoteStream: {
              value: {}
            },
            instance: {
              value: {
                connections: {
                  'peer-id': [{
                    peerConnection: {
                      getSenders: () => [mockSenderAudio, mockSenderVideo]
                    }
                  }]
                }
              }
            }
          }
        },
        stubs: {
          QBtn: {
            props: ['icon'],
            template: `<button @click="$emit('click')" :data-icon="icon"><slot /></button>`
          }
        }
      }
    })
  })

  it('renders both video elements', () => {
    const videos = wrapper.findAll('video')
    expect(videos.length).toBe(2)
  })

  it('calls cancelCall when hang up button clicked', async () => {
    const cancelBtn = wrapper.find('[data-icon="call_end"]')
    await cancelBtn.trigger('click')
    expect(mockCancelCall).toHaveBeenCalled()
  })
})
