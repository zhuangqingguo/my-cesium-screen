import Cookies from 'js-cookie'

const TokenKey = 'ACCESS_TOKEN'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token = '', ExpireInSeconds = 60 * 60 * 24) {
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + ExpireInSeconds * 1000)
  return Cookies.set(TokenKey, token, {
    expires: expiresTime
  })
}

export function removeToken() {
  window.loadAsyncRoute = null
  localStorage.clear()
  return Cookies.remove(TokenKey)
}
