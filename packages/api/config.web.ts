import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const holiApiUrl = publicRuntimeConfig.holi_api.url
