import { createPinia } from 'pinia';
// 状态持久化
import piniaPersist from 'pinia-plugin-persist';

const store = createPinia();

store.use(piniaPersist);

export { store };
