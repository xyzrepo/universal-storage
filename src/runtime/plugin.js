import { Storage } from '~storage'
//import autoState from '~state'
 import Vue from 'vue'
// /* import auto state mixin dependencies */
 import { forEach, pickBy, pick, omit } from 'lodash';

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


  if (!Vue.__auto_save_state_global_mixin__) {
    const $storage = storage;
    Vue.__auto_save_state_global_mixin__ = true;
    Vue.mixin({
      mixins: [
        {
          watch: {
            $data: {
              handler() {
                this.saveState();
              },
              deep: true
            }
          },

          created() {
            this.loadState()
          },

          beforeMount() {
            this.loadState();
          },
          data () {
            return {
              _cacheKey_: this.autoStateConfig().cacheKey || 'storage'
            }
          },
          methods: {
            loadState() {
              if (!this.autoStateConfig()) {
                return;
              }
              const savedState = $storage.getUniversal(
                _cacheKey_
              );

              if (!savedState) {
                return;
              }
              /* let sanitizedState = this._sanitizeData(savedState, {
                saveProperties: this.autoStateConfig().saveProperties,
                ignoreProperties: this.autoStateConfig().ignoreProperties
              }) */
              forEach(this._sanitizeData(savedState, {
                saveProperties: this.autoStateConfig().saveProperties,
                ignoreProperties: this.autoStateConfig().ignoreProperties
              }), (value, key) => {
                //if (this.attributeIsManagedBySaveState(key)) {
                  if (this.autoStateConfig().onLoad) {
                    value = this.autoStateConfig().onLoad(key, value);
                  }

                  this.$data[key] = value;
                //}
              });
            },
            saveState() {
              if (!this.autoStateConfig()) {
                return;
              }
              const data = this._sanitizeData(this.$data, {
                saveProperties: this.autoStateConfig().saveProperties,
                ignoreProperties: this.autoStateConfig().ignoreProperties
              });

              $storage.setUniversal(_cacheKey_, data);

            },
            _sanitizeData(data, { saveProperties, ignoreProperties }) {
              let result = (ignoreProperties ? omit(data, ignoreProperties) : data)
              return (saveProperties ? pick(result, saveProperties) : result);
            },
            originalloadState() {
              if (!this.autoStateConfig()) {
                return;
              }
              const savedState = $storage.getUniversal(
                _cacheKey_
              );

              if (!savedState) {
                return;
              }

              forEach(savedState, (value, key) => {
                if (this.attributeIsManagedBySaveState(key)) {
                  if (this.autoStateConfig().onLoad) {
                    value = this.autoStateConfig().onLoad(key, value);
                  }

                  this.$data[key] = value;
                }
              });
            },
            OriginalsaveState() {
              const data = pickBy(this.$data, (value, attribute) => {
                return this.attributeIsManagedBySaveState(attribute);
              });

              if (!this.autoStateConfig()) {
                return;
              }
              $storage.setUniversal(_cacheKey_, data);

            },

            attributeIsManagedBySaveState(attribute) {
              if (
                this.autoStateConfig().ignoreProperties &&
                this.autoStateConfig().ignoreProperties.indexOf(attribute) !==
                -1
              ) {
                return false;
              }

              if (!this.autoStateConfig().saveProperties) {
                return true;
              }

              return (
                this.autoStateConfig().saveProperties.indexOf(attribute) !== -1
              );
            },

            clearSavedState() {
              if (!this.autoStateConfig()) {
                return;
              }
              $storage.removeUniversal(_cacheKey_);
            },

            autoStateConfig() {
              return {
                cacheKey: "storage"
              }
            }
          }
        }
      ]
    }); // Set up your mixin then
  }
}
