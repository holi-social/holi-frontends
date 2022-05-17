import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const kratosUrl = publicRuntimeConfig.kratos.url
