import Vue from 'vue';
import { Storage } from '~storage'
import activateAutoState from './auto-state.client'
import { forEach, pick, omit } from 'lodash';

export default function nuxtUniversalStorage(ctx, inject) {
  let options = <%= JSON.stringify(options, null, 2) %>
  const cookie = <%= serialize(options.cookie) %>

    options = {
    ...options,
      cookie
  }

  // Create new instance of Storage class
  const storage = new Storage(ctx, options)

  // Inject into context as $storage
  ctx.$storage = storage
  inject('storage', storage)

  // activate autoState mixin using $storages
  if (process.browser && options.autoState !== false)
    activateAutoState(storage, options)
}
