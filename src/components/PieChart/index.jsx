import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

import cls from './style.module.less';
import { getOptions } from './pie';

use([
  CanvasRenderer,
  PieChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent
]);

export default defineComponent({
  name: 'PieChart',
  props: {
    dataSource: {
      require: true,
      default: () => []
    }
  },
  setup(props) {
    const pieRef = ref();
    const currentRef = ref(0);
    const timerRef = ref();

    watch(
      () => props.dataSource,
      (newVal, oldVal) => {
        // 自动播放 把注释去掉
        // if (timerRef.value) {
        //   clearInterval(timerRef.value);
        // }
        // tick();
        // timerRef.value = setInterval(() => {
        //   tick();
        // }, 4000);
      },
      { deep: true, immediate: true }
    );

    onBeforeUnmount(() => {
      clearInterval(timerRef.value);
    });

    function tick() {
      if (pieRef && pieRef.value) {
        pieRef.value.dispatchAction({
          type: 'downplay'
        });
        pieRef.value.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentRef.value
        });
        pieRef.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: currentRef.value
        });

        currentRef.value += 1;
        if (currentRef.value >= props.dataSource?.length) {
          currentRef.value = 0;
        }
        return;
      }
    }

    const handleMouseover = ({ dataIndex }) => {
      if (pieRef && pieRef.value) {
        pieRef.value.dispatchAction({
          type: 'downplay'
        });
        pieRef.value.dispatchAction({
          type: 'highlight',
          dataIndex
        });
        pieRef.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: dataIndex
        });
      }
    };

    const getTotal = () => {
      let total = 0;
      props.dataSource.forEach(el => (total += el.value));
      return total.toFixed(2);
    };

    return () => (
      <div className={cls['pie-chart']}>
        <div className={cls['chart-bg']}>
          <div className={cls['mid-info']}>
            <div className={cls.value}>{getTotal()}</div>
            <div clsssName={cls.label}>地块面积(亩)</div>
          </div>
        </div>
        <VChart
          option={getOptions(props.dataSource)}
          init-options={{
            renderer: 'canvas'
          }}
          ref={pieRef}
          autoresize
          // onMouseover={handleMouseover}
          // onHighlight={param => {
          //   if (param?.name && !param?.dataIndex) {
          //     handleMouseover({
          //       dataIndex: props.dataSource?.findIndex(
          //         item => item.name === param.name
          //       )
          //     });
          //   }
          //   return;
          // }}
        />
      </div>
    );
  }
});
