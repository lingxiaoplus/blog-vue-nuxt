<template>

  <div>

    <v-row class="pa-4">

      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">

          <v-btn v-on="on" @click="editedIndex = -1" class="ma-2 white--text" small tile color="blue" :loading="loading"
                 :disabled="loading">
            <v-icon left small>mdi-plus</v-icon>
            新增
          </v-btn>

        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field prepend-icon="mdi-account" v-model="editedItem.roleName" label="角色名称"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field prepend-icon="mdi-cctv" v-model="editedItem.roleTag" label="权限"></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-subheader class="pl-0">角色级别</v-subheader>
                  <v-slider
                    v-model="editedItem.roleLevel"
                    thumb-label
                  ></v-slider>
                </v-col>
                <v-col cols="12">
                  <v-textarea outlined clearable label="角色描述" v-model="editedItem.roleDescription"></v-textarea>
                </v-col>



              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="()=>{ dialog = false; editedItem = {} }">取消</v-btn>
            <v-btn color="blue darken-1" text @click="saveRole">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-btn class="ma-2 white--text" small tile color="error" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left small>mdi-delete</v-icon>
        删除
      </v-btn>

      <v-btn class="ma-2 white--text" small tile color="success" :loading="loading"
             :disabled="loading">
        <v-icon left small>mdi-file-export-outline</v-icon>
        导出
      </v-btn>
    </v-row>

    <v-row>
      <v-col cols="8">
        <div>
          <v-data-table :headers="headers" :items="desserts" :page.sync="pageNum" :items-per-page="itemsPerPage"
                        hide-default-footer class="elevation-1" @page-count="pageCount = $event" @click:row="clickTableRow">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>角色管理</v-toolbar-title>

                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <!-- loading条 -->
                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
                </v-progress-linear>

              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">

              <v-icon
                small
                color="primary"
                class="mr-2"
                @click="editItem(item)"
              >mdi-pencil
              </v-icon>
              <v-icon
                small
                color="primary"
                @click="deleteItem(item)"
              >mdi-delete
              </v-icon>

            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="getRoles" tile>刷新试试</v-btn>
            </template>
          </v-data-table>
          <div class="text-center pt-2"  v-if="pageCount>1">
            <v-pagination v-model="pageNum" :length="pageCount"></v-pagination>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <v-card tile>
          <v-card-text>菜单分配</v-card-text>
          <v-card-actions>
            <v-treeview
              style="width: 100%"
              selectable
              selected-color="primary"
              open-on-click
              hoverable
              @input="selectEvent"
              :items="menuTree"
              item-key="id"
              v-model="selectedMenu"
            ></v-treeview>
          </v-card-actions>
          <v-card-actions>
            <v-row
              align="center"
              justify="end"
            ><v-btn class="mr-2" color="primary" tile @click="updateRoleMenu()" :loading="loading">保存</v-btn></v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>



    <v-row justify="center">
      <v-dialog v-model="deleteDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">确认要删除这一条记录吗?</v-card-title>
          <!--<v-card-text>删除之后数据就不存在了</v-card-text>-->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteDialog = false">取消</v-btn>
            <v-btn color="green darken-1" text @click="deleteProduct">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
                        text: '角色名称',
                        value: 'roleName'
                    },
                    {
                        text: '角色描述',
                        value: 'roleDescription'
                    },
                    {
                        text: '角色权限',
                        value: 'roleTag'
                    },
                    {
                        text: '角色级别',
                        value: 'roleLevel'
                    },
                    {
                        text: '操作',
                        value: 'action',
                        sortable: false,
                    },
                ],
                desserts: [],
                editedItem: {
                    roleName: '',
                    roleDescription: '',
                    roleTag: '',
                },
                dialog: false,
                editedIndex: -1,
                deleteDialog: false,
                selectDate: new Date().toISOString().substr(0, 10),
                dateMenu: false,
                loading: false,
                productId: '',  //当前线路的id
                on: false,
                search: '',
                loading:false,
                selectList: [],
                menuTree: [],
                selectedMenu: [],
                role: '',
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '添加角色' : '编辑角色'
            },
        },
        watch: {
            pageNum(val) {
                console.log("监听到页数发生变化", val);
                this.pageNum = val;
                this.getRoles();
            },
            menuTree(val){
                console.log("选择", val);
            }
        },
        methods: {
            itemClick(e) {
                console.log("点击", e);
            },
            clickTableRow(row){
                console.log("点击列",row.menuList);
                this.selectedMenu = row.menuList;
                this.role = row;
            },
            selectEvent(e){
                console.log("选择",this.selectedMenu)
            },
            editItem(e) {
                this.editedIndex = 1;
                this.editedItem = Object.assign({}, e);
                this.editedItem.departureTime = e.dateFormat; //这里要注意一下
                this.dialog = true;
                console.log("点击", e);
            },
            deleteItem(e) {
                this.deleteDialog = true;
                console.log("点击", e);
                this.productId = e.id;
            },
            onSelectDate(date) {
                this.dateMenu = false;
                this.editedItem.departureTime = date;
                console.log("选择时间", date);
            },
            async getRoles() {
                try {
                    this.loading = true;
                    let response = await this.$http.get("/role/all?pageNum=" + this.pageNum + "&pageSize=" + 5);
                    console.log("角色 : ", response.data);
                    this.desserts = response.data.data;
                    //let page = parseInt(response.data.total / this.itemsPerPage) + 1;
                    //console.log("page:", page)
                    this.pageCount = response.data.totalPage;
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
            async saveRole() {
                this.dialog = false;
                this.loading = true;
                console.log("角色", this.editedItem);
                try {
                    let editData = Object.assign({}, this.editedItem);
                    if (this.editedIndex > 0) {
                        //更新
                        let response = await this.$http.put("/role", editData);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "更新角色成功"
                        });
                    } else {
                        //新增
                        let response = await this.$http.post("/role", editData);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "添加角色成功"
                        });
                    }
                    this.getRoles();
                } catch (e) {
                    console.log("添加/更新角色失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "添加/更新角色失败"
                    });
                } finally {
                    this.loading = false;
                }
            },
            async deleteProduct() {
                this.deleteDialog = false;
                this.loading = true;
                try {
                    let response = await this.$http.delete("/role/" + this.productId);
                    console.log("删除线路", response.data);
                    this.getRoles();
                } catch (e) {
                    console.log("删除线路失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "删除线路失败"
                    });
                } finally {
                    this.loading = false;
                }

            },
            async updateRoleMenu(){
                if(this.role){
                    console.log("选择的角色",this.role,"选择的菜单",this.selectedMenu);
                    try {
                        this.loading = true;
                        let response = await this.$http.put("/role/roleMenu?roleId=" + this.role.id + "&menuIds=" + this.selectedMenu);
                        console.log("更新菜单 : ", response.data);
                    } catch (e) {
                        this.$store.commit('showSnackbar', {
                            color: 'error',
                            text: e.response.data.message ? e.response.data.message : "更新菜单失败"
                        });
                    } finally {
                        this.loading = false;
                    }
                }else {
                    this.$store.commit('showSnackbar', {
                        color: 'info',
                        text: "请选择角色"
                    });
                }
            },
            getUnixTime(dateStr) {
                var newstr = dateStr.replace(/-/g, '/');
                var date = new Date(newstr);
                var time_str = date.getTime().toString();
                return time_str.substr(0, 10);
            }
        },
        mounted() {
            let menu_info = JSON.parse(localStorage.getItem("menu_info"));
            this.menuTree = menu_info;
            this.getRoles();
        },
    }
</script>

<style>
</style>
