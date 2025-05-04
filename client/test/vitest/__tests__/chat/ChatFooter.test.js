import { mount, flushPromises } from '@vue/test-utils'
import ChatFooter from 'components/chat/ChatFooter.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createMessage } from 'src/apollo/requests/message.js'
import { useUsersStore } from 'stores/users-store.js'
import {installQuasarPlugin} from "@quasar/quasar-app-extension-testing-unit-vitest";
import {Loading} from "quasar";

installQuasarPlugin({plugins: {Loading}});

vi.mock('src/apollo/requests/message.js', () => ({
  createMessage: vi.fn(() => Promise.resolve({
    createMessage: {
      id: 'm1',
      text: 'Test message',
      participant_id: 'p1',
      sent_at: new Date().toISOString()
    }
  }))
}))

describe('ChatFooter.vue', () => {
  let usersStore

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends a message and updates the store', async () => {
    const wrapper = mount(ChatFooter, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: {
                currentUserId: '123',
                users: [
                  {
                    id: '123',
                    chat: {
                      id: 'chat-1',
                      messages: []
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

    const input = wrapper.find('input')
    await input.setValue('Test message')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(createMessage).toHaveBeenCalledWith('chat-1', 'Test message')
    expect(usersStore.addChatMessage).toHaveBeenCalled()
    expect(wrapper.vm.message).toBe('')
  })

  it('does not send empty messages', async () => {
    const wrapper = mount(ChatFooter, {
      global: {
        plugins: [createTestingPinia({createSpy: vi.fn})]
      }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(createMessage).not.toHaveBeenCalled()
  })
})
