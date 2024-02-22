import { NextPage } from 'next'
import React from 'react'

import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const OwnProfilePage: NextPage = () => <OwnProfile />

export const getServerSideProps = createServerSideProps

export default OwnProfilePage
