import { request } from '@/utils/request'

// 地块详情--作物(除鱼塘外)弹窗
export function getOtherInfo(params) {
  return request({
    url: '/dw/largeScreen/other',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

// 地块详情--作物(鱼塘)弹窗
export function getFishpond(params) {
  return request({
    url: '/dw/largeScreen/fishpond',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

// 设备弹窗
export function getPopoverDevice(params) {
  return request({
    url: '/dw/largeScreen/popoverDevice',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}
