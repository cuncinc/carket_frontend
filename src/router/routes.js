
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'account', component: () => import('pages/account/Account.vue') },
      { path: 'settings', component: () => import('pages/settings/Settings.vue') },
    ]
  },

  {
    path: '/login',
    component: () => import('pages/account/Login.vue')
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
