import Vue from 'vue';
// 引入 ECharts 主模块
//var echarts = require('echarts/lib/echarts');
import * as echarts from 'echarts'
// 引入仪表盘
// require("echarts/lib/chart/gauge");
// 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require('echarts/lib/component/graphic');

// require('echarts/lib/chart/bar');
// require('echarts/lib/chart/pie');
// require('echarts/lib/chart/line');
// require('echarts/theme/macarons');
// require('echarts/lib/chart/radar');
//词云
//require('echarts-wordcloud');
import 'echarts-wordcloud';
Vue.prototype.$echarts = echarts;

