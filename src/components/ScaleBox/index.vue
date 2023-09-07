<script lang="jsx">
import { defineComponent, watch, ref, reactive, toRef, toRefs } from 'vue';
import { useSizeStore } from '@/store/modules/size';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'ScaleBox',
  props: {
    translate: { default: 0 },
    transformOrigin: { default: 'left top' },
    style: { default: {} }
  },
  setup(props, ctx) {
    const { slots } = ctx;
    const sizeStore = useSizeStore();
    // const { scaleNum } = storeToRefs(sizeStore); // 不生效

    return () => (
      <div
        class="scale-box"
        style={{
          // height: this.props?.height || 'auto',
          // overflow: 'hidden',
          // position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            transformOrigin: props.transformOrigin,
            transform: `scale(${sizeStore.scaleNum}) translate(${props.translate})`,
            width: props?.width || 'auto',
            ...props.style
          }}
        >
          {slots.default && slots.default()}
        </div>
      </div>
    );
  }
});
</script>

<style lang="less" scoped>
.scale-box {
  position: absolute;
  right: 30px;
  top: 40%;
  pointer-events: auto;
}
</style>
