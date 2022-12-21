import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesGroup from '@holi/core/screens/spaces/components/SpacesGroup'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/queries'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type DiscoverSpacesViewProps = {
  user?: User
  style?: StyleProp<ViewStyle>
  userSpecificSpacesGroups: DiscoverSpacesGroup[]
  defaultSpacesGroups: DiscoverSpacesGroup[]
}

const DiscoverSpacesView: React.VFC<DiscoverSpacesViewProps> = ({
  style,
  userSpecificSpacesGroups,
  defaultSpacesGroups,
}) => {
  const { topics, skills } = useContext(SpaceTermContext)

  const { t } = useTranslation()

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>

      <View style={styles.body}>
        {/* User specific spaces suggestions */}
        {userSpecificSpacesGroups.map((group, index) => (
          <SpacesGroup
            key={index}
            topic={topics.find((topic) => topic.id === group.topicId)}
            skill={skills.find((skill) => skill.id === group.skillId)}
            location={group.location}
            spaces={group.spaces}
            style={styles.spacesGroup}
          />
        ))}

        {userSpecificSpacesGroups.length > 0 && defaultSpacesGroups.length > 0 && (
          <HoliText style={styles.othersTitle}>{t('spaces.discover.others')}</HoliText>
        )}

        {/* Default spaces suggestions */}
        {defaultSpacesGroups.map((group, index) => (
          <SpacesGroup
            key={index}
            topic={topics.find((topic) => topic.id === group.topicId)}
            skill={skills.find((skill) => skill.id === group.skillId)}
            location={group.location}
            spaces={group.spaces}
            style={styles.spacesGroup}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 24,
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
})

export default DiscoverSpacesView
