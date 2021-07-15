//import { Storage } from '~storage'
import Vue from "vue";
/* import auto state mixin dependencies */
import { forEach, pickBy } from "lodash";

export default function autoState($storage) {
  //const $storage = storage

  if (!Vue.__auto_save_state_global_mixin__) {
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
            console.log("universal auto state mixin is created");
          },

          mounted() {
            this.loadState();
            console.log("universal auto state mixin is mounted");
          },

          methods: {
            loadState() {
              const savedState = $storage.getUniversal(
                this.autoStateConfig().cacheKey
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

            saveState() {
              const data = pickBy(this.$data, (value, attribute) => {
                return this.attributeIsManagedBySaveState(attribute);
              });

              $storage.setUniversal(this.autoStateConfig().cacheKey, data);
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
              $storage.removeUniversal(this.autoStateConfig().cacheKey);
            },

            autoStateConfig: () => {
              return {
                cacheKey: "defaultCacheKey"
              }
            }
          }
        }
      ]
    }); // Set up your mixin then
    //console.log("universal auto state mixin is loaded inside IF");
  }
  //console.log("universal auto state mixin is loaded outside IF");
}
