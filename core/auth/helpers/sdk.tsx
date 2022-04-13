import axiosFactory from 'axios'
import { Platform } from 'react-native'
import { Configuration, V0alpha2Api } from '@ory/kratos-client'
import { resilience } from '@holi/core/auth/helpers/axios'

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () => {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost' // 172.16.110.186

  return new V0alpha2Api(
    new Configuration({
      basePath: 'http://' + host + ':4000/.ory',
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
