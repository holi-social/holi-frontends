import { NextPage } from 'next'
import React from 'react'

import Login from '@holi/core/auth/screens/Login'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const LoginPage: NextPage = () => <Login />

export const getServerSideProps = createServerSideProps

export default LoginPage
