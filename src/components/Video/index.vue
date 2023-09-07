<template>
  <div class="video-div" ref="videoContentRef">
    <span v-if="state.cameraName" class="camera-name">{{
      state.cameraName
    }}</span>
    <video ref="flvPlayerVideoRef" muted autoplay class="flv-video">
      <div>浏览器不支持video</div>
    </video>

    <!-- 退出全屏 / 全屏 -->
    <div
      class="fullscreen-btn"
      v-show="state.url && state.errorCount <= state.maxReconnectCount"
      @click="fullscreenHandle"
    >
      <div class="zoom-out" v-if="state.isFlullscreen"></div>
      <div class="zoom-in" v-else></div>
    </div>

    <!-- 转盘 -->
    <div
      class="steering-wheel"
      v-show="state.url && state.errorCount <= state.maxReconnectCount"
    ></div>

    <!-- 无播放源提示 -->
    <Empty v-if="!state.url" class="flv-refresh" text="暂无播放源" />

    <!-- 错误刷新提示 -->
    <Empty
      v-if="state.url && state.errorCount > state.maxReconnectCount"
      class="flv-refresh"
      text="已播完或者出错了，点击我刷新"
      @click="faultRefresh"
    />
  </div>
</template>

<script setup name="Video">
import { getVideoAddress, getVideoReset } from '@/api/common';
import Empty from './empty.vue';
import flvjs from 'flv.js';

import {
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  watch,
  ref,
  nextTick
} from 'vue';

Window.flvTimeOut = 300; // flv推流延时播放的时间，单位ms  值尽量在1000内，否则可能会导致偶现灰屏
Window.reconnectFlvCount = 20; // 推流断流重连次数，值最好>=20，否则可能会导致推流无法正常打开

const props = defineProps({
  info: { default: {} },

  option: {
    type: Object,
    default: () => {
      return {
        type: 'flv', // 视频类型  flv/mp4
        isLive: true // 是否实时流
      };
    }
  },

  flvReload: {
    type: Boolean,
    default: false
  },

  // 是否追帧和跳帧，默认需要
  isBufferedEnd: {
    type: Boolean,
    default: true
  }
});

const videoContentRef = ref(null);
const flvPlayerVideoRef = ref(null);

const state = reactive({
  cameraName: props.info?.deviceName,
  url: '',

  loading: true, // 加载动画
  flvPlayer: null,
  delayTimer: null,

  maxReconnectCount: Window.reconnectFlvCount, // 重连的最大次数
  errorCount: 0, // 错误次数，连接10次则不再连接
  lastDecodedFrame: 0, // 用于判断卡顿
  endedReloadFlag: true, // 用于判断推流结束，是否要再次构建（情景：后端关闭推流后重新打开，有几秒的断流时间）

  isFlullscreen: false
});

const getData = () => {
  Promise.all([
    getVideoAddress({
      channel: props.info.channel,
      device: props.info.divece,
      protocol: 'FLV'
    }),
    getVideoReset({
      channel: props.info.channel,
      presettoken: props.info.presetToken
    })
  ]).then(res => {
    state.url = res[0].data;
    // state.url = 'http://122.225.84.166:18000/flv/live/stream_218_0.flv';

    nextTick(() => {
      flvInitLoad();
    });
  });
};

onMounted(() => {
  getData();
  document.addEventListener('fullscreenchange', fullScreenChange);
});
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', fullScreenChange);
  flvDestory();
});
function fullScreenChange() {
  if (document.fullscreenElement === null) {
    if (state.isFlullscreen) {
      state.isFlullscreen = false;
    }
  }
}

// 播放器初始化处理
function flvInitLoad() {
  state.loading = true; // 添加加载动画
  state.errorCount = 0; // 错误连接次数置0
  flvDestory();
  nextTick(() => {
    state.delayTimer = setTimeout(() => {
      flvCreated('flvInitLoad');
    }, Window.flvTimeOut); // 等待一会儿再打开，防止找不到元素，最好不要超过1000,，否则切换时，容易导致锁死
  });
}

// 构建播放器
function flvCreated() {
  try {
    const videoElement = flvPlayerVideoRef.value;
    if (flvjs.isSupported() && videoElement) {
      const flvOption = {
        type: 'flv', // 是否是直播流，默认 true
        isLive: true, // 是否是直播流，默认 true
        url: state.url, // 播放地址
        hasAudio: false, // 是否有音频
        hasVideo: true, //是否有视频
        stashInitialSize: 128, // 减少首帧显示等待时长
        ...props.option
      };
      state.flvPlayer = flvjs.createPlayer(flvOption, {
        enableWorker: false, // 不启用分离的线程进行转换，之前为true
        enableStashBuffer: false, // 关闭IO隐藏缓冲区
        stashInitialSize: 128, // 减少首帧显示等待时长
        autoCleanupSourceBuffer: true, // 打开自动清除缓存
        fixAudioTimestampGap: false, //false才会音视频同步,新增
        lazyLoad: false // 去掉懒加载,新增
      });

      state.flvPlayer.attachMediaElement(videoElement);
      state.flvPlayer.load();

      state.flvPlayer.play();
      state.endedReloadFlag = true; // 重置画面停滞的播放状态，下次停滞了会再次打开
      videoElementEvent(); // 手动跳帧，防止延时
      flvPlayerEvent(); // 断流、卡顿处理
    }
  } catch (error) {
    console.error('构建错误', error);
  }
}

