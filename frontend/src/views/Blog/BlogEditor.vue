<template>
  <div class="blog-editor">
    <div class="editor-container">
      <h1>{{ isEditing ? '编辑文章' : '写文章' }}</h1>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入文章标题" 
            maxlength="100"
            show-word-limit
            class="title-input"
          />
        </el-form-item>
        
        <el-form-item label="摘要" prop="summary">
          <el-input 
            v-model="form.summary" 
            type="textarea" 
            placeholder="请输入文章摘要" 
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <div class="content-editor">
            <el-input 
              v-model="form.content" 
              type="textarea" 
              placeholder="请输入文章内容（支持Markdown格式）" 
              :rows="15"
              class="markdown-editor"
            />
            <div class="editor-tips">
              <span>支持Markdown格式</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="标签" prop="tags">
          <el-select 
            v-model="form.tags" 
            multiple 
            placeholder="请选择标签"
            class="tags-select"
          >
            <el-option 
              v-for="tag in availableTags" 
              :key="tag.value" 
              :label="tag.label" 
              :value="tag.value"
            />
          </el-select>
          <div class="tag-input">
            <el-input 
              v-model="newTag" 
              placeholder="输入新标签并按回车添加"
              @keyup.enter="addTag"
              class="new-tag-input"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select 
            v-model="form.category" 
            placeholder="请选择分类"
            class="category-select"
          >
            <el-option 
              v-for="category in categories" 
              :key="category.value" 
              :label="category.label" 
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="封面图">
          <el-upload
            class="cover-upload"
            action="#"
            :auto-upload="false"
            :on-change="handleCoverChange"
            :show-file-list="false"
            accept="image/*"
          >
            <div class="cover-preview" v-if="form.coverImage">
              <img :src="form.coverImage" alt="封面预览" />
              <button type="button" class="remove-cover" @click="form.coverImage = ''">
                &times;
              </button>
            </div>
            <el-button type="primary" v-else>选择封面</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="published">发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <div class="form-actions">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm">
              {{ isEditing ? '更新' : '发布' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBlogStore } from '@/stores/blog'

// 路由
const router = useRouter()
const route = useRoute()

// 状态管理
const blogStore = useBlogStore()

// 表单引用
const formRef = ref()

// 响应式数据
const form = reactive({
  title: '',
  summary: '',
  content: '',
  tags: [] as string[],
  category: '',
  coverImage: '',
  status: 'published'
})

// 新标签输入
const newTag = ref('')

// 可用标签
const availableTags = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'security', label: '网络安全' },
  { value: 'algorithm', label: '算法' },
  { value: 'database', label: '数据库' }
]

// 分类选项
const categories = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'security', label: '网络安全' },
  { value: 'devops', label: 'DevOps' },
  { value: 'other', label: '其他' }
]

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ]
}

// 计算属性
const isEditing = computed(() => !!route.params.id)

// 生命周期
onMounted(() => {
  if (isEditing.value) {
    loadArticle()
  }
})

// 加载文章数据
const loadArticle = async () => {
  try {
    const id = route.params.id as string
    const article = await blogStore.getArticleById(id)
    if (article) {
      form.title = article.title
      form.summary = article.summary
      form.content = article.content
      form.tags = article.tags || []
      form.category = article.category
      form.coverImage = article.coverImage || ''
      form.status = article.status
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
    console.error('加载文章失败:', error)
  }
}

// 添加标签
const addTag = () => {
  if (newTag.value && !form.tags.includes(newTag.value)) {
    form.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 处理封面图变更
const handleCoverChange = (file: any) => {
  // 这里应该处理文件上传，暂时使用本地路径
  form.coverImage = URL.createObjectURL(file.raw)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (isEditing.value) {
          // 更新文章
          await blogStore.updateArticle(route.params.id as string, form)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          await blogStore.createArticle(form)
          ElMessage.success('文章发布成功')
        }
        router.push('/blog')
      } catch (error) {
        ElMessage.error(isEditing.value ? '更新失败' : '发布失败')
        console.error('提交失败:', error)
      }
    }
  })
}

// 取消
const cancel = () => {
  ElMessageBox.confirm('确定要取消吗？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/blog')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped lang="scss">
.blog-editor {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.editor-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 32px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.title-input {
  font-size: 18px;
  font-weight: 600;
}

.content-editor {
  position: relative;
}

.markdown-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  min-height: 400px;
}

.editor-tips {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.tags-select {
  margin-bottom: 12px;
}

.new-tag-input {
  width: 100%;
}

.cover-upload {
  width: 100%;
}

.cover-preview {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-cover {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

// 响应式设计
@media (max-width: 768px) {
  .blog-editor {
    padding: 12px;
  }
  
  .editor-container {
    padding: 20px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .markdown-editor {
    min-height: 300px;
  }
  
  .cover-preview {
    width: 100%;
    height: 150px;
  }
}
</style>
