// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from '@ory/integrations/next-edge'
import getConfig from 'next/config'

// We need to export the config.
export { config }

const { publicRuntimeConfig } = getConfig()

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  apiBaseUrlOverride: publicRuntimeConfig.kratos.url,
  forceCookieSecure: true,
})
