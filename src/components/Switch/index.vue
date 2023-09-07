<script setup lang="ts" name="MySwitch">
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>

<template>
  <a-switch v-bind="attrs" />
</template>

<style lang="less" scoped>
.ant-switch-checked:focus {
  box-shadow: none;
}
.ant-switch-checked {
  background-color: #23ac5e;
}
</style>
