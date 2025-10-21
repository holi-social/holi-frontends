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
import { Image } from 'holi-bricks/components/image/Image'
import { Text } from 'holi-bricks/components/text'

export type AuthenticationType = 'login' | 'registration'

type TabItem = HoliTabItem & {
  key: AuthenticationType
  content: () => React.JSX.Element
}

interface AuthenticationSelectionProps {
  initialSelection?: AuthenticationType
  flowId?: string
  resetFlow: () => void
  onLogin?: () => void
  onRegister?: () => void
}

export const AuthenticationSelection = ({
  initialSelection = 'login',
  flowId,
  resetFlow,
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
          startedFlowId={initialSelection === 'login' ? flowId : undefined}
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
          startedFlowId={initialSelection === 'registration' ? flowId : undefined}
          onRegister={onRegister}
          step={authenticationStep}
          setStep={setAuthenticationStep}
        />
      ),
    },
  ]

  const onTabSwitch = useCallback(
    (key: string) => {
      if (key === selectedAuthenticationType) {
        return
      }
      setSelectedAuthenticationType(key as AuthenticationType)
      setAuthenticationStep('oidc')
      resetFlow()
    },
    [resetFlow, selectedAuthenticationType]
  )

  return (
    <>
      {authenticationStep !== 'code' && (
        <Text headingLevel="1" size="4xl" textAlign="center" margin={{ bottom: 'xs' }}>
          {t('registration.signUp.heading')}

          <Image source={require('@holi/ui/assets/img/icons/give-five-filled.svg')} width={50} height={40} alt="" />
        </Text>
      )}

      <HoliTabs
        activeTab={selectedAuthenticationType}
        onChange={onTabSwitch}
        data={tabs}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={styles.tabs.backgroundColor}
        tabBarBackgroundColor={styles.tabs.backgroundColor}
        centeredTabButtons
        hideTabs={authenticationStep === 'code'}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.bg.main,
  },
}))
