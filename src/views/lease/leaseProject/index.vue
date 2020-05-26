<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">项目名称</label>
        <el-input v-model="query.name" clearable placeholder="项目名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="form.startTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="startTime" label="项目开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="项目结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="nowMoney" label="截至目前费用" />
        <el-table-column prop="totalMoney" label="截至结束时费用" />
        <el-table-column prop="remark" label="项目描述" />
        <el-table-column prop="status" label="项目状态">
          <template slot-scope="scope">
            {{ dict.label.lease_project_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','leaseProject:edit','leaseProject:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudLeaseProject from '@/api/leaseProject'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, createBy: null, updateBy: null, createTime: null, updateTime: null, name: null, startTime: null, status: null, endTime: null, nowMoney: null, totalMoney: null, remark: null }
export default {
  name: 'LeaseProject',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['lease_project_status'],
  cruds() {
    return CRUD({ title: '租赁项目', url: 'api/leaseProject', sort: 'id,desc', crudMethod: { ...crudLeaseProject }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'leaseProject:add'],
        edit: ['admin', 'leaseProject:edit'],
        del: ['admin', 'leaseProject:del']
      },
      rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '项目开始时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '项目名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
