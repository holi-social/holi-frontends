import { GetServerSideProps, NextPage } from 'next'
import React from 'react'

import ForceLogout from '@holi/core/auth/screens/ForceLogout'

const ForceLogoutPage: NextPage = () => <ForceLogout />

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  Object.keys(req.cookies).forEach((key) => {
    if (key.startsWith('ory_session_')) {
      res.setHeader('Set-Cookie', `${key}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    }
  })

  return {
    props: {},
  }
}

export default ForceLogoutPage
