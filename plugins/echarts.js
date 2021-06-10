import Vue from 'vue';
// 引入 ECharts 主模块
//var echarts = require('echarts/lib/echarts');
//import * as echarts from 'echarts'
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

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入各种图表，图表后缀都为 Chart
import { BarChart, PieChart,GaugeChart,LineChart,RadarChart } from "echarts/charts";  //这里我引用两个类型的图表
// 引入提示框，标题，直角坐标系等组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  GaugeChart,
  LineChart,
  RadarChart,
  CanvasRenderer,
]);
import 'echarts-wordcloud';
Vue.prototype.$echarts = echarts;

