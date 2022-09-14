import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppDetail from '@holi-apps/donations/screens/DonationsAppDetail'
import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'

export type DonationsAppScreensList = {
  DonationsAppHome: undefined
  DonationsAppDetail: undefined
}

const DonationsAppStack = createNativeStackNavigator<DonationsAppScreensList>()

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
          testID="nav-button-home"
        >
          <HoliIcon icon="search" size={30} color={colors.fontColorBlack} />
        </HoliButton>
        <HoliButton label={t('navigation.search')} inline transparent onPress={() => navigate('/search')}>
          <HoliIcon icon="home-smile-2" size={30} color={colors.fontColorBlack} />
        </HoliButton>
      </View>
      {children}
    </View>
  )
}

const DonationsAppNavigator: React.VFC = () => {
  return (
    <View style={{ height: '100%' }}>
      <DonationsAppStack.Navigator
        initialRouteName="DonationsAppHome"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundColorWhite,
          },
          headerTitleAlign: 'center',
        }}
      >
        <DonationsAppStack.Screen name="DonationsAppHome" component={DonationsAppHome} />
        <DonationsAppStack.Screen
          name="DonationsAppDetail"
          component={DonationsAppDetail}
          options={{
            headerBackTitleVisible: false,
            headerBackVisible: false,
            headerLeft: BackButton,
          }}
        />
      </DonationsAppStack.Navigator>
      <AppNavigation />
    </View>
  )
}

export default DonationsAppNavigator
