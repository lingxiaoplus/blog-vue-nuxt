<template>
  <v-app  id="inspire">
    <v-sheet>
      <v-flex class="d-flex flex-column align-center justify-center">
        <v-avatar size="160">
          <img src="https://blog-1252348761.cos.ap-chengdu.myqcloud.com/image/dog.gif">
        </v-avatar>
        <p class="text-h4 font-weight-medium ma-2">凌霄</p>
        <p class="text-h6 font-weight-medium">java开发工程师</p>
        <p class="text-subtitle-1 font-weight-light">习惯沉默而不停止思考，无力表达却不曾失去态度</p>

        <v-flex class="d-flex align-center justify-center flex-row mt-4">
          <v-icon medium>mdi-kubernetes</v-icon>
          <span class="font-weight-medium px-2" style="font-size: 26px">我的项目</span>
        </v-flex>
        <v-row no-gutters>
          <v-col v-for="(project,index) in projectList" :key="project.id" cols="12" sm="4">
            <v-card elevation="0" @click="">
              <v-flex class="d-flex flex-column align-center justify-center pa-6 ma-4">
                <div class="project-icon ma-2" :style="[{'background-color': colorList[index]}]">
                  <v-icon large dark>{{project.icon}}</v-icon>
                </div>
                <p class="text-h6 font-weight-medium">{{project.name}}</p>
                <p class="text-subtitle-1 font-weight-medium">{{project.desc}}</p>
              </v-flex>
            </v-card>

          </v-col>
        </v-row>


        <v-flex class="d-flex align-center justify-center flex-row mt-4">
          <v-icon medium>mdi-hammer-wrench</v-icon>
          <span class="font-weight-medium px-2" style="font-size: 26px">我的技能</span>
        </v-flex>

        <v-sheet class="v-sheet--offset ma-2" color="cyan" elevation="12" min-width="900px" max-width="calc(100% - 32px)"
        >
          <v-sparkline
            :labels="labels"
            :value="value"
            color="white"
            line-width="2"
            padding="16"
          ></v-sparkline>
        </v-sheet>

        <v-row no-gutters>
          <v-col v-for="(technology,index) in technologyList" :key="technology.id" cols="12" sm="6">
            <v-flex class="d-flex flex-column align-center justify-center pa-6 ma-4" style="min-width: 400px">

              <v-progress-linear :color="colorList[index]" height="25" v-model="technology.value" buffer-value="60" value="40" stream>
                <strong class="white--text">{{technology.name}}:{{ Math.ceil(technology.value) }}%</strong>
              </v-progress-linear>
            </v-flex>
          </v-col>
        </v-row>

        <v-flex class="d-flex align-center justify-center flex-row mt-4">
          <v-icon medium>mdi-navigation</v-icon>
          <span class="font-weight-medium px-2" style="font-size: 26px">其他</span>
        </v-flex>

        <v-card-text>
          <!--<markdown :mdValuesP="content" :fullPageStatusP="false" :editStatusP="false"
                    :previewStatusP="true"
                    :navStatusP="false" :icoStatusP="false">
          </markdown>-->
          <no-ssr>
          <mavon-editor v-model="content"
                        :toolbarsFlag="false" defaultOpen="preview" :subfield="false"
                        :editable="false" :navigation="false" previewBackground="#fff"
          ></mavon-editor>
          </no-ssr>
        </v-card-text>
      </v-flex>
    </v-sheet>


  </v-app>

</template>

<script>
    //import markdown from '../../components/markdown';
    export default {
        name: "about",
        data() {
            return{
                bgGifUrl: require("../../assets/dog.gif"),
                projectList:[
                    {
                        id: 1,
                        icon: 'mdi-bacteria-outline',
                        name: '个人博客系统',
                        desc: '一个采用Material Design + vue + vuetify 和响应式设计的博客系统。',
                    },
                    {
                        id: 2,
                        icon: 'mdi-asterisk',
                        name: 'BiliBili',
                        desc: '仿照B站设计的系统。',
                    },
                    {
                        id: 3,
                        icon: 'mdi-bug',
                        name: 'simple-image-processing',
                        desc: '一个基于opencv+libyuv实现的图像识别算法库。',
                    }
                ],
                technologyList:[
                    {
                        id: 1,
                        name:'java',
                        value:97.1
                    },
                    {
                        id: 2,
                        name:'javascript',
                        value:90.1
                    },
                    {
                        id: 3,
                        name:'程序设计',
                        value:85.1
                    },
                    {
                        id: 4,
                        name:'android',
                        value:80.1
                    }
                ],
                labels: ['javascript', 'java', 'android', 'html5', 'css', 'sql', '程序架构', 'vue',],
                value: [200, 675, 410, 390, 310, 460, 250, 240,],
                content:
                    "#### 谈谈人生\n" +
                    "\n" +
                    "爱梦想，爱生活。平时喜欢发发呆，胡思乱想。爱音乐，目前自学吉他，希望能学会。爱宠物，老家有一只狗。想养只猫，不过现在单身，合租，养活自己都是问题。总结：我是一只有趣的程序猿。\n" +
                    "\n" +
                    "这是我的个人博客，用来记录一些平时遇到的琐碎问题和一些笔记，不期待有多大的流量。如果刚好你能从我的博客找到解决问题的方法，那么我很高兴能帮到你。\n" +
                    "\n" +
                    "#### 个人链接\n" +
                    "\n" +
                    "[Github](https://github.com/lingxiaopua)\n" +
                    "\n" +
                    "[掘金](https://juejin.im/user/5a3097fbf265da430c11ccd8)\n" +
                    "\n" +
                    "[微博](https://weibo.com/p/1005053866839538/home?from=page_100505&mod=TAB&is_all=1#place)\n" +
                    "\n" +
                    "邮箱：lingxiaopua@gmail.com\n",
                colorList: "",
            }
        },
      mounted() {
          this.colorList = this.$uiUtil.colorList
      }
    }
</script>

<style scoped>
  .v-sheet--offset {
    position: relative;
  }
  .project-icon {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    background-color: #42A5F5;
    font-size: 1.75rem;
    border-radius: 50%;
  }
</style>
