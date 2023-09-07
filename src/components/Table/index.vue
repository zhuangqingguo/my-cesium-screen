<script setup lang="ts" name="MyTable">
import { reactive, ref, useAttrs } from 'vue'

const attrs = useAttrs()
const props = defineProps({
  dataSource: {
    default: [
      { name: 'xx奖项', time: '2023-04-13' },
      { name: 'xx奖项', time: '2023-04-13' },
      { name: 'xx奖项', time: '2023-04-13' },
      { name: 'xx奖项', time: '2023-04-13' },
      { name: 'xx奖项', time: '2023-04-13' }
    ]
  },
  columns: {
    default: [
      {
        title: '奖项名称',
        dataIndex: 'name'
      },
      {
        title: '获奖时间',
        dataIndex: 'time'
      }
    ]
  }
})
</script>

<template>
  <a-table
    :dataSource="props.dataSource"
    :columns="props.columns"
    :pagination="false"
    size="small"
    v-bind="attrs"
    :row-class-name="
      (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
    "
  />
</template>

<style lang="less" scoped>
:deep(.ant-table) {
  background: transparent;
  background-color: transparent;
  font-size: 0.14rem;
  color: rgba(216, 240, 255, 0.8);
  .ant-table-thead {
    background: linear-gradient(90deg, #2c466c 0%, rgba(49, 77, 114, 0) 100%);
    th {
      font-family: AlibabaPuHuiTi-Medium;
      color: #d8f0ff;
      background: transparent;
      background-color: transparent;
      border: none;
      padding: 0.03rem 0.3rem !important;
    }
  }
  .ant-table-tbody > tr > td {
    font-family: AlibabaPuHuiTi-Regular;
    background: transparent;
    background-color: transparent;
    border: none;
    padding: 0.03rem 0.3rem !important;
  }
  .ant-table-row:hover {
    color: #fff;
    background: linear-gradient(
      270deg,
      rgba(1, 108, 198, 0) 0%,
      rgba(1, 108, 198, 0.7) 100%
    );
  }

  .table-striped {
    background-image: url('@/assets/images/table-row-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .ant-table-cell-scrollbar {
    box-shadow: none;
  }

  .ant-table-body {
    overflow-y: auto !important;
  }
}
</style>
