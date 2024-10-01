import { NextPage } from 'next'
import React from 'react'

import Notifications from '@holi/core/screens/notifications/Notifications'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const NotificationsPage: NextPage = () => <Notifications />

export const getServerSideProps = createServerSideProps

export default NotificationsPage
