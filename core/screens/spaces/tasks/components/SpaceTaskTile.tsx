import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import FilterPill from '@holi/core/components/FilterPill'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { LocationType, Space, Task, VisibilityType } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  AtFilled,
  GlobalFilled,
  GlobeFilled,
  LockFilled,
  MapPin2Filled,
  PhoneFilled,
  RefreshFilled,
  TimeFilled,
} from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type Variant = 'full' | 'recommendation' | 'list'

export type SpaceTaskTileProps = {
  task: Task
  space: Space
  isAdmin?: boolean
  isCollaborator?: boolean
  variant?: Variant
}

const IMAGE_ASPECT_RATIO = 311 / 166

const SpaceTaskTile: React.FC<SpaceTaskTileProps> = ({
  task,
  space,
  isCollaborator = false,
  variant = 'full',
}: SpaceTaskTileProps) => {
  const isVariantFull = variant === 'full'
  const isVariantRecommendation = variant === 'recommendation'
  const isVariantList = variant === 'list'
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()
  const [imageError, setImageError] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const goToDetailView = () => navigate(`/spaces/${space.name}/tasks/${task.id}`)

  const handlePlaceholder = useCallback(() => {
    setShowPlaceholder(imageError || !task.thumbnail)
  }, [imageError, task.thumbnail])

  useEffect(() => {
    handlePlaceholder()
  }, [handlePlaceholder])

  return (
    <View style={[styles.taskItem, isVariantRecommendation && styles.taskItemRecommendation]} testID="space-task-tile">
      <HoliButton
        transparent
        label={task.name}
        onPress={goToDetailView}
        disabled={isVariantFull}
        style={styles.clickOverlay}
      >
        <View style={styles.imageContainer}>
          {!showPlaceholder && !!task.thumbnail && (
            <HoliImage
              label={t('spaces.tasks.thumbnail.label')}
              source={{ uri: task.thumbnail }}
              blurhash={task.thumbnailBlurhash}
              style={isVariantFull ? styles.imageVariantFull : styles.image}
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
          {isVariantList && isCollaborator && (
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
          {isVariantRecommendation && (
            <View style={styles.spaceOverlay}>
              <SpaceAvatar space={space} size={'micro'} />
              <HoliText size={'extrasmall'} color={'gray300'}>
                {space.name}
              </HoliText>
            </View>
          )}
        </View>
      </HoliButton>
      <View style={styles.detailContainer}>
        <HoliButton
          transparent
          label={task.name}
          onPress={goToDetailView}
          disabled={isVariantFull}
          style={[styles.clickOverlay, { flex: 1 }]}
        >
          <HoliText ellipsizeMode="tail" bold {...(isVariantFull ? {} : { numberOfLines: 2 })} testID="task-title">
            {task.name}
          </HoliText>
        </HoliButton>
        {isVariantList && <TaskDrawer task={task} space={space} />}
      </View>
      {isVariantFull && (
        <>
          <HoliGap size={'xs'} />
          <HoliLink
            label={space.name ? t('space.visitProfile', { title: space.name }) : ''}
            href={`/spaces/${space.name}`}
          >
            <View style={styles.space}>
              <SpaceAvatar space={space} size={'micro'} />
              <HoliText size={'small'}>
                <Trans t={t} i18nKey="spaces.tasks.details.space" values={{ space: space.name }}>
                  <HoliText size={'small'} bold />
                </Trans>
              </HoliText>
            </View>
          </HoliLink>
          <HoliGap size={'s'} />
        </>
      )}
      <HoliButton
        transparent
        label={task.name}
        onPress={goToDetailView}
        disabled={isVariantFull}
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
            <HoliIcon icon={TimeFilled} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
            <HoliText style={styles.iconGroupText} size="extrasmall">
              {t(`spaces.input.task.regularity.${task.regularity}.title`)}
            </HoliText>
          </View>
        </View>
      </HoliButton>
      {task.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {task.skills.map((skill) => {
            return <FilterPill small key={skill.id} label={skill.title} filterType="skill" style={styles.pill} />
          })}
        </View>
      )}

      {!isVariantFull ? (
        <HoliButton
          transparent
          label={task.name}
          onPress={goToDetailView}
          disabled={isVariantFull}
          style={styles.clickOverlay}
        >
          <View style={styles.descriptionContainer}>
            <HoliRichTextOutput
              text={task.description}
              color="gray300"
              size="small"
              allowAllLinks
              testID="task-description"
            />
          </View>
        </HoliButton>
      ) : (
        <View style={styles.descriptionContainer}>
          <HoliRichTextOutput
            text={task.description}
            color="black300"
            size="small"
            allowAllLinks
            testID="task-description"
          />
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
              size="medium"
              testID="task-contact-avatar"
            />
            <HoliText>{task.creator.fullName || t('user.profileView.anonymous')}</HoliText>
          </View>

          <HoliText bold style={styles.contactInformationTitle}>
            {t('spaces.tasks.contact.title')}
          </HoliText>
          <View style={styles.contactContainer}>
            <HoliIcon icon={AtFilled} color={colors.foreground20} />
            <HoliButton
              inline
              transparent
              label={task.contactEmail}
              onPress={() => Linking.openURL(`mailto:${task.contactEmail}`)}
            >
              <HoliText size="small">{task.contactEmail}</HoliText>
            </HoliButton>
          </View>

          {!!task.contactPhone && (
            <View style={styles.contactContainer}>
              <HoliIcon icon={PhoneFilled} color={colors.foreground20} />
              <HoliButton
                inline
                transparent
                label={task.contactPhone}
                onPress={() => Linking.openURL(`tel:${task.contactPhone}`)}
              >
                <HoliText size="small">{task.contactPhone}</HoliText>
              </HoliButton>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
    descriptionContainer: {
      marginVertical: 16,
    },
    image: {
      borderRadius: 8,
      height: 136,
      justifyContent: 'center',
    },
    imageVariantFull: {
      borderRadius: 8,
      width: '100%',
      aspectRatio: IMAGE_ASPECT_RATIO,
      height: Platform.OS === 'web' ? '100%' : 'auto',
    },
    emptyImage: {
      backgroundColor: theme.colors.background20,
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
      borderColor: theme.colors.foreground30at12Percent,
      backgroundColor: theme.colors.background10,
      padding: 8,
      flexShrink: 1,
    },
    taskItemRecommendation: {
      borderColor: theme.colors.gray200,
    },
    space: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    pill: {
      marginRight: 6,
      marginTop: 4,
      flexShrink: 1,
    },
    iconsContainer: {
      marginTop: 8,
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
      color: theme.colors.foreground20,
      marginRight: 8,
    },
    spotsClaimed: {
      textAlign: 'right',
      color: theme.colors.foreground20,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    skill: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      paddingHorizontal: 14,
      paddingVertical: 8,
      color: theme.colors.foreground20,
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
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceOverlay: {
      position: 'absolute',
      left: 8,
      bottom: 8,
      padding: 4,
      paddingRight: 8,
      borderRadius: 6,
      gap: 4,
      backgroundColor: theme.colors.background10,
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
      gap: 16,
    },
    contactInformationTitle: {
      marginTop: 16,
    },
    contactContainer: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buttonWithIcon: {
      display: 'flex',
      justifyContent: 'center',
      paddingVertical: 18,
      marginBottom: 12,
    },
  })

export default memo(SpaceTaskTile)
