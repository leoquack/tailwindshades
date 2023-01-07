const _404 = () => import('@/components/404.vue')
const Shade = () => import('@/components/BaseSelect.vue')
const MyColors = () => import('@/components/MyColors.vue')
const CommunityShades = () => import('@/components/CommunityShades.vue')

export default [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      auth: false,
    },
    component: _404,
  },
  {
    path: '/',
    name: 'shade',
    meta: {
      auth: false,
      title: 'Shade',
    },
    component: Shade,
  },
  {
    path: '/my-colors',
    name: 'my-colors',
    meta: {
      auth: true,
      title: 'My colors',
    },
    component: MyColors,
  },
  {
    path: '/community/shades',
    name: 'community-shades',
    meta: {
      auth: false,
      title: 'Community shades',
    },
    props: {
      mode: 'all',
    },
    component: CommunityShades,
  },
  {
    path: '/community/my-liked-shades',
    name: 'my-liked-shades',
    meta: {
      auth: false,
      title: 'My liked shades',
    },
    props: {
      mode: 'my-liked',
    },
    component: CommunityShades,
  },
]
