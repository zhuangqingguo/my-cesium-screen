import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from 'axios'
import { notification } from 'ant-design-vue'
// import { useUserStore } from '@/store/modules/user';
import Cookies from 'js-cookie'
import router from '../router'

// const userStore = useUserStore();

/**
 * @description: ContentType
 */
export enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8'
}

export const errorCode: any = {
  /* '400': '请求错误', */
  '400': '登录认证异常',
  '401': '登录认证失效，请重新登录'!,
  '403': '无权限',
  '410': '帐号已停用',
  '411': '帐号已锁定',
  '412': '用户名错误',
  '413': '密码错误',
  '414': '手机号码错误',
  '415': '验证码错误',
  '416': '验证码已过期',
  '420': 'appId错误',
  '421': '无权限登录该应用',
  '422': '钉钉用户未匹配',
  '423': '钉钉临时授权码无效',
  '424': '钉钉应用后台免登授权码无效',
  '500': '业务错误,返回错误提示',
  '599': '接口入参错误',
  '600': '外部接口异常',
  '999': '系统出现未知错误'
}

export function request(requestConifg: AxiosRequestConfig) {
  const axiosIns: AxiosInstance = axios.create({
    withCredentials: false,
    timeout: 10000, // 请求超时时间
    baseURL: import.meta.env.VITE_BASE_API
  })

  // 请求拦截
  axiosIns.interceptors.request.use(
    config => {
      // 发送请求前，可在此携带 token
      const token = Cookies.get('ACCESS_TOKEN')
      if (token) {
        config.headers['token'] = token
      }

      return config
    },
    (error: AxiosError) => {
      notification.error({
        message: error.message,
        duration: 5
      })
      return Promise.reject(error)
    }
  )

  // 响应拦截
  axiosIns.interceptors.response.use(
    (response: AxiosResponse) => {
      // 请求rul
      // const requestUrl = response.config.url;
      // 未设置状态码则默认成功状态
      const code = response.data.code || 200
      // 获取错误信息
      const msg = response.data.message || errorCode[code]

      if (
        response.status === 200 &&
        code === 200 &&
        response.data.success == true
      ) {
        return response.data
      } else if (code === 400) {
        notification.error({
          message: '系统提示',
          description: code + ':' + msg,
          duration: 5
        })
        Cookies.remove('ACCESS_TOKEN')
      } else if (code === 401) {
        notification.error({
          message: '系统提示',
          description: code + ':' + msg,
          duration: 5
        })
        Cookies.remove('ACCESS_TOKEN')
        window.location.href = `${import.meta.env.VITE_CAS_URL}/login?service=${
          window.location.origin
        }`
      } else if (code === 404) {
        router.push('/404')
      } else {
        Cookies.set('serveErr', JSON.stringify(response.data))
        notification.error({
          message: '系统提示',
          description: code + ':' + msg,
          duration: 5
        })
      }
      return Promise.reject(response)
    },
    (error: AxiosError) => {
      notification.error({
        message: error.message,
        duration: 5
      })
      //  return Promise.reject(error) //注释该行，否则接口请求失败会一直请求刷新错误数据，这里保证请求一次
    }
  )

  axiosIns.defaults.headers.post['Content-Type'] = ContentTypeEnum.JSON
  // 请求函数
  return new Promise((resolve, reject) => {
    axiosIns
      .request(requestConifg)
      .then((response: any) => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
