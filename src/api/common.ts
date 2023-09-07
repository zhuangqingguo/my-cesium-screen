import { request } from '@/utils/request';

const userApi = {
  Login: '/sys/casLogin',
  Logout: '/sys/logout',
  UserInfo: '/sys/user/get'
};

export function ssoLogin(parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  });
}

export function getInfo(parameter) {
  return request({
    url: userApi.UserInfo,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'userId=' + parameter
    //parameter
  });
}

export function getWeather(data: { locationCode: string }) {
  return request({
    url: '/external/weather/today',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 获取字典下拉选项
export function getOptions(dictCode) {
  return request({
    url: '/sys/dict/getOptions',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: { dictCode }
  });
}

// 获取视频播放地址
export function getVideoAddress(params) {
  return request({
    url: '/dw/video/address',
    method: 'get',
    params
  });
}
// 跳转到预置位
export function getVideoReset(params) {
  return request({
    url: '/dw/video/reset',
    method: 'get',
    params
  });
}
// 摄像头转动-停止
export function getVideoPtz(params) {
  return request({
    url: '/dw/video/ptz',
    method: 'get',
    params
  });
}
