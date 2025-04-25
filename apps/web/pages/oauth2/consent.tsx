// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/consent.ts
import { type AcceptOAuth2ConsentRequestSession, IdentityApi, OAuth2Api, type OAuth2ConsentRequest } from '@ory/client'
import type { GetServerSideProps, NextPage } from 'next'
import pino from 'pino'
import React from 'react'

import { type OAuth2DefaultProps, createDefaultProps } from '@holi/core/auth/helpers/oauth2'
import { OAuth2Consent, type OAuth2ConsentProps } from '@holi/core/auth/screens/OAuth2Consent'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const identityApi = new IdentityApi(oryConfiguration)
const emailSuffix = '@holi.team'
const userNamePrefix = 'holi_'
const logger = pino()

const OAuth2ConsentPage: NextPage = (props: OAuth2ConsentProps) => <OAuth2Consent {...props} />

const createSession = async (subject: string): Promise<AcceptOAuth2ConsentRequestSession> => {
  const { data: identity } = await identityApi.getIdentity({ id: subject })

  return {
    access_token: {},
    id_token: {
      name: identity.traits?.name || identity.id,
      email: identity.id + emailSuffix,
      preferred_username: userNamePrefix + identity.id,
    },
  }
}

const acceptConsentRequest = async (
  consentChallenge: string,
  session: AcceptOAuth2ConsentRequestSession,
  consentRequest: OAuth2ConsentRequest
) => {
  const { data: acceptResponse } = await oauth2Api.acceptOAuth2ConsentRequest({
    consentChallenge,
    acceptOAuth2ConsentRequest: {
      grant_scope: consentRequest.requested_scope,

      session,

      grant_access_token_audience: consentRequest.requested_access_token_audience,

      // This will set the "skip" parameter in subsequent requests
      remember: true,

      remember_for: 3600, // seconds
    },
  })

  return serverSideRedirect(acceptResponse.redirect_to)
}

const rejectConsentRequest = async (defaultProps: OAuth2DefaultProps, consentChallenge: string, message?: string) => {
  try {
    const { data: rejectResponse } = await oauth2Api.rejectOAuth2ConsentRequest({
      consentChallenge,
      rejectOAuth2Request: {
        error: 'invalid_request',
        error_description: message,
      },
    })
    return serverSideRedirect(rejectResponse.redirect_to)
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ error: any) {
    logger.error({
      message: 'Error rejecting login request',
      error: error?.response?.data || error,
    })
    return {
      props: {
        ...defaultProps,
        error: error?.response?.data || error.toString(),
        errorContext: {
          location: 'oauth2.consent.rejectOAuth2ConsentRequest',
        },
      },
    }
  }
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const defaultProps = createDefaultProps(req.headers)

  // The challenge is used to fetch information about the consent request from ORY Hydra.
  const consentChallenge = extractQueryParameter(req.url || '', 'consent_challenge')
  if (!consentChallenge) {
    return {
      props: {
        ...defaultProps,
        error: 'Expected a consent challenge to be set but received none.',
        errorContext: {
          location: 'oauth2.consent.consentChallenge',
        },
      },
    }
  }

  try {
    const { data: consentRequest } = await oauth2Api.getOAuth2ConsentRequest({ consentChallenge })

    if (!consentRequest.subject) {
      return {
        props: {
          ...defaultProps,
          error: 'Subject ID is missing.',
          errorContext: {
            location: 'oauth2.consent.getOAuth2ConsentRequest',
          },
        },
      }
    }

    if (!consentRequest.skip && !consentRequest.client?.skip_consent) {
      return rejectConsentRequest(defaultProps, consentChallenge, 'Skipping consent not allowed')
    }

    const session = await createSession(consentRequest.subject)

    return acceptConsentRequest(consentChallenge, session, consentRequest)
  } catch (/* eslint-disable @typescript-eslint/no-explicit-any */ error: any) {
    // Try to reject consent request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    logger.error({
      message,
      error: error?.response?.data || error,
    })
    return rejectConsentRequest(defaultProps, consentChallenge, message)
  }
}

export default OAuth2ConsentPage
