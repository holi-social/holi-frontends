import { GetServerSideProps, NextPage } from 'next'
import React from 'react'

import ForceLogout from '@holi/core/auth/screens/ForceLogout'

/*
We changed our ory session cookies to use the full domain.
We currently still have ory session cookies on the root domain in the wild.
They can cause problems, so we need to remove them, when we do a force logout.
We can not determine, whether we have such a cookie, so we delete the cookie twice: Once without explicit domain, which deletes the new cookie. Once with explicit root domain, which deletes the old cookie.
Since we can't set the set-cookie header twice during one request, we need to make this in an extra redirect request.
This whole process can be removed in the future and deleting to full domain cookie should suffice.

TODO This page should be removed in the future and forceLogout should be accessed directly in SessionExpiryProtection.tsx.
*/

const ForceLogoutPage: NextPage = () => <ForceLogout />

const rootDomain = (host: string | undefined): string => {
  if (!host) return ''
  const domain = host.split(':')[0]
  const domainparts = domain.split('.')
  if (domainparts.length > 2) {
    return domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1]
  }
  return ''
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const domainpart = rootDomain(req.headers.host)

  Object.keys(req.cookies).forEach((key) => {
    if (key.startsWith('ory_session_')) {
      if (domainpart) {
        res.setHeader(
          'Set-Cookie',
          `${key}=deleted; domain=${domainpart}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        )
      }
    }
  })

  return {
    // we redirect to also delete the cookie with the full domain to ensure new cookies are also removed.
    // TODO: This page (forceLogoutDomain) should be removed in the future and forceLogout should be accessed directly in SessionExpiryProtection.tsx.
    redirect: {
      destination: '/forceLogout',
      permanent: true,
    },
  }
}

export default ForceLogoutPage
