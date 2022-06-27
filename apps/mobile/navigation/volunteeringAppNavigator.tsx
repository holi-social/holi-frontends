import React from 'react'
import { SafeAreaView, View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import { useTheme } from '@holi/ui/styles/theme/theme'

import { VolunteeringAppHomeScreen } from '@holi-apps/volunteering/screens/VolunteeringAppHomeScreen'

export type VolunteeringAppScreensList = {
  VolunteeringAppHome: undefined
}

const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()

export const AppNavigation: React.FC = ({ children }) => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  return (
    <SafeAreaView
      style={{
        padding: 10,
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: theme.colors.backgroundColorWhite,
      }}
    >
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <HoliButton label="Home" inline transparent onPress={() => navigate('/')} testID="nav-button-home">
          <Holicon icon="home" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
        <HoliButton label="Search" inline transparent onPress={() => navigate('/search')}>
          <Holicon icon="search" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
      </View>
      {children}
    </SafeAreaView>
  )
}

const VolunteeringAppNavigator: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <SafeAreaView style={{ padding: 10, height: '100%' }}>
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
        <VolunteeringAppStack.Screen name="VolunteeringAppHome" component={VolunteeringAppHomeScreen} />
      </VolunteeringAppStack.Navigator>
      <AppNavigation />
    </SafeAreaView>
  )
}

export default VolunteeringAppNavigator
