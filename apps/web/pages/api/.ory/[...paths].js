// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from '@ory/integrations/next-edge'

import { kratosUrl } from '@holi/core/auth/helpers/config'
import { environmentId } from '@holi/web/environment'

// We need to export the config.
export { config }

// And create the Ory Cloud API "bridge".
export default createApiHandler({
  apiBaseUrlOverride: kratosUrl,
  forceCookieSecure: environmentId !== 'development',
})
