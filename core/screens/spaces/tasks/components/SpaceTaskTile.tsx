import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import useDeleteTask from '@holi/core/hooks/useDeleteTask'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import { LocationType, Space, Task, VisibilityType } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceTaskTileProps = {
  task: Task
  space: Space
  isAdmin?: boolean
  showFullView?: boolean
}

const IMAGE_ASPECT_RATIO = 327 / 210

const SpaceTaskTile: React.FC<SpaceTaskTileProps> = ({
  task,
  space,
  isAdmin,
  showFullView = true,
}: SpaceTaskTileProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const [isLoadingDeleteTask, deleteTask] = useDeleteTask({
    id: task.id,
    spaceIdOrName: space.id,
    successMsg: t('spaces.tasks.delete.success'),
  })

  const goToDetailView = () => navigate(`/spaces/${space.name}/tasks/${task.id}`)

  return (
    <View key={task.id} style={styles.taskItem} testID="space-task-tile">
      <HoliButton transparent label={task.name} onPress={goToDetailView} disabled={showFullView}>
        <View style={styles.imageContainer}>
          {!!task.thumbnail && (
            <HoliImage
              label={t('spaces.task.thumbnail.label')}
              source={{ uri: task.thumbnail }}
              style={showFullView ? styles.imageShowFullView : styles.image}
            />
          )}
          {!task.thumbnail && (
            <View style={[styles.image, styles.emptyImage]}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
                label={t('spaces.task.thumbnail.label')}
                isSvg
                height={166}
                width={296}
                style={styles.image}
              />
            </View>
          )}
          <View style={styles.visibility}>
            <HoliIcon
              icon={task.visibility === VisibilityType.PUBLIC ? 'globe' : 'lock'}
              size={12}
              color={colors.foreground30}
              style={styles.iconGroupIcon}
              filled
            />
            <HoliText size="small">{t(`spaces.input.task.visibility.${task.visibility}.title`)}</HoliText>
          </View>
        </View>
      </HoliButton>
      <View style={styles.detailContainer}>
        <HoliButton
          disabled={showFullView}
          transparent
          inline
          label={task.name}
          onPress={goToDetailView}
          style={{ flex: 1 }}
        >
          <HoliText ellipsizeMode="tail" bold {...(showFullView ? {} : { numberOfLines: 2 })}>
            {task.name}
          </HoliText>
        </HoliButton>
        {isAdmin && (
          <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="btn-task-more-options">
            <HoliActionDrawer.Action
              action="edit"
              title={t('global.edit')}
              testID="btn-to-edit-task"
              handleAction={() => navigate(`/spaces/${space.name}/tasks/${task.id}/edit`)}
            />
            <HoliActionDrawer.Action
              isLoading={isLoadingDeleteTask}
              action="delete"
              title={t('spaces.digitalTool.delete.label')}
              variant="danger"
              testID="btn-to-delete-task"
              showConfirmation
            >
              <HoliActionDrawer.Confirmation
                title={t('spaces.tasks.delete.confirmation.title')}
                description={t('spaces.tasks.delete.confirmation.description')}
                testID="task-delete"
                handleConfirmation={deleteTask}
                buttonType="warning"
                hasDismissBtn
                requireLogin
              />
            </HoliActionDrawer.Action>
          </HoliActionDrawer.Drawer>
        )}
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon
            icon={task.location ? 'map-pin-2' : task.locationType === LocationType.HYBRID ? 'refresh' : 'global'}
            size={12}
            color={colors.foreground20}
            style={styles.iconGroupIcon}
            filled
          />
          <HoliText style={styles.iconGroupText} size="extrasmall">
            {!task.location ? t(`spaces.input.task.locationType.${task.locationType}.title`) : task.location}
          </HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="time" size={12} color={colors.foreground20} style={styles.iconGroupIcon} filled />
          <HoliText style={styles.iconGroupText} size="extrasmall">
            {t(`spaces.input.task.regularity.${task.regularity}.title`)}
          </HoliText>
        </View>
      </View>
      {task.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {task.skills.map((skill) => {
            return (
              <SpacesFilterPill
                small
                key={skill.id}
                testID="spaces-topic-title"
                label={skill.title}
                filterType="skill"
                style={styles.pill}
              />
            )
          })}
        </View>
      )}
      {!showFullView ? (
        <View style={styles.descriptionContainer}>
          <HoliText color="gray300" size="small" {...(showFullView ? {} : { numberOfLines: 3 })}>
            {task.description}
          </HoliText>
        </View>
      ) : (
        <View style={styles.descriptionContainer}>
          <HoliText color="gray300" size="small">
            {task.description}
          </HoliText>
          <HoliText bold style={styles.publishedByTitle}>
            {t('spaces.tasks.published.by.title')}
          </HoliText>
          <View style={styles.avatar}>
            <HoliAvatar
              imageSrc={task.creator.avatar}
              label={task.creator.fullName || t('user.profileView.anonymous')}
              initials={task.creator.avatarLabel || ''}
              defaultColor={task.creator.avatarDefaultColor || ''}
              size="large"
              testID="task-contact-avatar"
            />
            <HoliText style={styles.avatarName}>{task.creator.fullName || t('user.profileView.anonymous')}</HoliText>
          </View>

          <HoliText bold style={styles.contactInformationTitle}>
            {t('spaces.tasks.contact.title')}
          </HoliText>
          <View style={styles.contactContainer}>
            <HoliIcon icon="at" size={24} color={colors.foreground20} filled />
            <HoliText style={styles.contactInformation} size="small">
              {task.contactEmail}
            </HoliText>
          </View>

          {!!task.contactPhone && (
            <View style={styles.contactContainer}>
              <HoliIcon icon="phone" size={24} color={colors.foreground20} filled />
              <HoliText style={styles.contactInformation} size="small">
                {task.contactPhone}
              </HoliText>
            </View>
          )}
        </View>
      )}
      {/* TODO: reinsert when claiming is implemented */}
      {/* <View style={styles.buttonContainer}>
        <HoliButton
          label={t('spaces.tasks.cta_claim')}
          onPress={() => ({})} // TODO add action
          testID={'spaces-tasks-cta-claim'}
          inline
        >
          <HoliText selectable={false} size="small">
            {t('spaces.tasks.cta_claim')}
          </HoliText>
        </HoliButton>
      </View> */}
      {/* <HoliText size="extrasmall" style={styles.spotsClaimed}>
        {t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}
      </HoliText> */}
    </View>
  )
}

