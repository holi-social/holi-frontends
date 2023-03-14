// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/consent.ts
import { AcceptOAuth2ConsentRequestSession, IdentityApi, OAuth2Api, OAuth2ConsentRequest } from '@ory/client'
import { GetServerSideProps, NextPage } from 'next'

import OAuth2Redirect from '@holi/core/auth/screens/OAuth2Redirect'
import { extractQueryParameter, oryConfiguration, serverSideRedirect } from '@holi/web/oauth2'

const oauth2Api = new OAuth2Api(oryConfiguration)
const identityApi = new IdentityApi(oryConfiguration)

const OAuth2ConsentPage: NextPage = () => <OAuth2Redirect />

const createSession = async (subject: string): Promise<AcceptOAuth2ConsentRequestSession> => {
  const { data: identity } = await identityApi.getIdentity({ id: subject })

  // The session allows us to set session data for id and access tokens
  return {
    // This data will be available when introspecting the token. Try to avoid sensitive information here,
    // unless you limit who can introspect tokens.
    access_token: {
      // foo: 'bar'
    },

    // This data will be available in the ID token.
    id_token: {
      name: identity.id,
      email: `${identity.id}@holi.team`,
      preferred_username: identity.id,
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
      // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
      // are requested accidentally.
      grant_scope: consentRequest.requested_scope,

      session,

      // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
      grant_access_token_audience: consentRequest.requested_access_token_audience,

      // This tells hydra to remember this consent request and allow the same client to request the same
      // scopes from the same user, without showing the UI, in the future.
      remember: true,

      // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
      remember_for: 3600,
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
    // Reject consent request in case an error occurs
    const message = error?.message || error || 'Unknown error'
    const { data: rejectResponse } = await oauth2Api.rejectOAuth2ConsentRequest({
      consentChallenge,
      rejectOAuth2Request: {
        error: 'invalid_request',
        error_description: message,
      },
    })
    return serverSideRedirect(rejectResponse.redirect_to)
  }
}

export default OAuth2ConsentPage
