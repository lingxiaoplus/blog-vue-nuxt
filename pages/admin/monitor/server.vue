<template>
  <div>
    <v-row>

      <v-col cols="6">
        <v-card class="ma-4 animated fadeInDown" style="animation-delay: 0.1s" tile max-height="350px">
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
                <p class="ma-2">{{ cpuInfo.coreNum }}核心</p>
              </v-flex>

              <v-flex class="d-flex flex-column align-center justify-center" style="max-width: 200px">
                <p>cpu负载</p>
                <v-progress-circular
                  :rotate="-90"
                  :size="100"
                  :width="6"
                  :value="cpuInfo.load"
                  color="primary"
                >
                  {{ cpuInfo.load }}
                </v-progress-circular>
                <p class="ma-2">{{ cpuInfo.load > 0.5? '运行卡顿': '运行流畅' }}</p>
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
                <p class="ma-2">{{ memoryInfo.used }}/{{ memoryInfo.total }}</p>
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
                <p class="ma-2">{{ diskStore.used }}/{{ diskStore.total }}</p>
              </v-flex>
            </v-flex>

          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card tile class="ma-4 animated fadeInDown" style="animation-delay: 0.2s">
          <v-card-title>jvm信息</v-card-title>
          <v-card-actions>
            <v-list flat>
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">操作系统:</v-list-item-title>
                      <v-list-item-title>{{ osName }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">系统架构:</v-list-item-title>
                      <v-list-item-title>{{ osArch }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">供货商:</v-list-item-title>
                      <v-list-item-title>{{ manufacturer }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">jdk版本:</v-list-item-title>
                      <v-list-item-title>{{ jvmInfo.version }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">jvm总内存:</v-list-item-title>
                      <v-list-item-title>{{ jvmInfo.total }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-flex class="d-flex flex-row">
                      <v-list-item-title class="text-content">jvm使用内存:</v-list-item-title>
                      <v-list-item-title>{{ jvmInfo.used }}</v-list-item-title>
                    </v-flex>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

            </v-list>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>

    <v-row>


      <v-col cols="6">
        <v-card tile class="ma-4 animated fadeInDown" style="animation-delay: 0.3s">
          <v-card-title>jvm负载</v-card-title>
          <v-card-actions>
            <v-flex class="px2 align-center justify-center">
              <div ref="gauge" style="width: 100%;height:350px"></div>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card tile class="ma-4 animated fadeInDown" style="animation-delay: 0.4s">
          <v-card-title>cpu温度</v-card-title>
          <v-card-actions>
            <v-flex class="px2 align-center justify-center">
              <div ref="temperature" style="width: 100%;height:350px"></div>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card tile class="ma-4 animated fadeInDown" style="animation-delay: 0.5s">
          <v-card-title>jvm堆内存</v-card-title>
          <v-card-actions>
            <v-flex class="px2 align-center justify-center">
              <div ref="lineArea" style="width: 100%;height:350px"></div>
            </v-flex>
          </v-card-actions>
          <v-card-text>
            <v-chip-group active-class="deep-purple accent-4 white--text" column>
              <v-chip>初始堆内存: {{jvmInfo.jvmHeapInfo.initMemory}}</v-chip>
              <v-chip>最大堆内存: {{jvmInfo.jvmHeapInfo.maxMemory}}</v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card tile class="ma-4 animated fadeInDown" style="animation-delay: 0.6s">
          <v-card-text class="px2">
            <div ref="line" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


  </div>
</template>

<script>
//var echarts = require('echarts/lib/echarts')
import * as echarts from 'echarts'
var interval = null
import temperature from '../../../plugins/charts/temperature'
import lineArea from '../../../plugins/charts/lineArea'
export default {
  name: 'server',
  data() {
    return {
      value: 20,
      theme: 'macarons',
      cpuInfo: {
        coreNum: 8,
        systemUsage: '5.08%',
        userUsage: '21.69%',
        waitRate: '0%',
        usageRate: '26.76%',
        name: '',
        temperature: '',
        vendor: '',
        voltage: '',
        fanSpeeds: '',
        load: ''
      },
      memoryInfo: {
        total: '7.89GB',
        used: '7.47GB',
        acaliable: '433.93MB',
        usageRate: '94.63%'
      },
      jvmInfo: {
        total: '288.5MB',
        used: '124.85MB',
        acaliable: '163.65MB',
        usageRate: '43.28%',
        version: '1.8.0_161',
        jvmHeapInfo: {
          initMemory: 0,
          maxMemory: 0
        }
      },
      diskStore: {
        total: '0.00GB',
        used: '0.00GB',
        acaliable: '0.00GB',
        usageRate: '0.00%'
      },
      osName: '',
      osArch: '',
      manufacturer: '',
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
  methods: {

    async getSystemLoad() {
      try {
        //this.$store.commit('setLoading', true);
        let resp = await this.$http.get('/system/load')
        console.log('系统负载', resp.data.data)
        this.cpuInfo = resp.data.data.cpuInfo
        this.memoryInfo = resp.data.data.memoryInfo
        this.jvmInfo = resp.data.data.jvmInfo
        this.diskStore = resp.data.data.diskStore
        this.osName = resp.data.data.osName
        this.osArch = resp.data.data.osArch
        this.manufacturer = resp.data.data.manufacturer
        const gauge = echarts.init(this.$refs.gauge, this.theme)
        temperature.jvmOption.series[0].data[0].value = this.jvmInfo.usageRate.replace('%', '')
        gauge.setOption(temperature.jvmOption)
        this.getNetworkState()

        temperature.temperatureOption.series[0].data[0].value = this.cpuInfo.temperature
        const tempera = echarts.init(this.$refs.temperature)
        tempera.setOption(temperature.temperatureOption)

        resp.data.data.jvmInfo.jvmHeapInfo.heapLineChartData.series.forEach(item =>{
          item.areaStyle =  {};
        })
        lineArea.lineArea.xAxis[0].data = resp.data.data.jvmInfo.jvmHeapInfo.heapLineChartData.xaxis
        lineArea.lineArea.series = resp.data.data.jvmInfo.jvmHeapInfo.heapLineChartData.series
        lineArea.lineArea.title.text = 'jvm堆内存监控'
        const jvmHeapArea = echarts.init(this.$refs.lineArea)
        jvmHeapArea.setOption(lineArea.lineArea)
      } catch (e) {
        console.log('获取系统负载失败', e)
        if (interval) {
          clearInterval(interval)
          console.log('取消定时轮询')
        }
      } finally {
        this.$store.commit('setLoading', false)
      }
    },
    async getNetworkState() {
      try {
        let resp = await this.$http.get('/system/network')
        console.log('网络状态', resp.data.data)
        this.lineData.xAxis.data = resp.data.data.xaxis
        this.lineData.series[0].data = resp.data.data.series
        var line = echarts.init(this.$refs.line, this.theme)
        // 使用刚指定的配置项和数据显示图表。
        line.setOption(this.lineData)
      } catch (e) {
        console.log('获取网络状态失败', e)
        if (interval) {
          clearInterval(interval)
          console.log('取消定时轮询')
        }
      } finally {
        this.$store.commit('setLoading', false)
      }
    }
  },
  mounted() {
    this.$store.commit('setLoading', true)
    this.getSystemLoad()
    interval = setInterval(() => {
      this.getSystemLoad()
    }, 5000)

    window.onresize = () =>{
      this.$refs.line.resize();
      this.$refs.temperature.resize();
      this.$refs.lineArea.resize();
      this.$refs.gauge.resize();
    }
  },
  beforeDestroy() {
    if (interval) {
      clearInterval(interval)
    }
    console.log('销毁前，取消定时轮询')
  }
}
</script>

<style scoped>
.text-content {
  max-width: 200px;
}
</style>
