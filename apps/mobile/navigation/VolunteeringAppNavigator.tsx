import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import Holicon from '@holi/ui/components/holicon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useTheme } from '@holi/ui/styles/theme/theme'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'

export type VolunteeringAppScreensList = {
  VolunteeringAppHome: undefined
}

const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()

export const AppNavigation: React.FC = ({ children }) => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const { t } = useTranslation()
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.backgroundColorWhite,
      }}
    >
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <HoliButton
          label={t('volunteering.navigation.home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="nav-button-home"
        >
          <Holicon icon="home" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
        <HoliButton label={t('volunteering.navigation.search')} inline transparent onPress={() => navigate('/search')}>
          <Holicon icon="search" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
      </View>
      {children}
    </View>
  )
}

const VolunteeringAppNavigator: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <View style={{ height: '100%' }}>
      <VolunteeringAppStack.Navigator
        initialRouteName="VolunteeringAppHome"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.backgroundColorWhite,
          },
          headerTitleAlign: 'center',
        }}
      >
        <VolunteeringAppStack.Screen name="VolunteeringAppHome" component={VolunteeringAppHome} />
      </VolunteeringAppStack.Navigator>
      <AppNavigation />
    </View>
  )
}

export default VolunteeringAppNavigator
