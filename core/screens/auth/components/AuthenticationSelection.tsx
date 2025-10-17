import { LoginForm } from '@holi/core/screens/auth/components/LoginForm'
import { RegistrationForm } from '@holi/core/screens/auth/components/RegistrationForm'
import { LogoutBox, LogoutBoxFilled, UserAdd, UserAddFilled } from '@holi/icons/src/generated'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import type { HoliTabItem } from '@holi/ui/components/organisms/HoliTabs/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'

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

  const [selectedAuthenticationType, setSelectedAuthenticationType] = useState<AuthenticationType>(initialSelection)
  const [authenticationStep, setAuthenticationStep] = useState<AuthenticationStep>('oidc')

  const tabs: TabItem[] = [
    {
      key: 'login',
      tabTitle: t('auth.tabs.login'),
      tabIcons: [LogoutBox, LogoutBoxFilled],
      content: () => (
        <LoginForm
          flowId={initialSelection === 'login' ? flowId : undefined}
          onLogin={onLogin}
          step={authenticationStep}
          setStep={setAuthenticationStep}
        />
      ),
    },
    {
      key: 'registration',
      tabTitle: t('auth.tabs.register'),
      tabIcons: [UserAdd, UserAddFilled],
      content: () => (
        <RegistrationForm
          flowId={initialSelection === 'registration' ? flowId : undefined}
          onRegister={onRegister}
          step={authenticationStep}
          setStep={setAuthenticationStep}
        />
      ),
    },
  ]

  const onTabSwitch = useCallback((key: string) => {
    setSelectedAuthenticationType(key as AuthenticationType)
    setAuthenticationStep('oidc')
    // TODO(SF) clear flow param?
  }, [])

  if (authenticationStep === 'code') {
    const selectedTab = tabs.find((tab) => tab.key === selectedAuthenticationType)
    if (selectedTab) {
      return selectedTab.content()
    }
  }

  return (
    <HoliTabs
      activeTab={selectedAuthenticationType}
      onChange={onTabSwitch}
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
