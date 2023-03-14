// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/login.ts
// and https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow#login-endpoint-code-example
import { FrontendApi, OAuth2Api } from '@ory/client'
import { GetServerSideProps, NextPage } from 'next'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

import OAuth2Redirect from '@holi/core/auth/screens/OAuth2Redirect'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const frontendApi = new FrontendApi(oryConfiguration)

const OAuth2LoginPage: NextPage = () => <OAuth2Redirect />

const getSubjectIdIfLoggedIn = async (cookies: NextApiRequestCookies) => {
  const cookie = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
  try {
    const { data: sessionResponse } = await frontendApi.toSession({
      cookie,
    })
    return sessionResponse?.identity?.id
  } catch (error) {
    console.error('Error retrieving session', error)
    return undefined
  }
}

const acceptLoginRequest = async (loginChallenge: string, subjectId: string) => {
  const { data: acceptResponse } = await oauth2Api.acceptOAuth2LoginRequest({
    loginChallenge,
    acceptOAuth2LoginRequest: {
      // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
      subject: subjectId,
      // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
      // set the "skip" parameter in the other route to true on subsequent requests!
      remember: true,
      // When the session expires, in seconds. Set this to 0 so it will never expire.
      remember_for: 3600,
      context: {
        // You can add any context that you want to be available to the consent endpoint.
      },
      // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
      // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
      // acr: '0',
    },
  })

  return serverSideRedirect(acceptResponse.redirect_to)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const loginChallenge = extractQueryParameter(req.url || '', 'login_challenge')
  // The challenge is used to fetch information about the login request from ORY Hydra.
  if (!loginChallenge) {
    return {
      props: {
        error: 'Expected a login challenge to be set but received none.',
      },
    }
  }

  try {
    const { data: loginRequest } = await oauth2Api.getOAuth2LoginRequest({ loginChallenge })

    // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
    // the user.
    if (loginRequest.skip) {
      // User is already authenticated, don't show the login form and simply accept the login request.
      return acceptLoginRequest(loginChallenge, loginRequest.subject)
    }

    // Check if user is already logged in
    const subjectId = await getSubjectIdIfLoggedIn(req.cookies)
    if (subjectId) {
      // User was authenticated successfully,
      return acceptLoginRequest(loginChallenge, subjectId)
    }

    // Redirect to login UI if authentication can't be skipped and user is not logged in.
    return serverSideRedirect(`/login?return_to=/oauth2/login?login_challenge=${loginChallenge}`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Reject login request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    const { data: rejectResponse } = await oauth2Api.rejectOAuth2LoginRequest({
      loginChallenge,
      rejectOAuth2Request: {
        error: 'invalid_request',
        error_description: message,
      },
    })
    return serverSideRedirect(rejectResponse.redirect_to)
  }
}

export default OAuth2LoginPage
