import type { NextPage } from 'next'
import React from 'react'

import ActHome from '@holi/core/screens/act/ActHome.web'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const ActPage: NextPage = () => <ActHome />

export const getServerSideProps = createServerSideProps

export default ActPage
