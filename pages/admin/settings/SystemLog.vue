<template>
  <div>
    <v-snackbar v-model="snackbar" color="primary" :timeout="3000" :top="true">
      {{ snackbarText }}
    </v-snackbar>


    <v-card color="basil">
      <v-tabs v-model="tablemodel">
        <v-tab v-for="item in tables" :key="item.name">
          {{ item.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tablemodel">
        <v-tab-item v-for="item in tables" :key="item.name">

          <v-data-table :headers="headers" :items="item.data" :page.sync="pageNum" :items-per-page="itemsPerPage"
                        hide-default-footer class="elevation-1" @page-count="pageCount = $event">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ item.name }}</v-toolbar-title>

                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索日志（根据账号）" single-line
                              hide-details @input="onSearchChanged"></v-text-field>
                <v-spacer></v-spacer>
                <!-- loading条 -->
                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
                </v-progress-linear>

              </v-toolbar>
            </template>

            <template v-slot:no-data>
              <v-btn color="primary">没有数据</v-btn>
            </template>
          </v-data-table>



        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <div class="text-center pt-2" v-if="tables[tablemodel].pageCount > 1">
      <v-pagination v-model="pageNum" :length="tables[tablemodel].pageCount" :total-visible="7"></v-pagination>
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
                        text: '耗时(毫秒)',
                        value: 'runTakes'
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
                ],
                loading: false,
                snackbar: false,
                snackbarText: '',
                search: "",
                tables: [
                    {
                        name: '登录日志',
                        data: [],
                        pageCount: 0,
                    },
                    {
                        name: '操作日志',
                        data: [],
                        pageCount: 0,
                    }
                ],
                tablemodel: 0,
                keyword: '',
            }
        },
        watch: {
            pageNum(val) {
                this.pageNum = val;
                this.getLogList();
            },
            tablemodel(val){
                if(this.tables[val].data.length < 1){
                    this.getLogList();
                }
            }
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
                    let resp = await this.$http.get(`/log?pageNum=${this.pageNum}&pageSize=10&logType=${this.tablemodel===0?0:-1}&keyword=${this.keyword}`);
                    console.log("log列表", resp.data);
                    this.tables[this.tablemodel].data = resp.data.data;
                    //this.desserts = resp.data.data;
                    //this.pageCount = resp.data.totalPage;
                    this.tables[this.tablemodel].pageCount = resp.data.totalPage;

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
