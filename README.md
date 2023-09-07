## 上塘河灌区试验站大屏

  **FE-sthgq-test-station-screen**


## 技术选型

| 编号 | 技术  | 版本号 |                          备注 |
| ---- | :---: | -----: | ----------------------------: |
| 1    |  Vue  | 3.3.4 |           前端技术框架 Vue.js |
| 2    | pinia | 2.1.3 | Vue.js 应用程序开发的状态管理 |
| 3    | ant-design-vue  | 3.2.20 |        前端 UI 库 |
| 4    | Axios | 1.4.0 |     基于 promise 的网络请求库 |
| 5    | less  | 4.1.3 |                层叠样式表语言 |
| 7    | vite  | 4.2.0 |                  代码编译工具 |
| 8    | echarts | 5.4.2 |                  可视化图表 |

## 开始使用

1. 环境准备

   - 安装[node](http://nodejs.org/)和[git](https://git-scm.com/)

   ```
   node version > 16
   ```

2. 安装

   ```shell
   git clone http://gitlab.1.com/HNIrrigatedArea/fe-sthgq-test-station-screen.git
   ```

3. 本地开发

```sh
# 进入项目根目录

# 安装依赖
npm install

# 启动服务
npm run dev

# 构建测试环境
npm run build:test

# 构建生产环境
npm run build:prod
```

> 若耗时太长可使用 `npm config set registry https://registry.npm.taobao.org`

> 打开浏览器访问 [http://localhost:5173]


## 配置

  配置文件-本地环境
  ```shell
  # 环境
  VITE_NODE_ENV = "dev"
  # 后端服务访问地址
  VITE_BASE_API = 'http://192.168.18.204:8820'
  # 单点登录地址
  VITE_CAS_URL = 'http://cas.1.com:8181/cas'
  ```

  配置文件-测试环境
  ```shell
  # 环境
  VITE_NODE_ENV = "test"
  # 后端服务访问地址
  VITE_BASE_API = 'http://192.168.18.204:8820'
  # 单点登录地址
  VITE_CAS_URL = 'http://cas.1.com:8181/cas'
  ```

  配置文件-生产环境
  ```shell
  # 环境
  VITE_NODE_ENV = "prod"
  # 后端服务访问地址
  VITE_BASE_API = ''
  # 单点登录地址
  VITE_CAS_URL = ''
  ```

## 提交代码

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中


## 联系

如果您发现了什么 bug，或者有什么界面建议或意见，请联系zqg@lyzhsl.com。
