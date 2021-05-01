<template>
  <div>
    <v-snackbar v-model="snackbar" color="error" :timeout="3000" :top="true">
      {{ snackbarText }}
    </v-snackbar>

    <v-toolbar flat>
      <v-toolbar-title>定时任务</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row class="pa-2">
      <v-col cols="2">
        <el-input size="small" maxlength="10" v-model="inputKeywork" placeholder="输入定时任务名称搜索">

        </el-input>
      </v-col>
      <v-col cols="4">
        <el-select v-model="triggerState" placeholder="任务状态" size="small">
          <el-option v-for="item in triggerStates" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <v-btn @click="" class="white--text" small tile color="primary" :loading="loading"
               :disabled="loading">
          <v-icon left small>mdi-magnify</v-icon>
          搜索
        </v-btn>
      </v-col>

    </v-row>
    <v-row class="pa-4">
      <v-btn @click="addJobDialog = true" class="ma-2 white--text" small tile color="blue" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-plus</v-icon>
        新增
      </v-btn>

      <v-btn @click="getQuartzJobList" class="ma-2 white--text" small tile color="warning" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-refresh</v-icon>
        刷新
      </v-btn>

      <v-btn @click="onDeleteClick()" class="ma-2 white--text" small tile color="error" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left small>mdi-delete</v-icon>
        删除
      </v-btn>
    </v-row>


    <v-data-table :headers="headers" :items="jobList" :page.sync="pageNum" :items-per-page="itemsPerPage"
                  hide-default-footer class="elevation-1"  :loading="loading">
      <template v-slot:item.triggerState="{ item }">
        <v-chip :color="item.triggerState==='ACQUIRED'?'green':'grey'" dark small>{{ item.triggerState }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn class="ma-2 white--text" text color="primary" @click="startOrPauseJob(item)">{{item.triggerState==='ACQUIRED'?'停止':'启动'}}</v-btn>
        <v-btn class="ma-2 white--text" text color="primary" @click="startJob(item)">立即执行</v-btn>
        <v-btn class="ma-2 white--text" text color="primary" @click="()=>{editJob=true;jobData=item}">编辑</v-btn>
        <v-btn class="ma-2 white--text" text color="primary" @click="deleteJob(item)">删除</v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getQuartzJobList" tile>刷新试试</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2" v-if="pageCount>1">
      <v-pagination v-model="pageNum" :length="pageCount"></v-pagination>

    </div>


    <v-dialog v-model="addJobDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{editJob?'编辑任务':'新增任务'}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-flex class="flex-column">
                  <v-text-field label="请选择任务组" required v-model="jobData.jobGroup"></v-text-field>
                  <v-text-field label="请输入任务名称" required v-model="jobData.jobName"></v-text-field>
                  <v-text-field label="请输入任务类名" required v-model="jobData.jobClassName"></v-text-field>
                  <v-text-field label="请输入cron表达式" required v-model="jobData.cronExpression"></v-text-field>
                  <v-textarea label="请输入参数" required v-model="jobData.oldJobGroup"></v-textarea>
                  <v-textarea label="请输入描述" required v-model="jobData.description"></v-textarea>
                </v-flex>
              </v-col>
              <v-col cols="12">
                <v-btn-toggle v-model="jobData.triggerState" mandatory color="primary" group>
                  <v-btn value="ACQUIRED">正常</v-btn>
                  <v-btn value="WAITING">停止</v-btn>
                </v-btn-toggle>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addJobDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="addJob()">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import exportExcel from '../../../components/ExportExcel.vue'

  export default {
    name: 'storageManage',
    components: {
      'export-excel': exportExcel
    },
    data() {
      return {
        jobData:{
          jobGroup: '',
          jobName: '',
          jobGroup: '',
          description: '',
          jobClassName: '',
          cronExpression: '',
          triggerState: '',
          oldJobName: '',
          oldJobGroup: '',
        },
        triggerStates: ['全部','正常','停止'],
        triggerState: '',
        headers: [
          {
            text: '任务组',
            value: 'jobGroup'
          },
          {
            text: '任务名称',
            value: 'jobName'
          },
          {
            text: '任务类名',
            value: 'jobClassName'
          },
          {
            text: 'cron表达式',
            value: 'cronExpression'
          },
          {
            text: '任务描述',
            value: 'description'
          },
          {
            text: '任务状态',
            value: 'triggerState'
          },
          {
            text: '操作',
            value: 'action',
            sortable: false,
            align: 'center',
          },
        ],

        jobList: [],
        editJob: false,

        startTime: '',
        endTime: '',
        fileList: [],
        suffix: '?imageView2/2/w/240/h/120/format/jpg/q/75|imageslim',
        suffix_720p: '?imageView2/1/w/1280/h/720/format/jpg/q/75',
        suffix_1080p: '?imageView2/1/w/1920/h/1080/format/jpg/q/75',
        loading: false,
        addJobDialog: false,
        fileName: '',
        selectList: [],
        fileInfo: {
          name: '',
          path: '',
          size: ''
        },
        snackbarText: '',
        snackbar: false,
        inputKeywork: '',
        accessKey: '',


        hidePagination: false,
        currentPage: 1,
        total: 0,
        pageNum: 1,
        pageSize: 5,


        //导出表格字段及formatter信息
        exportExcelArry: [{
          prop: 'name',
          label: '文件路径',
          formatterFlag: false
        }, {
          prop: 'mimeType',
          label: '文件类型',
          formatterFlag: false,
          formatterType: 'common-type',
          formatterInfo: [{ value: 0, label: '未完成' }, { value: 1, label: '已完成' }]
        }, {
          prop: 'bucket',
          label: '空间名称',
          formatterFlag: false
        },
          {
            prop: 'size',
            label: '文件大小',
            formatterFlag: false
          },
          {
            prop: 'path',
            label: '文件预览',
            formatterFlag: false
          }
        ],
        //导出excel表格id及excel名称
        exportExcelInfo: {
          excelId: 'record-table',
          excelName: '七牛云存储.xlsx'
        },
        //需要导出的table数据
        tableAllData: [],
        ossProperties: {
          accessKey: '',
          secretKey: '',
          bucketName: '',
          prefixImg: ''
        }
      }
    },
    watch:{
      editJob(value){
        if (value){
          this.addJobDialog = true;
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.selectList = val
      },
      async getQuartzJobList() {
        try {
          this.loading = true;
          this.$store.commit('setLoading', true);
          let response = await this.$http.get("/job/list?pageNum=" + this.pageNum);
          console.log("response : ", response.data);
          this.jobList = response.data.data;
          this.pageCount = response.data.totalPage;
        } catch (e) {
          console.log("获取任务列表失败", e.response.data);
          this.$store.commit('showSnackbar', {
            color: 'error',
            text: e.response.data.message ? e.response.data.message : "获取任务列表失败"
          });
        } finally {
          this.loading = false;
          this.$store.commit('setLoading', false);
        }

      },

      async addJob() {
        try {
          this.loading = true;
          let jobData = Object.assign({}, this.jobData);
          let resp = await this.$http.post('/job/add',jobData)
          this.addJobDialog = false;
          this.jobData = '';
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
          console.log("添加任务失败",e.response.data.message)
        }finally {
          this.loading = false;
        }
      },

      //立即执行
      async startJob(job) {
        try {
          this.loading = true;
          let jobData = Object.assign({}, job);
          let resp = await this.$http.post('/job/do',jobData)
          this.getQuartzJobList();
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
          console.log("执行任务失败",e.response.data.message)
        }finally {
          this.loading = false;
        }
      },
      async pauseJob(job) {
        try {
          this.loading = true;
          let jobData = Object.assign({}, job);
          let resp = await this.$http.post('/job/pause',jobData)
          this.getQuartzJobList();
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
          console.log("暂停任务失败",e.response.data.message)
        }finally {
          this.loading = false;
        }
      },
      //从暂停状态恢复任务
      async recoverJob(job) {
        try {
          this.loading = true;
          let jobData = Object.assign({}, job);
          let resp = await this.$http.post('/job/recover',jobData)
          this.getQuartzJobList();
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
          console.log("恢复任务失败",e.response.data.message)
        }finally {
          this.loading = false;
        }
      },
      async deleteJob(job) {
        try {
          this.loading = true;
          let jobData = Object.assign({}, job);
          let resp = await this.$http.post('/job/delete',jobData)
          this.getQuartzJobList();
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
          console.log("删除任务失败",e.response.data.message)
        }finally {
          this.loading = false;
        }
      },
      startOrPauseJob(item){
        if (item.triggerState==='ACQUIRED'){
          this.pauseJob(item)
        }else {
          this.recoverJob(item)
        }
      },

    },
    mounted() {
      //this.getOssProperties();
      this.getQuartzJobList();
    }
  }
</script>

<style scoped>

</style>
