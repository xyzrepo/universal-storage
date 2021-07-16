import Vue from "vue";
import {
  forEach,
  pick,
  omit
} from "lodash";

export default function activateAutoState(storage, opts) {
  let $storage = storage;
  let $options = opts;
  Vue.mixin({
    mixins: [{
      watch: {
        $data: {
          handler() {
            this.saveState();
          },
          deep: true
        }
      },

      created() {
        this.loadState();
      },

      beforeMount() {
        this.loadState();
      },
      methods: {
        loadState() {
          const savedState = $storage.getUniversal(
            $options.autoState.cacheKey
          );

          if (!savedState) {
            return;
          }

          forEach(this._sanitizeData(savedState, {
            saveProperties: $options.autoState.saveProperties,
            ignoreProperties: $options.autoState.ignoreProperties
          }), (value, key) => {
            /*  if (this.autoStateConfig().onLoad) {
               value = this.autoStateConfig().onLoad(key, value);
             } */
            this.$data[key] = value;
          });
        },
        saveState() {
          const data = this._sanitizeData(this.$data, {
            saveProperties: $options.autoState.saveProperties,
            ignoreProperties: $options.autoState.ignoreProperties
          });

          $storage.setUniversal($options.autoState.cacheKey, data);

        },
        _sanitizeData(data, {
          saveProperties,
          ignoreProperties
        }) {
          let result = (ignoreProperties ? omit(data, ignoreProperties) : data)
          return (saveProperties ? pick(result, saveProperties) : result);
        },

        clearSavedState() {
          $storage.removeUniversal($options.autoState.cacheKey);
        }
      }
    }]
  }); // Set up your mixin then
  /* } */
}
