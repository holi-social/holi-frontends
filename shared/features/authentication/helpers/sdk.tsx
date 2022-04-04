import { Configuration, V0alpha2Api } from '@ory/kratos-client'
//import Constants from 'expo-constants'
import axiosFactory from 'axios'
import { resilience } from './axios'

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

export const newKratosSdk = () =>
  new V0alpha2Api(
    new Configuration({
      basePath: 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com',
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
