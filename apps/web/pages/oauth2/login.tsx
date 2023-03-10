// Based on https://github.com/ory/hydra-login-consent-node/blob/master/src/routes/login.ts and https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow#login-endpoint-code-example
import { Configuration, FrontendApi, OAuth2Api } from '@ory/client'
import { GetServerSideProps, NextPage } from 'next'
import url from 'url'

export const configuration = new Configuration({
  basePath: process.env.ORY_BASE_URL,
  accessToken: process.env.ORY_ADMIN_ACCESS_TOKEN,
})

const oauth2Api = new OAuth2Api(configuration)
const frontendApi = new FrontendApi(configuration)

type OAuth2LoginPageProps = {
  error?: string
}

const OAuth2LoginPage: NextPage<OAuth2LoginPageProps> = (props) => {
  console.log(props)

  if (props.error) {
    return <div>Error handling login request: {props.error}</div>
  }
  return <div>Redirecting...</div>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    // Parses the URL query
    const query = url.parse(req.url || '', true).query

    // The challenge is used to fetch information about the login request from ORY Hydra.
    const loginChallenge = String(query.login_challenge)
    if (!loginChallenge) {
      return {
        props: {
          error: 'Expected a login challenge to be set but received none.',
        },
      }
    }

    const { data: loginRequest } = await oauth2Api.getOAuth2LoginRequest({ loginChallenge })
    console.log('loginRequest', loginRequest)

    // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
    // the user.
    // if (loginRequest.skip) {
    //   // User is already authenticated, don't show the login form and simply accept the login request.
    //   const { data: acceptResponse } = await oauth2Api.acceptOAuth2LoginRequest({
    //     loginChallenge,
    //     acceptOAuth2LoginRequest: {
    //       subject: loginRequest.subject,
    //       // TODO(SF) add more params, see below?
    //     },
    //   })
    //   console.log('acceptResponse', acceptResponse)

    //   // Redirect the user back to hydra
    //   return {
    //     redirect: {
    //       permanent: false,
    //       destination: acceptResponse.redirect_to,
    //     },
    //   }
    // }

    // TODO(SF) relevant?
    //     // The user did not want to sign in with the given app.
    // if (req.body.submit === "Deny access") {
    //   await ory
    //     .rejectOAuth2LoginRequest({
    //       loginChallenge: challenge,
    //       rejectOAuth2Request: {
    //         error: "access_denied",
    //         error_description: "The resource owner denied the request",
    //       },
    //     })
    //     .then(({ data }) => response.redirect(data.redirect_to))
    // }

    // Check if user is already logged in
    const cookie = Object.entries(req.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
    const { data: sessionResponse } =
      (await frontendApi
        .toSession({
          cookie,
        })
        .catch((error) => {
          console.error('error retrieving session', error)
          return
        })) || {}
    console.log('sessionResponse', sessionResponse)

    // TODO(SF) no idea if this is the right field, or data.identity.id?
    // TODO(SF) check for more fields, like active?
    if (sessionResponse?.identity?.id) {
      // User was authenticated successfully,
      const { data: acceptResponse } = await oauth2Api.acceptOAuth2LoginRequest({
        loginChallenge,
        acceptOAuth2LoginRequest: {
          // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
          subject: sessionResponse?.identity?.id,
          // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
          // set the "skip" parameter in the other route to true on subsequent requests!
          remember: true, //Boolean(req.body.remember),
          // When the session expires, in seconds. Set this to 0 so it will never expire.
          remember_for: 3600,
          context: {
            // You can add any context that you want to be available to the consent endpoint.
          },
          // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
          // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
          // acr: '0',
          //
          // If the environment variable CONFORMITY_FAKE_CLAIMS is set we are assuming that
          // the app is built for the automated OpenID Connect Conformity Test Suite. You
          // can peak inside the code for some ideas, but be aware that all data is fake
          // and this only exists to fake a login system which works in accordance to OpenID Connect.
          //
          // If that variable is not set, the ACR value will be set to the default passed here ('0')
          // acr: oidcConformityMaybeFakeAcr(loginRequest, '0'),
        },
      })
      console.log('acceptResponse', acceptResponse)

      return {
        redirect: {
          permanent: false,
          destination: acceptResponse.redirect_to,
        },
      }
    }

    // Redirect to login UI if authentication can't be skipped and user is not logged in.
    // res.render('login', {
    //   csrfToken: req.csrfToken(),
    //   challenge: challenge,
    //   action: urljoin(process.env.BASE_URL || '', '/login'),
    //   hint: body.oidc_context?.login_hint || '',
    // })
    return {
      redirect: {
        permanent: false,
        // TODO(SF) ?
        destination: `/login?return_to=/oauth2/login?login_challenge=${loginChallenge}`,
      },
    }

    // You could also deny the login request which tells hydra that no one authenticated!
    // hydra.rejectLoginRequest(challenge, {
    //   error: 'invalid_request',
    //   errorDescription: 'The user did something stupid...'
    // })
    //   .then(({body}) => {
    //     // All we need to do now is to redirect the browser back to hydra!
    //     res.redirect(String(body.redirectTo));
    //   })
    //   // This will handle any error that happens when making HTTP calls to hydra
    //   .catch(next);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('error', error)
    return {
      props: {
        error: error?.message || 'Unknown error',
      },
    }
  }
}

export default OAuth2LoginPage
