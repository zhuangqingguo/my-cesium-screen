import {
  reactive,
  readonly,
  computed,
  getCurrentInstance,
  watchEffect,
  watch,
  ref,
  unref,
  toRaw,
  nextTick
} from 'vue'

export default (initValue, Cesium, modal, viewer, scene) => {
  const isZhaOpen = ref(initValue)

  watchEffect(() => {
    const modalIns = modal.value?.modalIns
    if (!!viewer.value && !!scene.value && modalIns?.id === 'zhamen') {
      isZhaOpen.value = !isZhaOpen.value
      const allModels = scene.value.primitives._primitives
      const oldMatrix = modalIns.primitive.modelMatrix
      const oldCenter = new Cesium.Cartesian3(
        oldMatrix[12],
        oldMatrix[13],
        oldMatrix[14]
      )
      const oldCartographic = Cesium.Cartographic?.fromCartesian(oldCenter)
      for (let i = 0; i < allModels.length; i++) {
        if (allModels[i].appearance) {
          if (isZhaOpen.value) {
            let newHeight = oldCartographic.height + 1
            let newCartographic = new Cesium.Cartographic(
              oldCartographic.longitude,
              oldCartographic.latitude,
              newHeight
            )
            let newCartesian =
              scene.value.globe?.ellipsoid?.cartographicToCartesian(
                newCartographic
              )
            let headingPitchRoll = new Cesium.HeadingPitchRoll(0, 0, 0)
            let openMatrix = Cesium.Transforms?.headingPitchRollToFixedFrame(
              newCartesian,
              headingPitchRoll,
              Cesium.Ellipsoid.WGS84,
              Cesium.Transforms.eastNorthUpToFixedFrame,
              new Cesium.Matrix4()
            )
            modalIns.primitive.modelMatrix = openMatrix
            allModels[i].modelMatrix = {
              0: 1,
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 1,
              6: 0,
              7: 0,
              8: 0,
              9: 0,
              10: 1,
              11: 0,
              12: 0,
              13: 0,
              14: 0,
              15: 1
            }
          } else {
            let newHeight = oldCartographic.height - 1
            let newCartographic = new Cesium.Cartographic(
              oldCartographic.longitude,
              oldCartographic.latitude,
              newHeight
            )
            let newCartesian =
              scene.value.globe?.ellipsoid?.cartographicToCartesian(
                newCartographic
              )
            let headingPitchRoll = new Cesium.HeadingPitchRoll(0, 0, 0)
            let closeMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
              newCartesian,
              headingPitchRoll,
              Cesium.Ellipsoid.WGS84,
              Cesium.Transforms.eastNorthUpToFixedFrame,
              new Cesium.Matrix4()
            )
            modalIns.primitive.modelMatrix = closeMatrix
            allModels[i].modelMatrix = closeMatrix
          }
        }
      }
    }
  })

  return [isZhaOpen]
}
