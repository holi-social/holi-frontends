import React from 'react'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import { useTheme } from '@holi/ui/styles/theme/theme'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderLeft: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate, navigateBack } = useRouting()
  const { showBackLink } = useNavigationContext()
  const { theme } = useTheme()

  if (showBackLink) {
    return (
      <HoliButton
        label="Go back"
        inline
        variant="transparent"
        onPress={() => navigateBack()}
        style={{ paddingHorizontal: 0 }}
      >
        <Holicon icon="arrow-back" size={30} color={theme.colors.softblack} />
      </HoliButton>
    )
  }

  return (
    <HoliButton
      label="Notifications"
      inline
      variant="transparent"
      onPress={() => navigate('/notifications')}
      {...props}
      style={props.style || {}}
    >
      <HoliIcon icon="bell" size={20} />
    </HoliButton>
  )
}

export default HeaderLeft
