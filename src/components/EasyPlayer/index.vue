<script setup name="MyEasyPlayer">
import { getVideoAddress, getVideoReset, getVideoPtz } from '@/api/common';
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch
} from 'vue';

const props = defineProps({
  name: { default: '' },
  channel: { default: '' },
  device: { default: '' },
  presetToken: { default: '' },
  key: 1
});

const state = reactive({
  url: '',
  isFlullscreen: false
});

const videoContentRef = ref(null);
const videoRef = ref(null);

watch(
  () => props.channel,
  (newVal, oldVal) => {
    getData();
  }
);

function getData() {
  if (props.presetToken) {
    Promise.all([
      getVideoAddress({
        channel: props.channel,
        device: props.device,
        protocol: 'FLV'
      }),
      getVideoReset({
        channel: props.channel,
        presettoken: props.presetToken
      })
    ]).then(res => {
      state.key = Math.random();
      state.url = res[0].data;
      console.log('视频地址', state.url);
    });
  } else {
    getVideoAddress({
      channel: props.channel,
      device: props.device,
      protocol: 'FLV'
    }).then(res => {
      state.key = Math.random();
      state.url = res.data;
    });
  }
}

onMounted(() => {
  getData();
  document.addEventListener('fullscreenchange', fullScreenChange);
});
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', fullScreenChange);
});
function fullScreenChange() {
  if (document.fullscreenElement === null) {
    if (state.isFlullscreen) {
      state.isFlullscreen = false;
    }
  }
}

// 全屏
function fullscreenHandle() {
  state.isFlullscreen = !state.isFlullscreen;

  if (state.isFlullscreen) {
    const el = videoContentRef.value;
    if (el.requestFullscreen) {
      el.requestFullscreen();
      return true;
    } else if (el.webkitRequestFullScreen) {
      el.webkitRequestFullScreen();
      return true;
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
      return true;
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
      return true;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// 转动方向
const onDirection = type => {
  const params = {
    channel: props.channel,
    device: props.device,
    speed: 50
  };

  getVideoPtz({
    ...params,
    command: type,
    direction: type
  }).then(res => {
    getVideoPtz({
      ...params,
      command: 'stop',
      direction: type
    }).then(resp => {
      console.log('调整成功');
    });
  });
};
</script>

<template>
  <div
    class="video-div"
    v-if="state.url"
    :key="state.key"
    ref="videoContentRef"
  >
    <easy-player
      ref="videoRef"
      :video-url="state.url"
      :video-title="props.name"
      live
      easyStretch
      reconnection
    />

    <!-- 退出全屏 / 全屏 -->
    <div class="fullscreen-btn" v-show="state.url" @click="fullscreenHandle">
      <div class="zoom-out" v-if="state.isFlullscreen"></div>
      <div class="zoom-in" v-else></div>
    </div>

    <!-- 转盘 -->
    <div
      :class="['steering-wheel', state.isFlullscreen ? 'full-whell' : '']"
      v-show="state.url"
    >
      <div class="btn-box">
        <caret-up-outlined
          :class="['btn-up', 'btn-common']"
          @click="() => onDirection('up')"
        />
        <caret-down-outlined
          :class="['btn-down', 'btn-common']"
          @click="() => onDirection('down')"
        />
        <caret-left-outlined
          :class="['btn-left', 'btn-common']"
          @click="() => onDirection('left')"
        />
        <caret-right-outlined
          :class="['btn-right', 'btn-common']"
          @click="() => onDirection('right')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.video-div {
  position: relative;
  width: 100%;
  height: 100%;

  .fullscreen-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9;
    .zoom-in {
      width: 0.26rem;
      height: 0.26rem;
      background: url('@/assets/images/zoom-in.png') no-repeat;
      background-size: 100% 100%;
      margin: 0.05rem;
      cursor: pointer;
    }
    .zoom-out {
      width: 0.56rem;
      height: 0.56rem;
      background: url('@/assets/images/zoom-out.png') no-repeat;
      background-size: 100% 100%;
      margin: 0.6rem;
    }
  }

  .steering-wheel {
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    z-index: 9;
    right: 0.1rem;
    bottom: 0.1rem;
    background: url('@/assets/images/steering-wheel.png') no-repeat;
    background-size: 100% 100%;
    padding: 0.06rem;
    font-size: 0.2rem;

    .btn-box {
      width: 100%;
      height: 100%;
      position: relative;
      .btn-common {
        position: absolute;
        :active {
          color: #4cdeff;
        }
      }
      .btn-up {
        left: 50%;
        top: 0;
        transform: translate(-50%);
      }
      .btn-down {
        left: 50%;
        bottom: 0;
        transform: translate(-50%);
      }
      .btn-left {
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .btn-right {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .full-whell {
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    z-index: 9;
    right: 0.6rem;
    bottom: 0.6rem;
    background: url('@/assets/images/steering-wheel.png') no-repeat;
    background-size: 100% 100%;
    padding: 0.07rem;
    font-size: 0.3rem;
  }
}

:deep(.vjs-control-bar) {
  display: none !important; // 目前UI隐藏
  display: flex;
  width: 100%;
  font-size: 0.12rem;
  align-items: center;

  .vjs-bitrate-control, // 码率
  .vjs-live-control, // 直播
  .vjs-stretch-control,// 拉伸
  .xxxxxx {
    display: none;
  }
}
:deep(.easy-player .video-title) {
  top: 0;
  left: 0;
  width: 100%;
  max-width: none;
  font-size: 0.14rem;
  font-family: AlibabaPuHuiTi-Regular;
  color: #ffffff;
  line-height: 0.2rem;
  text-shadow: 0px 0px 0.06rem rgba(0, 0, 0, 0.3);

  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
  text-align: left;
  padding: 0px 0.08rem;
}
</style>
