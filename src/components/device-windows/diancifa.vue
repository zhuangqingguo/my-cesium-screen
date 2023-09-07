<script setup name="DianCiFa">
import InfoWindow from '@/components/InfoWindow/index.vue'
import EasyPlayer from '@/components/EasyPlayer/index.vue'
// import Video from '@/components/Video/index.vue';
import Switch from '@/components/Switch/index.vue'
import { useAttrs, ref, reactive } from 'vue'
import { getPopoverDevice } from '@/api/land'

const attrs = useAttrs()
const props = defineProps({
  info: { default: null }
})

const state = reactive({
  detail: null,
  checked: false
})
const onChange = checked => {
  state.checked = checked
}

getPopoverDevice({ id: props.info.id }).then(res => {
  state.detail = res.data
  state.checked = res?.data?.status == 1 ? true : false
})
</script>

<template>
  <InfoWindow
    v-bind="attrs"
    :title="state.detail?.deviceName"
    height="3.4rem"
    width="3.2rem"
  >
    <div class="indicator">
      <div class="item">
        <div class="label">阀门状态：</div>
        <div class="value">
          <Switch size="small" :checked="state.checked" @change="onChange" />
        </div>
      </div>
      <div class="item">
        <div class="label">流量：</div>
        <div class="value">{{ state.detail?.waterMeterFlow }} m³/s</div>
      </div>
      <div class="item">
        <div class="label">所属地块：</div>
        <div class="value">
          {{ state.detail?.landName }}
        </div>
      </div>
      <div class="item">
        <div class="label">时间：</div>
        <div class="value">{{ state.detail?.dateTime }}</div>
      </div>
    </div>
    <div class="video" v-if="state.detail?.channel">
      <EasyPlayer
        :name="state.detail?.deviceName"
        :channel="state.detail?.channel"
        :device="state.detail?.divece"
        :presetToken="state.detail?.presetToken"
      />
      <!-- <Video :info="state.current" /> -->
    </div>
  </InfoWindow>
</template>

<style lang="less" scoped>
.indicator {
  padding-bottom: 0.2rem;
  .item {
    display: flex;
    justify-content: space-between;
    font-size: 0.14rem;
    font-family: AlibabaPuHuiTi-Regular;
    color: #dfdfdf;
    line-height: 0.24rem;
    text-shadow: 0px 0px 0.06rem rgba(0, 0, 0, 0.3);
    .label {
    }
    .value {
    }
  }
}
.video {
  height: 1.6rem;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
  border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(135, 208, 255, 1),
      rgba(86, 169, 253, 1),
      rgba(34, 79, 143, 1),
      rgba(31, 78, 142, 1)
    )
    1 1;
}
</style>
