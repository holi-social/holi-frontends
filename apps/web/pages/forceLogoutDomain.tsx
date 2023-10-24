import { GetServerSideProps, NextPage } from 'next'
import React from 'react'

import ForceLogout from '@holi/core/auth/screens/ForceLogout'

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
      // we redirect to also delete the cookie with the full domain to ensure new cookies are also removed.
      // TODO This page (forceLogoutDomain) should be removed in the future and forceLogout should be accessed directly in SessionExpiryProtection.tsx.
      res.writeHead(302, {
        Location: '/forceLogout',
      })
      res.end()
    }
  })

  return {
    props: {},
  }
}

export default ForceLogoutPage
