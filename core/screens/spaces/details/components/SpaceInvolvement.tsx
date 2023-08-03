import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceCollaboratorOnboardingSteps from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingSteps'
import LinkHubWidget from '@holi/core/screens/spaces/linkHub/components/LinkHubWidget'
import NewToolsTeaser from '@holi/core/screens/spaces/linkHub/components/NewToolsTeaser'
import StorageWidget from '@holi/core/screens/spaces/linkHub/components/StorageWidget'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import TaskCollaborationCard from '@holi/core/screens/spaces/tasks/components/TaskCollaborationCard'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, OpenArm } from '@holi/icons/src/generated'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface SpaceInvolvementProps {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceInvolvement: React.FC<SpaceInvolvementProps> = ({ space, style }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember

  const navigateToTasks = () => navigate(`/spaces/${space.name}/tasks`)

  return (
    <>
      <View style={style}>
        {isAdmin && (
          <HoliLink label={t('spaces.collaborate.onboarding.link')} href={`/spaces/${space.name}/onboarding`}>
            <View style={[styles.card, styles.onboarding]}>
              <HoliIcon icon={OpenArm} size={24} color={colors.brandColorB30} style={styles.icon} />
              <HoliText>{t('spaces.collaborate.onboarding.link')}</HoliText>
              <HoliIcon icon={ArrowRightS} size={24} style={styles.end} />
            </View>
          </HoliLink>
        )}
        {isCollaborator && <LinkHubWidget space={space} style={styles.card} />}
        {isCollaborator && <StorageWidget space={space} style={styles.card} />}
        {isCollaborator ? (
          <TaskCollaborationCard isAdmin={isAdmin} space={space} isCollaborator={isCollaborator} />
        ) : (
          <>
            {space.onboarding?.steps && space.onboarding.steps.length > 0 && (
              <SpaceCollaboratorOnboardingSteps
                steps={space.onboarding?.steps}
                header={t('spaces.collaborate.onboarding.info.header')}
                style={styles.onboardingSteps}
              />
            )}
            <SpaceTaskList isAdmin={isAdmin} space={space} isCollaborator={isCollaborator} preview />
            {space.tasks && space.tasks.length > 2 && (
              <View style={styles.seeAllButtonContainer}>
                <HoliButton
                  label={t('spaces.spaceDetails.tasks.seeAllButton.label')}
                  onPress={() => navigateToTasks()}
                  style={styles.seeAllButton}
                  inline
                  type="secondary"
                >
                  <HoliText>{t('spaces.spaceDetails.tasks.seeAllButton.label')}</HoliText>
                </HoliButton>
              </View>
            )}
          </>
        )}
        {isCollaborator && <NewToolsTeaser />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  seeAllButtonContainer: {
    alignItems: 'center',
  },
  seeAllButton: {
    bottom: 0,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  onboarding: {
    backgroundColor: colors.white100,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background30,
  },
  onboardingSteps: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
    paddingBottom: 12,
    marginBottom: 32,
  },
  icon: {
    marginRight: 8,
    marginLeft: 16,
  },
  end: {
    marginLeft: 'auto',
    alignSelf: 'flex-end',
    marginRight: 16,
  },
})

export default SpaceInvolvement
