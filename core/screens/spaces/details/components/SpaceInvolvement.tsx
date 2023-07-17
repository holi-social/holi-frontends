import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import NewToolsTeaser from '@holi/core/screens/spaces/linkHub/components/NewToolsTeaser'
import SpaceCollaborationArea from '@holi/core/screens/spaces/linkHub/components/SpaceCollaborationArea'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, OpenArm } from '@holi/icons/src/generated'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface SpaceInvolvementProps {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceInvolvement: React.FC<SpaceInvolvementProps> = ({ space, style }) => {
  const { t } = useTranslation()
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember

  return (
    <>
      <View style={style}>
        {isAdmin && (
          <HoliLink label={t('spaces.collaborate.onboarding.link')} href={`/spaces/${space.name}/onboarding`}>
            <View style={styles.onboarding}>
              <HoliIcon icon={OpenArm} size={18} color={colors.brandColorB30} style={styles.icon} />
              <HoliText>{t('spaces.collaborate.onboarding.link')}</HoliText>
              <HoliIcon icon={ArrowRightS} style={styles.end} />
            </View>
          </HoliLink>
        )}
        {isCollaborator && <SpaceCollaborationArea space={space} />}
        {isCollaborator ? (
          <TaskCollaborationCard isAdmin={isAdmin} space={space} />
        ) : (
          <>
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
    backgroundColor: colors.white100,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  icon: {
    paddingLeft: 10,
    marginRight: 6,
  },
  end: {
    marginLeft: 'auto',
    alignSelf: 'flex-end',
    marginRight: 8,
  },
})

export default SpaceInvolvement
