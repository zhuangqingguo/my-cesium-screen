import {
  defineConfig,
  type PluginOption,
  splitVendorChunkPlugin,
  loadEnv
} from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import cesium from 'vite-plugin-cesium';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
// import { insertHtml, h } from 'vite-plugin-insert-html';
// import { viteExternalsPlugin } from 'vite-plugin-externals';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// 当前工作目录路径
const root: string = process.cwd();

export default defineConfig(({ mode }) => {
  // const envDir = 'env'; // 环境变量文件的文件夹，相对于项目的路径，也可以用 nodejs 函数拼接绝对路径
  const isProd = mode === 'prod';

  const env = loadEnv(mode, root, '');
  // 默认 base 是 '/'
  const base = '/';

  // const cesiumBaseUrl = env['VITE_CESIUM_BASE_URL'];
  // // 复制 node_modules 下的 cesium 依赖
  // const cesiumLibraryRoot = 'node_modules/cesium/Build/CesiumUnminified/';
  // const cesiumLibraryCopyToRootPath = 'libs/cesium/'; // 相对于打包后的路径
  // const cesiumStaticSourceCopyOptions = [
  //   'Assets',
  //   'ThirdParty',
  //   'Workers',
  //   'Widgets'
  // ].map(dirName => {
  //   return {
  //     src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
  //     dest: `${cesiumLibraryCopyToRootPath}${dirName}`
  //   };
  // });

  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
    cesium(),
    splitVendorChunkPlugin(),
    Components({
      resolvers: [AntDesignVueResolver({ resolveIcons: true })]
    }),
    // svg icon
    createSvgIconsPlugin({
      // 指定图标文件夹
      iconDirs: [path.resolve(root, 'src/assets/icons/svg')],
      // 指定 symbolId 格式
      symbolId: 'icon-[dir]-[name]'
    }),
    // 允许 setup 语法糖上添加组件名属性
    vueSetupExtend(),
    // 生产环境 gzip 压缩资源
    viteCompression({
      threshold: 10 * 1024 // 10KB 以下不压缩
    })
    // viteExternalsPlugin(
    //   {
    //     cesium: 'Cesium' // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
    //   },
    //   {
    //     // disableInServe: true, // 开发模式时不外部化
    //   }
    // ),
    // insertHtml({
    //   head: [
    //     // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接，开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
    //     h('script', {
    //       // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
    //       src: `${base}${cesiumBaseUrl}Cesium.js`
    //       // isProd
    //       //   ? `${cesiumBaseUrl}Cesium.js`
    //       //   : `${base}${cesiumBaseUrl}Cesium.js`
    //     })
    //   ]
    // }),
    // viteStaticCopy({
    //   targets: [
    //     // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
    //     {
    //       src: `${cesiumLibraryRoot}Cesium.js`,
    //       dest: cesiumLibraryCopyToRootPath
    //     },
    //     // 四大静态文件夹
    //     ...cesiumStaticSourceCopyOptions
    //   ]
    // }),
  ];

  return {
    base,
    // envDir,
    plugins,
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import '@/styles/variables.less';`
          },
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        extensions: ['.vue', '.jsx', '.tsx', '.js', '.json', '.ts']
        // 使用路径别名时想要省略的后缀名，可以自己 增减
      }
    },
    build: {
      rollupOptions: {
        assetsPublicPath: './',
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      host: true,
      // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
      // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
      proxy: {
      }
    }
  };
});
