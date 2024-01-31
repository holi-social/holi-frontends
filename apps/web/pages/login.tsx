import { NextPage } from 'next'
import React from 'react'

import Login from '@holi/core/auth/screens/Login'
import { featureFlag } from '@holi/web/environment'
import { addTranslations } from '@holi/web/helpers/addTranslations'
import { NextJSPageProps } from '@holi/web/types'

const LoginPage: NextPage = () => <Login />

export const getServerSideProps = async (props: Partial<NextJSPageProps> = {}) => {
  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any performance cost
  // when we render the home site.
  if (!featureFlag.enableSSR) {
    return {
      props: {},
    }
  }

  return { props: await addTranslations(props.locale, {}) }
}

export default LoginPage
