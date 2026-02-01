<template>
  <div id="app">
    <!-- 路由切换动画 -->
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="route.meta.transition || 'fade'"
        mode="out-in"
        @before-enter="handleBeforeEnter"
        @after-enter="handleAfterEnter"
      >
        <!-- 保持组件状态 -->
        <keep-alive :include="keepAliveComponents">
          <component 
            :is="Component" 
            :key="route.path"
            class="page-wrapper"
          />
        </keep-alive>
      </transition>
    </router-view>

    <!-- 全局加载指示器 -->
    <div v-if="globalLoading" class="global-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 全局通知 -->
    <teleport to="body">
      <div class="global-notifications">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <p>{{ notification.message }}</p>
          <button @click="removeNotification(notification.id)">&times;</button>
        </div>
      </div>
    </teleport>

    <!-- 返回顶部按钮 -->
    <button 
      v-if="showBackToTop" 
      class="back-to-top"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const showBackToTop = ref(false)
const globalLoading = ref(false)
const notifications = ref<any[]>([])

// 计算属性
const keepAliveComponents = computed(() => [
  'HomePage',
  'BlogList',
  'ForumList',
  'ResourceList'
])

// 生命周期
onMounted(() => {
  setupEventListeners()
})

onUnmounted(() => {
  removeEventListeners()
})

// 事件监听
const setupEventListeners = () => {
  window.addEventListener('scroll', handleScroll)
}

const removeEventListeners = () => {
  window.removeEventListener('scroll', handleScroll)
}

// 事件处理
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBeforeEnter = () => {
  globalLoading.value = true
}

const handleAfterEnter = () => {
  globalLoading.value = false
}

const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

// 添加通知
const addNotification = (type: string, message: string) => {
  const id = Date.now().toString()
  notifications.value.push({ id, type, message })
  
  // 3秒后自动移除
  setTimeout(() => {
    removeNotification(id)
  }, 3000)
}

// 暴露方法
defineExpose({
  addNotification
})
</script>

<style scoped lang="scss">
#app {
  min-height: 100vh;
  position: relative;
}

.page-wrapper {
  min-height: calc(100vh - 60px); // 减去导航栏高度
}

.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-spinner {
    text-align: center;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    p {
      color: #666;
      font-size: 14px;
    }
  }
}

.global-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
  
  .notification {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideIn 0.3s ease;
    
    &.success {
      background-color: #d4edda;
      color: #155724;
    }
    
    &.error {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    &.warning {
      background-color: #fff3cd;
      color: #856404;
    }
    
    &.info {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    
    button {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      margin-left: 16px;
    }
  }
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-5px);
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

// 动画
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .global-notifications {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
