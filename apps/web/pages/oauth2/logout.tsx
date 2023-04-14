// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/logout.ts
import { OAuth2Api } from '@ory/client'
import { deleteCookie } from 'cookies-next'
import { GetServerSideProps, NextPage } from 'next'
import pino from 'pino'

import OAuth2Redirect, { OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const logger = pino()

const OAuth2LogoutPage: NextPage = (props: OAuth2RedirectProps) => <OAuth2Redirect {...props} />

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // The challenge is used to fetch information about the logout request from ORY Hydra.
  const logoutChallenge = extractQueryParameter(req.url || '', 'logout_challenge')
  if (!logoutChallenge) {
    return {
      props: {
        error: 'Expected a logout challenge to be set but received none.',
      },
    }
  }

  try {
    const { data: acceptResponse } = await oauth2Api.acceptOAuth2LogoutRequest({
      logoutChallenge,
    })

    // Delete all ory cookies to force logout from HOLI
    Object.keys(req.cookies).map((key) => {
      if (key.startsWith('ory_')) {
        deleteCookie(key, { req, res })
      }
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
        error: error?.response?.data || error,
      })
      return {
        props: {
          error: error?.response?.data || error.toString(),
        },
      }
    }
  }
}

export default OAuth2LogoutPage
