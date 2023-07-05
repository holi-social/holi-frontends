import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceCollaboratorOnboarding from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboarding'
import SpaceCollaboratorOnboardingInfo from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingInfo'
import SpaceFollow from '@holi/core/screens/spaces/details/components/SpaceFollow'
import SpaceJoin from '@holi/core/screens/spaces/details/components/SpaceJoin'
import NewToolsTeaser from '@holi/core/screens/spaces/linkHub/components/NewToolsTeaser'
import SpaceCollaborationArea from '@holi/core/screens/spaces/linkHub/components/SpaceCollaborationArea'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceInvolvementProps {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceInvolvement: React.FC<SpaceInvolvementProps> = ({ space, style }) => {
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember
  const { visible: onboardingVisible, show: showOnboarding, hide: hideOnboarding } = useModalState()
  const mixins = useStyleMixins()

  return (
    <>
      <View style={style}>
        {isCollaborator && <SpaceCollaborationArea space={space} />}
        {isCollaborator ? (
          <TaskCollaborationCard isAdmin={isAdmin} space={space} />
        ) : (
          <View style={mixins.container}>
            <View style={styles.onboarding}>
              <SpaceCollaboratorOnboardingInfo />
            </View>
            <SpaceCollaboratorOnboarding space={space} hide={hideOnboarding} visible={onboardingVisible} />
            <SpaceTaskList isAdmin={isAdmin} space={space} />
          </View>
        )}
        {isCollaborator && <NewToolsTeaser />}
      </View>

      <View style={styles.floatingContainer}>
        <SpaceFollow space={space} style={styles.floatingButton} />
        <SpaceJoin space={space} showOnboarding={showOnboarding} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  onboarding: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
    marginBottom: 32,
  },
  floatingContainer: {
    // position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 42,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  floatingButton: {
    marginRight: 8,
    maxWidth: vars.maxButtonWidth,
  },
})

export default SpaceInvolvement
