<script setup lang="ts">
//@ts-nocheck
import topBg from '@/assets/images/info-window-top-bg.png';
import { ref, onMounted, useAttrs, watch, nextTick } from 'vue'
import EasyPlayer from '@/components/EasyPlayer/index.vue'
import { getPopoverDevice, getPopoverWater, getPopoverSite, landDetailsById, getPopoverMeteorological, getPopoverMoisture } from '@/api/index';

const emits = defineEmits(['onClose'])
let comPopupData = ref({});
const attrs: any = useAttrs()
const props: any = defineProps({
  mapPopupDetails: {
    type: Object,
  }
});

const onClose = () => {
  emits('onClose')
}
const handlePlotInfo = id => {
  const landId = props.mapPopupDetails.ID
  if (landId) {
    attrs?.onHandlePlotInfo && attrs.onHandlePlotInfo(landId)
  }
}
watch(() => props.mapPopupDetails.ID, (newVal, oldVal) => {
  if (newVal) {
    if (props.mapPopupDetails.type == 1) {
      getPopoverDevice({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
          if (comPopupData.status) {
            comPopupData.value.status = true;
          } else {
            comPopupData.value.status = false;
          }
        }
      });
    } else if (props.mapPopupDetails.type == 2) {
      getPopoverSite({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
        }
      });
    } else if (props.mapPopupDetails.type == 3) {
      getPopoverWater({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
        }
      });
    } else if (props.mapPopupDetails.type == 'land') {
      landDetailsById({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
        }
      })
    } else if (props.mapPopupDetails.type == 'meteorology') {
      getPopoverMeteorological({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
        }
      })
    } else if (props.mapPopupDetails.type == 'soilMoisture') {
      props.mapPopupDetails.name == '新仓墒情站'
      getPopoverMoisture({ id: props.mapPopupDetails.ID }).then((res) => {
        if (res?.data) {
          comPopupData.value = res.data;
        }
      })
    }
  }
}, { deep: true });
onMounted(() => {
  //76:田间水位站  104 机械水表  105 远传水表//num === 1电磁阀
})
</script>

