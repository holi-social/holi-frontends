import { Configuration, Session as KratosSession, V0alpha2Api } from '@ory/kratos-client'
import axiosFactory from 'axios'

//import { resilience } from '@holi/core/auth/helpers/axios'
import { kratosUrl } from '@holi/core/auth/helpers/config'

export type SessionContext = {
  session_token: string

  session: KratosSession
} | null

const axios = axiosFactory.create()
//resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  axios.defaults.withCredentials = true
  return new V0alpha2Api(
    new Configuration({
      basePath: kratosUrl,
      baseOptions: {
        credentials: 'include',
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
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
