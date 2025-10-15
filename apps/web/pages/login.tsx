import type { NextPage } from 'next'
import React from 'react'

import { Login } from '@holi/core/auth/screens/Login'
import { createServerSidePropsWithLoggedInUserGuard } from '@holi/web/helpers/createServerSideProps'

const LoginPage: NextPage = () => <Login />

export const getServerSideProps = createServerSidePropsWithLoggedInUserGuard

export default LoginPage
