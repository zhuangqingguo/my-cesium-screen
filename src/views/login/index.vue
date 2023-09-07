<script lang="jsx">
import { getInfo, ssoLogin } from '@/api/common'
import Cookies from 'js-cookie'
import { onMounted, defineComponent, reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const state = reactive({
      loading: true,
      ssoForm: {
        appId: 'test-station-screen',
        service: '',
        ticket: ''
      },
      data: [],
      ticketName: '',
      ticketRemark: ''
    })

    function ssoLoginFn() {
      if (window.location) {
        if (window.location && !window.location.search) {
          // 认证平台跳回，并在地址栏包含ticket,获取ticket
          window.location.href = `${
            import.meta.env.VITE_CAS_URL
          }/login?service=${window.location.origin}`
        } else {
          // 单点登录url中没有ticket，跳至认证中心url
          let service = window.location.origin
          let ticket = decodeURIComponent(window.location.search)

          if (ticket.indexOf('?ticket=') > -1) {
            ticket = ticket.split('?ticket=')[1]
            state.ssoForm.service = service
            state.ssoForm.ticket = ticket
            ssoLogin(state.ssoForm)
              .then(res => loginSuccess(res))
              .catch(err => requestFailed(err))
              .finally(() => {})
          } else {
            //没有cas登录、没有ticket直接返回登录页
            window.location.href = `${
              import.meta.env.VITE_CAS_URL
            }/login?service=${window.location.origin}`
          }
        }
      }
    }
    onMounted(() => {
      ssoLoginFn()
    })

    function casLogin() {
      window.location.href = `${import.meta.env.VITE_CAS_URL}/login?service=${
        window.location.origin
      }`
    }
    //登录成功
    function loginSuccess(res) {
      userStore.setUserInfo(res.data.user)

      Cookies.set('userId', res.data.user.userId)
      Cookies.set('ACCESS_TOKEN', res.data.token)
      router.push({ path: '/home' })
    }
    //登录失败
    function requestFailed(err) {
      if (Cookies.get('serveErr')) {
        state.data = JSON.parse(Cookies.get('serveErr'))
      } else {
        state.data = { code: err.data.code, message: err.data.message }
      }

      state.loading = false

      state.ticketName = '单点登录失败'
      state.ticketRemark = state.data.code + ':' + state.data.message
    }

    return () => (
      <div className="login-container">
        {state.loading ? (
          <a-spin size="large" />
        ) : (
          <div className="login-box">
            <a-result
              status="404"
              title={state.ticketName}
              sub-title={state.ticketRemark}
            >
              {{
                extra: () => (
                  <a-button type="primary" onClick={casLogin}>
                    返回登录页
                  </a-button>
                )
              }}
            </a-result>
          </div>
        )}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  position: relative;
  width: 400px;
  height: 500px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
</style>
