import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { useUserStore } from './store/userStore'
import '@nutui/nutui-react-taro/dist/style.css'
import './app.scss'

// Auth pages that should not trigger redirect to login
const AUTH_PAGES = [
  '/pages/auth/login',
  '/pages/auth/profile-complete',
  '/pages/auth/bind-phone',
]

function isAuthPage(path: string): boolean {
  return AUTH_PAGES.some((p) => path.includes(p))
}

class App extends Component<PropsWithChildren> {

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth = async () => {
    const token = Taro.getStorageSync('token')
    const currentPath = Taro.getCurrentPages()?.[0]?.route || ''

    // If already on an auth page, don't redirect
    if (isAuthPage(currentPath)) {
      return
    }

    if (!token) {
      // No token at all, go to login
      Taro.redirectTo({ url: '/pages/auth/login' })
      return
    }

    // Token exists, try to fetch user info to validate it
    try {
      await useUserStore.getState().fetchUserInfo()
    } catch (error: any) {
      // Token might be expired, try to refresh
      const refreshToken = Taro.getStorageSync('refreshToken')
      if (refreshToken) {
        try {
          const refreshed = await useUserStore.getState().refreshAccessToken()
          if (refreshed) {
            // Token refreshed successfully, retry fetching user info
            try {
              await useUserStore.getState().fetchUserInfo()
            } catch (retryError) {
              console.error('刷新token后获取用户信息仍失败:', retryError)
            }
            return
          }
        } catch (refreshError) {
          console.error('刷新token失败:', refreshError)
        }
      }

      // Refresh failed or no refresh token, clear and redirect to login
      Taro.removeStorageSync('token')
      Taro.removeStorageSync('refreshToken')
      useUserStore.setState({ token: null, refreshToken: null, userInfo: null })
      Taro.redirectTo({ url: '/pages/auth/login' })
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children is the page to be rendered
  render () {
    return this.props.children
  }
}

export default App
