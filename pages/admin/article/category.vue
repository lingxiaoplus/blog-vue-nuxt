<template>

  <div>


    <template >
      <v-toolbar flat>
        <v-toolbar-title>文章分类</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- loading条 -->
        <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
        </v-progress-linear>
      </v-toolbar>
    </template>

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-row class="pa-4" >
          <v-btn v-on="on" @click="editedIndex = -1" color="primary" class="ma-2 white--text" tile>
            <v-icon left small>mdi-plus</v-icon>
            新增
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

              <v-col cols="12">
                <v-text-field v-model="editedItem.name" label="分类名称" :rules="[rules.base,rules.content]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.description" label="分类描述" :rules="[rules.base,rules.content]"></v-text-field>
              </v-col>
              <!-- <v-col cols="12" >
                <v-text-field v-model="editedItem.rolePermession" label="权限"></v-text-field>
              </v-col> -->

            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="saveRole">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table :headers="headers" :items="desserts" :page.sync="pageNum" :items-per-page="itemsPerPage"
                  hide-default-footer class="elevation-1"  :loading="loading">

      <template v-slot:item.action="{ item }">
        <v-btn class="ma-2 white--text" text color="primary" @click="editItem(item)">
          编辑
          <v-icon right dark small>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn class="ma-2 white--text" text color="primary" @click="deleteItem(item)">
          删除
          <v-icon right dark small>
            mdi-delete
          </v-icon>
        </v-btn>

      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getRoles" tile>刷新试试</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2" v-if="pageCount>1">
      <v-pagination v-model="pageNum" :length="pageCount"></v-pagination>

    </div>

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
                        text: '分类名称',
                        value: 'name'
                    },
                    {
                        text: '分类描述',
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
                    name: '',
                    description: '',
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
                    content: value => value.length < 50 || '分类过长',
                }

            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '添加分类' : '编辑分类'
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
            itemClick(e) {
                console.log("点击", e);
            },
            editItem(e) {
                this.editedIndex = 1;
                this.editedItem = e;
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
                    this.$store.commit('setLoading', true);
                    let response = await this.$http.get("/category?pageNum=" + this.pageNum);
                    console.log("response : ", response.data);
                    this.desserts = response.data.data;
                    //let page = parseInt(response.data.total / this.itemsPerPage) + 1;
                    //console.log("page:", page)
                    this.pageCount = response.data.totalPage;
                } catch (e) {
                    console.log("获取分类列表失败", e.response.data);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "获取分类列表失败"
                    });
                } finally {
                    this.loading = false;
                    this.$store.commit('setLoading', false);
                }

            },
            async saveRole() {
                if (!this.$refs.form.validate()) {
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "请检查提交内容"
                    });
                    return;
                }
                this.dialog = false;
                this.loading = true;
                console.log("分类", this.editedItem);
                try {
                    let editData = Object.assign({}, this.editedItem);
                    if (this.editedIndex > 0) {
                        //更新
                        let response = await this.$http.put("/category", editData);
                        console.log("更新分类", response.data);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "更新分类成功"
                        });
                    } else {
                        //新增
                        let response = await this.$http.post("/category", editData);
                        console.log("添加分类", response.data);
                        this.$store.commit('showSnackbar', {
                            color: 'success',
                            text: "添加分类成功"
                        });
                    }
                    this.getRoles();
                } catch (e) {
                    console.log("添加/更新分类失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "添加/更新分类失败"
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
                    console.log("删除分类", response.data);
                    this.getRoles();
                } catch (e) {
                    console.log("删除分类失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "删除分类失败"
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
            this.getRoles();
        },
    }
</script>

<style>
</style>
