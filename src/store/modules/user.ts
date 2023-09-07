import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        key: 'user',
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage
        // state 中的字段名，按组打包储存
      }
    ]
  },
  state: () => {
    return {
      user: {}
    };
  },
  actions: {
    setUserInfo(user: any) {
      this.user = user;
    }
  }
});
