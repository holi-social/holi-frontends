import { NextPage } from 'next'
import React from 'react'

import AppsHub from '@holi/core/screens/appsHub/AppsHub'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const AppsHubPage: NextPage = () => <AppsHub />

export const getServerSideProps = createServerSideProps

export default AppsHubPage
