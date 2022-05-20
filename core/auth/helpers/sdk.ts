import { Configuration, Session as KratosSession, V0alpha2Api } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'
import { kratosUrl } from '@holi/core/auth/helpers/config'

export type SessionContext = {
  session_token: string

  session: KratosSession
} | null

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  return new V0alpha2Api(
    new Configuration({
      basePath: kratosUrl,
      baseOptions: {
        // setting `withCredentials: true` is crucial. if set, the GET request that initializes the login flow will be
        // executed in `credentials: 'include'` mode (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
        // if it was not set, the browser would ignore any cookies returned in the browser response. in this case, the
        // browser would miss CSRF cookies which are required in subsequent requests
        withCredentials: true,
        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    kratosUrl,
    // Ensure that we are using the axios client with retry.
    axios
  )
}
