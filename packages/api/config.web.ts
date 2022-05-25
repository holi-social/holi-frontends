import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const holiApi = publicRuntimeConfig.holi_api.url
console.log('HOLI-API:' + holiApi)
