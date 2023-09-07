<script setup lang="ts" name="InfoWindow">
import topBg from '@/assets/images/info-window-top-bg.png'
import { ref, useAttrs } from 'vue'

const emits = defineEmits(['close'])

const props = defineProps({
  title: { default: '' },
  hasClose: { default: true },
  width: { default: '2.46rem' },
  height: { default: '3.4rem' }
})

const onColse = () => {
  emits('close')
}
</script>

<template>
  <div class="modal-box" :style="{ width: props.width, height: props.height }">
    <div class="top-bg">
      <img :src="topBg" class="bg-img" alt="" />
    </div>

    <div class="light-line-box">
      <div class="left-line"></div>
      <div class="right-line"></div>
      <div class="top-line"></div>
      <div class="bottom-line"></div>
    </div>

    <div class="close" v-if="props.hasClose">
      <svg-icon class="close-icon" @click="onColse" name="window-close" />
    </div>

    <div class="title">{{ props.title }}</div>

    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.modal-box {
  position: relative;
  border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(135, 208, 255, 1),
      rgba(86, 169, 253, 1),
      rgba(34, 79, 143, 1),
      rgba(31, 78, 142, 1)
    )
    1 1;

  .title {
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
    margin: 0.14rem 0.16rem;
    font-size: 0.14rem;
    font-family: AlibabaPuHuiTi-Regular;
    color: #dfdfdf;
    line-height: 0.2rem;
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
    background: linear-gradient(
      180deg,
      #3787ff 0%,
      #0e2341 30%,
      #020b19 63%,
      #020a18 86%,
      #151b26 100%
    );
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

  .light-line-box {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -2;

    .left-line {
      position: absolute;
      top: -1px;
      left: -1px;
      width: 1rem;
      height: 0.9rem;
      border: 1px solid;
      border-image: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.8),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0)
        )
        1 1;
    }
    .right-line {
      position: absolute;
      top: -1px;
      right: -1px;
      width: 1rem;
      height: 0.9rem;
      border: 1px solid;
      border-image: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.8)
        )
        1 1;
    }

    .top-line {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translate(-50%);
      width: 1.2rem;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 50%,
        rgba(255, 255, 255, 0) 100%
      );
    }
    .bottom-line {
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translate(-50%);
      width: 0.8rem;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(207, 240, 255, 0) 0%,
        #8fd3ff 52%,
        rgba(207, 240, 255, 0) 100%
      );
    }
  }
}
</style>
