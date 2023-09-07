<script setup lang="ts">
//@ts-nocheck
import { getScreenDevice, getScreenSite } from '@/api/index';
import { ref, reactive, onMounted } from 'vue';

const checkedKeys = ref<string[]>([]);
const emits = defineEmits(['treeChecked']);
// watch(checkedKeys, () => {
//   console.log('checkedKeys', checkedKeys);
// });
//视频监控
let allTreeData = reactive([
  {
    title: '视频监控',
    key: 11,
    category: 3,
    children: [
      {
        title: '摄像头',
        key: 1111,
        category: 3
      }
    ]
  }
]);
//
const init = () => {
  getScreenSite().then(siteRes => {
    if (siteRes.data) {
      let siteData = setSite(siteRes.data);
      allTreeData.unshift(...siteData);
      getScreenDevice().then(res => {
        if (res.data) {
          let deviceData = setDevice(res.data);
          allTreeData.unshift(...deviceData);
        }
      });
    }
  });
  // interface Cascader {
  //   title: string | number;
  //   key: string | number;
  //   children?: Array<Cascader>;
  // };
  function setDevice(treeDevice) {
    const deviceList = [];
    for (const data of treeDevice) {
      const out = {
        title: data.deviceCategoryName,
        key: data.deviceCategoryId,
        category: 1
      };
      if (data?.children && data?.children?.length) {
        out.children = setDevice(data.children);
      }
      deviceList.push(out);
    }
    return deviceList;
  }
  //
  function setSite(treeSite) {
    const siteList = [];
    for (const data of treeSite) {
      const out = {
        title: data.objectCategoryName,
        key: data.objectCategoryId,
        category: 2
      };
      if (data?.children && data?.children?.length) {
        out.children = setSite(data.children);
      }
      siteList.push(out);
    }
    return siteList;
  }
};
//checkTree
const checkTree = (node, e) => {
  emits('treeChecked', e.checkedNodes);
};
onMounted(() => {
  init();
});
</script>
<template>
  <div class="map-legend-tree">
    <h5 class="map-legend-title">图例展示</h5>
    <a-tree
      v-model:checkedKeys="checkedKeys"
      checkable
      :height="400"
      @check="checkTree"
      :tree-data="allTreeData"
    >
      <template #title="{ title, key, category }">
        <template v-if="key === 1111">
          <i class="legend-icon legend-7"></i>
        </template>
        <template v-else-if="key === 14">
          <i class="legend-icon legend-1"></i>
        </template>
        <template v-else-if="key === 22">
          <i class="legend-icon legend-2"></i>
        </template>
        <template v-else-if="key === 78">
          <i class="legend-icon legend-5"></i>
        </template>
        <template v-else-if="key === 81">
          <i class="legend-icon legend-6"></i>
        </template>
        <span>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>
<style lang="less" scoped>
.map-legend-tree {
  min-width: 240px;
  max-height: 400px;
  width: 220px;
  // position: absolute;
  // top: 40%;
  // right: 20px;
  z-index: 2;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  .map-legend-title {
    color: #fff;
    font-size: 16px;
    text-align: center;
    font-family: AlibabaPuHuiTi-Medium, AlibabaPuHuiTi;
    font-weight: 500;
  }
  :deep(.ant-tree-checkbox-checked .ant-tree-checkbox-inner::after) {
    border: 2px solid rgba(0, 0, 0, 0.5);
    border-top: 0;
    border-left: 0;
  }
  :deep(.ant-tree) {
    color: #fff;
    background: transparent;
    .ant-tree-checkbox-inner {
      background: #6bbcff;
      border: 1px solid #6bbcff;
    }
    .ant-tree-node-content-wrapper:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .ant-tree-title {
      display: flex;
    }
    .ant-tree .ant-tree-checkbox-inner {
      background: transparent;
    }
  }
  .legend-icon {
    width: 26px;
    height: 26px;
    display: inline-block;
  }
  .legend-1 {
    background: url('@/assets/images/legend_icon1.png') center center no-repeat;
    background-size: 106%;
  }
  .legend-2 {
    background: url('@/assets/images/legend_icon2.png') center center no-repeat;
    background-size: 106%;
  }
  .legend-5 {
    background: url('@/assets/images/legend_icon2.png') center center no-repeat;
    background-size: 106%;
  }
  .legend-6 {
    background: url('@/assets/images/legend_icon2.png') center center no-repeat;
    background-size: 106%;
  }
  .legend-7 {
    background: url('@/assets/images/legend_icon7.png') center center no-repeat;
    background-size: 106%;
  }
}
</style>
