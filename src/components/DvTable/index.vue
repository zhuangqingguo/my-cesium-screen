<script setup name="DvTable">
import { reactive, useAttrs, onMounted } from 'vue'
import { ScrollBoard } from '@kjgl77/datav-vue3'

const attrs = useAttrs()
const props = defineProps({
  config: { default: null }
})

</script>

<template>
  <ScrollBoard v-if="props.config" :config="props.config" v-bind="attrs" />
</template>

<style lang="less" scoped>
:deep(.header) {
  background-color: transparent !important;
  background: linear-gradient(90deg, #2c466c 0%, rgba(49, 77, 114, 0) 100%);

  .header-item {
    height: 0.3rem !important;
    line-height: 0.3rem !important;

    font-size: 0.14rem;
    font-family: AlibabaPuHuiTi-Medium;
    font-weight: 500;
    color: #D8F0FF;
  }
}

:deep(.row-item) {
  font-family: AlibabaPuHuiTi-Regular;
  font-weight: 400;
  color: rgba(216, 240, 255, 0.8);

  &:hover {
    color: #fff;
    background: linear-gradient(270deg,
        rgba(1, 108, 198, 0) 0%,
        rgba(1, 108, 198, 0.7) 100%);
  }

  .ceil {
    font-size: 0.14rem;
  }
}
</style>