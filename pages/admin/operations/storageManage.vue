<template>
  <div>
    <v-snackbar v-model="snackbar" color="error" :timeout="3000" :top="true">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">确认</v-btn>
    </v-snackbar>

    <v-toolbar flat color="white">
      <v-toolbar-title>存储管理</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-dialog v-model="configDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">七牛云配置</span>
        </v-card-title>
        <v-card-text>
          <v-row style="align-items: center">
            <v-col cols="3">
              <v-card-text>Access Key:</v-card-text>
            </v-col>
            <v-col cols="9">
              <v-text-field disabled label="当前accessKey" required v-model="ossProperties.accessKey"></v-text-field>
            </v-col>
          </v-row>

          <v-row style="align-items: center">
            <v-col cols="3">
              <v-card-text>Secret Key:</v-card-text>
            </v-col>
            <v-col cols="9">
              <v-text-field disabled label="当前Secret Key" required v-model="ossProperties.secretKey"></v-text-field>
            </v-col>
          </v-row>

          <v-row style="align-items: center">
            <v-col cols="3">
              <v-card-text>空间名称:</v-card-text>
            </v-col>
            <v-col cols="9">
              <v-text-field label="请选择空间" required v-model="ossProperties.bucketName"></v-text-field>
            </v-col>
          </v-row>

          <v-row style="align-items: center">
            <v-col cols="3">
              <v-card-text>外链域名:</v-card-text>
            </v-col>
            <v-col cols="9">
              <v-text-field label="当前外链域名" required v-model="ossProperties.prefixImg"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="configDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="pa-2" style="background: white">
      <v-col cols="2">
        <el-input size="small" maxlength="10" v-model="inputKeywork" placeholder="输入文件名称搜索">

        </el-input>
      </v-col>
      <v-col cols="4">
        <el-time-select
          size="small"
          placeholder="起始时间"
          v-model="startTime"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }">
        </el-time-select>
        <el-time-select
          size="small"
          placeholder="结束时间"
          v-model="endTime"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: startTime
    }">
        </el-time-select>
        <v-btn @click="" class="white--text" small tile color="primary" :loading="loading"
               :disabled="loading">
          <v-icon left small>mdi-magnify</v-icon>
          搜索
        </v-btn>
      </v-col>

    </v-row>
    <v-row class="pa-4" style="background: white">
      <v-btn @click="uploadDialog = true" class="ma-2 white--text" small tile color="blue" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-cloud-upload-outline</v-icon>
        上传
      </v-btn>

      <v-btn @click="" class="ma-2 white--text" small tile color="warning" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-refresh</v-icon>
        同步
      </v-btn>

      <v-btn @click="onDeleteClick()" class="ma-2 white--text" small tile color="error" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left small>mdi-delete</v-icon>
        删除
      </v-btn>

      <v-btn @click="configDialog = true" class="ma-2 white--text" small tile color="primary" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-cogs</v-icon>
        配置
      </v-btn>
      <v-btn @click="exportExcelSelect" class="ma-2 white--text" small tile color="success" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-file-export-outline</v-icon>
        导出
      </v-btn>
    </v-row>

    <export-excel ref="myChild"
                  :exportExcelInfo="exportExcelInfo"
                  :tableData="selectList"
                  :exportExcelArry="exportExcelArry">

    </export-excel>
    <el-table :data="fileList" style="width: 100%" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="文件路径" width="180">
      </el-table-column>
      <el-table-column prop="mimeType" label="文件类型" width="180">
      </el-table-column>
      <el-table-column prop="bucket" label="空间名称">
      </el-table-column>
      <el-table-column prop="size" label="文件大小">
      </el-table-column>

      <el-table-column prop="path" label="文件预览">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="图片链接"
            width="240"
            trigger="hover"
            :content="scope.row.path+suffix_720p">

            <el-image slot="reference" style="width: 80px;height: 40px" :src="scope.row.path+suffix" aspect-ratio="2" :preview-src-list="[scope.row.path+suffix_1080p]">
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="primary lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </el-image>
          </el-popover>

          <!--<v-img width="80" height="40" :src="scope.row.path+suffix" aspect-ratio="2">

          </v-img>-->
        </template>
      </el-table-column>

      <el-table-column prop="time" label="创建日期">
      </el-table-column>
    </el-table>


    <div style="width: 100%;display: flex;justify-content: center;margin: 10px;">
      <el-pagination :hide-on-single-page="hidePagination" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
                     layout="prev, pager, next, jumper,sizes, total"
                     :total="total">
      </el-pagination>
    </div>


    <v-dialog v-model="uploadDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">文件上传</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="请输入文件名" required v-model="fileName"></v-text-field>
              </v-col>

              <v-col cols="12">
                <el-upload
                  drag
                  action="http://api.lingxiaomz.top/upload/"
                  :on-preview="handlePictureCardPreview"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :limit="1"
                  multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="uploadDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="uploadFile()">上传</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
    import exportExcel from '../../../components/ExportExcel.vue';

    export default {
        name: "storageManage",
        components: {
            'export-excel': exportExcel
        },
        data() {
            return {
                startTime: '',
                endTime: '',
                fileList: [],
                suffix: '?imageView2/2/w/240/h/120/format/jpg/q/75|imageslim',
                suffix_720p: '?imageView2/1/w/1280/h/720/format/jpg/q/75',
                suffix_1080p: '?imageView2/1/w/1920/h/1080/format/jpg/q/75',
                loading: false,
                uploadDialog: false,
                configDialog: false,
                fileName: "",
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
                    formatterInfo: [{value: 0, label: '未完成'}, {value: 1, label: '已完成'}]
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
                    prefixImg: '',
                },
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.selectList = val;
            },
            async getFileList() {
                try {
                    this.$store.commit('setLoading', true);
                    let resp = await this.$http.get(`/upload/list?pageNum=${this.pageNum}&pageSize=${this.pageSize}`);
                    console.log("", resp.data);
                    this.fileList = resp.data.data;
                    this.tableAllData = resp.data.data;

                    this.total = resp.data.total;
                    this.totalPage = resp.data.totalPage;
                } catch (e) {
                    console.log("异常", e);
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message ? e.response.data.message : "获取文件列表失败";
                } finally {
                    this.$store.commit('setLoading', false);
                }
            },

            async uploadFile() {
                if (!this.fileInfo.path) {
                    this.$message.error("请上传图片，或等图片上传完成");
                    return
                }
                try {
                    let resp = await this.$http.put(`/upload/${this.fileInfo.name}?newName=${this.fileName}`);
                    this.uploadDialog = false;
                    this.$message.success("上传成功");
                    this.getFileList();
                } catch (e) {
                    console.log(e)
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message ? e.response.data.message : "上传文件失败";
                } finally {

                }

            },

            async onDeleteClick() {
                if (this.selectList.length < 1) {
                    this.snackbar = true;
                    this.snackbarText = "请选择要删除的评论";
                    return;
                }
                try {
                    this.loading = true;
                    let resp = await this.$http.delete(`/upload/${this.selectList[0].name}`);
                    console.log("删除成功", resp.data);
                    this.getFileList();
                } catch (e) {
                    console.log("删除评论失败", e);
                    this.$message.error("删除评论失败，请稍后再试")
                } finally {
                    this.loading = false;
                }
            },

            async getOssProperties() {
                try {
                    let resp = await this.$http.get("/upload/oss_properties");
                    this.ossProperties = resp.data.data
                } catch (e) {
                    console.log("获取配置失败", e)
                }
            },

            handlePictureCardPreview(file) {
                console.log("返回文件上传结果", file.response);
                //this.dialogImageUrl = file.url;
                //this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList) {
                //文件上传成功时的钩子
                console.log("文件上传成功时的钩子", response);
                this.fileInfo = response;
                //this.imageUrl = this.fileInfo.path;
            },
            handleError(err, file, fileList) {
                console.log("文件上传失败时的钩子", err);
                this.showSnackBar("文件上传失败", false);
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getFileList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val;
                this.getFileList();
            },

            exportExcelSelect() {
                if (this.selectList.length === 0) {
                    this.$message.info('请勾选导出项');
                    return;
                }
                //将选中项传给this. tableAllData
                this.tableAllData = this.selectList;
                //需要延时调导出方法，为了等待数据初始化到列表中
                setTimeout(() => {
                    this.$refs.myChild.exportExcel();
                }, 500)
            },
        },
        mounted() {
            this.getFileList();
            this.getOssProperties();
        }
    }
</script>

<style scoped>

</style>
