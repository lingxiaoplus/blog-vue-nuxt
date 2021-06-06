var articleCountOption = {
  title: {
    text: '文章统计/周'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  }]
}

var ipVisitOption = {
  title: {
    text: 'ip流量统计/周'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
};

var operatorsOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center',
    data: ['中国电信', '中国移动', '中国联通', '其他', '境外', '长城宽带']
  },
  series: [
    {
      name: '运营商',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 235,
          name: '中国电信'
        },
        {
          value: 274,
          name: '中国移动'
        },
        {
          value: 310,
          name: '中国联通'
        },
        {
          value: 335,
          name: '其他'
        },
        {
          value: 100,
          name: '境外'
        }
      ]
    }
  ]
}
export default {
  articleCountOption, ipVisitOption, operatorsOption
}