<template>
  <div class="modal-box" :style="{ width: props.width, height: props.height }">
    <div class="top-bg">
      <img :src="topBg" class="bg-img" alt="" />
    </div>
    <div class="close">
      <svg-icon class="close-icon" @click="onClose" name="window-close" />
    </div>
    <div class="popup-title">{{ comPopupData.deviceName || comPopupData.siteName || mapPopupDetails.name ||
      comPopupData.landName }}</div>
    <div class="content" v-if="mapPopupDetails.type == 1 || mapPopupDetails.type == 2 || mapPopupDetails.type == 3">
      <div class="item-row switch-row" v-if="mapPopupDetails.type == 1">
        <label class="label" v-if="comPopupData">阀门状态：</label>
        <a-switch v-model:checked="comPopupData.status" />
      </div>
      <p class="item-row" v-if="mapPopupDetails.type == 1">流量：{{ comPopupData.waterMeterFlow == null ? '--' :
        comPopupData.waterMeterFlow }}{{ comPopupData.waterMeterFlow ? 'm³/s' : '' }}</p>
      <p class="item-row" v-if="mapPopupDetails.type == 2">水位：{{ comPopupData.waterLevel == null ? '--' :
        comPopupData.waterLevel }}{{ comPopupData.waterLevel ? 'm' : '' }}</p>
      <p class="item-row" v-if="mapPopupDetails.type == 3">水量：{{ comPopupData.waterLevel == null ? '--' :
        comPopupData.waterLevel }}{{ comPopupData.waterLevel ? 'm³' : '' }}</p>
      <p class="item-row" v-if="mapPopupDetails.type == 1 || mapPopupDetails.type == 2 || mapPopupDetails.type == 3">所属地块：{{ comPopupData.landName == null ? '--' :
        comPopupData.landName }}</p>
      <p class="item-row" v-if="mapPopupDetails.type == 1 || mapPopupDetails.type == 2 || mapPopupDetails.type == 3">时间：{{ comPopupData.dateTime == null ? '--' :
        comPopupData.dateTime }}</p>
      <div class="video" v-if="mapPopupDetails.type == 1 && comPopupData?.channel">
        <EasyPlayer :name="comPopupData.deviceName" :channel="comPopupData.channel" :device="comPopupData.divece"
          :presetToken="comPopupData.presetToken" />
      </div>
    </div>
    <div class="video" v-if="mapPopupDetails.type == 7">
      <EasyPlayer :name="mapPopupDetails.name" :channel="mapPopupDetails.channel" :device="mapPopupDetails.divece" />
    </div>
    <div class="content land-row" v-if="mapPopupDetails.type == 'land'">
      <p>试验作物名称：</p>
      <p class="value">{{ comPopupData.cropNames }}</p>
      <p>试验地块类型：</p>
      <p class="value">{{ comPopupData.landType }}</p>
      <p>试验地块占地面积：</p>
      <p class="value">{{ comPopupData.landArea }}亩</p>
      <p>说明：</p>
      <p class="value" :title="comPopupData.remark">{{ comPopupData.remark }}</p>
      <button class="land-btn" @click="handlePlotInfo(comPopupData.id)">地块详情</button>
    </div>
    <div class="content" v-if="mapPopupDetails.type == 'meteorology'">
      <p class="item-row">雨量（mm）：{{ comPopupData.rainFall == null ? '--' :
        comPopupData.rainFall }}</p>
        <p class="item-row">气压（hpa）：{{ comPopupData.airPressure == null ? '--' :
        comPopupData.airPressure }}</p>
        <p class="item-row">海平面气压（hpa）：{{ comPopupData.seaAirPressure == null ? '--' :
        comPopupData.seaAirPressure }}</p>
        <p class="item-row">气温（℃）：{{ comPopupData.airTemperature == null ? '--' :
        comPopupData.airTemperature }}</p>
        <p class="item-row">湿度（%）：{{ comPopupData.humidity == null ? '--' :
        comPopupData.humidity }}</p>
        <p class="item-row">水汽压（hpa）：{{ comPopupData.waterPressure == null ? '--' :
        comPopupData.waterPressure }}</p>
        <p class="item-row">露点温度（℃）：{{ comPopupData.criticalTemperature == null ? '--' :
        comPopupData.criticalTemperature }}</p>
        <p class="item-row">时间：{{ comPopupData.dateTime }}</p>
    </div>
    <div class="content" v-if="mapPopupDetails.type == 'soilMoisture'">
      <p class="item-row">温度（℃）：{{ comPopupData.airTemperature == null ? '--' :
        comPopupData.airTemperature }}</p>
        <p class="item-row">湿度（%）：{{ comPopupData.airHumidity == null ? '--' :
        comPopupData.airHumidity }}</p>
        <p class="item-row">光合有效辐射（W/㎡）：{{ comPopupData.activeRadiation == null ? '--' :
        comPopupData.activeRadiation }}</p>
        <p class="item-row">风速（m/s）：{{ comPopupData.windSpeed == null ? '--' :
        comPopupData.windSpeed }}</p>
        <p class="item-row">负氧离子（个/cm³）：{{ comPopupData.negativeOxygenIon == null ? '--' :
        comPopupData.negativeOxygenIon }}</p>
        <p class="item-row">10cm温度（℃）：{{ comPopupData.oneTemperature == null ? '--' :
        comPopupData.oneTemperature }}</p>
        <p class="item-row">10cm湿度（%）：{{ comPopupData.oneHumidity == null ? '--' :
        comPopupData.oneHumidity }}</p>
        <p class="item-row">20cm温度（℃）：{{ comPopupData.twoTemperature == null ? '--' :
        comPopupData.twoTemperature }}</p>
        <p class="item-row">20cm湿度（%）：{{ comPopupData.twoHumidity == null ? '--' :
        comPopupData.twoHumidity }}</p>
        <p class="item-row">30cm温度（℃）：{{ comPopupData.threeTemperature == null ? '--' :
        comPopupData.threeTemperature }}</p>
        <p class="item-row">30cm湿度（%）：{{ comPopupData.threeHumidity == null ? '--' :
        comPopupData.threeHumidity }}</p>
        <p class="item-row">40cm温度（℃）：{{ comPopupData.fourTemperature == null ? '--' :
        comPopupData.fourTemperature }}</p>
        <p class="item-row">40cm湿度（%）：{{ comPopupData.fourHumidity == null ? '--' :
        comPopupData.fourHumidity }}</p>
        <p class="item-row">50cm温度（℃）：{{ comPopupData.fiveTemperature == null ? '--' :
        comPopupData.fiveTemperature }}</p>
        <p class="item-row">50cm湿度（%）：{{ comPopupData.fiveHumidity == null ? '--' :
        comPopupData.fiveHumidity }}</p>
        <p class="item-row">时间：{{ comPopupData.dateTime }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.modal-box {
  font-size: 14px;
  max-width: 400px;
  min-width: 319px;
  position: relative;
  border: 1px solid;
  z-index: 99;
  border-image: linear-gradient(180deg,
      rgba(135, 208, 255, 1),
      rgba(86, 169, 253, 1),
      rgba(34, 79, 143, 1),
      rgba(31, 78, 142, 1)) 1 1;

  .popup-title {
    margin: 0 0.2rem;
    font-size: 0.16rem;
    font-family: AlibabaPuHuiTi-Medium;
    font-weight: 500;
    color: #ffffff;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  }

  .content {
    max-height: 200px;
    overflow-x: auto;
    margin: 0.14rem 0.16rem;
    font-size: 0.14rem;
    font-family: AlibabaPuHuiTiR;
    color: #dfdfdf;
    line-height: 0.2rem;

    .switch-row {
      display: flex;
    }
  }

  .close {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: -1px;
    top: -1px;
    font-size: 0.5rem;
    z-index: 1;

    .close-icon {
      position: relative;
      top: -0.27rem;
      right: 0rem;
      cursor: pointer;
    }
  }

  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: calc(100% - 0.2rem);
    height: calc(100% - 0.1rem);
    background-color: rgba(135, 208, 255, 0.5);
    z-index: -5;
    margin: 0 0.1rem 0.1rem;
  }

  &::after {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg,
        #3787ff 0%,
        #0e2341 30%,
        #020b19 63%,
        #020a18 86%,
        #151b26 100%);
    opacity: 0.9;
    z-index: -4;
  }

  .top-bg {
    position: absolute;
    left: 0;
    top: 0;

    z-index: -3;
    width: 100%;
    display: flex;
    justify-content: center;

    .bg-img {
      width: 100%;
      display: block;
    }
  }
}

.video {
  height: 2.2rem;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
  border: 1px solid;
  border-image: linear-gradient(180deg,
      rgba(135, 208, 255, 1),
      rgba(86, 169, 253, 1),
      rgba(34, 79, 143, 1),
      rgba(31, 78, 142, 1)) 1 1;
}

.ant-switch-checked:focus {
  box-shadow: none;
}

.ant-switch {
  height: 18px;
}

.ant-switch-checked {
  background-color: #00CE04;
}

:deep(.ant-switch-handle) {
  width: 14px;
  height: 14px;
}

.land-row {
  p {
    width: 98%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .value {
    color: #00CE04;
  }
}

.land-btn {
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  font-family: AlibabaPuHuiTi-Medium, AlibabaPuHuiTi;
  font-weight: 500;
  color: #D8F0FF;
  line-height: 16px;
  letter-spacing: 1px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3), 0px 0px 10px #016CC6, 0px 0px 4px #016CC6;
  background: linear-gradient(180deg, rgba(15, 81, 136, 0.3) 0%, rgba(1, 108, 198, 0.95) 100%);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(1, 108, 198, 0.8);
}
</style>