<template>
  <div id="cesiumContainer"></div>
  <!-- <div class="popup-wrapper" ref="popupInfoDom">
    <MapPopup
      :mapPopupDetails="mapPopupDetails"
      v-if="isShowMapPopup"
      @onClose="closePopup"
      v-bind="attrs"
    />
  </div>
  <div class="set-wrapper" @click="setToggle">
    <SettingOutlined style="color: #fff" />
  </div> -->
</template>

<script setup name="Cesium">
import * as Cesium from 'cesium'
import { xcModelUrl } from '@/components/map/mapData'
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  watch,
  onBeforeUnmount,
  useAttrs
} from 'vue'

import useZhamen from './useZhamen'

const viewer = ref(null)
const scene = ref(null)
const flight = ref(null)
const modalIns = ref(null)

const isShowMapPopup = ref(false)
//tree
const storageTree = ref([])
//map
// const isZhaOpen = ref(true)
const isShowSet = ref(true)
let popupInfoDom = ref(null)
const mapPopupDetails = ref({
  type: 11,
  ID: 0
})
const monitorVideoList = ref([])
let flyPosition = reactive({
  direction: Cesium.Cartesian3.fromDegrees(120.690668, 30.4079999, 15.8),
  heading: 0,
  pitch: 0,
  roll: 0
})

useZhamen(true, Cesium, modalIns, viewer, scene)

onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWRlMmQ1Ni1iNGMxLTRhY2YtYmExYi1jNjYyNTUxNDhjYzgiLCJpZCI6MjMwODAsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4OTE4NzE1NH0.QrUVmI13wKIqFwmnsGSR6aMr8FEtbO7jsTA0mqnvbdM'
  viewer.value = new Cesium.Viewer('cesiumContainer', {
    animation: false, //左下角的动画仪表盘
    baseLayerPicker: false, //右上角的图层选择按钮
    geocoder: false, //搜索框
    homeButton: false, //home按钮
    sceneModePicker: false, //模式切换按钮
    timeline: false, //底部的时间轴
    navigationHelpButton: false, //右上角的帮助按钮，
    fullscreenButton: false, //右下角的全屏按钮
    infoBox: false, //小弹窗
    selectionIndicator: false,
    zoomIndicatorContainer: false,
    navigation: false, //指南针
    navigationHelpButton: false, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false // 导航说明
  })

  scene.value = viewer.value.scene

  //隐藏底部logo
  viewer.value._cesiumWidget._creditContainer.style.display = 'none'
  //抗锯齿
  scene.value.postProcessStages.fxaa.enabled = false
  //深度检测
  scene.value.globe.depthTestAgainstTerrain = true

  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(120.6897018, 30.40551944, 105.0),
    orientation: {
      heading: Cesium.Math.toRadians(21.0),
      pitch: Cesium.Math.toRadians(-21.0),
      roll: 0.0
    }
  })

  scene.value.renderError.addEventListener(reload)
  function reload() {
    window.location.reload()
  }
  // // 转动
  // const angle = 6
  // const distance = 300
  // const startTime = Cesium.JulianDate.fromDate(new Date())
  // viewer.clock.startTime = startTime.clone()
  // viewer.clock.currentTime = startTime.clone()
  // viewer.clock.clockRange = Cesium.ClockRange.CLAMPED
  // viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK
  const initialHeading = flyPosition.heading
    ? flyPosition.heading
    : viewer.value.camera.heading

  flight.value = function TimeExecution() {
    // let delTime = Cesium.JulianDate.secondsDifference(
    //   viewer.clock.currentTime,
    //   viewer.clock.startTime
    // )
    // let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading
    // viewer.scene.camera.setView({
    //   destination: flyPosition.direction,
    //   orientation: {
    //     heading: heading,
    //     pitch: Cesium.Math.toRadians(-31)
    //   }
    // })
    // viewer.scene.camera.moveBackward(distance)
  }

  viewer.value.clock.onTick.addEventListener(flight.value)

  //初始化事件
  initEvent()
  let deviceCartesian
  function initEvent() {
    new Cesium.ScreenSpaceEventHandler(viewer.value.canvas).setInputAction(
      e => {
        let earthPosition = scene.value.pick(e?.position)

        let bengCartesian = viewer.value?.camera?.pickEllipsoid(e.position)
        let bengCartographic =
          Cesium?.Cartographic?.fromCartesian(bengCartesian)
        let lng = Cesium.Math.toDegrees(bengCartographic?.longitude).toFixed(4)
        let lat = Cesium.Math.toDegrees(bengCartographic?.latitude).toFixed(4)

        let ray = viewer.value.camera?.getPickRay(e.position)
        deviceCartesian = viewer.value?.scene?.globe?.pick(
          ray,
          viewer.value.scene
        )

        viewer.value.clock.onTick.removeEventListener(flight.value)

        if (earthPosition?.id == undefined) return
        if (earthPosition?.id) {
          viewer.value.clock.onTick.removeEventListener(flight.value)
        }
        if (typeof earthPosition.id == 'number') {
          monitorVideoList.value.forEach(item => {
            if (earthPosition.id == item.channel) {
              mapPopupDetails.value = {
                type: 7, //摄像头
                channel: item.channel,
                name: item.monitorName,
                divece: item.divece
              }
              isShowMapPopup.value = true
              popupInfoDom.value.style.display = 'block'
              scene.value.postRender.addEventListener(updatePosition)
            }
          })
        }
        if (earthPosition.id === 'xincang_JZ') {
          if (
            lng == 120.6904 ||
            lng == 120.6906 ||
            lng == 120.6907 ||
            lng == 120.6908
          ) {
            viewer.value.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                120.690668,
                30.4079999,
                8.39
              ),
              orientation: {
                heading: Cesium.Math.toRadians(137.0),
                pitch: Cesium.Math.toRadians(-31.0),
                roll: 0.0
              }
            })
          } else if (
            lng == 120.6911 ||
            (lng == 120.6912 && lat == 30.4087) ||
            (lng == 120.6912 && lat == 30.4086)
          ) {
            viewer.value.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                120.69115,
                30.4085191,
                6.39
              ),
              orientation: {
                heading: Cesium.Math.toRadians(157.0),
                pitch: Cesium.Math.toRadians(-37.0),
                roll: 0.0
              }
            })
          } else if (
            lng == 120.6919 &&
            lat != 30.4094 &&
            lat != 30.4095 &&
            lat != 30.4096 &&
            lat != 30.4097 &&
            lat != 30.4098
          ) {
            viewer.value.camera.flyTo({
              destination: Cesium.Cartesian3?.fromDegrees(
                120.6918159,
                30.4083512204,
                6.39
              ),
              orientation: {
                heading: Cesium.Math.toRadians(137.56665),
                pitch: Cesium.Math.toRadians(-40.55656),
                roll: -0.0
              }
            })
          }
        } else if (earthPosition.id === 'zhamen') {
          modalIns.value = {
            modalIns: earthPosition,
            isOpen: !modalIns.value?.isOpen
          }
        }
        if (
          (earthPosition?.id && earthPosition?.primitive?.position) ||
          earthPosition?.id?.entityCollection?.owner?.id
        ) {
          if (earthPosition && earthPosition?.id?.id) {
            if (earthPosition?.id?.ddevice == 'device') {
              setTimeout(() => {
                nextTick(() => {
                  mapPopupDetails.value = {
                    type: 1, //电磁阀
                    ID: earthPosition.id.id
                  }
                })
              }, 100)
            }
            //田间水位计站点弹框接口    监测站点----水量计量弹窗getPopoverWater    气象站 78    土壤墒情站 81
            if (earthPosition?.id?.ddevice == 'site') {
              if (earthPosition?.id?.categoryName == '田间水位站') {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 2, //田间水位计
                      ID: earthPosition.id.id
                    }
                  })
                }, 100)
              } else if (
                earthPosition?.id?.categoryName == '机械水表' ||
                earthPosition?.id?.categoryName == '远传水表'
              ) {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 3, //水量计量弹窗
                      ID: earthPosition.id.id
                    }
                  })
                }, 100)
              } else if (earthPosition?.id.id == 128) {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 'meteorology', //气象站
                      ID: earthPosition.id.id,
                      name: '气象站'
                    }
                  })
                }, 100)
              } else if (earthPosition?.id.id == 48) {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 'soilMoisture', //土壤墒情站
                      ID: earthPosition.id.id,
                      name: '土壤墒情站'
                    }
                  })
                }, 100)
              }
            }
            if (earthPosition?.id?.ddevice == 'monitor') {
              mapPopupDetails.value = {
                type: 7, //摄像头
                channel: earthPosition.id.id,
                name: earthPosition.id.name,
                divece: earthPosition.id.vdivece
              }
            }
            if (
              earthPosition?.id?.entityCollection?.owner?.id ||
              earthPosition?.id.landType == 'land'
            ) {
              viewer.value.clock.onTick.removeEventListener(flight.value)
              setTimeout(() => {
                let landId = earthPosition?.id?.entityCollection?._owner?.id
                  ? earthPosition?.id?.entityCollection?._owner?.id
                  : earthPosition?.id.id
                nextTick(() => {
                  mapPopupDetails.value = {
                    type: 'land', //地块
                    ID: landId
                  }
                })
              }, 100)
            }
            isShowMapPopup.value = true
            popupInfoDom.value.style.display = 'block'
            scene.value.postRender.addEventListener(updatePosition)
          } else {
            isShowMapPopup.value = false
            popupInfoDom.value.style.display = 'none'
            scene.value.postRender.removeEventListener(updatePosition)
          }
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )

    new Cesium.ScreenSpaceEventHandler(scene.value.canvas).setInputAction(e => {
      const currentMoveObj = scene.value.pick(e.endPosition)
      let moveCartesian = viewer.value?.camera?.pickEllipsoid(e?.endPosition)
      if (moveCartesian == undefined) return
      let moveCartographic = Cesium?.Cartographic?.fromCartesian(moveCartesian)
      let lng = Cesium.Math.toDegrees(moveCartographic?.longitude).toFixed(4)
      let lat = Cesium.Math.toDegrees(moveCartographic?.latitude).toFixed(4)
      viewer.value.clock.onTick.removeEventListener(flight.value)
      if (currentMoveObj?.id && currentMoveObj.id != 'xincang_JZ') {
        viewer.value._element.style.cursor = ''
        document.documentElement.style.cursor = 'pointer'
      } else {
        document.documentElement.style.cursor = ''
      }
      if (currentMoveObj?.id == 'xincang_JZ') {
        if (
          lng == 120.6904 ||
          lng == 120.6906 ||
          lng == 120.6907 ||
          lng == 120.6908 ||
          lng == 120.6911 ||
          (lng == 120.6912 && lat == 30.4087) ||
          (lng == 120.6912 && lat == 30.4086) ||
          (lng == 120.6919 &&
            lat != 30.4094 &&
            lat != 30.4095 &&
            lat != 30.4096 &&
            lat != 30.4097 &&
            lat != 30.4098)
        ) {
          viewer.value._element.style.cursor = ''
          document.documentElement.style.cursor = 'pointer'
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    viewer.value.screenSpaceEventHandler.setInputAction(e => {
      viewer.value.clock.onTick.removeEventListener(flight.value)
    }, Cesium.ScreenSpaceEventType.WHEEL)

    viewer.value.screenSpaceEventHandler.setInputAction(e => {
      viewer.value.clock.onTick.removeEventListener(flight.value)
      // let flyCartesian = viewer?.camera?.pickEllipsoid(e?.endPosition);
      // if (flyCartesian == undefined) return;
      // let flyCartographic = Cesium?.Cartographic?.fromCartesian(flyCartesian);
      // flyPosition.direction = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(flyCartographic?.longitude), Cesium.Math.toDegrees(flyCartographic?.latitude), flyCartographic.height)
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  }

  // 位置更新
  function updatePosition() {
    let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.value?.scene,
      deviceCartesian
    )
    if (windowPosition == undefined) return
    popupInfoDom.value.style.left = windowPosition?.x - 220 / 2 + 'px'
    popupInfoDom.value.style.top = windowPosition?.y - 150 + 'px'
  }

  addModel()
  async function addModel() {
    try {
      xcModelUrl.gltfList.forEach(async item => {
        const model = await Cesium.Model.fromGltfAsync({
          url: item.url,
          scale: 1,
          id: item.id,
          modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            Cesium.Cartesian3?.fromDegrees(
              item.position[0],
              item.position[1],
              -19.966
            ),
            new Cesium.HeadingPitchRoll(0, 0, 0)
          ),
          label: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        scene.value.primitives.add(model)
      })
      const shuiguanModel = await Cesium.Model.fromGltfAsync({
        url: '/map/shuiguan.gltf',
        scale: 0.92,
        id: 'shuiguan',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.6921501, 30.40821, 5.11),
          new Cesium.HeadingPitchRoll(-20.03623, -3.1439, -380.13)
        ),
        color: new Cesium.Color(0, 0.415, 0.7058, 0.7)
      })
      scene.value.primitives.add(shuiguanModel)
      const zhaModel = await Cesium.Model.fromGltfAsync({
        url: '/map/banZha.gltf',
        scale: 0.62,
        id: 'banZha',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.691797, 30.408418, 2.89),
          new Cesium.HeadingPitchRoll(250, 0, 0)
        ),
        color: new Cesium.Color(0.9958, 0.9958, 0.9958, 0.9)
      })
      scene.value.primitives.add(zhaModel)
      const zhaModel2 = await Cesium.Model.fromGltfAsync({
        url: '/map/caoZha.gltf',
        id: 'caoZha',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.691988, 30.407931, 2.89),
          new Cesium.HeadingPitchRoll(170, 0, 0)
        ),
        color: new Cesium.Color(1.0, 1.0, 1.0, 0.9)
      })
      scene.value.primitives.add(zhaModel2)
    } catch (error) {}
    try {
      xcModelUrl.tilesetList.forEach(async tileset => {
        const xcTileset = await Cesium.Cesium3DTileset.fromUrl(tileset.url)
        scene.value.primitives.add(xcTileset)
      })
    } catch (error) {
      console.log('tileset')
    }
  }

  addWaterLayer()
  function addWaterLayer() {
    let waterInstances = []
    let beiWaterPromise = Cesium.GeoJsonDataSource.load('/map/beiWater.geojson')
    beiWaterPromise.then(ds => {
      let entitys = ds.entities.values
      entitys.forEach(e => {
        let geometry = new Cesium.GeometryInstance({
          id: 'water',
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              e.polygon.hierarchy.getValue().positions
            ),
            height: 1,
            extrudedHeight: 1.37,
            arcType: Cesium.ArcType.GEODESIC,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromRandom({
                red: 0,
                green: 0.41568627450980394,
                blue: 0.7058823529411765,
                alpha: 1
              })
            )
          }
        })
        waterInstances.push(geometry)
      })
    })
    //
    let nanWaterPromise = Cesium.GeoJsonDataSource.load('/map/nanWater.geojson')
    nanWaterPromise.then(ds => {
      let entitys = ds.entities.values
      entitys.forEach(e => {
        let geometry = new Cesium.GeometryInstance({
          id: 'water',
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              e.polygon.hierarchy.getValue().positions
            ),
            height: 1,
            extrudedHeight: 2.58,
            arcType: Cesium.ArcType.GEODESIC,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromRandom({
                red: 0,
                green: 0.41568627450980394,
                blue: 0.7058823529411765,
                alpha: 1
              })
            )
          }
        })
        waterInstances.push(geometry)
      })
    })
    console.log(waterInstances)
    let waterPrimitive = new Cesium.Primitive({
      allowPicking: true,
      asynchronous: false,
      id: 'water',
      geometryInstances: waterInstances,
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
          fabric: {
            type: 'Water',
            uniforms: {
              baseWaterColor: new Cesium.Color(0, 0.415, 0.7058, 0.7),
              blendColor: new Cesium.Color(0, 0.415, 0.7058, 0.7),
              normalMap: '/map/waterNormals.jpg',
              frequency: 8000.0, // 控制波数的数字。'#006ab4'
              animationSpeed: 0.02, // 控制水的动画速度的数字。
              amplitude: 5.0, // 控制水波振幅的数字。
              specularIntensity: 0.8 // 控制镜面反射强度的数字。
            }
          }
        })
      })
    })
    scene.value.primitives.add(waterPrimitive)
  }
})
</script>
