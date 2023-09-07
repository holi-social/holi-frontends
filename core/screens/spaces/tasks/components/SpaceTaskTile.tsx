import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import useDeleteTask from '@holi/core/hooks/spaces/useDeleteTask'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'
import { LocationType, Space, Task, VisibilityType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  AtFilled,
  Delete,
  Edit2,
  GlobalFilled,
  GlobeFilled,
  LockFilled,
  MapPin2Filled,
  More,
  PhoneFilled,
  RefreshFilled,
  Time,
} from '@holi/icons/src/generated'
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
  showOptions?: boolean
  isAdmin?: boolean
  isCollaborator?: boolean
  showFullView?: boolean
}

const IMAGE_ASPECT_RATIO = 327 / 210

const SpaceTaskTile: React.FC<SpaceTaskTileProps> = ({
  task,
  space,
  showOptions = false,
  isAdmin,
  isCollaborator,
  showFullView = true,
}: SpaceTaskTileProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const [imageError, setImageError] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [isLoadingDeleteTask, deleteTask] = useDeleteTask({
    id: task.id,
    spaceIdOrName: space.name,
    successMsg: t('spaces.tasks.delete.success'),
  })

  const goToDetailView = () => navigate(`/spaces/${space.name}/tasks/${task.id}`)

  const handlePlaceholder = useCallback(() => {
    setShowPlaceholder(imageError || !task.thumbnail)
  }, [imageError, task.thumbnail])

  useEffect(() => {
    handlePlaceholder()
  }, [handlePlaceholder])

  return (
    <View key={task.id} style={styles.taskItem} testID="space-task-tile">
      <HoliButton
        transparent
        label={task.name}
        onPress={goToDetailView}
        disabled={showFullView}
        style={styles.clickOverlay}
      >
        <View style={styles.imageContainer}>
          {!showPlaceholder && !!task.thumbnail && (
            <HoliImage
              label={t('spaces.tasks.thumbnail.label')}
              source={{ uri: task.thumbnail }}
              blurhash={task.thumbnailBlurhash}
              style={showFullView ? styles.imageShowFullView : styles.image}
              onError={() => setImageError(true)}
            />
          )}
          {showPlaceholder && (
            <View style={[styles.image, styles.emptyImage]}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
                label={t('spaces.tasks.thumbnail.label')}
                isSvg
                height={166}
                width={296}
                style={styles.image}
              />
            </View>
          )}
          {isCollaborator && (
            <View style={styles.visibility}>
              <HoliIcon
                icon={task.visibility === VisibilityType.PUBLIC ? GlobeFilled : LockFilled}
                color={colors.foreground30}
                size={16}
                style={styles.iconGroupIcon}
              />
              <HoliText size="small">{t(`spaces.input.task.visibility.${task.visibility}.title`)}</HoliText>
            </View>
          )}
        </View>
      </HoliButton>

      <View style={styles.detailContainer}>
        <HoliButton
          transparent
          label={task.name}
          onPress={goToDetailView}
          disabled={showFullView}
          style={[styles.clickOverlay, { flex: 1 }]}
        >
          <HoliText ellipsizeMode="tail" bold {...(showFullView ? {} : { numberOfLines: 2 })}>
            {task.name}
          </HoliText>
        </HoliButton>
        {showOptions && isAdmin && (
          <HoliActionDrawer.Drawer
            label={t('global.moreOptions')}
            testID="btn-task-more-options"
            buttonElement={<HoliIcon icon={More} color={colors.foreground30} />}
          >
            <HoliActionDrawer.Action
              icon={Edit2}
              title={t('global.edit')}
              testID="btn-to-edit-task"
              handleAction={() => navigate(`/spaces/${space.name}/tasks/${task.id}/edit`)}
            />
            <HoliActionDrawer.Action
              isLoading={isLoadingDeleteTask}
              icon={Delete}
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
      <HoliButton
        transparent
        label={task.name}
        onPress={goToDetailView}
        disabled={showFullView}
        style={styles.clickOverlay}
      >
        <View style={styles.iconsContainer}>
          <View style={styles.iconGroupContainer}>
            <HoliIcon
              icon={
                task.location ? MapPin2Filled : task.locationType === LocationType.HYBRID ? RefreshFilled : GlobalFilled
              }
              size={12}
              color={colors.foreground20}
              style={styles.iconGroupIcon}
            />
            <HoliText style={styles.iconGroupText} size="extrasmall">
              {!task.location ? t(`spaces.input.task.locationType.${task.locationType}.title`) : task.location}
            </HoliText>
          </View>
          <View style={styles.iconGroupContainer}>
            <HoliIcon icon={Time} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
            <HoliText style={styles.iconGroupText} size="extrasmall">
              {t(`spaces.input.task.regularity.${task.regularity}.title`)}
            </HoliText>
          </View>
        </View>
      </HoliButton>
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

      <HoliButton
        transparent
        label={task.name}
        onPress={goToDetailView}
        disabled={showFullView}
        style={styles.clickOverlay}
      >
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
                imageBlurhash={task.creator.avatarBlurhash}
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
              <HoliIcon icon={AtFilled} color={colors.foreground20} />
              <HoliText style={styles.contactInformation} size="small">
                {task.contactEmail}
              </HoliText>
            </View>

            {!!task.contactPhone && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={PhoneFilled} color={colors.foreground20} />
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
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  clickOverlay: {
    position: 'relative',
    pointerEvents: 'auto',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
    justifyContent: 'center',
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
    marginBottom: 16,
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
    flexShrink: 1,
  },
  iconsContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
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
