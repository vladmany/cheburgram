const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/chat/:id', component: () => import('components/chat/ChatMessages.vue') }
    ]
  },

  // // Always leave this as last one,
  // // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
