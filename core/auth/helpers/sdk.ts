import { Configuration, FrontendApi, Session as KratosSession } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'
import { oryUrl } from '@holi/core/auth/helpers/config'

export type OrySessionToken = string

export type OrySessionContext = {
  // `session_token` is only set for native clients
  session_token?: OrySessionToken
  session: KratosSession
}

const baseOptions = {
  // setting `withCredentials: false` is crucial in the mobile app. Otherwise we get problems with cookies sent in the request.
  withCredentials: false,
}

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  return new FrontendApi(
    new Configuration({
      basePath: oryUrl,
      baseOptions,
    }),
    oryUrl,
    // Ensure that we are using the axios client with retry.
    axios
  )
}
