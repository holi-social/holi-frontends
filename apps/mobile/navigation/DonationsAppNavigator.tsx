import React from 'react'

import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppHome, { type DonationsAppHomeParams } from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail, {
  type DonationsAppProjectDetailParams,
} from '@holi-apps/donations/screens/DonationsAppProjectDetail'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useTranslation } from 'react-i18next'
import { ArrowDownS } from '@holi/icons/src/generated'

export type DonationsAppScreensList = {
  DonationsAppHome: DonationsAppHomeParams
  DonationsAppHomeOld: DonationsAppHomeParams
  DonationsAppHomeDE: DonationsAppHomeParams
  DonationsAppProjectDetail: DonationsAppProjectDetailParams
  DonationsAppProjectDetailOld: DonationsAppProjectDetailParams
  DonationsAppProjectDetailDE: DonationsAppProjectDetailParams
}

const DonationsAppStack = createNativeStackNavigator<DonationsAppScreensList>()

const DonationsAppNavigator = () => {
  const { t } = useTranslation()

  const donationOptions: NativeStackNavigationOptions = {
    headerBackVisible: false,
    headerTitleAlign: 'center',
    headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
    headerTitle: () => (
      <HoliHeading level="2" size="s">
        {t('donations:app.name')}
      </HoliHeading>
    ),
  }

  const donationDetailsOptions: NativeStackNavigationOptions = {
    ...donationOptions,
    headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} icon={ArrowDownS} />,
  }

  return (
    <DonationsAppStack.Navigator
      initialRouteName={RouteName.DonationsAppHome}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: colors.black300,
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
        headerTitle: '', // prevent showing the technical name of the screen on initial render
      }}
    >
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppHome}
        options={donationOptions}
        component={DonationsAppHome}
      />
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppHomeOld}
        options={donationOptions}
        component={DonationsAppHome}
      />
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppHomeDE}
        options={donationOptions}
        component={DonationsAppHome}
      />
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppProjectDetail}
        options={donationDetailsOptions}
        component={DonationsAppProjectDetail}
      />
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppProjectDetailOld}
        options={donationDetailsOptions}
        component={DonationsAppProjectDetail}
      />
      <DonationsAppStack.Screen
        name={RouteName.DonationsAppProjectDetailDE}
        options={donationDetailsOptions}
        component={DonationsAppProjectDetail}
      />
    </DonationsAppStack.Navigator>
  )
}

export default DonationsAppNavigator
