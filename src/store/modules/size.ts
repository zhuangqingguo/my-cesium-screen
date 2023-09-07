import { defineStore } from 'pinia';

export const useSizeStore = defineStore('size', {
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        key: 'size',
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage
      }
    ]
  },
  state: () => {
    return {
      scaleNum: 1
    };
  },
  actions: {
    onWindowResize() {
      // 获取 html 元素
      let screenHtml = document.querySelector('html');
      if (!screenHtml) return;

      // // let sizeNum = 100;
      // // if (clientW <= 1360) {
      // //     sizeNum = 130
      // // } else if (clientW <= 1400) {
      // //     sizeNum = 120
      // // } else if (clientW <= 1600) {
      // //     sizeNum = 110
      // // }

      // html 的fontsize 大小
      let htmlRem;
      let scaleNum;
      if (screenHtml.clientWidth / screenHtml.clientHeight > 1920 / 1080) {
        htmlRem = (screenHtml.clientHeight * 100) / 1080;
        scaleNum = screenHtml.clientHeight / 1080;
      } else {
        htmlRem = (screenHtml.clientWidth * 100) / 1920;
        scaleNum = screenHtml.clientWidth / 1920;
      }

      screenHtml.style.fontSize = htmlRem + 'px';

      this.setScaleNum(+scaleNum.toFixed(2));
    },
    setScaleNum(num: number) {
      this.scaleNum = num;
    }
  }
});
