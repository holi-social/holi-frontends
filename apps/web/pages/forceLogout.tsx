import { GetServerSideProps, NextPage } from 'next'
import React from 'react'

import ForceLogout from '@holi/core/auth/screens/ForceLogout'

const ForceLogoutPage: NextPage = () => <ForceLogout />

const rootDomain = (host: string | undefined): string => {
  if (!host) return ''
  let domain = host.split(':')[0]
  const domainparts = domain.split('.')
  if (domainparts.length > 2) {
    domain = domainparts[domainparts.length - 2] + '.' + domainparts[domainparts.length - 1]
  }
  return '; domain=' + domain
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const domainpart = rootDomain(req.headers.host)
  Object.keys(req.cookies).forEach((key) => {
    if (key.startsWith('ory_session_')) {
      res.setHeader('Set-Cookie', `${key}=deleted${domainpart}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    }
  })

  return {
    props: {},
  }
}

export default ForceLogoutPage
