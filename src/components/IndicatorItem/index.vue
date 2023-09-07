<script setup lang="ts" name="IndicatorItem">
const props = defineProps(['title', 'padding', 'size'])
</script>

<template>
  <div class="indicator-item">
    <div :class="['common', props?.size == 'large' ? 'lg-title' : 'sm-title']">
      {{ props.title }}
    </div>

    <div
      class="content"
      :style="props.padding ? { padding: props.padding } : {}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.indicator-item {
  flex: 1;

  .common {
    background: url('@/assets/images/indicator-header-bg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 0.52rem;

    font-size: 0.24rem;
    font-family: JiangChengXieHei-700W;
    color: #f6f9fe;
    line-height: 0.36rem;
    letter-spacing: 2px;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    padding-left: 0.4rem;
    text-align: left;
  }
  .sm-title {
    background: url('@/assets/images/indicator-header-bg.png') no-repeat;
    background-size: 100% 100%;
  }
  .lg-title {
    background: url('@/assets/images/indicator-header-bg-lg.png') no-repeat;
    background-size: 100% 100%;
  }

  .content {
    padding: 0.2rem 0.28rem;
  }
}
</style>
