// import { AcceptOAuth2ConsentRequestSession } from '@ory/client'
import {
  //   AcceptOAuth2ConsentRequestSession,
  //   Configuration, //   FrontendApi,
  //   IdentityApi,
  //   OAuth2Api, //   OAuth2ApiAcceptOAuth2ConsentRequestRequest,
  OAuth2ApiGetOAuth2ConsentRequestRequest,
} from '@ory/client'
// import csrf from 'csurf'
import { GetServerSideProps, NextPage } from 'next'
import url from 'url'

import Consent from '@holi/core/auth/screens/Consent'

// const skip = false

// const baseOptions: any = {}

if (process.env.MOCK_TLS_TERMINATION) {
  //   baseOptions.headers = { 'X-Forwarded-Proto': 'https' }
}

// const configuration = new Configuration({
//   basePath: 'https://dev-auth.project-holi.org',
//   accessToken: 'ory_pat_2oh0KgUwQWGLLnsgAXJXHXzuohTcYPtO',
//   baseOptions,
// })

// const hydraAdmin = new V0alpha2Api(configuration)
// const ory = {
//   identity: new IdentityApi(configuration),
//   frontend: new FrontendApi(configuration),
//   oauth2: new OAuth2Api(configuration),
// }

const ConsentPage: NextPage = (props) => {
  console.log(props)
  return <Consent />
}

// Sets up csrf protection
// const csrfProtection = csrf({
//   cookie: {
//     sameSite: 'lax',
//   },
// })

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Parses the URL query
  console.log('nbvc')
  const query = url.parse(req.url || '', true).query

  // The challenge is used to fetch information about the consent request from ORY hydraAdmin.
  const challenge: OAuth2ApiGetOAuth2ConsentRequestRequest = { consentChallenge: String(query.consent_challenge) }
  if (!challenge) {
    // next(new Error('Expected a consent challenge to be set but received none.'))

    return {
      props: {
        query,
      },
    }
  }

  // This section processes consent requests and either shows the consent UI or
  // accepts the consent request right away if the user has given consent to this
  // app before
  //   const { data: body } = await ory.oauth2.getOAuth2ConsentRequest(challenge)
  //   // This will be called if the HTTP request was successful
  //   const handleOAuth2ConsentRequest = async ({ data: body }: any) => {
  //     // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
  //     if (skip) {
  //       const acceptChallenge: OAuth2ApiAcceptOAuth2ConsentRequestRequest = {
  //         consentChallenge: challenge.consentChallenge,
  //         acceptOAuth2ConsentRequest: {
  //           // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
  //           // are requested accidentally.
  //           grant_scope: body.requested_scope,

  //           // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
  //           grant_access_token_audience: body.requested_access_token_audience,

  //           // The session allows us to set session data for id and access tokens
  //           session: {
  //             // This data will be available when introspecting the token. Try to avoid sensitive information here,
  //             // unless you limit who can introspect tokens.
  //             // accessToken: { foo: 'bar' },
  //             // This data will be available in the ID token.
  //             // idToken: { baz: 'bar' },
  //           },
  //         },
  //       }
  //       // You can apply logic here, for example grant another scope, or do whatever...
  //       // ...

  //       // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
  //       const result = await ory.oauth2.acceptOAuth2ConsentRequest(acceptChallenge)

  //       //   .then(({ data: body }) => {
  //       //     // All we need to do now is to redirect the user back to hydra!
  //       //     res.redirect(String(body.redirect_to))
  //       //   })
  //     }
  //   }

  // The consent request has now either been accepted automatically or rendered.

  return {
    props: { query },
  }
}

export default ConsentPage
