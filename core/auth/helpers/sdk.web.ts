import { edgeConfig } from '@ory/integrations/next'
import { Configuration, FrontendApi, Session as KratosSession } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'
import { baseOptions } from '@holi/core/auth/helpers/sharedConfig'

export type SessionContext = {
  session_token: string
  session: KratosSession
} | null

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
