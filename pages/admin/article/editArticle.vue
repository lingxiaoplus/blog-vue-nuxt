<template>
  <div class='mx-2'>

    <v-snackbar v-model='snackbar' color='error' :timeout='3000' :top='true'>
      {{ snackbarText }}
    </v-snackbar>
    <v-layout column>
      <v-layout style='margin-left: 10px;'>
        <v-row align='center'>
          <v-col>
            <v-text-field color='primary' label='请输入文章标题' clearable v-model='title'></v-text-field>
          </v-col>

        </v-row>
      </v-layout>
      <v-layout row>
        <v-col md='10'>
          <v-card elevation='0'>
            <!--编辑器组件，嵌入到任意父组件中-->
            <mavon-editor v-model='editContent' style='min-height: 600px;max-height: 700px;z-index: 1;'
                          :navigation='false' ref='md'
                          @imgAdd='$imgAdd' @imgDel='$imgDel' :ishljs='false'
                          @change='childEventHandler'
            ></mavon-editor>
          </v-card>
        </v-col>

        <v-col md='2' class='px-md-2' style='height: 700px;'>
          <v-flex>
            <v-hover v-slot:default='{ hover }'>
              <v-card class='pa-md-2' tile :elevation='hover?12:2'>
                <!--          <v-img-->
                <!--            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"-->
                <!--            height="200px"-->
                <!--          ></v-img>-->
                <v-card-title style='padding-bottom: 10px'>
                  文章状态
                </v-card-title>
                <v-card-subtitle>
                  <v-flex class='d-flex flex-column mt-2'>
                    <div>状态：{{ articleStatus == 0 ? '草稿箱' : '已发布' }}</div>
                    <div>公开度：{{ articleStatus == 0 ? '未公开' : '已公开' }}</div>
                  </v-flex>
                </v-card-subtitle>

                <v-flex class='mx-2'>
                  <v-select v-model='select' :items='selectList' item-text='name' item-value='id'
                            label='请选择分类' persistent-hint return-object single-line></v-select>
                </v-flex>
                <v-flex class='mx-2'>
                  <v-select v-model='label' :items='labelList' item-text='name' item-value='id'
                            label='请选择标签' attach multiple></v-select>
                </v-flex>

                <v-flex>
                  <v-btn :loading='loadingDraft' :disabled='loadingDraft' color='primary'
                         tile @click='saveArticleToDrafts(0)'>
                    保存
                  </v-btn>
                  <v-btn :loading='loadingDraft' color='green' dark tile @click='saveArticleToDrafts(1)'>
                    发布
                  </v-btn>

                  <v-btn :loading='loadingDraft' tile @click='preview'>
                    预览
                  </v-btn>
                </v-flex>
              </v-card>
            </v-hover>


            <v-flex class='pt-4'>
              <v-hover v-slot:default='{ hover }'>
                <v-card class='pa-md-2' tile :elevation='hover?12:2'>
                  <v-card-title style='padding-bottom: 10px'>
                    封面图片
                  </v-card-title>
                  <v-flex class='mx-2'>
                    <v-select v-model='imageType' :items='imageTypes' item-text='name' item-value='value'
                              label='请选择图片类型' persistent-hint return-object single-line></v-select>
                  </v-flex>
                  <v-card-actions v-if="imageType.value==='local'" class='d-flex align-center justify-center'>
                    <v-sheet width='200' height='200' elevation='0' class='d-flex align-center justify-center'>
                      <v-flex>
                        <el-upload :action='uploadImageUrl' list-type='picture-card'
                                   :on-preview='handlePictureCardPreview' :on-success='handleSuccess'
                                   :class='{disabled:headPortrait}'
                                   :headers='headers'
                                   :on-error='handleError' :on-remove='handleRemove'
                                   :file-list='image_list' :limit='1'>
                          <i class='el-icon-plus'></i>
                        </el-upload>
                        <el-dialog :visible.sync='dialogVisible' size='tiny'>
                          <img width='100%' :src='headPortrait' alt=''>
                        </el-dialog>
                      </v-flex>
                    </v-sheet>
                  </v-card-actions>

                  <v-card-actions v-else class='d-flex align-center justify-center' @click='chooseWebDialog'>
                    <v-sheet width='200' height='200' elevation='1' class='d-flex align-center justify-center'>
                      <v-img v-if='headPortrait' :src='headPortrait' aspect-ratio='1'></v-img>
                      <v-icon medium v-else>mdi-camera-enhance-outline</v-icon>
                    </v-sheet>
                  </v-card-actions>
                </v-card>
              </v-hover>

            </v-flex>


            <v-dialog v-model='web_dialog' max-width='500px'>
              <v-card>
                <v-card-title>
                  <span class='headline'>网络图片</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref='form' lazy-validation>
                      <v-col cols='12'>
                        <v-text-field v-model='webDialogImageUrl' label='图片地址(http:// or https://)'></v-text-field>
                      </v-col>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn tail class='ml-auto' color='primary' text @click='onDialogBingClick' :loading='bingLoading'>
                    选择bing图片
                  </v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color='primary' text @click='web_dialog = false'>取消</v-btn>
                  <v-btn color='primary' text @click='saveWebImage'>保存</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>


            <v-bottom-sheet v-model='bottomSheet'>
              <v-sheet class='text-center' height='500px'>
                <v-flex>
                  <v-row>
                    <v-col v-for='image in bingImages' :key='image.url' class='d-flex child-flex' cols='3'>
                      <v-card flat tile class='d-flex' @click='headPortrait = image.url' elevation='2'>
                        <v-img :src='image.url' aspect-ratio='1.7' class='grey lighten-2' max-height='200'>
                          <template v-slot:placeholder>
                            <v-row class='fill-height ma-0' align='center' justify='center'>
                              <v-progress-circular indeterminate color='grey lighten-5'></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                        <v-btn v-if='headPortrait===image.url' absolute style='top: 10px' color='green'
                               class='white--text' fab large right top>
                          <v-icon>mdi-gesture-tap</v-icon>
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-btn color='primary' tile @click='++bingIdx'>
                    <v-icon left small>mdi-refresh</v-icon>
                    换一批
                  </v-btn>
                  <v-btn color='red' tile dark @click='()=>{bottomSheet = false;bingIdx=1}'>
                    <v-icon left small>mdi-close</v-icon>
                    关闭
                  </v-btn>
                </v-flex>
              </v-sheet>
            </v-bottom-sheet>

          </v-flex>

        </v-col>


      </v-layout>

    </v-layout>
  </div>


  <!--变量后面的大写P表示是从父组件中传入的参数-->
  <!--:mdValuesP="msg" 表示需要初始化传入编辑器的内容-->
  <!--:fullPageStatusP="false" 加载时是否全屏（true全屏/false跟随父容器）-->
  <!--:editStatusP="false" 加载时是否显示编辑容器（true显示/false不显示）-->
  <!--:previewStatusP="false" 加载时是否显示预览容器（true全屏/false不显示）-->
  <!--:navStatusP="false" 加载时是否显示顶部快速标签栏（true显示/false不显示）-->
  <!--:icoStatusP="false" 加载时是否显示版权标志（true显示/false不显示）,如果取消掉，请勿忘挖井人，谢谢！-->
  <!--@childevent="childEventHandler" 监听组件的$.emit()方法传回父组件的值，便于父容器保存获取-->
