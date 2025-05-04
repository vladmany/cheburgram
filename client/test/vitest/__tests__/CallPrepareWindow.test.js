import { mount } from '@vue/test-utils'
import CallPrepareWindow from 'src/components/CallPrepareWindow.vue'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersStore } from 'stores/users-store'
import {installQuasarPlugin} from "@quasar/quasar-app-extension-testing-unit-vitest";
import {Loading} from "quasar";

installQuasarPlugin({plugins: {Loading}});

describe('CallPrepareWindow.vue', () => {
  const mockCancelCall = vi.fn()
  const mockAcceptCall = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  const mountComponent = (callType = 'out') => {
    return mount(CallPrepareWindow, {
      global: {
        provide: {
          peer: {
            cancelCall: mockCancelCall,
            acceptCall: mockAcceptCall
          }
        },
        plugins: [
          createTestingPinia({
            initialState: {
              users: {
                users: [
                  {
                    id: 'user-1',
                    first_name: 'Alice',
                    last_name: 'Smith',
                    image_url: 'avatar.jpg'
                  }
                ]
              }
            },
            stubActions: false,
            createSpy: vi.fn,
          })
        ],
        stubs: {
          QBtn: {
            props: ['icon'],
            template: `<button @click="$emit('click')" :data-icon="icon"><slot /></button>`
          },
          QSpinnerDots: true
        }
      },
      props: {
        peerId: 'peer-user-1',
        callType
      }
    })
  }

  it('renders user info and spinner for outgoing call', () => {
    const wrapper = mountComponent('out')
    expect(wrapper.text()).toContain('Alice Smith')
    expect(wrapper.find('img').attributes('src')).toBe('avatar.jpg')
    expect(wrapper.findComponent({ name: 'QSpinnerDots' }).exists()).toBe(true)
  })

  it('renders accept and cancel buttons for incoming call', async () => {
    const wrapper = mountComponent('in')
    const acceptBtn = wrapper.find('[data-icon="call"]')
    const cancelBtn = wrapper.find('[data-icon="call_end"]')

    expect(acceptBtn.exists()).toBe(true)
    expect(cancelBtn.exists()).toBe(true)

    await acceptBtn.trigger('click')
    expect(mockAcceptCall).toHaveBeenCalled()

    await cancelBtn.trigger('click')
    expect(mockCancelCall).toHaveBeenCalled()
  })

  it('does not render if user not found', () => {
    const wrapper = mount(CallPrepareWindow, {
      global: {
        provide: {
          peer: {
            cancelCall: mockCancelCall,
            acceptCall: mockAcceptCall
          }
        },
        plugins: [
          createTestingPinia({
            initialState: {
              users: { users: [] }
            },
            createSpy: vi.fn,
          })
        ]
      },
      props: {
        peerId: 'peer-user-999',
        callType: 'in'
      }
    })

    expect(wrapper.find('.call-container').exists()).toBe(false)
  })
})
