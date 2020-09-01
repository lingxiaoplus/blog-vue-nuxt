<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" :bottom="true">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">确认</v-btn>
    </v-snackbar>
    <v-data-iterator :items="items" :items-per-page.sync="itemsPerPage" :footer-props="{ itemsPerPageOptions }">
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-card>
              <v-list-item>
                <v-list-item-avatar color="grey">
                  <img :src="item.headPortrait" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ item.username }}</v-list-item-title>
                  <!--<v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>-->
                </v-list-item-content>
              </v-list-item>
              <!--<v-card-actions>
                <v-row>
                  <v-col cols="6">
                    <v-avatar style="margin-left: 10px;">
                      <img :src="item.headPortrait" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="6">
                    <v-card-title>
                      {{ item.username }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card-actions>-->

              <v-divider></v-divider>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>昵称:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.nickname }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>电话:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.phoneNum }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>邮箱:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.email }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>用户状态:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-switch v-model="!item.status" @change="enableUser(item)" class="ml-3" color="primary" dense></v-switch>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>用户角色:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-select
                      v-model="item.roles"
                      :items="roleList"
                      item-text="roleName" item-value="id" dense
                      label="角色"
                      multiple
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>

              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <!-- 添加人员 -->
    <v-dialog v-model="openAddDialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" absolute dark fab bottom right color="primary" style="bottom: 20px;">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">添加人员</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="用户名" required v-model="editMember.name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="昵称" hint="这是一个昵称" v-model="editMember.nickname"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="电话号码" hint="请输入11位手机号码" required v-model="editMember.phoneNum"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email" type="email" required v-model="editMember.email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="密码" type="password" required v-model="editMember.password"></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="el-upload__text"><em>点击上传头像</em></div>
                <el-upload
                  action="http://api.lingxiaosuse.cn/upload/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </v-col>
            </v-row>
          </v-container>
          <small>这个世界太奇妙</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="openAddDialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="addMember">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
    export default {
        data: () => ({
            itemsPerPageOptions: [4, 8, 12],
            itemsPerPage: 4,
            items: [],
            editMember: {
                email: "zs@163.com",
                headPortrait: "",
                id: "E61D65F673D54F68B0861025C69773DB",
                name: "张三",
                nickname: '',
                phoneNum: "18888888888",
                password: '',
            },
            loading: false,
            openAddDialog: false,
            dialogImageUrl: '',
            dialogVisible: false,
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'primary',
            roleList: [],
        }),
        methods: {
            async getMembers() {
                let user_info = JSON.parse(localStorage.getItem("user_info"));
                this.loading = true;
                try {
                    let response = await this.$http.get("/user/list", {
                        params: {
                            pageNum: 1,
                            pageSize: 5,
                            userId: user_info.userId,
                        }
                    });
                    console.log("获取人员列表", response.data);
                    this.items = response.data.data;
                } catch (e) {
                    console.log("获取人员列表失败", e);
                } finally {
                    this.loading = false;
                }
            },
            async addMember() {
                this.loading = true;
                this.openAddDialog = false;
                try {
                    let response = await this.$http.post("/member", this.editMember);
                    console.log("添加人员", response.data);
                    this.showSnackBar("添加人员成功", true);
                    this.getMembers();
                } catch (e) {
                    console.log("添加人员失败", e.response.data);
                    this.showSnackBar("添加人员失败", false);
                } finally {
                    this.loading = false;
                }
            },


            async getRoles() {
                try {
                    this.loading = true;
                    let response = await this.$http.get("/role/all?pageNum=1&pageSize=5");
                    console.log("角色 : ", response.data);
                    this.roleList = response.data.data;
                } catch (e) {
                    console.log("获取角色列表失败", e.response.data);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "获取角色列表失败"
                    });
                } finally {
                    this.loading = false;
                }

            },

            async enableUser(item){
                console.log("修改用户状态",item);
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            /**
             * 图片预览
             * @param {Object} file
             */
            handlePictureCardPreview(file) {
                console.log("返回文件上传结果", file.response);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList) {
                //文件上传成功时的钩子
                console.log("文件上传成功时的钩子", response);
                this.editMember.headPortrait = response;
            },
            handleError(err, file, fileList) {
                console.log("文件上传失败时的钩子", err);
                this.showSnackBar("文件上传失败", false);
            },
            showSnackBar(text, success) {
                this.snackbar = true;
                this.snackbarText = text;
                this.snackbarColor = success ? "green" : "red";
            },
        },
        mounted() {
            this.getMembers();
            this.getRoles();
        }
    }
</script>

<style>
</style>
