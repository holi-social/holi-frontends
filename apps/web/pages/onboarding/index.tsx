import type { NextPage, NextPageContext } from 'next'
import React from 'react'

import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const OnboardingPage: NextPage = () => <Onboarding />

export const getServerSideProps = async (context: NextPageContext) =>
  createServerSideProps(context, [], {
    redirectIfLoggedIn: '/',
  })

export default OnboardingPage
