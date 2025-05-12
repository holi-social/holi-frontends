import { edgeConfig } from '@ory/integrations/next'
import { Configuration, FrontendApi } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'

const baseOptions = {
  // setting `withCredentials: true` is crucial. if set, the GET request that initializes the login flow will be
  // executed in `credentials: 'include'` mode (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
  // if it was not set, the browser would ignore any cookies returned in the browser response. in this case, the
  // browser would miss CSRF cookies which are required in subsequent requests
  withCredentials: true,
}

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  return new FrontendApi(
    new Configuration({
      ...edgeConfig,
      ...baseOptions,
    }),
    edgeConfig.basePath,
    // Ensure that we are using the axios client with retry.
    axios
  )
}
