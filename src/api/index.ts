import { request } from '@/utils/request';
//base/deviceCategory/getTree 设备分类  objectCategory/getTreeByCode?objectCategoryCode=MS监测站点
const screenApi = {
  deviceApi: '/base/deviceCategory/getTree',
  deviceById: '/dw/largeScreen/device',
  siteApi: '/base/objectCategory/getTreeByCode?objectCategoryCode=MS',
  siteById: '/dw/largeScreen/site',
  popoverDevice: '/dw/largeScreen/popoverDevice',
  landApi: '/dw/largeScreen/land',
  popoverSite: '/dw/largeScreen/popoveSite',
  noticeApi: '/dw/largeScreen/notice'
};
//设备
export function getScreenDevice() {
  return request({
    url: screenApi.deviceApi,
    method: 'post'
  });
}
//获取设备经纬度
export function getScreenDeviceById(data) {
  return request({
    url: screenApi.deviceById,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//监测站点
export function getScreenSite() {
  return request({
    url: screenApi.siteApi,
    method: 'post'
  });
}
//获取监测站点经纬度
export function getScreenSiteById(data) {
  return request({
    url: screenApi.siteById,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//设备弹框
export function getPopoverDevice(data) {
  return request({
    url: screenApi.popoverDevice,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//获取地块
export function getLand() {
  return request({
    url: screenApi.landApi,
    method: 'post'
  });
}
export function landDetailsById (data) {
  return request({
    url: '/dw/largeScreen/popover',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
//监测站点----田间水位计弹窗
export function getPopoverSite(data) {
  return request({
    url: screenApi.popoverSite,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//监测站点----水量计量弹窗//目前只支持此项下面的前2个
export function getPopoverWater(data) {
  return request({
    url: '/dw/largeScreen/popoveWater',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//视频
export function getVideo() {
  return request({
    url: '/dw/largeScreen/video',
    method: 'post',
  });
}
//通知
export function getNotice() {
  return request({
    url: screenApi.noticeApi,
    method: 'post'
  });
}
//气象
export function getPopoverMeteorological(data) {
  return request({
    url: '/dw/largeScreen/popoveMeteorological',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
//墒情
export function getPopoverMoisture(data) {
  return request({
    url: '/dw/largeScreen/popoveMoisture',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
