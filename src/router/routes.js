
const routes = [
  {
    path: '/assets',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('pages/assets/Create.vue') },
      { path: ':aid(\\d+)', component: () => import('pages/assets/AssetsDetail.vue') },
      { path: ':aid(\\d+)/edit', component: () => import('pages/assets/EditAsset.vue') },
    ]
  },
  {
    path: '/audit',
    component: () => import('layouts/AuditLayout.vue'),
    children: [
      { path: '', component: () => import('pages/audit/Audit.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('pages/account/Login.vue')
  },
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
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
