<template>
  <div class="thread-create">
    <div class="create-container">
      <h1>发布帖子</h1>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入帖子标题"
            maxlength="100"
            show-word-limit
            class="title-input"
          />
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
        
        <el-form-item label="内容" prop="content">
          <div class="content-editor">
            <el-input 
              v-model="form.content" 
              type="textarea" 
              placeholder="请输入帖子内容"
              :rows="15"
              class="content-textarea"
            />
            <div class="editor-tips">
              <span>请详细描述你的问题或分享，以便获得更好的回复</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="标签" prop="tags">
          <el-select 
            v-model="form.tags" 
            multiple 
            placeholder="请选择标签（可选）"
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
        
        <el-form-item label="附件">
          <el-upload
            class="attachment-upload"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="true"
            multiple
          >
            <el-button type="primary"><el-icon><Upload /></el-icon> 选择文件</el-button>
            <template #tip>
              <div class="upload-tip">
                支持上传图片、文档等文件，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <div class="form-actions">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm">发布帖子</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useForumStore } from '@/stores/forum'
import { Upload } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 状态管理
const forumStore = useForumStore()

// 表单引用
const formRef = ref()

// 响应式数据
const form = reactive({
  title: '',
  category: '',
  content: '',
  tags: [] as string[],
  attachments: [] as any[]
})

// 新标签输入
const newTag = ref('')

// 分类选项
const categories = [
  { value: 'web-security', label: 'Web安全' },
  { value: 'network-security', label: '网络安全' },
  { value: 'cryptography', label: '密码学' },
  { value: 'malware-analysis', label: '恶意软件分析' },
  { value: 'ethical-hacking', label: '道德黑客' },
  { value: 'security-tools', label: '安全工具' },
  { value: 'other', label: '其他' }
]

// 可用标签
const availableTags = [
  { value: 'xss', label: 'XSS' },
  { value: 'csrf', label: 'CSRF' },
  { value: 'sql-injection', label: 'SQL注入' },
  { value: 'rce', label: '远程代码执行' },
  { value: 'pentesting', label: '渗透测试' },
  { value: 'vulnerability', label: '漏洞分析' },
  { value: 'defense', label: '安全防御' },
  { value: 'tools', label: '工具使用' }
]

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ]
}

// 添加标签
const addTag = () => {
  if (newTag.value && !form.tags.includes(newTag.value)) {
    form.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 处理文件变更
const handleFileChange = (file: any) => {
  // 这里应该处理文件上传，暂时只添加到本地
  form.attachments.push(file.raw)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await forumStore.createThread(form)
        ElMessage.success('帖子发布成功')
        router.push('/forum')
      } catch (error) {
        ElMessage.error('发布失败')
        console.error('发布失败:', error)
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
    router.push('/forum')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped lang="scss">
.thread-create {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.create-container {
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
  font-size: 16px;
}

.content-editor {
  position: relative;
}

.content-textarea {
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

.category-select {
  width: 200px;
}

.tags-select {
  margin-bottom: 12px;
}

.new-tag-input {
  width: 100%;
}

.attachment-upload {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

// 响应式设计
@media (max-width: 768px) {
  .thread-create {
    padding: 12px;
  }
  
  .create-container {
    padding: 16px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .content-textarea {
    min-height: 300px;
  }
  
  .category-select {
    width: 100%;
  }
}
</style>
