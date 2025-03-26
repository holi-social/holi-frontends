import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const OnboardingPage: NextPage = () => <Onboarding />

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], {
    redirectIfLoggedIn: '/',
  })

export default OnboardingPage
