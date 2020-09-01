<template>
  <div>

    <template>
      <v-toolbar flat>
        <v-toolbar-title>文章管理</v-toolbar-title>

        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="keyword"
          append-icon="mdi-magnify"
          label="搜索文章(根据标题)"
          single-line
          hide-details
          @input="onSearchChanged"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="yellow darken-2">
        </v-progress-linear>
      </v-toolbar>
    </template>
    <v-flex class="mx-2 d-flex flex-row align-center" >
      <nuxt-link to="editArticle">
        <v-btn color="primary" dark tile>
          写文章
        </v-btn>
      </nuxt-link>

      <v-subheader>页数</v-subheader>
      <v-flex style="max-width: 100px">
        <v-select v-model="pageSize" :items="pageSizes"
                  label="请选择页数" persistent-hint return-object single-line></v-select>
      </v-flex>

    </v-flex>

    <v-data-table :headers="headers" :items="desserts" :page.sync="pageNum" :items-per-page="itemsPerPage"
                  hide-default-footer class="elevation-1">
      <template v-slot:item.labels="{ item }">
        <v-chip-group mandatory>
          <v-chip v-for="label in item.labels" :key="label.id" small :color="getColor(label.id)" dark text-color="white">{{label.description}}</v-chip>
        </v-chip-group>
      </template>


      <template v-slot:item.status="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-chip @click="dialog = true" v-bind="attrs" v-on="on" small :color="getColor(item.status.code)" dark text-color="white">{{item.status.name}}</v-chip>
          </template>
          <span>点击发布文章</span>
          <v-dialog v-model="dialog" max-width="290">
            <v-card>
              <v-card-title class="headline">提示</v-card-title>
              <v-card-text>{{item.status.code==0?'确定发布该文章吗?':'确定将该文章移动到草稿箱吗?'}}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">
                  取消
                </v-btn>
                <v-btn color="green darken-1" text @click="publishArticle(item.id,item.status.code)">
                  确认
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-tooltip>
      </template>

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
        <v-btn color="primary">刷新试试</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
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
            <v-btn color="green darken-1" text @click="deleteArticle">确认</v-btn>
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
        keyword: '',
        pageSize: 5,
        pageSizes: [5, 10, 15, 20, 25, 30],
        headers: [
          {
            text: '标题',
            value: 'title'
          },
          {
            text: '作者',
            value: 'author'
          },
          {
            text: '分类',
            value: 'categoryName'
          },
          {
            text: '标签',
            value: 'labels'
          },
          {
            text: '状态',
            value: 'status'
          },
          {
            text: '评论',
            value: 'commentCount'
          },
          {
            text: '更新时间',
            value: 'updateTime'
          },
          {
            text: '操作',
            value: 'action',
            sortable: false,
            align: 'center'
          }
        ],
        desserts: [],
        editedItem: {
          roleName: '',
          roleDesc: '',
          rolePermession: ''
        },
        dialog: false,
        editedIndex: -1,
        deleteDialog: false,
        selectDate: new Date().toISOString().substr(0, 10),
        dateMenu: false,
        loading: false,
        article_id: '',
        on: false

      }
    },
    watch: {
      pageNum(val) {
        this.pageNum = val
        this.getArticles()
      },
      pageSize(val) {
        this.getArticles()
      }
    },
    methods: {
      async publishArticle(id,status) {
        try {
          this.dialog = false;
          let resp = await this.$http.put("/article", {
            "id": id,
            "status": status==0?1:0
          });
          this.$message({
            message: '文章发布成功',
            type: 'success'
          });
          this.getArticles()
        } catch (e) {
          this.snackbar = true;
          this.snackbarText = e.response.data.message;
        } finally {

        }
      },
      onSearchChanged(e) {
        console.log('搜索', e)
        this.keyword = e
        this.getArticles()
      },
      async getArticles() {
        this.loading = true
        try {
          this.$store.commit('setLoading', true)
          let resp = await this.$http.get('/article?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword)
          console.log('文章列表', resp.data)
          this.desserts = resp.data.data
          this.pageCount = resp.data.totalPage
        } catch (e) {
          console.log('文章列表失败', e.response)
          this.$store.commit('showSnackbar', {
            color: 'error',
            text: e.response.data.message ? e.response.data.message : '获取文章列表失败'
          })
        } finally {
          this.loading = false
          this.$store.commit('setLoading', false)
        }
      },
      deleteItem(e) {
        this.deleteDialog = true
        console.log('点击', e)
        this.article_id = e.id
      },
      editItem(e) {
        //let article = JSON.stringify(response.data.data)
        this.$router.push({ path: 'editArticle?articleId=' + e.id + '&status=' + e.status.code })

      },
      async deleteArticle() {
        this.deleteDialog = false
        this.loading = true
        try {
          let response = await this.$http.delete('/article/' + this.article_id)
          console.log('删除文章', response.data)
          this.getArticles()
        } catch (e) {
          console.log('删除文章失败', e.response.data)
          this.$store.commit('showSnackbar', {
            color: 'error',
            text: e.response.data.message ? e.response.data.message : '删除文章失败'
          })
        } finally {
          this.loading = false
        }
      },
      getColor(id) {
        if (id == 0) return 'orange'
        else if (id == 1) return 'green'
        else if (id == 2) return 'red'
        else return 'green'
      }
    },
    mounted() {
      this.getArticles()
    }
  }
</script>

<style scoped>

</style>
