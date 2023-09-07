<script setup lang="ts" name="PageTop">
import { getWeather } from '@/api/common'
import { reactive, onBeforeUnmount } from 'vue'
import moment from 'moment'

const state: any = reactive({
  weather: null,
  time: '',
  interval: undefined
})

function getToday() {
  let date = new Date()
  let year = date.getFullYear()
  let month: any = date.getMonth() + 1
  let day: any = date.getDate()
  month = month > 9 ? month : '0' + month
  day = day < 10 ? '0' + day : day
  return year + '-' + month + '-' + day
}

// 天气;
const getInfo = async () => {
  const res: any = await getWeather({ locationCode: '101210303' })
  state.weather = res.data

  const sunsetTime = `${getToday()} ${state.weather.sunset}`
  const sunriseTime = `${getToday()} ${state.weather.sunrise}`
  if (
    +new Date() < moment(sunsetTime).valueOf() &&
    +new Date() > moment(sunriseTime).valueOf()
  ) {
    state.weather.iconType = 'iconDay'
  } else {
    state.weather.iconType = 'iconNight'
  }
}
getInfo()

// 时间
const getTime = () => {
  state.time = moment().format('YYYY/MM/DD HH:mm:ss')
  state.interval = setInterval(() => {
    state.time = moment().format('YYYY/MM/DD HH:mm:ss')
  }, 1000)
}
getTime()

onBeforeUnmount(() => {
  clearInterval(state.interval)
})
</script>

<template>
  <div class="top">
    <div class="title">海宁市上塘河灌区试验站综合管控驾驶舱</div>
    <div class="time">{{ state.time }}</div>
    <div class="weather">
      <i
        :class="[
          `qi-${state.weather?.[state.weather.iconType]}`,
          'weather-icon'
        ]"
      ></i>
      {{ state.weather?.tempMin || '' }}-{{ state.weather?.tempMax }}℃
    </div>
  </div>
</template>

<style lang="less" scoped>
.top {
  position: absolute;
  width: 100%;
  height: 1.5rem;
  background: url('@/assets/images/page-header-bg.png') no-repeat;
  background-size: 100% 100%;
  z-index: 10;
  pointer-events: none;

  .title {
    font-size: 0.32rem;
    font-family: YouSheBiaoTiHei;
    color: #ffffff;
    line-height: 0.42rem;
    letter-spacing: 3px;
    text-shadow: 0px 0px 0.08rem rgba(0, 118, 255, 0.7);
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    text-align: center;
    margin-top: 0.34rem;
  }

  .time {
    position: absolute;
    left: 0.4rem;
    top: 0.4rem;
    font-size: 0.24rem;
    font-family: DS-Digital-Bold, DS-Digital;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 0px 0px 0.04rem rgba(67, 151, 255, 0.5);
  }

  .weather {
    position: absolute;
    right: 0.4rem;
    top: 0.4rem;

    font-size: 0.2rem;
    font-family: AlibabaPuHuiTi-Medium;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 0px 0px 4px rgba(67, 151, 255, 0.5);
    display: flex;
    align-items: center;

    .weather-icon {
      font-size: 0.26rem;
      margin-right: 0.05rem;
    }
  }
}
</style>
