import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const NotificationSettings = dynamic(() => import('@holi/core/screens/notifications/NotificationSettings'), {
  ssr: false,
})

const NotificationSettingsPage: NextPage = () => <NotificationSettings />

export default NotificationSettingsPage
