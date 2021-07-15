export default function ({ $storage }) {
  $storage.syncUniversal('works', true)
  $storage.setLocalStorage('localStorage', true)
  $storage.setSessionStorage('sessionStorage', true)
  $storage.setCookie('cookieStorage', true)
}
