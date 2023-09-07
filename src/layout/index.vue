<script setup lang="ts">
import { useCachedViewStoreHook } from '@/store/modules/cachedView';
import { useSizeStore } from '@/store/modules/size';
import { computed, onBeforeUnmount } from 'vue';

const sizeStore = useSizeStore();

const onResize = () => {
  sizeStore.onWindowResize();
};

// 浏览器窗口，自适应
sizeStore.onWindowResize();
window.addEventListener('resize', onResize);

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

// 路由缓存
const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});
</script>

<template>
  <div class="app-wrapper">
    <div class="app-wrapper-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
  .app-wrapper-content {
    position: relative;
    height: 100%;
    width: 100%;
  }
}
</style>
