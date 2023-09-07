<script setup lang="ts" name="Home">
import { onMounted, ref, nextTick } from 'vue'
import PageTop from './components/pageTop/index.vue'

// import Map from '@/components/map/Map.vue'
import Map from './components/cesuim/map.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import ScaleBox from '@/components/ScaleBox/index.vue'

let mapTreeChecked = ref({})

onMounted(() => {})

const handlePlotInfo = id => {}

const treeChecked = legendData => {
  mapTreeChecked.value = legendData
}
</script>

<template>
  <div class="home-page">
    <!-- 头部 -->
    <PageTop />
    <Map :mapTreeChecked="mapTreeChecked" @handlePlotInfo="handlePlotInfo" />
    <ScaleBox
      :style="{
        transformOrigin: 'right bottom',
        right: '0.21rem',
        top: '0.5rem',
        zIndex: 2
      }"
    >
      <MapLegend @treeChecked="treeChecked" />
    </ScaleBox>
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
