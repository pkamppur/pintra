export function saveCookie(name: string, value: string, expiresInMinutes: number) {
  const today = new Date()
  const expire = new Date()

  expire.setTime(today.getTime() + expiresInMinutes * 60 * 1000)

  const cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expire.toUTCString() + '; path=/'
  document.cookie = cookie
}

export function removeCookie(name: string) {
  const expiresNow = new Date(0)

  const cookie = name + '=' + encodeURIComponent('') + '; expires=' + expiresNow.toUTCString() + '; path=/'
  document.cookie = cookie
}
