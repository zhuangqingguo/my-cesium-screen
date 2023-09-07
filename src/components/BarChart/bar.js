import * as echarts from 'echarts/core';
const colors = ['#1978E5'];

export const getOptions = (data, custom) => {
  let {
    singleValue = true,
    shortValue = true,
    inverse,
    xLabel = '',
    yLabel = '',
    yUnit = ''
  } = custom;
  let xAxisParams = {
    type: 'category',
    data: data.length ? data[0].data.map(i => i[0]) : [],
    axisLabel: {
      textStyle: {
        color: '#f6ffff'
      }
    }
  };
  let yAxisParams = {
    type: 'value'
  };

  let legendParams = {
    top: 5,
    right: '0%'
  };

  if (inverse) {
    let temp;
    temp = xAxisParams;
    xAxisParams = yAxisParams;
    yAxisParams = temp;

    temp = xLabel;
    xLabel = yLabel;
    yLabel = temp;

    legendParams = {
      bottom: 0,
      left: 'center'
    };

    xAxisParams.splitLine = {
      show: false
    };
    xAxisParams.axisLabel = {
      textStyle: {
        color: 'rgba(246, 255, 255, 0.7)'
      },
      formatter(t) {
        if (shortValue) {
          if (t > Math.pow(10, 8) - 1) {
            return t / Math.pow(10, 9) + '亿';
          }
          if (t > Math.pow(10, 5) - 1) {
            return t / 10000 + '万';
          }
        }
        if (yUnit) {
          return `${t}${yUnit}`;
        }
        return t;
      }
    };
  }

  const option = {
    title: {
      top: 5,
      left: 5,
      text: yLabel,
      textAlign: 'left',
      textStyle: {
        color: 'rgba(246, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: 400
      }
    },
    grid: {
      left: '4%',
      right: xLabel ? '10%' : '4%',
      bottom: inverse ? '12%' : '3%',
      top: inverse ? '12%' : '20%',
      containLabel: true
    },
    color: colors,
    tooltip: {
      // confine: true,
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.6)', //通过设置rgba调节背景颜色与透明度
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
      // formatter: params => {
      //   let dataStr = `<div><p style="font-weight:bold;margin:0 5px 5px;">${params[0].name}</p></div>`;
      //   params.forEach(item => {
      //     dataStr += `<div>
      //    <div style="margin: 0 8px;">
      //      <span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${
      //        item.color.colorStops[0].color
      //      };border-radius:2px;"></span>
      //      <span>${singleValue  true? item.name : item.seriesName}</span>
      //      <span style="float:right;color:#fff;margin-left:20px;">${
      //        item.data
      //      }</span>
      //    </div>
      //  </div>`;
      //   });
      //   return dataStr;
      // }
    },
    xAxis: {
      name: (data.length && xLabel) || '',
      nameTextStyle: {
        padding: [0, 0, 0, -5],
        color: 'rgba(246, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: 400
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255,255,255,0.2)'
        }
      },
      z: 10,
      ...xAxisParams
    },
    yAxis: {
      axisPointer: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLabel: {
        textStyle: {
          color: 'rgba(246, 255, 255, 0.7)'
        },
        formatter(t) {
          if (shortValue) {
            if (t > Math.pow(10, 8) - 1) {
              return t / Math.pow(10, 9) + '亿';
            }
            if (t > Math.pow(10, 5) - 1) {
              return t / 10000 + '万';
            }
          }
          if (yUnit) {
            return `${t}${yUnit}`;
          }
          return t;
        }
      },
      ...yAxisParams
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    legend: {
      show: !!custom?.legend,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#f6ffff'
      },
      ...legendParams
    },
    series: data.map((item, index) => {
      return {
        type: 'bar',
        barMaxWidth: 8,
        showBackground: true,
        // backgroundStyle: {
        //   color: 'rgba(255, 255, 255, 0.05)'
        // },
        name: item.name,
        stack: item.stack,
        itemStyle: {
          borderRadius: [10, 10, 0, 0], //（顺时针左上，右上，右下，左下）
          color:
            index === 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#1978E5'
                  },
                  {
                    offset: 1,
                    color: '#10274B'
                  }
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(243, 213, 156, 0.85)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(206, 159, 65, 0.85)'
                  }
                ])
        },
        emphasis: {
          itemStyle: {
            color:
              index === 0
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#00D5FF'
                    },
                    {
                      offset: 1,
                      color: 'rgba(9,111,165, 1)'
                    }
                  ])
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#CFA144' },
                    { offset: 1, color: '#CFA144' }
                  ])
          }
        },
        data: item.data.map(d => d[1])
      };
    })
  };
  return option;
};
