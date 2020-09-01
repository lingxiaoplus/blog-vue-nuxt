<template>
  <v-container>
    <v-layout row wrap>

      <v-flex xs10 md12 class="pa-4">
        <v-layout row wrap>

          <v-col class="pa-2" cols="3" v-for="(item,index) in cardList" :key="item.name">
            <v-scale-transition>
              <div v-if="item.show">
                <v-hover v-slot:default="{ hover }">

                  <v-card :elevation="hover?6:2" tile>

                    <v-row style="align-items: center">
                      <v-col cols="6">
                        <v-img class="mx-4" :src="item.src" width="40px" height="40px">
                        </v-img>
                      </v-col>
                      <v-col cols="6" class="text--secondary">
                        <v-card-title class="px-4">{{item.number}}</v-card-title>
                        <v-card-subtitle class="px-4">{{item.name}}</v-card-subtitle>
                      </v-col>
                    </v-row>

                  </v-card>

                </v-hover>
              </div>
            </v-scale-transition>
          </v-col>

        </v-layout>
      </v-flex>


      <v-flex class="pa-4" xs12 md12 style="width: 100%">
        <v-card tile>
          <v-card-text class="px2">
            <div ref="line" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-flex>


      <v-flex xs10 md6 class="pa-4">
        <v-card tile>
          <v-card-text class="px2">
            <div ref="sale" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs10 md6 class="pa-4">
        <v-card tile>
          <v-card-text class="px2">
            <div ref="pie" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        name: "dashboard",
        data() {
            return {
                theme: "macarons",
                cardList: [
                    {
                        name: '新增用户',
                        number: 0,
                        src: require("../../../assets/cycling leaves.png"),
                        url: '',
                        show: false
                    },
                    {
                        name: '文章总数',
                        number: 12,
                        src: require("../../../assets/article_all.png"),
                        url: '',
                        show: false
                    },
                    {
                        name: '评论数',
                        number: 22,
                        src: require("../../../assets/comment.png"),
                        url: '',
                        show: false
                    },
                    {
                        name: '分类数量',
                        number: 1,
                        src: require("../../../assets/category.png"),
                        url: '',
                        show: false
                    },
                    {
                        name: '标签数量',
                        number: 1,
                        src: require("../../../assets/label.png"),
                        url: '',
                        show: false
                    },
                    {
                        name: '友情链接',
                        number: 1,
                        src: require("../../../assets/link.png"),
                        url: '',
                        show: false
                    },

                ],

                option: {
                    title: {
                        text: '文章统计/周'
                    },
                    tooltip: {},
                    legend: {
                        data: ['新增文章']
                    },
                    xAxis: {
                        data: ["技术", "娱乐", "福利", "羊毛", "其他"]
                    },
                    yAxis: {},
                    series: [{
                        name: '新增文章',
                        type: 'bar',
                        data: [5, 20, 36, 10, 20],
                        //color:  this.$vuetify.theme.themes.light.primary
                    }]
                },


                lineData: {
                    title: {
                        text: 'ip流量统计/周'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }, {
                        data: [820, 932, 901, 934, 120, 1220, 1120],
                        type: 'line',
                        areaStyle: {}
                    }]
                },
                first: false,
            }
        },
        //html加载完成后执行
        mounted() {
            this.cardList.forEach((item, index) => {
                setTimeout(() => {
                    item.show = true;
                }, (index + 1) * 200)
            });
            this.getStatistics();
            this.$nextTick(() => {
                const line = this.$echarts.init(this.$refs.line, this.theme);
                line.setOption(this.lineData);
                const pie = this.$echarts.init(this.$refs.pie, this.theme);
                pie.setOption({
                    title: {
                        text: '访问来源'
                    },
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data: [{
                            value: 235,
                            name: '视频广告'
                        },
                            {
                                value: 274,
                                name: '联盟广告'
                            },
                            {
                                value: 310,
                                name: '邮件营销'
                            },
                            {
                                value: 335,
                                name: '直接访问'
                            },
                            {
                                value: 400,
                                name: '搜索引擎'
                            }
                        ]
                    }],
                    itemStyle: {
                        emphasis: {
                            // 阴影的大小
                            shadowBlur: 200,
                            // 阴影水平方向上的偏移
                            shadowOffsetX: 0,
                            // 阴影垂直方向上的偏移
                            shadowOffsetY: 0,
                            // 阴影颜色
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000',
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                })

            })
        },
        methods: {
            async getStatistics() {
                try {
                    let resp = await this.$http.get("/statistics/article/week");
                    console.log(">>", resp.data.data);
                    this.option.xAxis.data = resp.data.data.articleIncreasedData.xAxis;
                    this.option.yAxis.data = resp.data.data.articleIncreasedData.yAxis;
                    this.option.series[0].data = resp.data.data.articleIncreasedData.series;
                    var sale = this.$echarts.init(this.$refs.sale, this.theme);
                    // 使用刚指定的配置项和数据显示图表。
                    sale.setOption(this.option);

                    this.cardList[0].number = resp.data.data.aggregationData.todayIncreased;
                    this.cardList[1].number = resp.data.data.aggregationData.articleSize;
                    this.cardList[2].number = resp.data.data.aggregationData.commentSize;
                    this.cardList[3].number = resp.data.data.aggregationData.categorySize;
                    this.cardList[4].number = resp.data.data.aggregationData.labelSize;
                    this.cardList[5].number = resp.data.data.aggregationData.linkSize;
                } catch (e) {
                    console.log("", e);
                }
            },
        },
    }
</script>

<style>
</style>
