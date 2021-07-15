import { setupTest, get, createPage } from '@nuxt/test-utils'

describe('My test', () => {
  setupTest({
    configFile: 'nuxt.config.ts',
    server: true
  })

  it('renders state', async () => {
    const { body } = await get('/')

    expect(body).toContain('{&quot;works&quot;:true}')
  })

})

describe('My 2nd test', () => {
  setupTest({
    configFile: 'nuxt.config.ts',
    browser: true
  })

  it('can use local storage', async () => {
    const page = await createPage('/')
    const html = await page.innerHTML('body')

    expect(html).toContain('localStorageTest:PASSED')
  })

  it('can use session storage', async () => {
    const page = await createPage('/')
    const html = await page.innerHTML('body')

    expect(html).toContain('sessionStorageTest:PASSED')
  })


  it('can use cookies', async () => {
    const page = await createPage('/')
    const html = await page.innerHTML('body')

    expect(html).toContain('cookieTest:PASSED')
  })
})
