import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useTheme } from '@holi/ui/styles/theme/theme'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderLeft: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate, navigateBack } = useRouting()
  const { showBackLink, showDownLink } = useNavigationContext()
  const { theme } = useTheme()
  const { t } = useTranslation()

  const getLinkIcon = () => {
    if (showDownLink) return 'arrowtip-down'
    return 'arrow-back'
  }

  if (showBackLink || showDownLink) {
    return (
      <HoliButton
        label={t('navigation.headerLeft.back')}
        inline
        transparent
        onPress={() => navigateBack()}
        style={{ paddingHorizontal: 0 }}
      >
        <Holicon icon={getLinkIcon()} size={30} color={theme.colors.softblack} />
      </HoliButton>
    )
  }

  return (
    <HoliButton
      label={t('notifications.title')}
      inline
      transparent
      onPress={() => navigate('/notifications')}
      {...props}
      style={props.style || {}}
    >
      <HoliIcon icon="bell" size={20} />
    </HoliButton>
  )
}

export default HeaderLeft
