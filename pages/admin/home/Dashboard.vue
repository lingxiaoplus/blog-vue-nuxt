<template>
  <v-flex class="ma-2">
    <v-layout row wrap>
      <v-flex xs10 md12 class="pa-4">
        <v-layout row wrap>
          <v-col class="pa-2" cols="3" v-for="(item, index) in cardList" :key="item.name">
            <v-scale-transition>
              <div v-if="item.show">
                <v-hover v-slot:default="{ hover }">
                  <v-card :elevation="hover ? 6 : 2" tile>
                    <v-row style="align-items: center">
                      <v-col cols="6"><v-img class="mx-4" :src="item.src" width="40px" height="40px"></v-img></v-col>
                      <v-col cols="6" class="text--secondary">
                        <v-card-title class="px-4">{{ item.number }}</v-card-title>
                        <v-card-subtitle class="px-4">{{ item.name }}</v-card-subtitle>
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
          <v-card-text class="px2"><div ref="line" style="width: 100%;height:350px"></div></v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs10 md6 class="pa-4">
        <v-card tile>
          <v-card-text class="px2"><div ref="sale" style="width: 100%;height:350px"></div></v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs10 md6 class="pa-4">
        <v-card tile>
          <v-card-text class="px2"><div ref="pie" style="width: 100%;height:350px"></div></v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import * as echarts from 'echarts'
import blogStatistics from '../../../plugins/charts/blogStatistics'
export default {
  name: 'dashboard',
  data() {
    return {
      theme: 'macarons',
      cardList: [
        {
          name: '新增用户',
          number: 0,
          src: require('../../../assets/cycling leaves.png'),
          url: '',
          show: false
        },
        {
          name: '文章总数',
          number: 12,
          src: require('../../../assets/article_all.png'),
          url: '',
          show: false
        },
        {
          name: '评论数',
          number: 22,
          src: require('../../../assets/comment.png'),
          url: '',
          show: false
        },
        {
          name: '分类数量',
          number: 1,
          src: require('../../../assets/category.png'),
          url: '',
          show: false
        },
        {
          name: '标签数量',
          number: 1,
          src: require('../../../assets/label.png'),
          url: '',
          show: false
        },
        {
          name: '友情链接',
          number: 1,
          src: require('../../../assets/link.png'),
          url: '',
          show: false
        }
      ],
      first: false,
    };
  },
  //html加载完成后执行
  mounted() {
    this.cardList.forEach((item, index) => {
      setTimeout(() => {
        item.show = true;
      }, (index + 1) * 200);
    });
    this.getStatistics();
    this.getVisitAnalyse();
    // 监听窗口的变化，实时调用 echarts的 resize事件
    window.onresize = () =>{
      this.$refs.sale.resize();
      this.$refs.line.resize();
      this.$refs.pie.resize();
    }
  },
  methods: {
    async getStatistics() {
      try {
        let resp = await this.$http.get('/statistics/article/week');
        console.log('>>', resp.data.data);
        if (Object.keys(resp.data.data.articleIncreasedData).length !== 0){
          blogStatistics.articleCountOption.xAxis.data = resp.data.data.articleIncreasedData.xaxis;
          blogStatistics.articleCountOption.data = resp.data.data.articleIncreasedData.yaxis;
          blogStatistics.articleCountOption.series[0].data = resp.data.data.articleIncreasedData.series;
        }

        var sale = this.$echarts.init(this.$refs.sale, this.theme);
        // 使用刚指定的配置项和数据显示图表。

        sale.setOption(blogStatistics.articleCountOption);

        this.cardList[0].number = resp.data.data.aggregationData.todayIncreased;
        this.cardList[1].number = resp.data.data.aggregationData.articleSize;
        this.cardList[2].number = resp.data.data.aggregationData.commentSize;
        this.cardList[3].number = resp.data.data.aggregationData.categorySize;
        this.cardList[4].number = resp.data.data.aggregationData.labelSize;
        this.cardList[5].number = resp.data.data.aggregationData.linkSize;
      } catch (e) {
        console.log('错误', e);
      }
    },
    async getVisitAnalyse() {
      try {
        let resp = await this.$http.get('/statistics/visitAnalyse');
        console.log('ip访问统计', resp.data.data);

        if (Object.keys(resp.data.data.lineCharData).length !== 0){
          blogStatistics.ipVisitOption.xAxis.data = resp.data.data.lineCharData.xaxis;
          blogStatistics.ipVisitOption.yAxis.data = resp.data.data.lineCharData.yaxis;
          blogStatistics.ipVisitOption.series[0].data = resp.data.data.lineCharData.series;
        }
        const line = this.$echarts.init(this.$refs.line, this.theme);
        line.setOption(blogStatistics.ipVisitOption);

        /*if (Object.keys(resp.data.data.operatorAnalyse).length !== 0){
          blogStatistics.operatorsOption.legend.data = resp.data.data.operatorAnalyse.legend;
          blogStatistics.operatorsOption.series[0].data = resp.data.data.operatorAnalyse.series;
        }*/
        const pie = this.$echarts.init(this.$refs.pie, this.theme);
        pie.setOption(blogStatistics.operatorsOption);

      } catch (e) {
        console.log('', e);
      }
    }
  }
};
</script>

<style></style>
