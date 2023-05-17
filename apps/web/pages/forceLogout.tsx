import { GetServerSideProps, NextPage } from 'next'
import React from 'react'

import ForceLogout from '@holi/core/auth/screens/ForceLogout'

const ForceLogoutPage: NextPage = () => <ForceLogout />

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookiesToDelete = Object.keys(req.cookies).filter((key) => key.startsWith('ory_session_'))
  cookiesToDelete.forEach((key) =>
    res.setHeader('Set-Cookie', `${key}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
  )

  return {
    props: {},
  }
}

export default ForceLogoutPage
