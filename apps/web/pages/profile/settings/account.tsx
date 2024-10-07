import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const AccountSettings = dynamic(() => import('@holi/core/screens/userprofile/AccountSettings'), {
  ssr: false,
})

const AccountSettingsPage: NextPage = () => <AccountSettings />

export default AccountSettingsPage
