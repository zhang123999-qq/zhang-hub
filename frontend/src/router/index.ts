import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 页面组件（懒加载）
const Home = () => import('@/views/Home/HomePage.vue')
const Tutorial = () => import('@/views/Home/Tutorial.vue')
const BlogList = () => import('@/views/Blog/BlogList.vue')
const BlogDetail = () => import('@/views/Blog/BlogDetail.vue')
const BlogEditor = () => import('@/views/Blog/BlogEditor.vue')
const ForumList = () => import('@/views/Forum/ForumList.vue')
const ThreadDetail = () => import('@/views/Forum/ThreadDetail.vue')
const ThreadCreate = () => import('@/views/Forum/ThreadCreate.vue')
const ResourceList = () => import('@/views/Resources/ResourceList.vue')
const ResourceDetail = () => import('@/views/Resources/ResourceDetail.vue')
const Login = () => import('@/views/Auth/Login.vue')
const Register = () => import('@/views/Auth/Register.vue')
const UserProfile = () => import('@/views/User/UserProfile.vue')
const UserSettings = () => import('@/views/User/UserSettings.vue')
const AdminDashboard = () => import('@/views/Admin/Dashboard.vue')
const AdminUsers = () => import('@/views/Admin/Users.vue')
const AdminContent = () => import('@/views/Admin/Content.vue')
const NotFound = () => import('@/views/Error/NotFound.vue')
const Forbidden = () => import('@/views/Error/Forbidden.vue')

// 路由定义
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false,
      keepAlive: true,
      showInNav: true
    }
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: Tutorial,
    meta: {
      title: '开发教程',
      requiresAuth: false,
      keepAlive: true,
      showInNav: true
    }
  },
  // 博客路由
  {
    path: '/blog',
    name: 'Blog',
    component: BlogList,
    meta: {
      title: '技术博客',
      requiresAuth: false,
      keepAlive: true,
      showInNav: true
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: BlogDetail,
    props: true,
    meta: {
      title: '文章详情',
      requiresAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/blog/create',
    name: 'BlogCreate',
    component: BlogEditor,
    meta: {
      title: '写文章',
      requiresAuth: true,
      transition: 'slide'
    }
  },
  {
    path: '/blog/edit/:id',
    name: 'BlogEdit',
    component: BlogEditor,
    props: true,
    meta: {
      title: '编辑文章',
      requiresAuth: true
    }
  },
  // 论坛路由
  {
    path: '/forum',
    name: 'Forum',
    component: ForumList,
    meta: {
      title: '安全论坛',
      requiresAuth: false,
      keepAlive: true,
      showInNav: true
    }
  },
  {
    path: '/forum/thread/:id',
    name: 'ThreadDetail',
    component: ThreadDetail,
    props: true,
    meta: {
      title: '帖子详情',
      requiresAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/forum/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    meta: {
      title: '发布帖子',
      requiresAuth: true,
      transition: 'slide'
    }
  },
  // 资源路由
  {
    path: '/resources',
    name: 'Resources',
    component: ResourceList,
    meta: {
      title: '安全资源',
      requiresAuth: false,
      keepAlive: true,
      showInNav: true
    }
  },
  {
    path: '/resources/:id',
    name: 'ResourceDetail',
    component: ResourceDetail,
    props: true,
    meta: {
      title: '资源详情',
      requiresAuth: false
    }
  },
  // 认证路由
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false,
      hideNav: true,
      transition: 'fade'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册',
      requiresAuth: false,
      hideNav: true,
      transition: 'fade'
    }
  },
  // 用户路由
  {
    path: '/user/:username',
    name: 'UserProfile',
    component: UserProfile,
    props: true,
    meta: {
      title: '个人主页',
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: UserSettings,
    meta: {
      title: '设置',
      requiresAuth: true
    }
  },
  // 管理路由
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '仪表板' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { title: '用户管理' }
      },
      {
        path: 'content',
        name: 'AdminContent',
        component: AdminContent,
        meta: { title: '内容管理' }
      }
    ]
  },
  // 错误页面
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      title: '无权限访问',
      requiresAuth: false
    }
  },
  // 重定向
  {
    path: '/home',
    redirect: '/'
  },
  // 404捕获
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 滚动行为
const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }
  
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth'
    }
  }
  
  // 如果是文章/帖子详情页，不滚动到顶部
  if (from.name === 'BlogDetail' || from.name === 'ThreadDetail') {
    return { left: 0, top: 0 }
  }
  
  return { left: 0, top: 0 }
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior
})

// 进度条配置
NProgress.configure({
  showSpinner: false,
  speed: 200,
  trickleSpeed: 50
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - CodeSecHub`
  }
  
  // 检查是否登录
  const isAuthenticated = !!localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // 检查路由是否存在
  if (!to.matched.length) {
    next('/404')
    return
  }
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 结束进度条
  NProgress.done()
  
  // 记录访问历史
  if (to.meta.requiresAuth) {
    const history = JSON.parse(localStorage.getItem('visit_history') || '[]')
    history.push({
      path: to.path,
      title: to.meta.title as string,
      timestamp: Date.now()
    })
    // 只保留最近100条历史记录
    if (history.length > 100) {
      history.splice(0, history.length - 100)
    }
    localStorage.setItem('visit_history', JSON.stringify(history))
  }
})

// 错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  NProgress.done()
})

export default router
