import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface DiscoverSpacesViewProps {
  loading?: boolean
  user?: User
  style?: StyleProp<ViewStyle>
  userSpecificSpacesGroups: DiscoverSpacesGroup[]
  defaultSpacesGroups: DiscoverSpacesGroup[]
}

const DiscoverSpacesView: React.FC<DiscoverSpacesViewProps> = ({
  loading = false,
  style,
  userSpecificSpacesGroups,
  defaultSpacesGroups,
}) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { openLoginModal } = useLoginModal()

  const hasUserSpecificTiers = userSpecificSpacesGroups.some((group) => group.spaces.totalResults > 0)
  const hasDefaultTiers = defaultSpacesGroups.some((group) => group.spaces.totalResults > 0)

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal()
  }, [isLoggedIn, navigate, openLoginModal])

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>
      <View style={styles.createSpaceButtonContainer}>
        <HoliButton
          label={t('spaces.discover.create.button')}
          onPress={() => {
            handleCreateSpaceButtonPress()
          }}
        >
          {t('spaces.discover.create.button')}
        </HoliButton>
      </View>

      <View style={styles.body}>
        {loading &&
          new Array(3).fill(1).map((_, idx) => {
            return <SpacesGroupSlider key={idx} loading={true} />
          })}

        {/* User specific spaces suggestions */}
        {!loading &&
          userSpecificSpacesGroups.map((group, index) => (
            <SpacesGroupSlider
              key={index}
              group={group}
              style={styles.spacesGroup}
              testID="discover-spaces-slider-user-specific"
            />
          ))}

        {!loading && hasUserSpecificTiers && hasDefaultTiers && (
          <HoliText style={styles.othersTitle} testID="discover-spaces-others">
            {t('spaces.discover.others')}
          </HoliText>
        )}

        {/* Default spaces suggestions */}
        {!loading &&
          defaultSpacesGroups.map((group, index) => (
            <SpacesGroupSlider
              key={index}
              group={group}
              style={styles.spacesGroup}
              testID="discover-spaces-slider-others"
            />
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: '400',
  },
  headerDescription: {
    marginTop: 8,
    fontWeight: '400',
  },
  body: {
    marginTop: 37,
  },
  spacesGroup: {
    marginBottom: 30,
  },
  othersTitle: {
    marginTop: 18,
    marginBottom: 48,
  },
  createSpaceButtonContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
})

export default DiscoverSpacesView