</template>

<script>
// 引入markdown组件
//import markdown from '../../components/markdown'

export default {
  name: 'editArticle',
  data() {
    return {
      editContent: '',
      loader: null,
      loadingDraft: false,
      select: { name: '请选择分类', id: '' },
      label: [],
      labelList: [],
      selectList: [],
      imageType: { name: '本地图片', value: 'local' },
      imageTypes: [
        {
          name: '本地图片',
          value: 'local'
        },
        {
          name: '网络图片',
          value: 'web'
        }
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      title: '',
      headPortrait: '',
      image_list: [],
      snackbarText: '',
      snackbar: false,
      articleId: '',
      articleStatus: 0,
      web_dialog: false,
      webDialogImageUrl: '',
      bottomSheet: false,
      bingImagePage: 1,
      bingImages: [],
      bingLoading: false,
      bingIdx: 1,
      headers: {},
      uploadImageUrl: ''
    }
  },
  watch: {
    /*loader () {
        if(this.loader == null){
            return;
        }
        const l = this.loader;
        this[l] = !this[l];
        console.log("开始进度条",this.loadingDraft);
        setTimeout(() => {
            this[l] = false;
            console.log("停止进度条",this.loadingDraft);
        }, 3000);
        this.loader = null;

    },*/
    headPortrait(val) {
      this.webDialogImageUrl = val
    },
    label(val) {
      console.log('修改了label', val)
    },
    bingIdx(val) {
      if (val === 1) return
      this.getBingImages()
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.image_list.length > 0
    }
  },
  methods: {
    async $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      try {
        let resp = await this.$http.post('/upload', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.$refs.md.$img2Url(pos, resp.data.path)
      } catch (e) {
        console.log(e)
        this.snackbar = true
        this.snackbarText = e.response.data.message ? e.response.data.message : '上传文件失败'
      }
    },
    $imgDel(pos) {

    },
    childEventHandler: function(res) {
      // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
      //console.log(">>",res)
      //this.editContent = res;

      //console.log("获取到输入的值",res.mdValue);
    },
    chooseWebDialog() {
      console.log('aaaaaaaa', this.headPortrait)
      this.web_dialog = true
      this.webDialogImageUrl = this.headPortrait
    },
    saveWebImage() {
      this.web_dialog = false
      //this.dialogImageUrl = this.webDialogImageUrl;
      this.headPortrait = this.webDialogImageUrl
      this.image_list[0] = { name: 'headPortrait', url: this.headPortrait }
    },
    async getCategorys() {
      try {
        let resp = await this.$http.get('/category?pageSize=999')
        console.log('获取分类成功', resp.data.data)
        this.selectList = resp.data.data

        this.selectList.forEach((item) => {
          if (item.id === this.select.id) {
            this.select = item
          }
        })

      } catch (e) {
        console.log('获取分类失败', e.response.data)
        this.snackbar = true
        this.snackbarText = e.response.data.message
      }
    },
    onDialogBingClick() {
      this.bottomSheet = true
      if (this.bingImages.length < 1) {
        this.getBingImages()
      }
    },
    async getBingImages() {
      try {
        this.bingLoading = true
        let resp = await this.$http.get('/upload/bingImage?pageNum=' + this.bingIdx + '&pageSize=8')
        console.log('获取bing图片', resp.data.data)
        this.bingImages = resp.data.data.images.data
        if (this.bingImages.length <= 0 && this.bingIdx !== 1) {
          this.bingIdx = 1
        }
      } catch (e) {
        console.log('获取bing图片失败', e.response.data)
        this.snackbar = true
        this.snackbarText = e.response.data.message ? e.response.data.message : '获取bing图片失败'
      } finally {
        this.bingLoading = false
        this.bottomSheet = true
      }
    },

    async getLabels() {
      try {
        let resp = await this.$http.get('/label?pageSize=30')
        console.log('获取分类成功', resp.data.data)
        this.labelList = resp.data.data

        this.labelList.forEach((item) => {
          if (item.id === this.label.id) {
            this.label = item
          }
        })

      } catch (e) {
        console.log('获取分类失败', e.response.data)
      }
    },

    handleRemove(file, fileList) {
      //删除文件
      console.log(file, fileList)
      this.image_list = []
      //this.dialogImageUrl = '';
      this.headPortrait = ''
    },
    /**
     * 图片预览
     * @param {Object} file
     */
    handlePictureCardPreview(file) {
      console.log('返回文件上传结果', file)
      //this.dialogImageUrl = file.url;
      this.headPortrait = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file, fileList) {
      //文件上传成功时的钩子
      console.log('文件上传成功时的钩子', response)
      this.headPortrait = response.path
      this.image_list[0] = { name: 'headPortrait', url: this.headPortrait }
    },
    handleError(err, file, fileList) {
      console.log('文件上传失败时的钩子', err)
      this.showSnackBar('文件上传失败:' + err, false)
    },
    showSnackBar(text, success) {
      this.snackbar = true
      this.snackbarText = text
      this.snackbarColor = success ? 'green' : 'red'
    },

    async saveArticleToDrafts(status) {
      console.log('选择的分类id', this.select.id)
      try {
        this.loadingDraft = true
        let resp = await this.$http.post('/article', {
          'categoryId': this.select.id,
          'content': this.editContent,
          'headImage': this.headPortrait,
          'status': status,  //草稿箱 0  发布 1
          'title': this.title,
          'id': this.articleId,
          'labelIds': this.label
        })
        this.$message({
          message: '文章保存成功',
          type: 'success'
        })
        /* Message.success({
          showClose: true,
          message: '文章保存成功'
        }) */
        console.log('文章保存成功', resp)
        this.articleId = resp.data
      } catch (e) {
        console.log('文章保存失败', e)
        this.snackbar = true
        this.snackbarText = e.response.data.message
      } finally {
        this.loadingDraft = false
      }

    },

    async getarticleDetails(id) {
      this.loading = true
      try {
        let response = await this.$http.get('/article/' + id)
        console.log('查询文章', response.data)
        this.title = response.data.data.title
        this.editContent = response.data.data.content
        this.select.id = response.data.data.categoryId
        this.articleId = response.data.data.id
        this.selectList.forEach((item) => {
          if (item.id == this.select.id) {
            this.select = item
          }
        })
        if (response.data.data.headImage) {
          this.image_list.push({
            name: response.data.data.id,
            url: response.data.data.headImage
          })
          //this.dialogImageUrl = response.data.data.headImage;
          this.headPortrait = response.data.data.headImage
        }
        if (response.data.data.labels) {
          this.label = response.data.data.labels.map((item) => {
            return item.id
          })
        }
      } catch (e) {
        console.log('查询文章失败', e)
        this.snackbar = true
        this.snackbarText = e.response ? e.response.data.message : '查询文章失败'
      } finally {
        this.loading = false
      }
    },
    preview() {
      this.$emit('setLoading')
      let article = {
        'categoryName': this.select.name,
        'content': this.editContent,
        'headImage': this.headPortrait,
        'status': status,  //草稿箱 0  发布 1
        'title': this.title,
        'watchCount': 0,
        'createAt': '',
        'author': ''
      }
      console.log('预览')
      const { href } = this.$router.resolve('/articleContent?preview=true')
      localStorage.setItem("articleContent",JSON.stringify(article))
      window.open(href, '_blank')
    }
  },
  mounted() {
    this.getCategorys()
    this.getLabels()
    let articleId = this.$route.query.articleId
    //如果有articleid传过来，说明是编辑 需要获取到文章内容
    if (articleId) {
      this.getarticleDetails(articleId)
    }
    let status = this.$route.query.status
    if (status) {
      this.articleStatus = status
    }
    this.headers = {
      'blog-login-token': localStorage.getItem('blog_login_token')
    }
    this.uploadImageUrl = this.$http.defaults.baseURL + '/upload'
  }
}
</script>

<style>

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.mavonEditor {
  width: 100%;
  min-height: 400px;
}

.disabled .el-upload--picture-card {
  display: none;
}
</style>
