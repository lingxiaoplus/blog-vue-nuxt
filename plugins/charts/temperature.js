var temperatureOption = {
  series: [{
    type: 'gauge',
    progress: {
      show: true,
      width: 10
    },
    axisLine: {
      lineStyle: {
        width: 10
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      length: 15,
      lineStyle: {
        width: 2,
        color: '#999'
      }
    },
    axisLabel: {
      distance: 25,
      color: '#999',
      fontSize: 14
    },
    anchor: {
      show: true,
      showAbove: true,
      size: 20,
      itemStyle: {
        borderWidth: 8
      }
    },
    title: {
      text: 'cpu温度',
      show: true
    },
    detail: {
      valueAnimation: true,
      fontSize: 20,
      offsetCenter: [0, '70%']
    },
    data: [{
      value: 70
    }]
  }],
  media: [

  ]
};

var jvmOption = {
  series: [{
    type: 'gauge',
    axisLine: {
      lineStyle: {
        width: 10,
        color: [
          [0.3, '#67e0e3'],
          [0.7, '#37a2da'],
          [1, '#fd666d']
        ]
      }
    },
    pointer: {
      itemStyle: {
        color: 'auto'
      }
    },
    axisTick: {
      distance: -26,
      length: 20,
      lineStyle: {
        color: '#fff',
        width: 2
      }
    },
    splitLine: {
      distance: -40,
      length: 30,
      lineStyle: {
        color: '#fff',
        width: 4
      }
    },
    axisLabel: {
      color: 'auto',
      distance: 40,
      fontSize: 14
    },
    detail: {
      valueAnimation: true,
      formatter: '{value} %',
      fontSize: 20,
      color: 'auto'
    },
    data: [{
      value: 70
    }]
  }]
};

export default {
  temperatureOption,jvmOption
}
