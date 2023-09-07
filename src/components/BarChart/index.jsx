import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

import cls from './style.module.less';
import { getOptions } from './bar';

use([
  CanvasRenderer,
  BarChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent
]);

export default defineComponent({
  name: 'BarChart',
  props: {
    dataSource: {
      require: true,
      default: () => [
        {
          name: '',
          data: []
        }
      ]
    },
    custom: { default: {} },
    height: { default: null }
  },
  setup(props) {
    const barRef = ref();

    return () => (
      <div
        className={cls['bar-chart']}
        style={props.height ? { height: props.height } : {}}
      >
        <VChart
          option={getOptions(props.dataSource, props.custom)}
          init-options={{
            renderer: 'canvas'
          }}
          ref={barRef}
          autoresize
        />
      </div>
    );
  }
});
