<template>
    <div>
      <v-row>

        <v-col cols="6">
          <v-card class="ma-4" tile>
            <v-card-text class="px2">
              <div ref="line" style="width: 100%;height:350px"></div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="ma-4" tile max-height="350px">
            <v-card-title>状态</v-card-title>
            <v-card-actions>
              <v-flex class="d-flex flex-row">
                <v-flex class="d-flex flex-column align-center justify-center" style="max-width: 200px">
                  <p>cpu使用率</p>
                  <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="6"
                    :value="cpuInfo.usageRate"
                    color="primary"
                  >
                    {{ cpuInfo.usageRate }}
                  </v-progress-circular>
                  <p class="ma-2">{{cpuInfo.coreNum}}核心</p>
                </v-flex>

                <v-flex class="d-flex flex-column align-center justify-center" style="max-width: 200px">
                  <p>内存使用率</p>
                  <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="6"
                    :value="memoryInfo.usageRate"
                    color="primary"
                  >
                    {{ memoryInfo.usageRate }}
                  </v-progress-circular>
                  <p class="ma-2">{{memoryInfo.used}}/{{memoryInfo.total}}</p>
                </v-flex>

                <v-flex class="d-flex flex-column align-center justify-center" style="max-width: 200px">
                  <p>磁盘使用率</p>
                  <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="6"
                    :value="diskStore.usageRate"
                    color="primary"
                  >
                    {{ diskStore.usageRate }}
                  </v-progress-circular>
                  <p class="ma-2">{{diskStore.used}}/{{diskStore.total}}</p>
                </v-flex>
              </v-flex>

            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>


      <v-card class="ma-4" tile>
        <v-card-title>jvm信息</v-card-title>
        <v-card-actions>

          <v-flex class="d-flex flex-row">
            <v-col cols="6">
              <v-list flat>
                <v-list-item-group color="primary">
                  <v-list-item>
                    <v-list-item-content>
                      <v-flex class="d-flex flex-row">
                        <v-list-item-title class="text-content">操作系统:</v-list-item-title>
                        <v-list-item-title>{{osName}}</v-list-item-title>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-flex class="d-flex flex-row">
                        <v-list-item-title class="text-content">系统架构:</v-list-item-title>
                        <v-list-item-title>{{osArch}}</v-list-item-title>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-flex class="d-flex flex-row">
                        <v-list-item-title class="text-content">jdk版本:</v-list-item-title>
                        <v-list-item-title>{{jvmInfo.version}}</v-list-item-title>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-flex class="d-flex flex-row">
                        <v-list-item-title class="text-content">jvm总内存:</v-list-item-title>
                        <v-list-item-title>{{jvmInfo.total}}</v-list-item-title>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-flex class="d-flex flex-row">
                        <v-list-item-title class="text-content">jvm使用内存:</v-list-item-title>
                        <v-list-item-title>{{jvmInfo.used}}</v-list-item-title>
                      </v-flex>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>

              </v-list>
            </v-col>
            <v-col cols="6">
              <v-flex class="px2 align-center justify-center">
                <div ref="gauge" style="width: 100%;height:350px"></div>
              </v-flex>
            </v-col>
          </v-flex>
        </v-card-actions>
      </v-card>

    </div>
</template>

<script>
    var echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/gauge');
    require('echarts/lib/chart/line');
    require('echarts/theme/macarons');
    var interval = null;
    export default {
        name: "server",
        data(){
            return{
                value: 20,
                theme: "macarons",
                cpuInfo: {
                    coreNum: 8,
                    systemUsage: "5.08%",
                    userUsage: "21.69%",
                    waitRate: "0%",
                    usageRate: "26.76%",
                },
                memoryInfo: {
                    total: "7.89GB",
                    used: "7.47GB",
                    acaliable: "433.93MB",
                    usageRate: "94.63%",
                },
                jvmInfo: {
                    total: "288.5MB",
                    used: "124.85MB",
                    acaliable: "163.65MB",
                    usageRate: "43.28%",
                    version: "1.8.0_161",
                },
                diskStore:{
                    total: "0.00GB",
                    used: "0.00GB",
                    acaliable: "0.00GB",
                    usageRate: "0.00%",
                },
                osName: '',
                osArch: '',
                jvmDrawable: {
                    title: {
                        text: '负载'
                    },
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: '业务指标',
                            type: 'gauge',
                            detail: {formatter: '{value}%'},
                            data: [{value: 50, name: 'jvm使用率'}]
                        }
                    ]
                },
                jvmInfo: [
                    {
                        name: '操作系统名',
                        value: 'Windows 10'
                    },
                    {
                        name: 'java版本',
                        value: '1.8.0_161'
                    }
                ],
                lineData: {
                    title: {
                        text: '流量实时统计/KB'
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
                        areaStyle: {}
                    }]
                }
            }
        },
        methods:{
            async getSystemLoad(){
                try {
                    //this.$store.commit('setLoading', true);
                    let resp = await this.$http.get("/system/load");
                    console.log("系统负载",resp.data.data);
                    this.cpuInfo = resp.data.data.cpuInfo;
                    this.memoryInfo = resp.data.data.memoryInfo;
                    this.jvmInfo = resp.data.data.jvmInfo;
                    this.diskStore = resp.data.data.diskStore;
                    this.osName = resp.data.data.osName;
                    this.osArch = resp.data.data.osArch;
                    const gauge = echarts.init(this.$refs.gauge, this.theme);
                    this.jvmDrawable.series[0].data[0].value = this.jvmInfo.usageRate.replace("%","");
                    gauge.setOption(this.jvmDrawable);
                    this.getNetworkState();
                } catch (e) {
                    console.log("获取系统负载失败",e)
                    if (interval){
                        clearInterval(interval);
                        console.log("取消定时轮询");
                    }
                } finally {
                    this.$store.commit('setLoading', false);
                }
            },
            async getNetworkState(){
                try {
                    let resp = await this.$http.get("/system/network");
                    console.log("网络状态",resp.data.data);
                    this.lineData.xAxis.data = resp.data.data.xaxis;
                    this.lineData.series[0].data = resp.data.data.series;
                    var line = echarts.init(this.$refs.line, this.theme);
                    // 使用刚指定的配置项和数据显示图表。
                    line.setOption(this.lineData);
                } catch (e) {
                    console.log("获取网络状态失败",e)
                    if (interval){
                        clearInterval(interval);
                        console.log("取消定时轮询");
                    }
                } finally {
                    this.$store.commit('setLoading', false);
                }
            }
        },
        mounted() {
            this.$store.commit('setLoading', true);
            this.getSystemLoad();
            interval = setInterval(()=>{
                this.getSystemLoad();
            },5000);
            /*setInterval(function () {
                this.jvmDrawable.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                //myChart.setOption(option, true);
                gauge.setOption(this.jvmDrawable);
            },2000);*/
        },
        beforeDestroy() {
            if (interval){
                clearInterval(interval);
            }
            console.log("销毁前，取消定时轮询");
        }
    }
</script>

<style scoped>
 .text-content{
   max-width: 200px;
 }
</style>
