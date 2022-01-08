const _404 = resolve => require(['@/components/404.vue'], resolve)
const Shade = resolve => require(['@/components/BaseSelect.vue'], resolve)
const MyColors = resolve => require(['@/components/MyColors.vue'], resolve)

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
]
