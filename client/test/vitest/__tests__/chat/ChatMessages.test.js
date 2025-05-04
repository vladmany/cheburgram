import { mount, flushPromises } from '@vue/test-utils'
import ChatMessages from 'components/chat/ChatMessages.vue'
import { createTestingPinia } from '@pinia/testing'
import { useUsersStore } from 'stores/users-store.js'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { markAsRead } from 'src/apollo/requests/message.js'
import {installQuasarPlugin} from "@quasar/quasar-app-extension-testing-unit-vitest";
import {Loading} from "quasar";

installQuasarPlugin({plugins: {Loading}});

vi.mock('src/apollo/requests/message.js', () => ({
  markAsRead: vi.fn(() => Promise.resolve())
}))

describe('ChatMessages.vue', () => {
  let usersStore

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders messages and marks incoming ones as read', async () => {
    const authUserId = 'auth-user-id'
    const participantIdMine = 'p1'
    const participantIdOther = 'p2'

    const wrapper = mount(ChatMessages, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: {
                authUser: {
                  id: authUserId,
                  imageUrl: 'auth-avatar.jpg'
                },
                currentUserId: 'current-user-id',
                users: [
                  {
                    id: 'current-user-id',
                    image_url: 'other-avatar.jpg',
                    chat: {
                      id: 'chat-1',
                      messages: [
                        {
                          id: 'm1',
                          text: 'Hello',
                          sent_at: new Date().toISOString(),
                          participant_id: participantIdOther,
                          read_at: null
                        },
                        {
                          id: 'm2',
                          text: 'Hi back!',
                          sent_at: new Date().toISOString(),
                          participant_id: participantIdMine,
                          read_at: new Date().toISOString()
                        }
                      ],
                      participants: [
                        { id: participantIdMine, user_id: authUserId },
                        { id: participantIdOther, user_id: 'current-user-id' }
                      ]
                    }
                  }
                ]
              }
            },
            stubActions: false,
            createSpy: vi.fn,
          })
        ]
      }
    })

    usersStore = useUsersStore()

    await flushPromises()

    const chatMessages = wrapper.findAllComponents({ name: 'QChatMessage' })
    expect(chatMessages.length).toBe(2)
    expect(chatMessages[0].text()).toContain('Hello')
    expect(chatMessages[1].text()).toContain('Hi back!')


    expect(markAsRead).toHaveBeenCalledWith('m1')
    expect(usersStore.markMessageAsRead).toHaveBeenCalledWith('m1')
  })
})
