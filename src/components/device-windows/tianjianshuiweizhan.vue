<script setup name="Tianjianshuiweizhan">
import InfoWindow from '@/components/InfoWindow/index.vue'
import { useAttrs, ref, reactive } from 'vue'
import { getPopoverSite } from '@/api/index'

const attrs = useAttrs()
const props = defineProps({
  info: { default: null }
})

const state = reactive({
  detail: null
})

getPopoverSite({ id: props.info.id }).then(res => {
  state.detail = res.data
})
</script>

<template>
  <InfoWindow
    v-bind="attrs"
    :title="state.detail?.siteName"
    height="1.5rem"
    width="3.2rem"
  >
    <div class="indicator">
      <div class="item">
        <div class="label">水位：</div>
        <div class="value">{{ state.detail?.waterLevel }} m</div>
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
</style>
