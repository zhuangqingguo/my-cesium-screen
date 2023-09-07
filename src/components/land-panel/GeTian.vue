<script setup name="GeTian">
import { getOtherInfo } from '@/api/land'
import { inject, reactive } from 'vue'
import InfoWindow from '@/components/InfoWindow/index.vue'
import { getFixedNum } from '@/utils/dealNumber'

const props = defineProps({
  data: { default: {} },
  handleCropGrow: { default: () => {} }
})
const injectData = inject('injectData')

const state = reactive({
  currentIdx: undefined,
  showDetail: false,
  detail: null,

  offsetTop: 0,
  offsetLeft: 0
})

const getPlant = idx => {
  return props?.data?.cropDetails?.find(ele => ele.ridgeOrder == idx + 1)
}

// 鼠标移入
const onMouseenter = (e, idx) => {
  state.currentIdx = idx
  const obj = getPlant(idx)
  if (obj) {
    state.offsetTop = e.clientY
    state.offsetLeft = e.clientX

    state.showDetail = true
    getOtherInfo({ id: injectData.id, cropId: obj.cropId }).then(res => {
      state.detail = { ...res.data, ridge: idx + 1 }
    })
  }
}
const onMouseLeave = idx => {
  state.showDetail = false
}

const onLandClick = idx => {
  if (props?.data?.cropDetails?.length && getPlant(idx)) {
    props.handleCropGrow({
      all: props?.data?.cropDetails,
      current: { ...getPlant(idx), ...state.detail }
    })
  }
}
</script>

<template>
  <div class="container">
    <div class="land-content">
      <div
        class="land-item"
        v-for="(n, idx) in [...new Array(props?.data.ridgeNum).keys()]"
        :style="7 < idx && idx < 16 ? { marginBottom: '0.5rem' } : {}"
        :key="idx"
        @mouseenter="e => onMouseenter(e, idx)"
        @mouseleave="() => onMouseLeave(idx)"
        @click="() => onLandClick(idx)"
      >
        <div class="order-num">{{ idx + 1 }}</div>

        <div class="soil">
          <img class="plant" :src="getPlant(idx)?.cropImg" />
        </div>
      </div>
    </div>
  </div>

  <div
    class="window-box"
    :style="{ top: `${state.offsetTop}px`, left: `${state.offsetLeft}px` }"
  >
    <InfoWindow
      v-if="state.showDetail"
      @close="state.showDetail = false"
      :hasClose="false"
      :title="state.detail?.cropName"
      height="auto"
      width="3rem"
    >
      <div class="item">
        <div class="label">格数编号</div>
        <div class="value">{{ state.detail?.ridge || '-' }}</div>
      </div>

      <div class="item">
        <div class="label">试验作物生长阶段</div>
        <div class="value">{{ state.detail?.thePeriod || '-' }}</div>
      </div>

      <div class="item">
        <div class="label">当前地块水位</div>
        <div class="value">{{ getFixedNum(state.detail?.waterLevel) }}</div>
      </div>

      <div class="item">
        <div class="label">试验地块土壤墒情</div>
        <div class="value">{{ state.detail?.beforeValue || '-' }}</div>
      </div>

      <div class="item">
        <div class="label">后一生长阶段</div>
        <div class="value">{{ state.detail?.afterPeriod || '-' }}</div>
      </div>
    </InfoWindow>
  </div>
</template>

<style lang="less" scoped>
.container {
  margin: 0.85rem 0.6rem 0.4rem 1rem;
  position: relative;

  // .land-mask {
  //   position: absolute;
  //   width: calc(100% + 1rem);
  //   height: calc(100% + 0.5rem);
  //   background: url('@/assets/images/land-getian-bg.png') no-repeat;
  //   background-size: 100% 100%;
  //   z-index: 1;
  //   left: -1rem;
  //   top: -0.3rem;
  //   pointer-events: none;
  // }
  .land-content {
    height: 5.6rem;
    width: 13.1rem;
    position: relative;
    background: url('@/assets/images/land-getian-bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 0.12rem;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 1.5rem);
    grid-gap: 0.12rem;
  }
}

.land-item {
  height: 1.5rem;
  width: 1.5rem;
  background: url('@/assets/images/land-getian-soil-bg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: end;

  // &:hover {
  //   .soil {
  //     background: url('@/assets/images/land-row-item-hover-bg.png') no-repeat;
  //     background-size: 100% 100%;
  //   }
  // }

  .plant {
    flex: 1;
    width: 100%;
  }

  .order-num {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);

    font-size: 0.48rem;
    font-family: YouSheBiaoTiHei;
    color: rgba(216, 240, 255, 0.6);
    line-height: 0.48rem;
  }
}

.window-box {
  position: fixed;
  // right: 0.4rem;
  // top: 50%;
  // transform: translateY(-50%);
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
</style>
