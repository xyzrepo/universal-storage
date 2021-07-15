<template>
<div>
  {{ JSON.stringify($storage.state) }}
  <br/>
  localStorageTest:{{ localStorageTest ? 'PASSED' : 'FAILED' }}
  <br/>
  sessionStorageTest:{{ sessionStorageTest ? 'PASSED' : 'FAILED' }}
  <br/>
  cookieStorageTest:{{ cookieStorageTest ? 'PASSED' : 'FAILED' }}
</div>
</template>

<script>
export default {
  data () {
    return {
      test: 'PASSED!',
      localStorageTest: false,
      sessionStorageTest: false,
      cookieStorageTest: false,
    }
  },
  created() {
    this.localStorageTest = this.$storage.getLocalStorage('localStorage')
    this.sessionStorageTest = this.$storage.getSessionStorage('sessionStorage')
    this.cookieStorageTest = this.$storage.getCookie('cookieStorage')
  }
}
</script>
