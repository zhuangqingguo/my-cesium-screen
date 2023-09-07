import * as echarts from 'echarts/core'
const colors = ['#00D5FF', '#FFE750']
//hex -> rgba
function hexToRgba(hex, opacity) {
  return (
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')'
  )
}

export const getOptions = (data, custom) => {
  let {
    shortValue = true, // 缩写坐标值
    xLabel = '', // x轴名称
    yLabel = '', //y轴名称
    yUnit = '', //y轴单位
    legend = false, // 图例
    showAreaStyle = true, // 颜色区域
    rYUnit = '', // 右侧y轴单位
    rYLabel = '' // 右侧y轴名称
  } = custom

  const option = {
    color: colors,
    title: {
      top: 5,
      left: 10,
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
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    tooltip: {
      // confine: true,
      // appendToBody: true,
      // position: (pos, params, dom, rect, size) => {
      //   let obj = { bottom: size.viewSize[1] - pos[1] + 10 }
      //   obj[['right', 'left'][+(pos[0] < size.viewSize[0] / 2)]] =
      //     pos[0] < size.viewSize[0] / 2
      //       ? pos[0] + 10
      //       : size.viewSize[0] - pos[0] + 10
      //   return obj
      // },
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
    },
    xAxis: {
      data: data.length ? data[0].data.map(i => i[0]) : [],
      name: (data.length && xLabel) || '',
      nameTextStyle: {
        padding: [0, 0, 0, -5],
        color: 'rgba(246, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: 400
      },
      axisLabel: {
        textStyle: {
          color: '#f6ffff'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    yAxis: [
      {
        axisPointer: {
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
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(246, 255, 255, 0.7)'
          },
          formatter(t) {
            if (shortValue) {
              if (t > Math.pow(10, 8) - 1) {
                return t / Math.pow(10, 9) + '亿'
              }
              if (t > Math.pow(10, 4) - 1) {
                return t / 10000 + '万'
              }
            }
            if (yUnit) {
              return `${t}${yUnit}`
            }
            return t
          }
        }
      },
      {
        position: 'right',
        axisPointer: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(246, 255, 255, 0.7)'
          },
          formatter(t) {
            if (shortValue) {
              if (t > Math.pow(10, 8) - 1) {
                return t / Math.pow(10, 9) + '亿'
              }
              if (t > Math.pow(10, 4) - 1) {
                return t / 10000 + '万'
              }
            }
            if (yUnit) {
              return `${t}${rYUnit}`
            }
            return t
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    legend: {
      show: !!legend,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      top: 5,
      right: '0%',
      textStyle: {
        color: '#f6ffff'
      },
      ...legend
    },
    series: data.map((item, i) => {
      return {
        type: 'line',
        symbol: 'none',
        showBackground: true,
        smooth: true,
        name: item.name,
        stack: 'something',
        yAxisIndex: item?.yAxisIndex || 0,
        areaStyle: {
          opacity: showAreaStyle ? 0.5 : 0,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: hexToRgba(colors[i % colors.length], 0.3)
            },
            {
              offset: 1,
              color: 'rgba(0, 180, 255, 0)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: item.data
      }
    })
  }
  return option
}
