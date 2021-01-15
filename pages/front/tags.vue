<template>
  <div>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<!--    <v-container v-show="loading">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader type="card" ></v-skeleton-loader>
        </v-col>

        <v-col cols="12">
          <v-skeleton-loader
            type="article, actions"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>-->
    <v-sheet >
      <v-card :elevation="0">
        <v-card-actions>
          <v-flex class="d-flex" style="align-items: center; justify-content: center;flex-direction: row">
            <v-icon medium>mdi-label-multiple</v-icon>
            <span class="font-weight-medium" style="font-size: 26px">文章标签</span>
          </v-flex>
        </v-card-actions>
        <v-card-text>
          <v-row justify="space-around">
            <v-col cols="12" sm="6" md="4" lg="6">
              <v-sheet elevation="2" class="pa-2">
                <v-chip-group column>
                  <v-chip v-for="(tag,index) in tags" :key="tag.id" dark :color="colorList[index]" label class="ma-2">
                    {{ tag.name }}
                  </v-chip>
                </v-chip-group>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>

      </v-card>


      <v-card class="overflow-hidden" tile :elevation="0">
        <v-card-text>
          <div ref="cloud" style="width: 100%;height:300px"></div>
        </v-card-text>
      </v-card>
    </v-sheet>


  </div>
</template>

<script>

    export default {
        name: "tags",
        data() {
            return {
                theme: "macarons",
                tags: [],
                colorList: ['primary', 'secondary', 'green', 'red', 'orange', 'indigo',
                    'blue', 'cyan', 'teal', 'lime', 'yellow', 'purple', 'light-blue'
                    , 'secondary', 'green', 'cyan', 'teal', 'lime', ',blue', 'cyan', 'teal', 'lime', 'yellow', 'purple'
                ],
                option: {
                    /*title: {
                        text: "词云图",
                        link: 'https://github.com/ecomfe/echarts-wordcloud',
                        subtext: 'data-visual.cn',
                        sublink: 'http://data-visual.cn',
                    },*/
                    tooltip: {},
                    series: [{
                        type: 'wordCloud',
                        gridSize: 20,
                        sizeRange: [12, 50],
                        rotationRange: [0, 0],
                        shape: 'circle',
                        textStyle: {
                            normal: {
                                color: function () {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: [{
                            name: 'java',
                            value: 10000,
                            textStyle: {
                                normal: {
                                    color: 'black'
                                },
                                emphasis: {
                                    color: 'red'
                                }
                            }
                        }]
                    }]
                },
                cloud: '',
              loading: true
            }
        },
        mounted() {
            this.cloud = this.$echarts.init(this.$refs.cloud, this.theme);
            this.getLabels()
        },
        methods: {
            //生成从minNum到maxNum的随机数
            randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(Math.random() * minNum + 1, 10);
                        break;
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                        break;
                    default:
                        return 0;
                        break;
                }
            },
            async getLabels() {
                try {
                  this.$store.commit('setLoading', true)
                    let resp = await this.$http.get("/front/labels");
                    console.log("结果", resp.data.data);
                    this.tags = resp.data.data;
                    let cloudList = this.tags.map((item) => {
                        return { name:item.name,value: this.randomNum(200,6000)  }
                    });
                    this.option.series[0].data =  cloudList;
                    this.cloud.setOption(this.option);
                } catch (e) {
                    console.log("异常", e);
                } finally {
                  this.$store.commit('setLoading', false);
                  this.loading = false;
                }
            },
        }
    }
</script>

<style scoped>

</style>
