// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/logout.ts
import { OAuth2Api } from '@ory/client'
import { setCookie } from 'cookies-next'
import type { GetServerSideProps, NextPage } from 'next'
import pino from 'pino'
import React from 'react'

import { cookieNameForceLogout, createDefaultProps } from '@holi/core/auth/helpers/oauth2'
import { OAuth2Logout, type OAuth2LogoutProps } from '@holi/core/auth/screens/OAuth2Logout'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const logger = pino()

const OAuth2LogoutPage: NextPage = (props: OAuth2LogoutProps) => <OAuth2Logout {...props} />

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const defaultProps = createDefaultProps(req.headers)

  // The challenge is used to fetch information about the logout request from ORY Hydra.
  const logoutChallenge = extractQueryParameter(req.url || '', 'logout_challenge')
  if (!logoutChallenge) {
    return {
      props: {
        ...defaultProps,
        error: 'Expected a logout challenge to be set but received none.',
        errorContext: {
          location: 'oauth2.logout.logoutChallenge',
        },
      },
    }
  }

  // Set cookie to prevent automatic relogin
  setCookie(cookieNameForceLogout, 'true', { req, res, maxAge: 60 * 60 * 24 })
  try {
    const { data: acceptResponse } = await oauth2Api.acceptOAuth2LogoutRequest({
      logoutChallenge,
    })

    return serverSideRedirect(acceptResponse.redirect_to)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Try to reject logout request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    logger.error({
      message,
      error: error?.response?.data || error,
    })
    try {
      await oauth2Api.rejectOAuth2LogoutRequest({
        logoutChallenge,
      })
      // Response does not specify a redirect destination
      return serverSideRedirect(process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || '')
    } catch (error) {
      logger.error({
        message: 'Error rejecting logout request',
        // @ts-ignore
        error: error?.response?.data || error,
      })
      return {
        props: {
          ...defaultProps,
          // @ts-ignore
          error: error?.response?.data || error.toString(),
          errorContext: {
            location: 'oauth2.logout.rejectOAuth2LogoutRequest',
          },
        },
      }
    }
  }
}

export default OAuth2LogoutPage
