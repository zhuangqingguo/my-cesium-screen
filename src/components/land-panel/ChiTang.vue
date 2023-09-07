<script setup name="ChiTang">
import { getFishpond } from '@/api/land'
import { inject, reactive } from 'vue'
import InfoWindow from '@/components/InfoWindow/index.vue'
import moment from 'moment'
import { getFixedNum } from '@/utils/dealNumber'

const props = defineProps({
  data: { default: {} },
  handleCropGrow: { default: () => {} }
})
const injectData = inject('injectData')

const state = reactive({
  showDetail: false,
  detail: null
})

// 鼠标移入
const onMouseenter = () => {
  state.showDetail = true
  getFishpond({ id: injectData.id }).then(res => {
    state.detail = res.data
  })
}
const onMouseLeave = () => {
  state.showDetail = false
}
</script>

<template>
  <div class="container">
    <div
      class="land-content"
      @mouseenter="() => onMouseenter()"
      @mouseleave="() => onMouseLeave()"
      @click="
        () => {
          state.detail?.length &&
            handleCropGrow({ all: state.detail, current: state.detail[0] })
        }
      "
    >
      <div
        class="land-item"
        v-for="(ele, idx) in props?.data?.cropDetails || []"
      >
        <img :src="ele.cropImg" style="height: 100%" alt="" />
      </div>
    </div>

    <div class="window-box">
      <InfoWindow
        v-if="state.showDetail && state?.detail?.length"
        @close="state.showDetail = false"
        :hasClose="false"
        :title="props.data?.landName"
        height="auto"
        width="3rem"
      >
        <div v-for="(el, i) in state.detail || []">
          <div class="item">
            <div class="label">生物名称</div>
            <div class="value">{{ el?.cropName || '-' }}</div>
          </div>

          <div class="item">
            <div class="label">养植时间</div>
            <div class="value">
              {{
                el?.plantingTime
                  ? moment(el.plantingTime).format('YYYY-MM-DD')
                  : '-'
              }}
            </div>
          </div>

          <div class="item">
            <div class="label">试验作物生长阶段</div>
            <div class="value">{{ el?.thePeriod || '-' }}</div>
          </div>

          <div class="item">
            <div class="label">后一生长阶段</div>
            <div class="value">{{ el?.afterPeriod || '-' }}</div>
          </div>

          <div v-if="i !== state.detail.length - 1" class="divide-line"></div>
        </div>
      </InfoWindow>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  margin: 0.7rem 0.4rem 0.6rem 0.8rem;
  position: relative;
  .land-content {
    height: 8rem;
    position: relative;
    background: url('@/assets/images/lang-chitang-bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 1rem;
    .land-item {
      height: 1rem;
      margin-bottom: 0.36rem;
    }
  }
}

.window-box {
  position: absolute;
  right: 0.4rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  pointer-events: none;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.14rem;
    font-family: AlibabaPuHuiTiR;
    color: #dfdfdf;
    line-height: 0.3rem;
  }
}

.divide-line {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  height: 0.1rem;
  margin-bottom: 0.1rem;
}
</style>
