<template>
  <div>
    <v-card :elevation="0">
      <v-card-actions >
        <v-flex class="d-flex" style="align-items: center; justify-content: center;flex-direction: row">
          <v-icon medium>mdi-electron-framework</v-icon>
          <span class="font-weight-medium" style="font-size: 26px">文章分类</span>
        </v-flex>
      </v-card-actions>
      <v-card-text>
        <v-row justify="space-around">
          <v-col cols="12" sm="6" md="4" lg="6">
            <v-sheet elevation="2" class="pa-2">
              <v-chip-group
                column
                active-class="primary--text"
              >
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
        <div ref="radar" style="width: 100%;height:300px"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
    export default {
        name: "category",
        data() {
            return{
                theme: "macarons",
                tags: [],
                colorList:['primary','secondary','green','red','orange','indigo',
                    'blue','cyan','teal','lime','yellow','purple','light-blue'
                    ,'secondary','green','cyan','teal','lime',',blue','cyan','teal','lime','yellow','purple'
                ],
                option : {
                    /*title: {
                        text: '基础雷达图'
                    },
                    tooltip: {},
                    legend: {
                        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                    },*/
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: [
                            { name: '前端', max: 6500},
                            { name: '数据库', max: 16000},
                            { name: '信息技术', max: 30000},
                            { name: '软件工程', max: 38000},
                            { name: 'java', max: 52000},
                            { name: 'docker', max: 25000}
                        ]
                    },
                    series: [{
                        name: '预算 vs 开销（Budget vs spending）',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: [
                            {
                                value: [4300, 10000, 28000, 35000, 50000, 19000],
                                name: '预算分配（Allocated Budget）'
                            },
                            {
                                value: [5000, 14000, 28000, 31000, 42000, 21000],
                                name: '实际开销（Actual Spending）'
                            }
                        ]
                    }]
                },
                radar: '',
            }
        },
        mounted(){
            this.radar = this.$echarts.init(this.$refs.radar, this.theme);
            this.getCategory();
        },
        methods:{
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
            async getCategory() {
                try {
                  this.$store.commit('setLoading', true)
                    let resp = await this.$http.get("/front/category");
                    console.log("结果", resp.data.data);
                    this.tags = resp.data.data;
                    let cloudList = this.tags.map((item) => {
                        return { name:item.name,max: this.randomNum(16000,52000)  }
                    });
                    this.option.radar.indicator =  cloudList;
                    this.radar.setOption(this.option);
                } catch (e) {
                    console.log("异常", e);
                } finally {
                  this.$store.commit('setLoading', false)
                }
            }
        }
    }
</script>

<style scoped>

</style>
