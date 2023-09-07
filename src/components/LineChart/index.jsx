import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, ScatterChart } from 'echarts/charts';
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
import { getOptions } from './line';

use([
  CanvasRenderer,
  LineChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent
]);

export default defineComponent({
  name: 'LineChart',
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
    const lineRef = ref();

    return () => (
      <div
        className={cls['line-chart']}
        style={props.height ? { height: props.height } : {}}
      >
        <VChart
          option={getOptions(props.dataSource, props.custom)}
          init-options={{
            renderer: 'canvas'
          }}
          ref={lineRef}
          autoresize
        />
      </div>
    );
  }
});
