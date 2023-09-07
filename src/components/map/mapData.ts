const modelUrl = import.meta.env.VITE_MODEL_URL
export const xcModelUrl = {
  name: '新仓试验站',
  code: 2020203,
  gltfList: [
    {
      url: modelUrl + 'gltf/xincang_JZ.gltf',
      position: [120.69060018, 30.40793944, 0.2],
      id: 'xincang_JZ'
    },
    // 闸门
    {
      url: modelUrl + 'gltf/xincang_sz.gltf',
      position: [120.69060018, 30.40793944, 0.2],
      id: 'zhamen',
      name: 'zhamen'
    },
    {
      url: modelUrl + 'gltf/xincang_beng01.gltf',
      position: [120.690598, 30.407941, 0.4],
      id: 'xincang_beng01'
    },
    {
      url: modelUrl + 'gltf/xincang_beng02.gltf',
      position: [120.69060018, 30.40793944, 0.4],
      id: 'xincang_beng02'
    },
    {
      url: modelUrl + 'gltf/xincang_beng03.gltf',
      position: [120.6905999, 30.4079412204, 0.4],
      id: 'xincang_beng03'
    }
  ],
  tilesetList: [
    {
      name: '倾斜摄影',
      id: 'xincang',
      alt: 30,
      url: modelUrl + 'Cesium3dtiles/xincang/tileset.json' //'tilest/tileset.json'
    }
    // {
    //   name: '河床',
    //   id: 'xincang_hc',
    //   alt: -0.8,
    //   url: modelUrl + '3dtiles/xincang/xincang_hc/tileset.json'
    // }
  ]
}
