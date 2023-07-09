import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceCollaboratorOnboardingInfo from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingInfo'
import NewToolsTeaser from '@holi/core/screens/spaces/linkHub/components/NewToolsTeaser'
import SpaceCollaborationArea from '@holi/core/screens/spaces/linkHub/components/SpaceCollaborationArea'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { colors } from '@holi/ui/styles/globalVars'

interface SpaceInvolvementProps {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceInvolvement: React.FC<SpaceInvolvementProps> = ({ space, style }) => {
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember

  return (
    <>
      <View style={style}>
        {isCollaborator && <SpaceCollaborationArea space={space} />}
        {isCollaborator ? (
          <TaskCollaborationCard isAdmin={isAdmin} space={space} />
        ) : (
          <>
            <View style={styles.onboarding}>
              <SpaceCollaboratorOnboardingInfo />
            </View>
            <SpaceTaskList isAdmin={isAdmin} space={space} />
          </>
        )}
        {isCollaborator && <NewToolsTeaser />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  onboarding: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
    marginBottom: 20,
  },
})

export default SpaceInvolvement
