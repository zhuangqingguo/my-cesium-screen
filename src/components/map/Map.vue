<script setup lang="ts">
//@ts-nocheck
import * as Cesium from 'cesium';
import { ref, reactive, nextTick, onMounted, watch, onBeforeUnmount, useAttrs } from "vue";
import MapPopup from './MapPopup.vue';
import { xcModelUrl } from './mapData'
import { getScreenDeviceById, getScreenSiteById, getLand, getVideo } from '@/api/index';

let viewer;
let flight;
const attrs = useAttrs()
//tree
const props: any = defineProps({
  mapTreeChecked: {
    type: Object
  }
});
const isShowMapPopup = ref<boolean>(false);
//tree
const storageTree = ref([]);
//map
const isZhaOpen = ref<boolean>(true);
const isShowSet = ref<boolean>(true);
let popupInfoDom = ref(null);
const mapPopupDetails = ref({
  type: 11, ID: 0
});
const monitorVideoList = ref([]);
let flyPosition = reactive({
  direction: Cesium.Cartesian3.fromDegrees(120.690668, 30.4079999, 15.8),
  heading: 0,
  pitch: 0,
  roll: 0
})

onMounted(() => {
  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWRlMmQ1Ni1iNGMxLTRhY2YtYmExYi1jNjYyNTUxNDhjYzgiLCJpZCI6MjMwODAsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4OTE4NzE1NH0.QrUVmI13wKIqFwmnsGSR6aMr8FEtbO7jsTA0mqnvbdM";
  viewer = new Cesium.Viewer('hnCesiumContainer', {
    animation: false,
    homeButton: false,
    geocoder: false,
    baseLayerPicker: false,
    timeline: false,
    shouldAnimate: false,
    fullscreenButton: false,
    infoBox: false,
    sceneModePicker: false,
    navigationInstructionsInitiallyVisible: false,
    navigationHelpButton: false,
    selectionIndicator: false,
  });
  const scene = viewer.scene;
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.postProcessStages.fxaa.enabled = false;
  //深度检测
  viewer.scene.globe.depthTestAgainstTerrain = true;
  // setTimeout(() => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(120.6897018, 30.40551944, 105.0),
      orientation: {
        heading: Cesium.Math.toRadians(21.0),
        pitch: Cesium.Math.toRadians(-21.0),
        roll: 0.0
      }
    });
  // }, 500)
  viewer.scene.renderError.addEventListener(reload);
  function reload () {
    window.location.reload();
  }
  //动
  const angle = 6;
  const distance = 300;
  const startTime = Cesium.JulianDate.fromDate(new Date());
  viewer.clock.startTime = startTime.clone();
  viewer.clock.currentTime = startTime.clone();
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
  const initialHeading = flyPosition.heading ? flyPosition.heading : viewer.camera.heading;
  flight = function TimeExecution() {
    let delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
    let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
    viewer.scene.camera.setView({
        destination : flyPosition.direction,
        orientation: {
          heading : heading,
          pitch : Cesium.Math.toRadians(-31),
        }
    });
    viewer.scene.camera.moveBackward(distance);
  };
  viewer.clock.onTick.addEventListener(flight);
  //初始化事件
  initEvent();
  let deviceCartesian;
  function initEvent() {
    new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      .setInputAction(e => {
        let earthPosition = scene.pick(e?.position);
        let ray = viewer.camera?.getPickRay(e.position);
        let bengCartesian = viewer?.camera?.pickEllipsoid(e.position);
        let bengCartographic = Cesium?.Cartographic?.fromCartesian(bengCartesian);
        let lng = (Cesium.Math.toDegrees(bengCartographic?.longitude)).toFixed(4);
        let lat = (Cesium.Math.toDegrees(bengCartographic?.latitude)).toFixed(4);
        deviceCartesian = viewer?.scene?.globe?.pick(ray, viewer.scene);
        viewer.clock.onTick.removeEventListener(flight);
        if (earthPosition?.id == undefined) return;
        if (earthPosition?.id) {
          viewer.clock.onTick.removeEventListener(flight);
        }
        if (typeof earthPosition.id == 'number') {
          monitorVideoList.value.forEach((item) => {
            if (earthPosition.id == item.channel) {
              mapPopupDetails.value = {
                type: 7,//摄像头
                channel: item.channel,
                name: item.monitorName,
                divece: item.divece
              }
              isShowMapPopup.value = true;
            popupInfoDom.value.style.display = "block";
            viewer.scene.postRender.addEventListener(updatePosition);
            }
          })
        }
        if (earthPosition.id === 'xincang_JZ') {
          if (lng == 120.6904 || lng == 120.6906 || lng == 120.6907 || lng == 120.6908) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(120.690668, 30.4079999, 8.39),
              orientation: {
                heading: Cesium.Math.toRadians(137.0),
                pitch: Cesium.Math.toRadians(-31.0),
                roll: 0.0
              }
            });
          } else if (lng == 120.6911 || lng == 120.6912 && lat == 30.4087 || lng == 120.6912 && lat == 30.4086) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(120.691150, 30.4085191, 6.39),
              orientation: {
                heading: Cesium.Math.toRadians(157.0),
                pitch: Cesium.Math.toRadians(-37.0),
                roll: 0.0
              }
            });
          } else if (lng == 120.6919 && lat != 30.4094 && lat != 30.4095 && lat != 30.4096 && lat != 30.4097 && lat != 30.4098) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3?.fromDegrees(120.6918159, 30.4083512204, 6.39),
              orientation: {
                heading: Cesium.Math.toRadians(137.56665),
                pitch: Cesium.Math.toRadians(-40.55656),
                roll: -0.0
              }
            });
          }
        } else if (earthPosition.id === 'zhamen') {
          isZhaOpen.value = !isZhaOpen.value;
          const allModels = scene.primitives._primitives;
          const oldMatrix = earthPosition.primitive.modelMatrix;
          const oldCenter = new Cesium.Cartesian3(oldMatrix[12], oldMatrix[13], oldMatrix[14]);
          const oldCartographic = Cesium.Cartographic?.fromCartesian(oldCenter);
          for (let i = 0; i < allModels.length; i++) {
            if (allModels[i].appearance) {
              if (isZhaOpen.value) {
                let newHeight = oldCartographic.height + 1;
                let newCartographic = new Cesium.Cartographic(oldCartographic.longitude, oldCartographic.latitude, newHeight);
                let newCartesian = viewer.scene.globe?.ellipsoid?.cartographicToCartesian(newCartographic);
                let headingPitchRoll = new Cesium.HeadingPitchRoll(0, 0, 0);
                let openMatrix = Cesium.Transforms?.headingPitchRollToFixedFrame(newCartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());
                earthPosition.primitive.modelMatrix = openMatrix;
                allModels[i].modelMatrix = { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0, 10: 1, 11: 0, 12: 0, 13: 0, 14: 0, 15: 1 };
              } else {
                let newHeight = oldCartographic.height - 1;
                let newCartographic = new Cesium.Cartographic(oldCartographic.longitude, oldCartographic.latitude, newHeight);
                let newCartesian = viewer.scene.globe?.ellipsoid?.cartographicToCartesian(newCartographic);
                let headingPitchRoll = new Cesium.HeadingPitchRoll(0, 0, 0);
                let closeMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(newCartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());
                earthPosition.primitive.modelMatrix = closeMatrix;
                allModels[i].modelMatrix = closeMatrix;
              }
            }
          }
        }
        if (earthPosition?.id && earthPosition?.primitive?.position || earthPosition?.id?.entityCollection?.owner?.id) {
          if (earthPosition && earthPosition?.id?.id) {
            if (earthPosition?.id?.ddevice == 'device') {
              setTimeout(() => {
                nextTick(() => {
                  mapPopupDetails.value = {
                    type: 1,//电磁阀
                    ID: earthPosition.id.id
                  }
                })
              }, 100);
            }
            //田间水位计站点弹框接口    监测站点----水量计量弹窗getPopoverWater    气象站 78    土壤墒情站 81
            if (earthPosition?.id?.ddevice == 'site') {
              if (earthPosition?.id?.categoryName == '田间水位站') {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 2,//田间水位计
                      ID: earthPosition.id.id
                    }
                  })
                }, 100);
              } else if (earthPosition?.id?.categoryName == '机械水表' || earthPosition?.id?.categoryName == '远传水表') {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 3,//水量计量弹窗
                      ID: earthPosition.id.id
                    }
                  })
                }, 100);
              } else if (earthPosition?.id.id == 128) {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 'meteorology',//气象站
                      ID: earthPosition.id.id,
                      name: '气象站'
                    }
                  })
                }, 100);
              } else if (earthPosition?.id.id == 48) {
                setTimeout(() => {
                  nextTick(() => {
                    mapPopupDetails.value = {
                      type: 'soilMoisture',//土壤墒情站
                      ID: earthPosition.id.id,
                      name: '土壤墒情站'
                    }
                  })
                }, 100);
              }
            }
            if (earthPosition?.id?.ddevice == 'monitor') {
              mapPopupDetails.value = {
                type: 7,//摄像头
                channel: earthPosition.id.id,
                name: earthPosition.id.name,
                divece: earthPosition.id.vdivece
              }
            }
            if (earthPosition?.id?.entityCollection?.owner?.id || earthPosition?.id.landType == "land") {
              viewer.clock.onTick.removeEventListener(flight);
              setTimeout(() => {
                let landId = earthPosition?.id?.entityCollection?._owner?.id ? earthPosition?.id?.entityCollection?._owner?.id : earthPosition?.id.id
                nextTick(() => {
                  mapPopupDetails.value = {
                    type: 'land',//地块
                    ID: landId,
                  }
                })
              }, 100);
            }
            isShowMapPopup.value = true;
            popupInfoDom.value.style.display = "block";
            viewer.scene.postRender.addEventListener(updatePosition);
          } else {
            isShowMapPopup.value = false;
            popupInfoDom.value.style.display = "none";
            viewer.scene.postRender.removeEventListener(updatePosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      new Cesium.ScreenSpaceEventHandler(scene.canvas)
      .setInputAction((e) => {
        const currentMoveObj = scene.pick(e.endPosition);
        let moveCartesian = viewer?.camera?.pickEllipsoid(e?.endPosition);
        if (moveCartesian == undefined) return;
        let moveCartographic = Cesium?.Cartographic?.fromCartesian(moveCartesian);
        let lng = (Cesium.Math.toDegrees(moveCartographic?.longitude)).toFixed(4);
        let lat = (Cesium.Math.toDegrees(moveCartographic?.latitude)).toFixed(4);
        viewer.clock.onTick.removeEventListener(flight);
        if (currentMoveObj?.id && currentMoveObj.id != 'xincang_JZ') {
          viewer._element.style.cursor = '';
          document.documentElement.style.cursor = 'pointer';
        } else {
          document.documentElement.style.cursor = '';
        }
        if (currentMoveObj?.id == 'xincang_JZ') {
          if (lng == 120.6904 || lng == 120.6906 || lng == 120.6907 || lng == 120.6908 || lng == 120.6911 || lng == 120.6912 && lat == 30.4087 || lng == 120.6912 && lat == 30.4086 || lng == 120.6919 && lat != 30.4094 && lat != 30.4095 && lat != 30.4096 && lat != 30.4097 && lat != 30.4098) {
            viewer._element.style.cursor = '';
            document.documentElement.style.cursor = 'pointer';
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      viewer.screenSpaceEventHandler
      .setInputAction((e) => {
        viewer.clock.onTick.removeEventListener(flight);
      }, Cesium.ScreenSpaceEventType.WHEEL);
      viewer.screenSpaceEventHandler
      .setInputAction((e) => {
        viewer.clock.onTick.removeEventListener(flight);
        // let flyCartesian = viewer?.camera?.pickEllipsoid(e?.endPosition);
        // if (flyCartesian == undefined) return;
        // let flyCartographic = Cesium?.Cartographic?.fromCartesian(flyCartesian);
        // flyPosition.direction = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(flyCartographic?.longitude), Cesium.Math.toDegrees(flyCartographic?.latitude), flyCartographic.height)
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  }
  // 位置更新
  function updatePosition() {
    let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer?.scene, deviceCartesian);
    if (windowPosition == undefined) return
    popupInfoDom.value.style.left = (windowPosition?.x - (220 / 2)) + 'px'
    popupInfoDom.value.style.top = (windowPosition?.y - 150) + 'px'
  }
  addModel();
  async function addModel() {
    try {
      xcModelUrl.gltfList.forEach(async (item) => {
        const model = await Cesium.Model.fromGltfAsync({
          url: item.url,
          scale: 1,
          id: item.id,
          modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            Cesium.Cartesian3?.fromDegrees(item.position[0], item.position[1], -19.966),
            new Cesium.HeadingPitchRoll(0, 0, 0),
          ),
          label: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
        scene.primitives.add(model);
      });
      const shuiguanModel = await Cesium.Model.fromGltfAsync({
        url: '/map/shuiguan.gltf',
        scale: 0.92,
        id: 'shuiguan',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.6921501, 30.408210, 5.11),
          new Cesium.HeadingPitchRoll (-20.03623, -3.1439, -380.13),
        ),
        color: new Cesium.Color(0, 0.415, 0.7058, 0.7)
      });
      scene.primitives.add(shuiguanModel);
      const zhaModel = await Cesium.Model.fromGltfAsync({
        url: '/map/banZha.gltf',
        scale: 0.62,
        id: 'banZha',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.691797, 30.408418, 2.89),
          new Cesium.HeadingPitchRoll (250, 0, 0),
        ),
        color: new Cesium.Color(0.9958, 0.9958, 0.9958, 0.9)
      });
      scene.primitives.add(zhaModel);
      const zhaModel2 = await Cesium.Model.fromGltfAsync({
        url: '/map/caoZha.gltf',
        id: 'caoZha',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          Cesium.Cartesian3.fromDegrees(120.691988, 30.407931, 2.89),
          new Cesium.HeadingPitchRoll (170, 0, 0),
        ),
        color: new Cesium.Color(1.0, 1.0, 1.0, 0.9)
      });
      scene.primitives.add(zhaModel2);
    } catch (error) {
    }
    try {
      xcModelUrl.tilesetList.forEach(async (tileset) => {
        const xcTileset = await Cesium.Cesium3DTileset.fromUrl(tileset.url);
        viewer.scene.primitives.add(xcTileset);
      })
    } catch (error) {
      console.log('tileset');
    }
  }
  addWaterLayer();
  function addWaterLayer() {
    let waterInstances = [];
    let beiWaterPromise = Cesium.GeoJsonDataSource.load('/map/beiWater.geojson');
    beiWaterPromise.then((ds) => {
      let entitys = ds.entities.values;
      entitys.forEach((e) => {
        let geometry = new Cesium.GeometryInstance({
          id: 'water',
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              e.polygon.hierarchy.getValue().positions
            ),
            height: 1,
            extrudedHeight: 1.37,
            arcType: Cesium.ArcType.GEODESIC,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromRandom({
                red: 0, green: 0.41568627450980394, blue: 0.7058823529411765, alpha: 1
              })
            ),
          },
        });
        waterInstances.push(geometry);
      });
    });
    //
    let nanWaterPromise = Cesium.GeoJsonDataSource.load('/map/nanWater.geojson');
    nanWaterPromise.then((ds) => {
      let entitys = ds.entities.values;
      entitys.forEach((e) => {
        let geometry = new Cesium.GeometryInstance({
          id: 'water',
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              e.polygon.hierarchy.getValue().positions
            ),
            height: 1,
            extrudedHeight: 2.58,
            arcType: Cesium.ArcType.GEODESIC,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromRandom({
                red: 0, green: 0.41568627450980394, blue: 0.7058823529411765, alpha: 1
              })
            ),
          },
        });
        waterInstances.push(geometry);
      });
    });
    console.log(waterInstances)
    let waterPrimitive = new Cesium.Primitive({
        allowPicking: true,
        asynchronous: false,
        id: 'water',
        geometryInstances: waterInstances,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: "Water",
              uniforms: {
                baseWaterColor: new Cesium.Color(0, 0.415, 0.7058, 0.7),
                blendColor: new Cesium.Color(0, 0.415, 0.7058, 0.7),
                normalMap: "/map/waterNormals.jpg",
                frequency: 8000.0, // 控制波数的数字。'#006ab4'
                animationSpeed: 0.02, // 控制水的动画速度的数字。
                amplitude: 5.0, // 控制水波振幅的数字。
                specularIntensity: 0.8, // 控制镜面反射强度的数字。
              },
            },
          }),
        }),
      });
      scene.primitives.add(waterPrimitive);
  }
  // growLayer();
  // function growLayer() {
  //   let growPromise = Cesium.GeoJsonDataSource.load('/map/test2.geojson');
  //   growPromise.then((ds) => {
  //     let entity = ds.entities.values;
  //     entity.forEach(async (e) => {
  //       let growCartesian = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(e.position._value.x, e.position._value.y, e.position._value.z + 6));
  //       let growModel = await Cesium.Model.fromGltfAsync({
  //         url: '/map/shuidao2.gltf',
  //         modelMatrix: growCartesian,
  //         scale : 3.0,
  //         minimumPixelSize : 80,
  //         maximumScale: 13,
  //         // loop: Cesium.ModelAnimationLoop.REPEAT.toExponential,
  //       });
  //       scene.primitives.add(growModel);
  //     })
  //   });   
  // }
  //获取地块
  getLand().then(async (res) => {
    if (res?.data?.length) {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].landGeojsonUrl) {
          const dataSource = await Cesium.GeoJsonDataSource.load(res.data[i].landGeojsonUrl, {
            stroke: new Cesium.Color(0, 0, 0, 0),
            fill: new Cesium.Color(0, 0, 0, 0),
            strokeWidth: 3,
            clampToGround: true,
          });
          const landGeoPromise = async () => {
            try {
              const polygonalFrame = await viewer.dataSources.add(dataSource);
              polygonalFrame.id = res.data[i].id;
              polygonalFrame.landType = 'land';
              viewer.zoomTo(polygonalFrame);
            }
            catch (err) {
            }
          };
          landGeoPromise();
        }
      }
    }
  });
  addLandText();
  //只有设备才有监控
  watch(() => props.mapTreeChecked, (newVal) => {
    let aLength = newVal.length
    let bLength = storageTree.value.length
    if (bLength > aLength) {
      let diffTree = storageTree.value.filter(obj =>
        !newVal.includes(obj) && obj.children == undefined
      );
      if (diffTree && diffTree.length) {
        for (let i = 0; i < diffTree.length; i++) {
          viewer.entities.removeById(diffTree[i].key);
          if (diffTree[i].category == 1) {
            getScreenDeviceById({ parentId: diffTree[i].key }).then((res) => {
              if (res?.data?.length) {
                for (let i = 0; i < res.data.length; i++) {
                  viewer.entities.removeById(res.data[i].id);
                }
              }
            });
          } else if (diffTree[i].category == 2) {
            getScreenSiteById({ objectCategoryId: diffTree[i].key }).then((res) => {
              if (res?.data?.length) {
                for (let i = 0; i < res.data.length; i++) {
                  viewer.entities.removeById(res.data[i].id);
                }
              }
            });
          } else if (diffTree[i].category == 3) {
            for (let i = 0; i < videoMonitorPoint.length; i++) {
              viewer.entities.removeById(videoMonitorPoint[i].channel.toString());
            }
            for (let i = 0; i < allPrimitives.length; i++) {
              for (let j = 0; j < monitorVideoList.value.length; j++) {
                if (Number(monitorVideoList.value[j].channel) == Number(allPrimitives[i].id)) {
                  viewer.scene.primitives.remove(allPrimitives[i]);
                }
              }
            }
          }
        }
      }
    } else {
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i].category == 1 && newVal[i].title != '设备分类') {
          getDeviceData(newVal[i].key);
        } else if (newVal[i].category == 2 && newVal[i].title != '监测站点') {
          getSiteData(newVal[i].key);
        } else if (newVal[i].category == 3 && newVal[i].title == '摄像头') {
          showVideoMonitor();
        }
      }
    }
    storageTree.value = newVal;
    const allPrimitives = viewer.scene.primitives._primitives
    if (newVal.length == 0) {
      for (let i = 0; i < allPrimitives.length; i++) {
        for (let j = 0; j < monitorVideoList.value.length; j++) {
          if (Number(monitorVideoList.value[j].channel) == Number(allPrimitives[i].id)) {
            viewer.scene.primitives.remove(allPrimitives[i]);
          }
        }
      }
    }
  });
  //接口设备
  function getDeviceData(parID) {
    getScreenDeviceById({ parentId: parID }).then((res) => {
      if (res?.data?.length) {
        for (let i = 0; i < res.data.length; i++) {
          if (Number(res.data[i].longitude)) {
            viewer.entities.add({
              name: res.data[i].name,
              id: res.data[i].id,
              acode: res.data[i].code,
              ddevice: 'device',
              position: Cesium.Cartesian3.fromDegrees(Number(res.data[i].longitude), Number(res.data[i].latitude), 5),
              billboard: {
                image: res.data[i].iconUrl,
                show: true,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.2,
              },
            });
          }
        }
      }
    });
  }
  async function getSiteData(parID) {
    //76:田间水位站  104 机械水表  105 远传水表
    await getScreenSiteById({ objectCategoryId: parID }).then((res) => {
      if (res?.data?.length) {
        for (let i = 0; i < res.data.length; i++) {
          if (Number(res.data[i].longitude)) {
            viewer.entities.add({
              id: res.data[i].id,
              name: res.data[i].name,
              acode: res.data[i].code,
              categoryName: res.data[i].categoryName,
              ddevice: 'site',
              position: Cesium.Cartesian3.fromDegrees(Number(res.data[i].longitude), Number(res.data[i].latitude), 5),
              billboard: {
                image: res.data[i].iconUrl,
                show: true,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.2,
              },
            });
          }
        }
      }
    });
  };
  function showVideoMonitor() {
    getVideo().then(async (res) => {
      if (res?.data?.length) {
        monitorVideoList.value = res?.data;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].channel == 220 || res.data[i].channel == 221) {
            viewer.entities.add({
              id: res.data[i].channel.toString(),
              name: res.data[i].monitorName,
              vdivece: res.data[i].divece,
              ddevice: 'monitor',
              position: Cesium.Cartesian3.fromDegrees(Number(res.data[i].longitude), Number(res.data[i].latitude), 8),
              billboard: {
                image: '/map/monitor_icon.png',
                show: true,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.7,
              },
            });
          } else {
            try {
              const telegraphPoleModel = await Cesium.Model.fromGltfAsync({
                url: "/map/telegraph_pole.glb",
                id: res.data[i].channel,
                name: res.data[i].monitorName,
                vdivece: res.data[i].divece,
                ddevice: 'monitor',
                modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                  Cesium.Cartesian3.fromDegrees(Number(res.data[i].longitude), Number(res.data[i].latitude), 5),
                  new Cesium.HeadingPitchRoll (-20.03623, -3.1439, -380.13),
                ),
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
              });
              viewer.scene.primitives.add(telegraphPoleModel);
            } catch (error) {
            }
          }
        }
      }
    })
  };
});
const closePopup = () => {
  isShowMapPopup.value = false;
}
const setToggle = () => {
  isShowSet.value = !isShowSet.value
  if (!isShowSet.value) {
    getLand().then((res) => {
      if (res?.data?.length) {
        for (let i = 0; i < res.data.length; i++) {
          viewer.entities.removeById(res.data[i].id);
        }
      }
    });
  } else {
    addLandText();
  }
}
const addLandText = () => {
  getLand().then(async (res) => {
    if (res?.data?.length) {
      for (let i = 0; i < res.data.length; i++) {
        let h = 11
        if (res.data[i].name.indexOf('大棚') != -1 || res.data[i].name == '测坑测桶试区') {
          h = 15
        }
        viewer.entities.add({
          id: res.data[i].id,
          landType: 'land',
          position: Cesium.Cartesian3.fromDegrees(Number(res.data[i].longitude), Number(res.data[i].latitude), h),
          label: {
            text: res.data[i].landArea ? res.data[i].name + '\n' + res.data[i].landArea + '亩' : res.data[i].name,
            font: 'bold 12px sans-serif',
            fillColor: new Cesium.Color.fromCssColorString('#fff'),
            showBackground: true,
            backgroundColor: new Cesium.Color(0, 0, 0, 0),//new Cesium.Color(0, 0.415, 0.7058, 0.9),//
            show: true,
          },
          billboard: {
            image: '/map/text_border.png',
            show: true,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            scale: 1.0,
            width: 100,
            height: 36,
          },
        });
      }
    }
  })
}
onBeforeUnmount(() => {
  viewer.scene.primitives.remove(viewer.scene.primitives._primitives);
  viewer.clock.onTick.removeEventListener(flight);
})
</script>

<template>
  <div id="hnCesiumContainer"></div>
  <div class="popup-wrapper" ref="popupInfoDom">
    <MapPopup :mapPopupDetails="mapPopupDetails" v-if="isShowMapPopup" @onClose="closePopup" v-bind="attrs" />
  </div>
  <div class="set-wrapper" @click="setToggle">
    <SettingOutlined style="color: #fff" />
  </div>
</template>

<style lang="less" scoped>
.popup-wrapper {
  position: absolute;
  top: 30%;
  left: 40%;
  display: none;
  color: #fff;
  z-index: 3;
  border-image: linear-gradient(180deg,
      rgba(135, 208, 255, 1),
      rgba(86, 169, 253, 1),
      rgba(34, 79, 143, 1),
      rgba(31, 78, 142, 1)) 1 1;
  background: linear-gradient(180deg,
      #3787ff 0%,
      #0e2341 30%,
      #020b19 63%,
      #020a18 86%,
      #151b26 100%);
  opacity: 0.9;
}
.set-wrapper {
  position: absolute;
  bottom: 30px;
  right: 50px;
  z-index: 999;
  cursor: pointer;
  opacity: 1;
}
</style>
