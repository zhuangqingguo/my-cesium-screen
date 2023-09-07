<template>
  <div class="empty-content">
    <!-- <IconFont :type="icon" class="empty-icon" /> -->
    <div>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
// import IconFont from '@/components/IconFont/index.vue';
export default {
  components: {
    // IconFont
  },
  props: {
    text: {
      type: String,
      default: '暂无记录'
    }
    // icon: {
    //   type: String,
    //   default: 'icon-zanwushuju1'
    // }
  }
};
</script>

<style lang="less" scoped>
.empty-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 11;
  color: rgba(255, 255, 255, 0.7);
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 0.4rem;
  margin-bottom: 0.2rem;
}

.empty-refresh {
  margin-left: 0.2rem;
}
</style>
