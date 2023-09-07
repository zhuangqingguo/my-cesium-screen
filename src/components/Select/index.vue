<script setup lang="ts" name="MySelect">
import { ref, useAttrs } from 'vue'

const attrs: any = useAttrs()
const props: any = defineProps({
  dataSource: { default: [] },
  width: { default: '100%' },
  defaultSelect: { default: '' }
})

const val = ref(
  props.dataSource.length
    ? props.defaultSelect || props.dataSource[0].value
    : undefined
)

const onSelect = value => {
  val.value = value
  attrs?.onGetData && attrs.onGetData(value)
}
</script>

<template>
  <a-select
    :value="val"
    size="small"
    :style="{ width: props.width }"
    v-bind="attrs"
    :options="props.dataSource"
    @select="onSelect"
  ></a-select>
</template>

<style lang="less" scoped>
:global(.ant-select) {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  font-family: AlibabaPuHuiTi-Medium;
  font-weight: 500;
  color: #c4dded;
  letter-spacing: 1px;
  // text-shadow: 0px 0px 0.04rem #00a8ff;
}
:deep(.ant-select-selector) {
  border: 1px solid rgba(1, 108, 198, 0.8) !important;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 46, 81, 0.95) 100%
  ) !important;
}
:global(.ant-select-dropdown) {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 46, 81, 0.95) 100%
  );
  border: 1px solid rgba(0, 67, 89, 0.8);
}
:global(.ant-empty-small) {
  color: #c4dded !important;
}
:global(.ant-select-item) {
  font-size: 0.16rem;
  line-height: 0.2rem;
  min-height: auto;
  padding: 0.05rem 0.12rem;

  font-family: AlibabaPuHuiTi-Medium;
  font-weight: 500;
  color: #c4dded;
  letter-spacing: 1px;
  // text-shadow: 0px 0px 0.04rem #00a8ff;
}
:global(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background: linear-gradient(
    270deg,
    rgba(1, 108, 198, 0) 0%,
    rgba(1, 108, 198, 0.7) 100%
  );
}
:global(
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled)
  ) {
  background: linear-gradient(
    270deg,
    rgba(1, 108, 198, 0) 0%,
    rgba(1, 108, 198, 0.7) 100%
  );

  color: #c4dded;
}

:global(
    .ant-select-single.ant-select-sm:not(
        .ant-select-customize-input
      ).ant-select-show-arrow
      .ant-select-selection-item
  ) {
  padding-right: 0.2rem;
}

:global(.ant-select-arrow) {
  color: #c4dded;
}
</style>
