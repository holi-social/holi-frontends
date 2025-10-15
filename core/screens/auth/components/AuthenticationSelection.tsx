import { LoginForm } from '@holi/core/screens/auth/components/LoginForm'
import { RegistrationForm } from '@holi/core/screens/auth/components/RegistrationForm'
import { LogoutBox, LogoutBoxFilled, UserAdd, UserAddFilled } from '@holi/icons/src/generated'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export type AuthenticationType = 'login' | 'registration'

type TabItem = HoliTabItem & {
  key: AuthenticationType
  content: () => React.JSX.Element
}

interface AuthenticationSelectionProps {
  initialSelection?: AuthenticationType
  flowId?: string
  onLogin?: () => void
  onRegister?: () => void
}

export const AuthenticationSelection = ({
  initialSelection = 'login',
  flowId,
  onLogin,
  onRegister,
}: AuthenticationSelectionProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const [activeTab, setActiveTab] = useState<AuthenticationType>(initialSelection)
  const tabs: TabItem[] = [
    {
      key: 'login',
      tabTitle: t('auth.tabs.login'),
      tabIcons: [LogoutBox, LogoutBoxFilled],
      content: () => <LoginForm onLogin={onLogin} />,
    },
    {
      key: 'registration',
      tabTitle: t('auth.tabs.register'),
      tabIcons: [UserAdd, UserAddFilled],
      content: () => <RegistrationForm flowId={flowId} onRegister={onRegister} />,
    },
  ]

  return (
    <HoliTabs
      activeTab={activeTab}
      onChange={(key) => setActiveTab(key as AuthenticationType)}
      data={tabs}
      keyExtractor={(item) => item.key}
      renderTabContent={({ item }) => item.content()}
      backgroundColor={styles.tabs.backgroundColor}
      tabBarBackgroundColor={styles.tabs.backgroundColor}
      centeredTabButtons
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.bg.main,
  },
}))