const styles = StyleSheet.create({
  detailContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreOptionsButton: {
    marginLeft: 16,
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
    height: 166,
  },
  imageShowFullView: {
    borderRadius: 8,
    width: '100%',
    aspectRatio: IMAGE_ASPECT_RATIO,
    height: Platform.OS === 'web' ? '100%' : 'auto',
  },
  emptyImage: {
    backgroundColor: colors.background20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  taskItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    padding: 8,
    flexShrink: 1,
  },
  pill: {
    marginRight: 6,
    marginTop: 4,
  },
  iconsContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconGroupIcon: {
    marginRight: 4,
  },
  iconGroupText: {
    color: colors.foreground20,
    marginRight: 8,
  },
  spotsClaimed: {
    textAlign: 'right',
    color: colors.foreground20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  skill: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.foreground20,
    height: 33,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  visibility: {
    position: 'absolute',
    left: 8,
    top: 8,
    padding: 4,
    paddingRight: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishedByTitle: {
    marginTop: 32,
  },
  avatar: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarName: {
    marginLeft: 16,
  },
  contactInformationTitle: {
    marginTop: 16,
  },
  contactContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInformation: {
    marginLeft: 10,
  },
  buttonWithIcon: {
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 12,
  },
})

export default memo(SpaceTaskTile)
