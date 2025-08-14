import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import OwnConnectionsTab from '@holi/core/screens/userprofile/components/OwnConnectionsTab'

const MyConnections = () => {
  const { t } = useTranslation()

  return (
    <Screen
      preset="fixed"
      headerOptions={{
        title: t('connections.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
      <OwnConnectionsTab emptyText={t('user.profile.own.connections.title.empty')} />
    </Screen>
  )
}

export default MyConnections
