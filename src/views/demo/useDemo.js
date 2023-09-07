import {
  reactive,
  readonly,
  computed,
  getCurrentInstance,
  watch,
  watchEffect,
  unref,
  toRaw,
  nextTick
} from 'vue'

export default data => {
  watchEffect(() => {
    console.log(2222, data.value)
  })

  // watch(
  //   () => data.value,
  //   data => {
  //     console.log(3333333, data)
  //   }
  // )

  // console.log(1111111)

  // return []
}
