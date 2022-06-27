import { Configuration, Session as KratosSession, V0alpha2Api } from '@ory/kratos-client'
import axiosFactory from 'axios'

import { resilience } from '@holi/core/auth/helpers/axios'
import { kratosUrl } from '@holi/core/auth/helpers/config'
import { baseOptions } from '@holi/core/auth/helpers/sharedConfig'

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
      baseOptions,
    }),
    kratosUrl,
    // Ensure that we are using the axios client with retry.
    axios
  )
}
