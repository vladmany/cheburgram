import { mount, flushPromises } from '@vue/test-utils'
import ChatSidebar from 'components/chat/ChatSidebar.vue'
import { createTestingPinia } from '@pinia/testing'
import { useUsersStore } from 'stores/users-store.js'
import { useAppStore } from 'stores/app-store.js'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import routes from 'src/router/routes.js'
import {installQuasarPlugin} from "@quasar/quasar-app-extension-testing-unit-vitest";
import {Loading} from "quasar";

installQuasarPlugin({plugins: {Loading}});

vi.mock('@clerk/vue', () => ({
  SignedIn: {
    template: '<div><slot /></div>'
  },
  UserButton: {
    template: '<div>UserButton</div>'
  }
}))

vi.mock('src/apollo/requests/chat.js', () => ({
  createChat: vi.fn(() => Promise.resolve({
    createChat: {
      id: '123',
      messages: [],
      participants: [
        { id: '1', user_id: 'user1' },
        { id: '2', user_id: 'authUserId' },
      ]
    }
  }))
}))

describe('ChatSidebar.vue', () => {
  let usersStore
  let appStore

  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  beforeEach(() => {
    router.push('/')
  })

  it('renders user list with correct info and reacts to new chat', async () => {
    const wrapper = mount(ChatSidebar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              users: {
                users: [
                  {
                    id: '1',
                    first_name: 'John',
                    last_name: 'Doe',
                    image_url: 'avatar.jpg',
                    chat: null
                  }
                ],
                authUser: { id: 'authUserId' },
                currentUserId: 'authUserId',
                onlineUsers: ['1']
              },
              app: {
                leftDrawerOpen: true
              }
            },
            stubActions: false,
            createSpy: vi.fn,
          }),
          router
        ],
        stubs: ['router-link', 'router-view', 'SignedIn', 'UserButton']
      }
    })

    usersStore = useUsersStore()
    appStore = useAppStore()

    await flushPromises()

    const userItem = wrapper.find('.q-item')
    expect(userItem.exists()).toBe(true)
    expect(userItem.text()).toContain('John Doe')

    await userItem.trigger('click')
    await flushPromises()

    const chat = usersStore.findUserByChatId('123')
    expect(chat).toBeDefined()
  })
})
