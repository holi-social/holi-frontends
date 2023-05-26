import React, { useEffect } from 'react'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpaceOnboardModal from '@holi/core/screens/spaces/components/SpaceOnboardModal'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/helpers/hooks'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
  style?: StyleProp<ViewStyle>
}

const MySpaces: React.VFC<MySpacesProps> = ({ mySpaces = [], style }) => {
  const { visible, show, hide } = useModalState()

  const { isOnboarded, setIsOnboarded } = useSpaceOnboarding('space_join_is_onboarded')

  useEffect(() => {
    const mySpacesList = mySpaces.flatMap((section) => section.spaces.data)

    if (
      !isOnboarded &&
      mySpacesList.some((space) => !space.connectionStatusToMyself.includes(SpaceConnectionType.CREATOR)) &&
      mySpacesList.some((space) => !space.connectionStatusToMyself.includes(SpaceConnectionType.MEMBERSHIP_REQUESTOR))
    ) {
      show()
    }
  }, [mySpaces, show, isOnboarded])

  // FIXME: this will be very expensive when spaces start growing.
  // If we need a better API this should be changed on the backend.
  const mappedSpaces = mySpaces.map((section) => {
    return {
      title: section.section,
      type: section.type,
      data: section.spaces.data,
    }
  })

  const handleModalClose = () => {
    setIsOnboarded()
    hide()
  }

  return (
    <View style={[styles.mySpaces, style]}>
      {mappedSpaces.map((section, sectionIndex) => (
        <View key={`${sectionIndex}`} style={styles.section}>
          <HoliHeading level="3" size="small" testID={`section-headline-${section.type}`}>
            {section.title}
          </HoliHeading>

          {section.data.map((space) => (
            <View key={`${sectionIndex}-${space.name}`} style={styles.spaceItemContainer}>
              <HoliBlockItem
                label={space.title}
                title={space.title}
                subtitle={space.location}
                description={space.description}
                imageElement={<SpaceAvatar space={space} size="large" />}
                users={space.members.data.map((membership) => membership.user)}
                href={decodeURI(`/spaces/${space.name}`)}
                type={section.type}
                testID="space-link"
              />
            </View>
          ))}
        </View>
      ))}
      <SpaceOnboardModal visible={visible} handleModalClose={handleModalClose} />
    </View>
  )
}

export default MySpaces

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background20,
    flex: 1,
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  mySpaces: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  spaceItemContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    alignItems: 'center',
  },
})