// video监听事件
function videoElementEvent() {
  const videoElement = flvPlayerVideoRef.value; // 媒体播放器
  if (!videoElement) {
    return;
  }

  /**
   * @description: 浏览器下载流事件，手动跳帧，防止累计延时
   * @return {*}
   * @Author: liuxin
   */
  videoElement.onprogress = e => {
    // 不需要跳帧，如：异常视频   或者没有数据流，则不进行跳帧
    if (!props.isBufferedEnd || state.flvPlayer.buffered.length <= 0) {
      return;
    }
    state.loading = false;
    /* ----- 跳帧操作 ----- */
    let end = state.flvPlayer.buffered.end(0); //获取当前时间值
    let diff = end - state.flvPlayer.currentTime; //获取相差差值
    // 延迟过大或帧率不正常，通过跳帧的方式更新视频
    if (diff > 20 || diff < 0) {
      state.flvPlayer.currentTime = state.flvPlayer.buffered.end(0) - 0.5; // 手动跳帧到最后
      return;
    }
    // 正常帧率，正常播放
    if (diff <= 1) {
      videoElement.playbackRate = 1;
    }
    // 10秒内的延时，1.1倍速播放
    else if (diff <= 10) {
      videoElement.playbackRate = 1.1;
    }
    // 20秒内的延时，1.2倍速播放
    else if (diff <= 20) {
      videoElement.playbackRate = 1.2;
    }
  };

  /**
   * @description: 监听点击事件，不执行暂停
   * @return {*}
   * @Author: liuxin
   */
  videoElement.onclick = e => {
    e.preventDefault();
  };
}

// flv对象事件监听，断流、卡顿处理
function flvPlayerEvent() {
  if (!state.flvPlayer._hasPendingLoad) {
    return;
  }

  state.flvPlayer.on(flvjs.Events.ERROR, errorHandle); // 监听出错消息后，销毁后重连
  state.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, errorHandle); // ctrl+f5刷新，会莫名因为停止end不播放
  state.flvPlayer.on(flvjs.Events.STATISTICS_INFO, statisticsInfoHanle); // 断流重连
}

function errorHandle() {
  //视频出错后销毁重新创建 网络错误
  if (state.flvPlayer && state.errorCount <= state.maxReconnectCount) {
    state.loading = true; // 添加loading动画
    state.errorCount++; //错误重连次数+1
    flvDestory();
    flvCreated('ERROR');
  }

  if (state.errorCount > state.maxReconnectCount) {
    state.loading = false; // 去掉loading
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

function faultRefresh() {
  // ctx.emit('faultRefresh'); // 传递给父组件，用于请求后端推流
  flvInitLoad();
}

// 断流、卡顿重连
function statisticsInfoHanle(res) {
  // 初始化播放
  if (state.lastDecodedFrame == 0) {
    state.lastDecodedFrame = res.decodedFrames;
    return;
  }
  // 正常播放
  if (state.lastDecodedFrame != res.decodedFrames) {
    state.lastDecodedFrame = res.decodedFrames;
    state.loading = false; // 去掉loading动画
    state.errorCount = 0; // 错误连接次数归0
  }
  // 播放异常
  else {
    if (state.player) {
      state.errorCount = 0; // 错误连接次数归0
      state.lastDecodedFrame = 0; // 最后播放编码号
      flvDestory(); // 销毁对象
      flvCreated('statistics_info'); // 创建对象
    }
  }
}

// 销毁
function flvDestory() {
  if (state.delayTimer) {
    clearTimeout(state.delayTimer); // 清除推迟打开播放器定时器
  }
  if (state.flvPlayer == null) return; // 空对象，不执行销毁

  /* ----- 销毁开始 ----- */
  try {
    state.flvPlayer.off(flvjs.Events.ERROR, errorHandle);
    if (state.flvPlayer._hasPendingLoad) {
      state.flvPlayer.pause();
      state.flvPlayer.unload();
    }
    state.flvPlayer.detachMediaElement();
    state.flvPlayer.destroy();
    state.flvPlayer = null;
  } catch (error) {
    console.error('销毁错误');
  }
}
</script>

<style lang="less" scoped>
.video-div {
  position: relative;
  width: 100%;
  height: 100%;
}
.video-div.video-fullscreen {
  position: fixed;
  top: 0px !important;
  left: 0px !important;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  margin: 0;
  // background: $bgColor;
}

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
  right: 0.1rem;
  bottom: 0.1rem;
  background: url('@/assets/images/steering-wheel.png') no-repeat;
  background-size: 100% 100%;
}

.flv-video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
// .flv-refresh {
//   width: 100%;
//   height: 100%;
//   @include flex-box(null, center, center);
//   cursor: pointer;
//   @include position-absolute(0, null, null, 0);
//   &:hover {
//     color: $fontHoverColor;
//   }
// }

.camera-name {
  // color: $dangerColor;
  // @include position-absolute(null, null, 10px, 10px);
  position: absolute;
  width: 100%;
  z-index: 10;

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
