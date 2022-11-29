import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsAppHome from '@holi-apps/goodnews/screens/GoodNewsAppHome'

export type GoodNewsAppScreensList = {
  GoodNewsAppHome: undefined
}

const GoodNewsAppStack = createNativeStackNavigator<GoodNewsAppScreensList>()

export const AppNavigation: React.FC = ({ children }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.backgroundColorWhite,
      }}
    >
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <HoliButton
          label={t('navigation.home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
        >
          <HoliIcon icon="search" size={30} color={colors.fontColorBlack} />
        </HoliButton>
      </View>
      {children}
    </View>
  )
}

const GoodNewsAppNavigator: React.VFC = () => {
  return (
    <View style={{ height: '100%' }}>
      <GoodNewsAppStack.Navigator
        initialRouteName={RouteName.GoodNewsAppHome}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundColorWhite,
          },
          headerTitleAlign: 'center',
        }}
      >
        <GoodNewsAppStack.Screen name={RouteName.GoodNewsAppHome} component={GoodNewsAppHome} />
      </GoodNewsAppStack.Navigator>
      <AppNavigation />
    </View>
  )
}

export default GoodNewsAppNavigator
