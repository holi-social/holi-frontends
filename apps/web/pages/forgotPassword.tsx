import type { NextPage } from 'next'
import React from 'react'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import { createServerSidePropsWithLoggedInUserGuard } from '@holi/web/helpers/createServerSideProps'

const ForgotPasswordPage: NextPage = () => <ForgotPassword />

export const getServerSideProps = createServerSidePropsWithLoggedInUserGuard

export default ForgotPasswordPage
