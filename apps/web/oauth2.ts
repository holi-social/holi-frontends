import { Configuration } from '@ory/client'
import url from 'url'

export const oryConfiguration = new Configuration({
  basePath: process.env.ORY_BASE_URL,
  accessToken: process.env.ORY_ADMIN_ACCESS_TOKEN,
})

export const extractQueryParameter = (requestUrl: string, parameterName: string) => {
  const query = url.parse(requestUrl, true).query
  return query[parameterName] && String(query[parameterName])
}

export const serverSideRedirect = (destination: string) => {
  return {
    redirect: {
      permanent: false,
      destination,
    },
  }
}
