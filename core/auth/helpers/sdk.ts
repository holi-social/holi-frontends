import axiosFactory from 'axios'
import { Platform } from 'react-native'
import {
  Session as KratosSession,
  SubmitSelfServiceLogoutFlowWithoutBrowserBody,
  SelfServiceRegistrationFlow,
  Configuration,
  V0alpha2Api,
} from '@ory/kratos-client'
import { AxiosPromise } from 'axios'
import { SelfServiceLoginFlow } from '@ory/kratos-client'
import { resilience } from '@holi/core/auth/helpers/axios'

export type SessionContext = {
  session_token: string

  session: KratosSession
} | null

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  const mobileUrl = 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com'
  const webUrl = 'http://localhost:3000/api/auth'

  return new V0alpha2Api(
    new Configuration({
      basePath: Platform.OS === 'web' ? webUrl : mobileUrl,
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    '',
    // Ensure that we are using the axios client with retry.
    axios
  )
}

export const initLoginFlow = (): AxiosPromise<SelfServiceLoginFlow> => {
  return newKratosSdk().initializeSelfServiceLoginFlowWithoutBrowser()
}

export const submitLogoutFlow = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
  return newKratosSdk().submitSelfServiceLogoutFlowWithoutBrowser(payload)
}

export const initRegistrationFlow = (): AxiosPromise<SelfServiceRegistrationFlow> => {
  return newKratosSdk().initializeSelfServiceRegistrationFlowWithoutBrowser()
}
