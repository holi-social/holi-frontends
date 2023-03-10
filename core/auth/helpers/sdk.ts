import { Configuration, FrontendApi, Session as KratosSession } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'
import { kratosUrl } from '@holi/core/auth/helpers/config'
import { baseOptions } from '@holi/core/auth/helpers/sharedConfig'

export type OrySessionToken = string

export type OrySessionContext = {
  session_token: OrySessionToken
  session: KratosSession
}

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  return new FrontendApi(
    new Configuration({
      basePath: kratosUrl,
      baseOptions,
    }),
    kratosUrl,
    // Ensure that we are using the axios client with retry.
    axios
  )
}
