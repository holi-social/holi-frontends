// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/consent.ts
import { AcceptOAuth2ConsentRequestSession, IdentityApi, OAuth2Api, OAuth2ConsentRequest } from '@ory/client'
import { GetServerSideProps, NextPage } from 'next'

import OAuth2Redirect, { OAuth2RedirectProps } from '@holi/core/auth/screens/OAuth2Redirect'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const identityApi = new IdentityApi(oryConfiguration)
const emailSuffix = '@holi.team'
const userNamePrefix = 'holi_'

const OAuth2ConsentPage: NextPage = (props: OAuth2RedirectProps) => <OAuth2Redirect {...props} />

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // The challenge is used to fetch information about the consent request from ORY hydraAdmin.
  const consentChallenge = extractQueryParameter(req.url || '', 'consent_challenge')
  if (!consentChallenge) {
    return {
      props: {
        error: 'Expected a consent challenge to be set but received none.',
      },
    }
  }

  try {
    const { data: consentRequest } = await oauth2Api.getOAuth2ConsentRequest({ consentChallenge })

    if (!consentRequest.subject) {
      return {
        props: {
          error: 'Subject ID is missing.',
        },
      }
    }

    const session = await createSession(consentRequest.subject)

    return acceptConsentRequest(consentChallenge, session, consentRequest)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Try to reject consent request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    return await oauth2Api
      .rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: 'invalid_request',
          error_description: message,
        },
      })
      .then(({ data: rejectResponse }) => serverSideRedirect(rejectResponse.redirect_to))
      .catch((error) => {
        return {
          props: {
            error: error?.response?.data || error.toString(),
          },
        }
      })
  }
}

export default OAuth2ConsentPage
