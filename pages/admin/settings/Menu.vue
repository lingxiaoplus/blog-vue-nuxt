<template>
  <div>
    <template >
      <v-toolbar flat>
        <v-toolbar-title>菜单管理</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- loading条 -->
        <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
        </v-progress-linear>
      </v-toolbar>
    </template>

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-row class="pa-4">
          <v-btn v-on="on" @click="editedIndex = -1" small color="primary" class="ma-2 white--text" tile>
            <v-icon left small>mdi-plus</v-icon>
            新增
          </v-btn>
          <v-btn @click="getMenu" small class="ma-2 white--text" tile color="primary" :loading="loading"
                 :disabled="loading">
            <v-icon left small>mdi-refresh</v-icon>
            刷新
          </v-btn>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.name" label="菜单名称" :rules="[rules.base,rules.content]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.url" label="路由地址" required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-select
                  v-model="menuSelect"
                  :items="menuSelectList"
                  @change="onMenuChange"
                  label="上级类目"
                  item-text="name"
                  item-value="parentId"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-subheader class="pl-0">菜单排序</v-subheader>
                <v-slider
                  v-model="editedItem.sortIndex"
                  thumb-label
                ></v-slider>
              </v-col>

               <v-col cols="12" >
                 <v-text-field
                   label="选择图标"
                   :prepend-icon="editedItem.icon"
                   v-model="editedItem.icon"
                 ></v-text-field>
              </v-col>

            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="()=>{ dialog = false; editedItem = {} }">取消</v-btn>
          <v-btn color="blue darken-1" text @click="saveMenu()">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <el-table :data="desserts" style="width: 100%" @selection-change="handleSelectionChange" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="selection" width="55">
      </el-table-column>

      <el-table-column prop="name" label="名字" width="180">
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="180">
        <template slot-scope="scope">
          <v-icon>{{scope.row.icon}}</v-icon>
        </template>
      </el-table-column>
      <el-table-column prop="sortIndex" label="排序">
      </el-table-column>
      <el-table-column prop="url" label="路由地址">
      </el-table-column>
      <el-table-column prop="keepAlive" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.keepAlive===1"
            @change="enableMenu(scope.row)"
            active-color="#66BB6A"
            inactive-color="#BDBDBD">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <v-icon
            small
            class="mr-2"
            @click="editItem(scope.row)"
          >mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(scope.row)"
          >mdi-delete
          </v-icon>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center pt-2" v-if="pageCount>1">
      <v-pagination v-model="pageNum" :length="pageCount"></v-pagination>

    </div>


    <!--<v-data-table :headers="headers" :items="desserts" :page.sync="pageNum" :items-per-page="itemsPerPage"
                  hide-default-footer class="elevation-1" @page-count="pageCount = $event" :loading="loading" loading-text="Loading... Please wait">

      <template v-slot:item.action="{ item }">
        <v-btn class="ma-2 white&#45;&#45;text" text color="primary" @click="editItem(item)">
          编辑
          <v-icon right dark small>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn class="ma-2 white&#45;&#45;text" text color="primary" @click="deleteItem(item)">
          删除
          <v-icon right dark small>
            mdi-delete
          </v-icon>
        </v-btn>

      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getMenu" tile>刷新试试</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2" v-if="pageCount>1">
      <v-pagination v-model="pageNum" :length="pageCount"></v-pagination>

    </div>-->

    <v-row justify="center">
      <v-dialog v-model="deleteDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">确认要删除这一条记录吗?</v-card-title>
          <v-card-text>删除之后数据就不存在了</v-card-text>
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
                        text: '菜单名称',
                        value: 'name'
                    },
                    {
                        text: '菜单描述',
                        value: 'description'
                    },
                    {
                        text: '启用时间',
                        value: 'createAt'
                    },
                    {
                        text: '操作',
                        value: 'action',
                        sortable: false,
                        align: 'center',
                    },
                ],
                desserts: [],
                editedItem: {
                    parentId: 0,
                    sortIndex: 0,
                },
                dialog: false,
                editedIndex: -1,
                deleteDialog: false,
                selectDate: new Date().toISOString().substr(0, 10),
                dateMenu: false,
                loading: false,
                productId: '',  //当前线路的id
                on: false,
                rules: {
                    base: value => value.length > 0 || '请填写内容',
                    content: value => value.length < 10 || '菜单过长',
                },
                selectList: [],
                searchIconModel: null,
                searchLoading: false,
                searchIcon: null,
                entries: [],
                menuSelectList:[
                    {
                        parentId:"0",
                        name: "顶级菜单"
                    }
                ],
                menuSelect: {parentId:"0", name: "顶级菜单"},
                slider: "",
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '添加菜单' : '编辑菜单'
            },
        },
        watch: {
            pageNum(val) {
                console.log("监听到页数发生变化", val);
                this.pageNum = val;
                this.getRoles();
            },
        },
        methods: {
            onMenuChange(e){
                console.log("菜单改变",e);
                this.editedItem.parentId = e;
            },
            handleSelectionChange(val) {
                this.selectList = val;
            },
            itemClick(e) {
                console.log("点击", e);
            },
            editItem(e) {
                this.editedIndex = 1;
                this.editedItem = Object.assign({}, e);
                this.editedItem.departureTime = e.dateFormat; //这里要注意一下
                this.dialog = true;
                console.log("点击", e);
                if (e.parentId && e.parentId !== 0){
                    //this.menuSelect;
                }
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
            async enableMenu(row){
                try {
                    row.keepAlive = row.keepAlive === 1 ? 0 : 1;
                    let response = await this.$http.put("/menu", row);
                    console.log("更新菜单", response.data);
                    this.$store.commit('showSnackbar', {
                        color: 'success',
                        text: "更新菜单成功, 刷新界面看到效果"
                    });
                    this.getMenu();
                } catch (e) {
                    console.log("更新菜单失败",e);
                }
            },
            async getMenu() {
                try {
                    this.menuSelectList = [{parentId:"0", name: "顶级菜单"}];
                    this.loading = true;
                    this.$store.commit('setLoading', true);
                    let response = await this.$http.get("/menu");
                    console.log("response : ", response.data);
                    this.desserts = response.data.data;
                    //let page = parseInt(response.data.total / this.itemsPerPage) + 1;
                    //console.log("page:", page)
                    this.pageCount = response.data.totalPage;
                    this.desserts.forEach((item)=>{
                        this.menuSelectList.push({ parentId:item.id, name: item.name });
                    });
                    console.log("菜单列表",this.menuSelectList);
                } catch (e) {
                    console.log("获取菜单列表失败", e.response.data);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "获取菜单列表失败"
                    });
                } finally {
                    this.loading = false;
                    this.$store.commit('setLoading', false);
                }

            },
            async saveMenu() {
                if (!this.$refs.form.validate()) {
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "请检查提交内容"
                    });
                    return;
                }
                this.dialog = false;
                this.loading = true;
                console.log("菜单", this.editedItem,"上级菜单",this.menuSelect);
                try {
                    let editData = Object.assign({}, this.editedItem);
                    if (this.editedIndex > 0) {
                        //更新
                        let response = await this.$http.put("/menu", editData);
                        console.log("更新菜单", response.data);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "更新菜单成功"
                        });
                    } else {
                        //新增
                        let response = await this.$http.post("/menu", editData);
                        console.log("添加菜单", response.data);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "添加菜单成功"
                        });
                    }
                    this.getMenu();
                } catch (e) {
                    console.log("添加/更新菜单失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "添加/更新菜单失败"
                    });
                } finally {
                    this.loading = false;
                }
            },
            async deleteProduct() {
                this.deleteDialog = false;
                this.loading = true;
                try {
                    let response = await this.$http.delete("/category/" + this.productId);
                    console.log("删除菜单", response.data);
                    this.getMenu();
                } catch (e) {
                    console.log("删除菜单失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "删除菜单失败"
                    });
                } finally {
                    this.loading = false;
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
            this.$store.commit('setLoading', true);
            this.getMenu();
        },
    }
</script>

<style scoped>

</style>
