<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">详情</label>
        <el-input v-model="query.name" clearable placeholder="详情" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物料</label>
        <el-input v-model="query.materialsId" clearable placeholder="物料" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属项目</label>
        <el-input v-model="query.leaseProjectId" clearable placeholder="所属项目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
        <el-input v-model="query.status" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <el-row>
        <crudOperation :permission="permission">
          <el-button slot="right" type="danger" @click="endLeaseDetail" class="filter-item" size="mini">租赁结束</el-button>
        </crudOperation>
        
      </el-row>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="详情" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="form.startTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物料" prop="materialsId">
            <!-- <el-input v-model="form.materialsId" style="width: 370px;" /> -->
            <el-select v-model="form.materialsId" placeholder="请选择">
              <el-option
                v-for="item in materialsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" prop="leaseProjectId">
            <el-select v-model="form.leaseProjectId" placeholder="请选择">
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input v-model="form.number" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="初始金额">
            <el-input v-model="form.nowMoney" style="width: 370px;" />
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
        <el-table-column prop="name" label="详情" />
        <el-table-column prop="remark" label="描述" />
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialsId" label="物料" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="nowMoney" label="截至目前时费用" />
        <el-table-column prop="leaseProjectId" label="所属项目" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.lease_project_status[scope.row.status] }}
          </template>
        </el-table-column>
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
        <el-table-column v-permission="['admin','leaseProjectDetail:edit','leaseProjectDetail:del']" label="操作" width="150px" align="center">
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
import crudLeaseProjectDetail from '@/api/leaseProjectDetail'
import crudLeaseProject from '@/api/leaseProject'
import crudLeaseMaterials from '@/api/leaseMaterials'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, createBy: null, updateBy: null, createTime: null, updateTime: null, name: null, remark: null, startTime: null, endTime: null, materialsId: null, nowMoney: null, leaseProjectId: null, status: null, number: null }
export default {
  name: 'LeaseProjectDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['lease_project_status'],
  cruds() {
    return CRUD({ title: '租赁项目明细', url: 'api/leaseProjectDetail', sort: 'id,desc', crudMethod: { ...crudLeaseProjectDetail }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'leaseProjectDetail:add'],
        edit: ['admin', 'leaseProjectDetail:edit'],
        del: ['admin', 'leaseProjectDetail:del']
      },
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '详情不能为空', trigger: 'blur' }
        ],
        materialsId: [
          { required: true, message: '物料不能为空', trigger: 'blur' }
        ],
        leaseProjectId: [
          { required: true, message: '所属项目不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '详情' },
        { key: 'materialsId', display_name: '物料' },
        { key: 'leaseProjectId', display_name: '所属项目' },
        { key: 'status', display_name: '状态' }
      ],
      projectOptions: [],
      materialsOptions: []
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 获取项目列表
    findProjectSelectData() {
      crudLeaseProject.findSelectData().then(res => {
        this.projectOptions = res
      })
    },
    // 获取物料列表
    findMaterialsSelectData() {
      crudLeaseMaterials.findSelectData().then(res => {
        this.materialsOptions = res
      })
    },
    // 结束租赁明细
    endLeaseDetail() {
      const ids = []
      this.crud.selections.forEach(element => {
        console.log(element)
        ids.push(element.id)
      })

      crudLeaseProjectDetail.endDetail(ids).then(res => {
        this.crud.refresh()
      })

    }
  },
  created() {
    this.findProjectSelectData()
    this.findMaterialsSelectData()
  }
}
</script>

<style scoped>

</style>
