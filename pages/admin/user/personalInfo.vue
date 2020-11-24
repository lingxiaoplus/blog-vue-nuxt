<template>
  <v-container>
    <v-row>
      <v-col clos="2">
        <v-card tile elevation="6">
          <v-img src="https://source.unsplash.com/random/600x400" height="194" class="header">
            <v-list-item align="center">
              <v-list-item-content>
                <v-avatar size="60">
                  <img :src="user_info.headPortrait?user_info.headPortrait:'https://cdn.vuetifyjs.com/images/john.jpg'"
                       alt="John">
                </v-avatar>
                <v-list-item-title class="headline white--text">{{user_info.nickname}}</v-list-item-title>
                <v-list-item-subtitle class="white--text">习惯沉默而不停止思考，无力表达却不曾失去态度</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-img>
          <v-card-text>
            蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
          </v-card-text>
          <v-card-text>
            昵称：{{user_info.nickname}}
          </v-card-text>
          <v-card-text>
            电话：{{user_info.phoneNumber}}
          </v-card-text>
          <v-card-text>
            邮箱：{{user_info.email}}
          </v-card-text>
          <v-card-actions>
            <v-dialog v-model="updateInfoDialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn text color="primary" dark v-on="on" v-show="false">更新个人信息</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">更新个人信息</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="昵称" required v-model="user_info.nickname"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Legal last name*"
                          hint="example of persistent helper text"
                          persistent-hint
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="邮箱" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="密码" type="password" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          :items="['0-17', '18-29', '30-54', '54+']"
                          label="Age*"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                          label="Interests"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="updateInfoDialog = false">取消</v-btn>
                  <v-btn color="blue darken-1" text @click="updateInfoDialog = false">确认</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>




      </v-col>
      <v-col cols="7">
        <v-card tile elevation="6" >
          <v-tabs v-model="tablemodel">
            <v-tab v-for="item in tables" :key="item.name">
              {{ item.name }}
            </v-tab>

            <v-tabs-items v-model="tablemodel">
              <v-tab-item>
                <v-flex class="d-flex flex-column mx-6">
                  <v-text-field style="max-width: 260px" label="昵称 (不作为登录使用)" v-model="user_info.nickname"></v-text-field>
                  <v-text-field style="max-width: 260px" label="手机号"></v-text-field>

                  <v-flex class="d-flex flex-row" style="align-items: center">
                    <v-list-item-action-text style="font-size: 16px;margin-right: 10px">性别: </v-list-item-action-text>
                    <v-radio-group v-model="sex" row style="max-width: 260px">
                      <v-radio label="男" value="0" color="primary"></v-radio>
                      <v-radio label="女" value="1" color="primary"></v-radio>
                      <v-radio label="未知" value="2" color="primary"></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <v-btn color="primary" tile small max-width="100px" class="mb-4">保存配置</v-btn>
                </v-flex>
              </v-tab-item>
              <v-tab-item>

                <v-data-table :headers="headers" :items="logList" :page.sync="pageNum" :items-per-page="itemsPerPage"
                              hide-default-footer class="elevation-1">
                  <template v-slot:no-data>
                    <v-btn color="primary">没有数据</v-btn>
                  </template>
                </v-data-table>

                <div class="text-center pt-2" v-if="pageCount > 1">
                  <v-pagination v-model="pageNum" :length="pageCount" :total-visible="7"></v-pagination>
                </div>
              </v-tab-item>


            </v-tabs-items>


          </v-tabs>
        </v-card>
      </v-col>

    </v-row>
  </v-container>

</template>

<script>
    export default {
        data() {
            return {
                tablemodel: 0,
                tables: [{
                    name: '用户资料'
                }, {
                    name: '操作日志'
                },],
                user_info: '',
                updateInfoDialog: false,
                sex: 2,
                pageNum: 1,
                pageCount: 0,
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
                itemsPerPage: 10,
                logList: [],
            }
        },
        watch:{
            pageCount(v){
                console.log("pageCount 改变",v);
            },
            pageNum(){
                this.getLogList();
            },
            tablemodel(v){
                if (v===1){
                    this.getLogList();
                }
            }
        },
        methods: {
            async getLogList() {
                this.loading = true;
                try {
                    this.$store.commit('setLoading', true);
                    let resp = await this.$http.get(`/log?pageNum=${this.pageNum}&pageSize=5&logType=-1&keyword=${this.user_info.username}`);
                    this.logList = resp.data.data;
                    this.pageCount = resp.data.totalPage;
                    //console.log("log列表  totalPage  ", resp.data.totalPage,"  pageCount  ", this.pageCount);
                } catch (e) {
                    console.log("log列表失败", e.response);
                    this.snackbar = true;
                    this.snackbarText = "获取log列表失败";
                } finally {
                    this.loading = false;
                    this.$store.commit('setLoading', false);
                }
            }
        },
        mounted() {

            let user_info = JSON.parse(localStorage.getItem("user_info"));
            console.log("用户信息", user_info);
            this.user_info = user_info;

        }
    }
</script>

<style>
  .header {
    justify-content: center;
    align-items: center;
  }
</style>
