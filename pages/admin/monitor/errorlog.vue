<template>
  <div>
    <v-snackbar v-model="snackbar" color="primary" :timeout="3000" :top="true">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">确认</v-btn>
    </v-snackbar>

    <v-toolbar flat>
      <v-toolbar-title>异常日志</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <!-- loading条 -->
      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
      </v-progress-linear>
    </v-toolbar>

          <v-data-table :headers="headers" :items="errorData" :page.sync="pageNum" :items-per-page="itemsPerPage"
                        hide-default-footer class="elevation-1">

            <template v-slot:no-data>
              <v-btn color="primary">没有数据</v-btn>
            </template>
            <template v-slot:item.action="{ item }">
              <v-dialog v-model="errorDialog" max-width="800px">
                <template v-slot:activator="{ on }">
                  <v-btn dark v-on="on" text color="primary">查看详情</v-btn>
                </template>
                <v-card tile>
                  <v-card-title>
                    <span class="headline">{{item.operationContent}}</span>
                  </v-card-title>
                  <v-card-text>{{item.exceptionInfo}}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="errorDialog = false">关闭</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-data-table>

    <div class="text-center pt-2" v-if="pageCount > 0">
      <v-pagination v-model="pageNum" :length="pageCount" :total-visible="7"></v-pagination>
    </div>




  </div>
</template>

<script>
    export default {
        data() {
            return {
                pageNum: 1,
                pageCount: 0,
                itemsPerPage: 10,
                headers: [
                    {
                        text: '日志内容',
                        value: 'operationContent',
                    },
                    {
                        text: '操作账号',
                        value: 'username'
                    },
                    {
                        text: '操作人名字',
                        value: 'nickname'
                    },
                    {
                        text: 'IP',
                        value: 'userIp'
                    },
                    {
                        text: '日志类型',
                        value: 'operationType'
                    },
                    {
                        text: '浏览器',
                        value: 'browser'
                    },
                    {
                        text: '操作时间',
                        value: 'createAt',
                    },
                    {
                        text: '异常详情',
                        value: 'action',
                        sortable: false,
                        align: 'center',
                    },
                ],
                loading: false,
                snackbar: false,
                snackbarText: '',
                search: "",
                keyword: '',
                errorData: [],
                errorDialog: false
            }
        },
        watch: {
            pageNum(val) {
                this.pageNum = val;
                this.getLogList();
            },
        },
        methods: {
            onSearchChanged(e){
                console.log("搜索",e);
                this.keyword = e;
                this.getLogList();
            },
            async getLogList() {
                this.loading = true;
                try {
                    this.$store.commit('setLoading', true);
                    let resp = await this.$http.get(`/log?pageNum=${this.pageNum}&pageSize=5&logType=5&keyword=${this.keyword}`);
                    console.log("log列表", resp.data);
                    this.errorData = resp.data.data;
                    //this.desserts = resp.data.data;
                    //this.pageCount = resp.data.totalPage;
                    this.pageCount = resp.data.totalPage;
                    console.log("log列表  pageCount: ", this.pageCount);
                } catch (e) {
                    console.log("log列表失败", e.response);
                    this.snackbar = true;
                    this.snackbarText = "获取log列表失败";
                } finally {
                    this.loading = false;
                    this.$store.commit('setLoading', false);
                }
            },

        },
        mounted() {
            this.getLogList();
        }
    }
</script>

<style>
</style>
