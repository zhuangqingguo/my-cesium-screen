import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from 'vue-router'
import routes from './routes'
import { useCachedViewStoreHook } from '@/store/modules/cachedView'
import setPageTitle from '@/utils/set-page-title'
import { getToken } from '@/utils/auth' // getToken from cookie

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 哪些需要验证
    if (!getToken()) {
      next({
        path: '/login', // 验证失败要跳转的页面
        query: {
          redirect: to.fullPath // 要传的参数
        }
      })
    } else {
      // token存在条件

      //   // 路由缓存
      //   // useCachedViewStoreHook().addCachedView(to);
      //   // 页面 title
      //   setPageTitle(to.meta.title);
      next()
    }
  } else {
    if (to.path == '/login') {
      if (getToken()) {
        next({
          path: '/home'
        })
      } else {
        next() // 确保一定要调用 next()
      }
    } else {
      next() // 确保一定要调用 next()
    }
  }
})

// router.beforeEach((to: any, from, next) => {
//   // 路由缓存
//   // useCachedViewStoreHook().addCachedView(to);
//   // 页面 title
//   setPageTitle(to.meta.title);
//   next();
// });

// router.afterEach(() => {});

export default router
