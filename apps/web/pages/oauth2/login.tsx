// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/login.ts
// and https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow#login-endpoint-code-example
import { FrontendApi, OAuth2Api } from '@ory/client'
import { getCookie } from 'cookies-next'
import type { GetServerSideProps, NextPage } from 'next'
import type { NextApiRequestCookies } from 'next/dist/server/api-utils'
import pino from 'pino'
import React from 'react'

import { cookieNameForceLogout, createDefaultProps } from '@holi/core/auth/helpers/oauth2'
import { OAuth2Login, type OAuth2LoginProps } from '@holi/core/auth/screens/OAuth2Login'
import { oryConfiguration, serverSideRedirect, toSingleQueryParameter } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const frontendApi = new FrontendApi(oryConfiguration)
const logger = pino()

const OAuth2LoginPage: NextPage = (props: OAuth2LoginProps) => <OAuth2Login {...props} />

const getSubjectIdIfLoggedIn = async (cookies: NextApiRequestCookies) => {
  const cookie = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
  try {
    const { data: sessionResponse } = await frontendApi.toSession({ cookie })
    return sessionResponse?.identity?.id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error({
      message: 'Error retrieving session',
      error: error?.response?.data || error,
    })
    return undefined
  }
}

const acceptLoginRequest = async (loginChallenge: string, subjectId: string) => {
  const { data: acceptResponse } = await oauth2Api.acceptOAuth2LoginRequest({
    loginChallenge,
    acceptOAuth2LoginRequest: {
      subject: subjectId,
      // This will set the "skip" parameter in subsequent requests
      remember: true,
      remember_for: 3600, // seconds
    },
  })

  return serverSideRedirect(acceptResponse.redirect_to)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const defaultProps = createDefaultProps(req.headers)

  const loginChallenge = toSingleQueryParameter(query['login_challenge'])

  // The challenge is used to fetch information about the login request from ORY Hydra.
  if (!loginChallenge) {
    return {
      props: {
        ...defaultProps,
        error: 'Expected a login challenge to be set but received none.',
        errorContext: {
          location: 'oauth2.login.loginChallenge',
        },
      },
    }
  }

  try {
    const error = toSingleQueryParameter(query['error'])
    if (error) {
      throw new Error(`Error during login: ${error}`)
    }

    const { data: loginRequest } = await oauth2Api.getOAuth2LoginRequest({ loginChallenge })

    const returnToParams = new URLSearchParams()
    returnToParams.append('login_challenge', loginChallenge)
    const returnTo = toSingleQueryParameter(query['return_to'])
    if (returnTo) {
      returnToParams.append('return_to', returnTo)
    }

    const loginFormProps = {
      props: {
        ...defaultProps,
        returnTo: `/oauth2/login?${returnToParams.toString()}`,
      },
    }

    // Check if user wanted to logout before and force display of login form
    const forceLogout = getCookie(cookieNameForceLogout, { req, res })
    if (forceLogout) {
      return loginFormProps
    }

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

    // Display login UI if authentication can't be skipped and user is not logged in.
    return loginFormProps

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Try to reject login request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    logger.error({
      message,
      error: error?.response?.data || error,
    })
    try {
      const { data: rejectResponse } = await oauth2Api.rejectOAuth2LoginRequest({
        loginChallenge,
        rejectOAuth2Request: {
          error: 'invalid_request',
          error_description: message,
        },
      })
      return serverSideRedirect(rejectResponse.redirect_to)
    } catch (error) {
      logger.error({
        message: 'Error rejecting login request',
        // @ts-ignore
        error: error?.response?.data || error,
      })
      return {
        props: {
          ...defaultProps,
          // @ts-ignore
          error: error?.response?.data ? JSON.stringify(error?.response?.data) : error.toString(),
          errorContext: {
            location: 'oauth2.login.rejectOAuth2LoginRequest',
          },
        },
      }
    }
  }
}

export default OAuth2LoginPage
