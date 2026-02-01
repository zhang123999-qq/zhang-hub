<template>
  <div class="thread-detail">
    <div class="thread-container">
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="!thread" class="error-state">
        <el-empty description="帖子不存在" />
        <el-button @click="goBack">返回论坛</el-button>
      </div>
      
      <div v-else>
        <!-- 帖子内容 -->
        <div class="thread-content">
          <h1 class="thread-title">{{ thread.title }}</h1>
          
          <div class="thread-meta">
            <div class="author-info">
              <el-avatar :size="40" :src="thread.author.avatar" />
              <div class="author-details">
                <span class="author-name">{{ thread.author.username }}</span>
                <span class="post-time">{{ formatTime(thread.createdAt) }}</span>
              </div>
            </div>
            
            <div class="thread-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ thread.viewsCount || 0 }} 浏览</span>
              </div>
              <div class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ thread.repliesCount || 0 }} 回复</span>
              </div>
              <div class="stat-item">
                <el-icon><Thumb /></el-icon>
                <span>{{ thread.likesCount || 0 }} 点赞</span>
              </div>
            </div>
          </div>
          
          <div class="thread-body">
            <p>{{ thread.content }}</p>
          </div>
          
          <div class="thread-actions">
            <el-button @click="likeThread" :type="isLiked ? 'primary' : 'default'">
              <el-icon><Star /></el-icon>
              点赞
            </el-button>
            <el-button @click="shareThread">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
            <el-button v-if="isAuthor" @click="editThread">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button v-if="isAuthor" @click="deleteThread" type="danger">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
        
        <!-- 评论区 -->
        <div class="comments-section">
          <h2>评论 ({{ comments.length }})</h2>
          
          <!-- 发表评论 -->
          <div class="comment-form" v-if="isAuthenticated">
            <el-avatar :size="36" :src="userAvatar" />
            <div class="form-content">
              <el-input
                v-model="newComment"
                type="textarea"
                placeholder="写下你的评论..."
                :rows="3"
              />
              <div class="form-actions">
                <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
                  发表评论
                </el-button>
              </div>
            </div>
          </div>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div 
              v-for="comment in comments" 
              :key="comment.id" 
              class="comment-item"
            >
              <el-avatar :size="32" :src="comment.author.avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author.username }}</span>
                  <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                </div>
                <p class="comment-body">{{ comment.content }}</p>
                <div class="comment-actions">
                  <el-button size="small" @click="likeComment(comment.id)">
              <el-icon><Star /></el-icon>
              {{ comment.likesCount || 0 }}
            </el-button>
                  <el-button size="small" @click="replyToComment(comment.id)">
                    <el-icon><ChatLineRound /></el-icon>
                    回复
                  </el-button>
                  <el-button v-if="isCommentAuthor(comment.author.id)" size="small" type="danger" @click="deleteComment(comment.id)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
                
                <!-- 回复表单 -->
                <div class="reply-form" v-if="replyingTo === comment.id && isAuthenticated">
                  <el-input
                    v-model="replyContent"
                    type="textarea"
                    placeholder="回复此评论..."
                    :rows="2"
                  />
                  <div class="reply-actions">
                    <el-button size="small" @click="cancelReply">取消</el-button>
                    <el-button size="small" type="primary" @click="submitReply(comment.id)">
                      回复
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useForumStore } from '@/stores/forum'
import { useAuthStore } from '@/stores/auth'
import { Loading, View, ChatDotRound, Star, Share, Edit, Delete, ChatLineRound } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 状态管理
const forumStore = useForumStore()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const thread = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref<string | null>(null)
const isLiked = ref(false)

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userAvatar = computed(() => authStore.user?.avatar || '')
const isAuthor = computed(() => {
  if (!thread.value || !authStore.user) return false
  return thread.value.author.id === authStore.user.id
})

// 生命周期
onMounted(() => {
  fetchThreadDetail()
})

