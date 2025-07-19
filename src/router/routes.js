import NotFound404 from '@/components/NotFound404.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import MyColors from '@/components/MyColors.vue'
import CommunityShades from '@/components/CommunityShades.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import Terms from '@/components/Terms.vue'

export default [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      auth: false,
    },
    component: NotFound404,
  },
  {
    path: '/',
    name: 'shade',
    meta: {
      auth: false,
      title: 'Shade',
    },
    component: BaseSelect,
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
  {
    path: '/terms',
    name: 'terms',
    meta: {
      auth: false,
      title: 'Terms of Service',
    },
    component: Terms,
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    meta: {
      auth: false,
      title: 'Privacy Policy',
    },
    component: PrivacyPolicy,
  },
]
