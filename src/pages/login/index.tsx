import Scaffold from 'components/scaffold'
import styles from './login.module.scss'
import { FormEvent, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { asString } from 'components/stringHelpers'

interface LoginResponse {
  token?: string
}

interface LoginErrorResponse {
  title?: string
}

function browserBaseUrl() {
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
}

async function loginUser(username: string, password: string) {
  const baseUrl = browserBaseUrl()

  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  const data = (await response.json()) as LoginResponse

  if (!data.token) {
    const error = data as LoginErrorResponse
    if (error.title) {
      throw new Error(error.title)
    }
    throw new Error('Invalid login, try again')
  }
  return data.token
}

function saveCookie(name: string, value: string, expiresInMinutes: number) {
  const today = new Date()
  const expire = new Date()

  expire.setTime(today.getTime() + expiresInMinutes * 60 * 1000)

  const cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expire.toUTCString() + '; path=/'
  document.cookie = cookie
}

function removeCookie(name: string) {
  const expiresNow = new Date(0)

  const cookie = name + '=' + encodeURIComponent('') + '; expires=' + expiresNow.toUTCString() + '; path=/'
  document.cookie = cookie
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const usernameInput = document.getElementById('login-username') as HTMLInputElement
    const passwordInput = document.getElementById('login-password') as HTMLInputElement
    const loginButton = document.getElementById('login-submit') as HTMLButtonElement

    setLoading(true)
    setErrorText('')

    usernameInput.disabled = true
    passwordInput.disabled = true
    loginButton.disabled = true

    try {
      const token = await loginUser(usernameInput.value, passwordInput.value)

      removeCookie('pintra_auth')
      saveCookie('pintra_auth', token, 5)

      window.location.href = browserBaseUrl() + decodeURIComponent(asString(router.query.redirectTo) || '')
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message)
      } else {
        setErrorText(JSON.stringify(error))
      }
    } finally {
      usernameInput.disabled = false
      passwordInput.disabled = false
      loginButton.disabled = false
      setLoading(false)
    }
  }

  return (
    <Scaffold title="Login | Pintra" loginRedirect="/">
      <main className={styles.main}>
        <div className={styles.topPadding} />
        <div className={styles.loginBoxContainer}>
          <div className={styles.loginBox}>
            <form id="login-form" name="login-form" onSubmit={handleSubmit}>
              <div className="login-container" data-resin-component="promptLogin">
                <h1>Login</h1>
                <label className={styles.formField}>
                  <span>Username</span>
                  <input
                    id="login-username"
                    type="text"
                    name="login"
                    required={true}
                    placeholder="Enter your username"
                    title="Enter your username"
                    autoComplete="username"
                    autoFocus={true}
                  />
                </label>

                <label className={styles.formField}>
                  <span>Password</span>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required={true}
                    placeholder="Enter your password"
                    title="Enter your password"
                    autoComplete="password"
                  />
                </label>

                <input type="hidden" name="redirect_url" value="/" />
                <input type="hidden" name="login_page_source" value="email-login" />

                <div className={styles.formBottom}>
                  <div className={styles.errorText}> {errorText}</div>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <button id="login-submit" type="submit" className="btn btn-primary btn-full-width">
                      Login
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.bottomPadding} />
      </main>
    </Scaffold>
  )
}
