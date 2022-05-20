import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const apiHost = publicRuntimeConfig.api.host
