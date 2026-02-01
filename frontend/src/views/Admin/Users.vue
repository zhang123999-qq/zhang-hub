<template>
  <div class="admin-users">
    <div class="users-header">
      <h1>用户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="users-filters">
      <el-input 
        v-model="searchKeyword" 
        placeholder="搜索用户名或邮箱"
        class="search-input"
        @keyup.enter="searchUsers"
      >
        <template #append>
          <el-button @click="searchUsers"><el-icon><Search /></el-icon></el-button>
        </template>
      </el-input>
      
      <el-select v-model="filterRole" placeholder="按角色筛选" class="role-filter">
        <el-option label="全部" value="" />
        <el-option label="管理员" value="admin" />
        <el-option label="编辑" value="editor" />
        <el-option label="普通用户" value="user" />
      </el-select>
      
      <el-select v-model="filterStatus" placeholder="按状态筛选" class="status-filter">
        <el-option label="全部" value="" />
        <el-option label="活跃" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
    </div>
    
    <!-- 用户列表 -->
    <div class="users-list">
      <el-table :data="users" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">{{ getRoleLabel(scope.row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="160">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginAt" label="最后登录" min-width="160">
          <template #default="scope">
            {{ formatTime(scope.row.lastLoginAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div class="user-actions">
              <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button 
                size="small" 
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                @click="toggleUserStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" :prop="editingUser ? '' : 'password'">
          <el-input 
            v-model="userForm.password" 
            type="password" 
            placeholder="请输入密码" 
            :disabled="!!editingUser"
          />
          <span v-if="editingUser" class="form-tip">留空表示不修改密码</span>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// 分页数据
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 用户数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-01-30T12:00:00Z'
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2026-01-02T00:00:00Z',
    lastLoginAt: '2026-01-29T10:00:00Z'
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-01-03T00:00:00Z',
    lastLoginAt: '2026-01-28T08:00:00Z'
  },
  {
    id: 4,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2026-01-04T00:00:00Z',
    lastLoginAt: '2026-01-20T06:00:00Z'
  },
  {
    id: 5,
    username: 'user3',
    email: 'user3@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-01-05T00:00:00Z',
    lastLoginAt: '2026-01-27T04:00:00Z'
  }
])

// 对话框数据
const userDialogVisible = ref(false)
const editingUser = ref<any>(null)
const userFormRef = ref()

// 用户表单
const userForm = reactive({
  username: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ]
}

// 生命周期
onMounted(() => {
  fetchUsers()
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    // 这里应该从API获取真实数据，暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    pagination.value.total = users.value.length
  } catch (error) {
    ElMessage.error('加载用户失败')
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索用户
const searchUsers = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  fetchUsers()
}

const handleCurrentChange = (current: number) => {
  pagination.value.page = current
  fetchUsers()
}

// 添加用户
const addUser = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  })
  userDialogVisible.value = true
}

// 编辑用户
const editUser = (user: any) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
    status: user.status
  })
  userDialogVisible.value = true
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (editingUser.value) {
          // 更新用户
          const index = users.value.findIndex(u => u.id === editingUser.value.id)
          if (index !== -1) {
            users.value[index] = { ...users.value[index], ...userForm }
          }
          ElMessage.success('用户更新成功')
        } else {
          // 创建用户
          const newUser = {
            id: users.value.length + 1,
            ...userForm,
            createdAt: new Date().toISOString(),
            lastLoginAt: null
          }
          users.value.unshift(newUser)
          ElMessage.success('用户添加成功')
        }
        userDialogVisible.value = false
        fetchUsers()
      } catch (error) {
        ElMessage.error(editingUser.value ? '更新失败' : '添加失败')
        console.error('保存用户失败:', error)
      }
    }
  })
}

// 切换用户状态
const toggleUserStatus = (user: any) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  ElMessageBox.confirm(
    `确定要${newStatus === 'active' ? '启用' : '禁用'}用户 ${user.username} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users.value[index].status = newStatus
      }
      ElMessage.success(`${newStatus === 'active' ? '启用' : '禁用'}成功`)
      fetchUsers()
    } catch (error) {
      ElMessage.error('操作失败')
      console.error('切换状态失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除用户
const deleteUser = (user: any) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${user.username} 吗？此操作不可恢复`,
    '危险',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      users.value = users.value.filter(u => u.id !== user.id)
      ElMessage.success('删除成功')
      fetchUsers()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除用户失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 格式化时间
const formatTime = (time: string | null) => {
  if (!time) return '从未登录'
  return new Date(time).toLocaleString('zh-CN')
}

// 获取角色类型
const getRoleType = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'editor': return 'warning'
    default: return 'info'
  }
}

// 获取角色标签
const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return '管理员'
    case 'editor': return '编辑'
    default: return '普通用户'
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  return status === 'active' ? 'success' : 'danger'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  return status === 'active' ? '活跃' : '禁用'
}
</script>

<style scoped lang="scss">
.admin-users {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.users-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .search-input {
    flex: 1;
    max-width: 400px;
  }
  
  .role-filter,
  .status-filter {
    width: 150px;
  }
}

.users-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  .user-actions {
    display: flex;
    gap: 8px;
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  display: block;
}

// 响应式设计
@media (max-width: 768px) {
  .admin-users {
    padding: 12px;
  }
  
  .users-filters {
    flex-direction: column;
    
    .search-input {
      max-width: none;
    }
    
    .role-filter,
    .status-filter {
      width: 100%;
    }
  }
  
  .users-list {
    padding: 16px;
  }
  
  .user-actions {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>