// 获取帖子详情
const fetchThreadDetail = async () => {
  const threadId = route.params.id as string
  loading.value = true
  try {
    // 获取帖子信息
    const postDetail = await forumStore.fetchPostDetail(Number(threadId))
    thread.value = postDetail
    
    // 检查是否已点赞
    checkIfLiked()
  } catch (error) {
    ElMessage.error('加载帖子失败')
    console.error('加载帖子失败:', error)
  } finally {
    loading.value = false
  }
}

// 检查是否已点赞
const checkIfLiked = () => {
  // 这里应该检查用户是否已点赞，暂时返回false
  isLiked.value = false
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 点赞帖子
const likeThread = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    // 暂时模拟点赞功能
    isLiked.value = !isLiked.value
    thread.value.like_count = (thread.value.like_count || 0) + (isLiked.value ? 1 : -1)
    ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞成功')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('点赞失败:', error)
  }
}

// 分享帖子
const shareThread = () => {
  // 这里应该实现分享功能
  ElMessage.info('分享功能开发中')
}

// 编辑帖子
const editThread = () => {
  router.push(`/forum/edit/${thread.value.id}`)
}

// 删除帖子
const deleteThread = () => {
  ElMessageBox.confirm('确定要删除这个帖子吗？此操作不可恢复', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await forumStore.deletePost(thread.value.id)
      ElMessage.success('删除成功')
      router.push('/forum')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const comment = await forumStore.createComment({
      post: thread.value.id,
      content: newComment.value
    })
    if (!thread.value.comments) {
      thread.value.comments = []
    }
    thread.value.comments.push(comment)
    thread.value.reply_count = (thread.value.reply_count || 0) + 1
    newComment.value = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error('评论失败')
    console.error('评论失败:', error)
  }
}

// 点赞评论
const likeComment = async (commentId: string) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  try {
    // 暂时模拟点赞功能
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      comment.likesCount = (comment.likesCount || 0) + 1
    }
    ElMessage.success('点赞成功')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('点赞评论失败:', error)
  }
}

// 回复评论
const replyToComment = (commentId: string) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  replyingTo.value = commentId
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async (commentId: string) => {
  if (!replyContent.value.trim()) return
  
  try {
    // 这里应该实现回复功能
    ElMessage.success('回复成功')
    cancelReply()
  } catch (error) {
    ElMessage.error('回复失败')
    console.error('回复失败:', error)
  }
}

// 删除评论
const deleteComment = (commentId: string) => {
  ElMessageBox.confirm('确定要删除这个评论吗？此操作不可恢复', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      // 暂时模拟删除评论功能
      comments.value = comments.value.filter(c => c.id !== commentId)
      thread.value.reply_count = Math.max(0, (thread.value.reply_count || 0) - 1)
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除评论失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 检查是否是评论作者
const isCommentAuthor = (authorId: string) => {
  if (!authStore.user) return false
  return authorId === authStore.user.id
}

// 返回论坛
const goBack = () => {
  router.push('/forum')
}
</script>

<style scoped lang="scss">
.thread-detail {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.thread-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .loading-icon {
      margin-right: 12px;
      font-size: 24px;
      color: #409eff;
    }
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    button {
      margin-top: 24px;
    }
  }
}

.thread-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  .thread-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
  }
  
  .thread-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .author-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .author-name {
          font-weight: 500;
          color: #333;
        }
        
        .post-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .thread-stats {
      display: flex;
      gap: 16px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #666;
      }
    }
  }
  
  .thread-body {
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
  }
  
  .thread-actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
}

.comments-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
  }
}

.comment-form {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  
  .form-content {
    flex: 1;
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  
  .comment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .comment-author {
        font-weight: 500;
        color: #333;
      }
      
      .comment-time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .comment-body {
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    }
    
    .comment-actions {
      display: flex;
      gap: 12px;
      
      button {
        padding: 0 12px;
        font-size: 12px;
      }
    }
  }
}

.reply-form {
  margin-top: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .thread-detail {
    padding: 12px;
  }
  
  .thread-content,
  .comments-section {
    padding: 16px;
  }
  
  .thread-title {
    font-size: 20px !important;
  }
  
  .thread-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .comment-form {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
