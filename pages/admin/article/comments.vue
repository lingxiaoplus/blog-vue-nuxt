<template>
  <div>

    <template>
      <v-toolbar flat color="white">
        <v-toolbar-title>评论管理</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>


    <v-dialog
      v-model="deleteDialog"
      max-width="290"
    >
      <v-card tile>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>确认要删除这些评论吗?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteDialog = false"
          >取消</v-btn>
          <v-btn
            color="primary"
            text
            @click="onDelete"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="replyDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">回复用户：{{replyRow?replyRow.member.username:""}}的评论</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="请输入回复内容" required v-model="commentContent"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="replyDialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="replyComment()">回复</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="pa-4" style="background: white" >
      <v-btn @click="deleteDialog = true" class="ma-2 white--text" small tile color="error" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left>mdi-delete</v-icon> 删除
      </v-btn>

      <v-btn @click="onPassOrReject(0)" class="ma-2 white--text" small tile color="warning" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left>mdi-cancel</v-icon> 驳回
      </v-btn>

      <v-btn @click="onPassOrReject(1)" class="ma-2 white--text" small tile color="primary" :loading="loading"
             :disabled="loading || (selectList.length < 1)">
        <v-icon left>mdi-hand-right</v-icon> 通过审核
      </v-btn>
    </v-row>

    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" row-key="id" :tree-props="{children: 'replies', hasChildren: 'hasChildren'}">
      <el-table-column type="selection" width="55">
      </el-table-column>

      <el-table-column prop="username" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>


      <el-table-column prop="article.title" label="文章标题">
        <template slot-scope="scope">
          <el-link type="primary" @click="linkToArticle(scope.row.article)">{{ scope.row.article.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评论内容">
      </el-table-column>

      <el-table-column prop="status" label="状态">

      </el-table-column>

      <el-table-column prop="createAt" label="提交时间">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
<!--          <el-button @click="commentClick(scope.row,true)" type="text" size="small">驳回</el-button>-->
          <el-button @click="()=>{replyRow=scope.row; replyDialog = true}" type="text" size="small">回复</el-button>
        </template>
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


  </div>
</template>

<script>
    export default {
        name: "comments",
        data() {
            return {
                tableData: [],
                pageNum: 1,
                pageSize: 5,
                pageCount: 0,
                itemsPerPage: 10,
                keyword: '',
                hidePagination: false,
                currentPage: 1,
                totalPage: 0,
                total: 0,
                loading: false,
                selectList: [],
                deleteDialog: false,
                replyDialog: false,
                replyRow: '',  //回复的当前列
                commentContent: '',
            }
        },
        methods: {
            async getComments() {
                try {
                    this.$store.commit('setLoading', true);
                    let resp = await this.$http.get(`/comment?pageNum=${this.pageNum}&pageSize=${this.pageSize}&keyword=${this.keyword}`);
                    console.log("评论", resp.data);
                    //this.tableData = resp.data.data;
                    /*this.tableData.forEach((item) => {
                        item.status = this.getCommentStatus(item.status);
                        if(item.replies){
                            item.replies.forEach((replie) => {
                                replie.status = this.getCommentStatus(replie.status);
                            })
                        }
                    });*/
                    this.tableData = this.reSetReplie(resp.data.data);
                    this.total = resp.data.total;
                    this.totalPage = resp.data.totalPage;
                    this.hidePagination = this.totalPage <= 1; //当页数小于等于1页的时候，就隐藏分页
                } catch (e) {
                    console.log("获取评论异常", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "网络异常，请稍后再试"
                    });
                } finally {
                    this.$store.commit('setLoading', false);
                }
            },
            reSetReplie(list){
                if(!list || list.length < 1){
                    return list;
                }
                list.forEach((item) => {
                    item.status = this.getCommentStatus(item.status);
                    if (item.replies){
                        this.reSetReplie(item.replies);
                    }
                });
                return list;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getComments();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val;
                this.getComments();
            },
            linkToArticle(item) {
                console.log(`当前对象: ${item.id}`);
                const { href } = this.$router.resolve("/articleContent?id=" + item.id);
                window.open(href, '_blank');
            },
            getCommentStatus(status) {
                let message = '';
                switch (status) {
                    case -1:
                        message = '待审核';
                        break;
                    case 0:
                        message = '已驳回';
                        break;
                    case 1:
                        message = '已通过';
                        break;
                    case 2:
                        message = '已删除';
                        break;
                    case 3:
                        message = '垃圾评论';
                        break;
                    default:
                        break;
                }
                return message;
            },
            handleSelectionChange(val) {
                this.selectList = val;
            },
            async onDelete(){
                if (this.selectList.length < 1){
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "请选择要删除的评论"
                    });
                    return ;
                }
                try {
                    this.loading = true;
                    let ids = this.selectList.map((item)=>{
                        return item.id;
                    });
                    let resp = await this.$http.delete(`/comment?ids=${ids}`);
                    console.log("删除成功",resp.data);
                    this.getComments();
                }catch (e) {
                    console.log("删除评论失败", e);
                    this.$message.error("删除评论失败，请稍后再试")
                }finally {
                    this.loading = false;
                    this.deleteDialog = false;
                }
            },
            async onPassOrReject(type){
                if (this.selectList.length < 1){
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: "请至少选择一个评论"
                    });
                    return ;
                }
                try {
                    this.loading = true;
                    let ids = this.selectList.map((item)=>{
                        return item.id;
                    });
                    let resp = await this.$http.put(`/comment?ids=${ids}&type=${type}`);
                    console.log("成功", resp.data);
                    this.$message.success(type===0?"评论驳回成功":"评论通过审核");
                    this.getComments();
                }catch (e) {
                    console.log("失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "网络异常，请稍后再试"
                    });
                }finally {
                    this.loading = false;
                }
            },
            async replyComment(){
                try {
                    let resp = await this.$http.post("/comment", {
                        userId: this.replyRow.member.uid,
                        articleId: this.replyRow.article.id,
                        parentId: this.replyRow.id,
                        content: this.commentContent,
                    });
                    console.log(resp.data);
                    this.$message({
                        message: '评论提交成功',
                        type: 'success'
                    });
                    this.getComments();
                } catch (e) {
                    console.log("评论失败", e);
                    this.$store.commit('showSnackbar', {
                        color: 'error',
                        text: e.response.data.message ? e.response.data.message : "网络异常，请稍后再试"
                    });
                }finally {
                    this.replyDialog = false;
                }
            }
        },
        mounted() {
            this.getComments();
        }
    }
</script>

<style scoped>

</style>
