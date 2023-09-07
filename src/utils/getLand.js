const landTypeMap = {
  137: 'PuTongDaPeng',
  138: 'HanTian',
  139: 'ChiTang',
  140: 'PuTongDaPeng',
  141: 'ShuiTian',
  142: 'GeTian'
}

export function getLand(landType) {
  return import(`@/components/land-panel/${landTypeMap[landType]}.vue`)
}
