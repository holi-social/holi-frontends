// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/sdk.tsx
import axiosFactory from 'axios'
import { Platform } from 'react-native'
import { Configuration, V0alpha2Api } from '@ory/kratos-client'
import { resilience } from '@holi/core/auth/helpers/axios'

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost' // 172.16.110.186
  const mobileUrl = 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com'
  // const webUrl = 'http://' + host + ':3000/ory'
  const webUrl = 'http://' + host + ':3000/api/auth'

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
