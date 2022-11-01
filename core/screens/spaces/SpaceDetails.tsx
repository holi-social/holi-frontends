import { useQuery } from '@apollo/client'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceDetailsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceDetailsParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SpaceDetails: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: 'Space Details', headerLeft: () => <BackButton /> })

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  if (error) {
    logError(error, `[SpaceDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }
  const space = data?.spaceById

  if (!space) return <HoliText>{t('spaces.spaceDetails.notFound', { spaceId })}</HoliText>

  const creator = {
    ...space.creator,
    fullName: userFullName(space.creator),
  }

  return (
    <DefaultLayout>
      <View style={[mixins.container, { justifyContent: 'center', padding: 10 }]}>
        <HoliHeading level="1" size="super">
          {space.title}
        </HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          <Trans i18nKey="spaces.spaceDetails.creator" values={{ name: creator.fullName || t('Anonymous user') }} />
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{space.description}</HoliText>
      </View>
    </DefaultLayout>
  )
}

export default SpaceDetails
