export const colors = [
  'rgba(232, 253, 0, 0.9)',
  'rgba(5, 207, 247, 0.9)',
  'rgba(179, 49, 238, 0.9)',
  'rgba(25, 120, 229, 0.9)',
  'rgba(234, 185, 102, 0.9)',
  'rgba(96, 180, 94, 0.9)',
  'rgba(190, 205, 208, 0.9)'
];

export const getOptions = data => {
  return {
    grid: {
      left: '0%',
      top: '0%',
      bottom: '0%',
      right: '0%'
    },

    legend: {
      type: 'scroll',
      orient: 'vertical',
      pageIconSize: [12, 12],
      pageTextStyle: {
        color: 'transparent'
      },
      left: '0%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      pageIconInactiveColor: '#375264',
      pageIconColor: '#7DA9C1',
      data: data.map(el => el.name),
      formatter: function (name) {
        let total = 0;
        let target;
        for (let i = 0, l = data.length; i < l; i++) {
          total += data[i].value;
          if (data[i].name == name) {
            target = data[i].value;
          }
        }

        let arr = [
          '{a|' + name + '}',
          // '{b|' + ((target / total) * 100).toFixed(2) + '}{c|' + ' %}'
          '{b|' + target + '}{c|' + ' 亩}'
        ];
        return arr.join(' ');
      },
      textStyle: {
        rich: {
          a: {
            color: '#f6ffff',
            width: 120,
            fontSize: 14
          },
          b: {
            fontSize: 14,
            color: '#ffffff'
          },
          c: {
            fontSize: 14,
            color: '#ffffff'
          }
        }
      }
      // tooltip: {
      //   show: true,
      //   formatter({ name }) {
      //     console.log(11111, name);
      //     const curItem = (data || []).find(r => r.itemName === name);
      //     const sum = eval((data || []).map(r => r.value).join('+'));
      //     let result = '';
      //     try {
      //       if (curItem) {
      //         const percent = ((curItem.value / sum) * 100).toFixed(2);
      //         result =
      //           curItem && `${name} <br />${curItem.value} <br /> ${percent}%`;
      //       }
      //     } catch (error) {}
      //     return result;
      //   }
      // }
    },

    color: colors,

    // textStyle: {
    //   fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
    // },

    tooltip: {
      // confine: true,
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.6)', //通过设置rgba调节背景颜色与透明度
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      }
      // formatter: `{b} <br /> {c}${unit || '人次'} <br /> ({d}%)`,
      // formatter: '{a} <br/>{b} : {c} ({d}%)'
      // formatter: '{b} : {c} ({d}%)'
    },

    series: [
      {
        type: 'pie',
        center: ['75%', '50%'],
        radius: ['47%', '67%'],
        avoidLabelOverlap: false,
        legendHoverLink: false,
        data: data,

        label: {
          show: false,
          position: 'center',
          formatter: '{a|{c}}',
          // padding: [170, 0, 0, 0],
          rich: {
            a: {
              fontSize: 16,
              color: '#fff'
            }
          }
        },

        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        itemStyle: {
          borderRadius: 5,
          borderColor: '#000',
          borderWidth: 3
        }
      }
    ]
  };
};
