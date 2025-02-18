import type { NextPage } from 'next'
import React from 'react'

import { AuthSelection } from '@holi/core/auth/screens/AuthSelection'
import { createServerSidePropsWithLoggedInUserGuard } from '@holi/web/helpers/createServerSideProps'

const AuthSelectionPage: NextPage = () => <AuthSelection />

export const getServerSideProps = createServerSidePropsWithLoggedInUserGuard

export default AuthSelectionPage
