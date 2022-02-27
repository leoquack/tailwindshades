const _404 = resolve => require(['@/components/404.vue'], resolve)
const Shade = resolve => require(['@/components/BaseSelect.vue'], resolve)
const MyColors = resolve => require(['@/components/MyColors.vue'], resolve)
const CommunityShades = resolve => require(['@/components/CommunityShades.vue'], resolve)

export default [
  {
    path: '*',
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
