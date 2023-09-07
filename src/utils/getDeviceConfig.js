const deviceMapObj = {
  // 设备分类
  ['A007']: {
    name: '电磁阀',
    component: 'diancifa'
  },
  ['泵001']: {
    name: '泵',
    component: 'beng'
  },
  ['闸001']: {
    name: '闸',
    component: 'zha'
  },
  ['A010']: {
    name: '增氧机',
    component: 'zhengyangji'
  },

  // 监测站点
  // 水文监测站
  ['MS001-1']: {
    name: '田间水位站',
    component: 'tianjianshuiweizhan'
  },
  ['MS001-2']: {
    name: '河道水位站',
    component: 'hedaoshuiweizhan'
  },
  ['MS001-3']: {
    name: '气象站',
    component: 'qixiangzhan'
  },
  ['MS001-5']: {
    name: '水质站',
    component: 'shuizhizhan'
  },
  ['MS001-6']: {
    name: '土壤墒情站',
    component: 'turangshangqingzhan'
  },
  // 水量计量点
  ['MS001-9']: {
    name: '机械水表',
    component: 'jixieshuibiao'
  },
  ['MS001-10']: {
    name: '远传水表',
    component: 'yuanchuanshuibiao'
  },
  ['MS001-8']: {
    name: '溢流出水计量',
    component: 'yiliuchushuijiliang'
  }
}

export function getDeviceCom(code) {
  return import(
    `@/components/device-windows/${deviceMapObj[code].component}.vue`
  )
}

// [
//   {
//     key: 'dk1001', // 地块code
//     value: [
//       {
//         // categoryCode: 'A007', // 设备类型code ==> categoryCode
//         // categoryName: '电磁阀',
//         deviceCode: '190',
//         deviceName: '4号柜1#电磁阀',
//         staticPosition: '32,65' // 距离左上角的物理像素距离(x,y)
//       }
//     ]
//   }
// ]

// https://sthzxgq.oss-cn-hangzhou.aliyuncs.com/plotImg/监控@2x.png
// https://sthzxgq.oss-cn-hangzhou.aliyuncs.com/plotImg/%E7%9B%91%E6%8E%A7%402x.png
