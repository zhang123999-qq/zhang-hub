import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// 全局样式
import './assets/css/global.scss'
import 'normalize.css/normalize.css'

async function bootstrap() {
  // 创建应用实例
  const app = createApp(App)
  
  // 初始化 Pinia (带持久化)
  const pinia = createPinia()
  pinia.use(createPersistedState({
    storage: localStorage,
    key: id => `codesechub-${id}`
  }))
  app.use(pinia)
  
  // 初始化路由
  app.use(router)
  
  // 应用挂载
  app.mount('#app')
  
  // 开发工具
  if (import.meta.env.DEV) {
    console.log(`
      🚀 CodeSecHub 前端已启动
      📁 环境: ${import.meta.env.MODE}
      🌐 API: ${import.meta.env.VITE_API_URL}
      🕒 时间: ${new Date().toLocaleString()}
    `)
  }
}

// 启动应用
bootstrap().catch(error => {
  console.error('应用启动失败:', error)
  
  // 显示启动错误
  const appContainer = document.getElementById('app')
  if (appContainer) {
    appContainer.innerHTML = `
      <div class="startup-error">
        <h2>应用启动失败</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">重新加载</button>
      </div>
    `
  }
})
