<template>
  <div>
    <v-snackbar v-model="snackbar" color="error" :timeout="2000" :top="true">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">确认</v-btn>
    </v-snackbar>

    <v-data-table :headers="headers" :items="desserts" :page.sync="pageNum" :items-per-page="itemsPerPage"
                  hide-default-footer class="elevation-1" @page-count="pageCount = $event" >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>邮箱管理</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- loading条 -->
          <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
          </v-progress-linear>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark tile class="mb-2" v-on="on" @click="editedIndex = -1">添加</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" >
                      <v-text-field v-model="editedItem.email" label="邮箱地址"></v-text-field>
                    </v-col>
                    <v-col cols="12" >
                      <v-text-field v-model="editedItem.authCode" label="邮箱授权码"></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" >
                      <v-text-field v-model="editedItem.rolePermession" label="权限"></v-text-field>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
                <v-btn color="blue darken-1" text @click="saveEmail">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>
      <template v-slot:item.enabled="{ item }">
        <v-switch dense v-model="item.enabled" @change="enableEmail(item)" color="primary"></v-switch>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn class="ma-2 white--text" text color="primary"  @click="editItem(item)">
          编辑<v-icon right dark small>
          mdi-pencil
        </v-icon>
        </v-btn>
        <v-btn class="ma-2 white--text" text color="primary"  @click="deleteItem(item)">
          删除<v-icon right dark small>
          mdi-delete
        </v-icon>
        </v-btn>

      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getEmails">刷新</v-btn>
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
                        text: '邮箱地址',
                        value: 'email'
                    },
                    {
                        text: '邮箱授权码',
                        value: 'authCode'
                    },
                    {
                        text: '是否启用',
                        value: 'enabled',
                        sortable: false,
                    },
                    {
                        text: '操作',
                        value: 'action',
                        sortable: false,
                    },
                ],
                desserts: [],
                editedItem: {
                    email: '',
                    authCode: '',
                },
                dialog: false,
                editedIndex: -1,
                deleteDialog: false,
                selectDate: new Date().toISOString().substr(0, 10),
                dateMenu: false,
                loading: false,
                snackbar: false,
                snackbarText: '',
                productId: '',  //当前线路的id
                on: false,
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '添加邮箱' : '编辑邮箱'
            },
        },
        watch: {
            pageNum(val){
                console.log("监听到页数发生变化",val);
                this.pageNum = val;
                this.getEmails();
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
            async getEmails() {
                try{
                    this.loading = true;
                    this.$store.commit('setLoading', true);
                    let response = await this.$http.get("/email");
                    console.log("response : ", response.data);
                    this.desserts = response.data.data;
                    //let page = parseInt(response.data.total / this.itemsPerPage) + 1;
                    //console.log("page:", page)
                    this.pageCount =  response.data.totalPage;
                }catch(e){
                    console.log("获取邮箱列表失败",e.response.data);
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message?e.response.data.message:"获取邮箱列表失败";
                }finally{
                    this.loading = false;
                    this.$store.commit('setLoading', false);
                }

            },
            async saveEmail() {
                this.dialog = false;
                this.loading = true;
                console.log("邮箱", this.editedItem);
                try{
                    let editData = Object.assign({}, this.editedItem);
                    if(this.editedIndex > 0){
                        //更新
                        let response = await this.$http.put("/email",editData);
                        this.snackbar = true;
                        this.snackbarText = "更新邮箱成功";
                        console.log("更新邮箱",response.data);
                    }else{
                        //新增
                        let response = await this.$http.post("/email",editData);
                        this.snackbar = true;
                        this.snackbarText = "添加邮箱成功";
                        console.log("添加邮箱",response.data);
                    }
                    this.getEmails();
                }catch(e){
                    console.log("添加/更新分类失败",e);
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message;
                }finally{
                    this.loading = false;
                }
            },
            async deleteProduct(){
                this.deleteDialog = false;
                this.loading = true;
                try{
                    let response = await this.$http.delete("/email/"+this.productId);
                    console.log("删除邮箱",response.data);
                    this.getEmails();
                }catch(e){
                    console.log("删除邮箱失败",e);
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message;
                }finally{
                    this.loading = false;
                }

            },
            getUnixTime(dateStr){
                var newstr = dateStr.replace(/-/g,'/');
                var date =  new Date(newstr);
                var time_str = date.getTime().toString();
                return time_str.substr(0, 10);
            },
            async enableEmail(item){
                console.log("启用邮箱",item);
                //item.enabled?(item.enabled=1):(item.enabled=0);
                try{
                    let emailData = Object.assign({}, item);
                    emailData.enabled?(emailData.enabled=1):(emailData.enabled=0);
                    //更新
                    let response = await this.$http.put("/email",emailData);
                    this.snackbar = true;
                    this.snackbarText = item.enabled?"启用邮箱成功":"禁用邮箱成功";
                    console.log("更新邮箱",response.data);
                    this.getEmails();
                }catch(e){
                    this.snackbar = true;
                    this.snackbarText = e.response.data.message;
                    item.enabled = !item.enabled;
                }finally{
                    this.loading = false;
                }
            },
        },
        mounted() {
            this.$store.commit('setLoading', true);
            this.getEmails();
        },
    }
</script>

<style scoped>

</style>
