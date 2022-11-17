import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterHeader from '@holi/core/screens/spaces/SpacesFilterHeader'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SPACES_PAGE_SIZE = 10
const location = 'Berlin'
const topics = ['Animal welfare', 'Children & Youth']

const Spaces: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { t } = useTranslation()
  const title = t('spaces.title')
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

  useNavigationHeader(navigation, { title: title })

  const { loading, data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
  })

  const spaces = data?.spaces || []

  if (error) {
    displayError(error, t('spaces.spaceListing.error'))
  }

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
      </View>
    )
  }

  return (
    <DefaultLayout>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
        <SpacesFilterHeader
          style={styles.spacesContainer}
          topics={topics}
          location={location}
          onPress={() => navigate('/apps/donations')}
        />
        {spaces.map((space) => {
          return (
            <HoliButton key={space.id} label={space.title} onPress={() => navigate(`/spaces/${space.id}`)}>
              <HoliText>{space.title}</HoliText>
            </HoliButton>
          )
        })}
      </View>
    </DefaultLayout>
  )
}

export default Spaces
const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  spacesContainer: {
    marginVertical: 16,
  },
})
