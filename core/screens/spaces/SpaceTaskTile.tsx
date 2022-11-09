import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors, vars } from '@holi/ui/styles/globalVars'

import { Task } from './types'

export type SpaceTaskTileProps = {
  style?: StyleProp<ViewStyle>
  task: Task
}

const SpaceTaskTile: React.VFC<SpaceTaskTileProps> = ({ task, style }: SpaceTaskTileProps) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View key={task.id} style={[style, styles.taskItem]}>
      <View style={styles.headingAvatarContainer}>
        <HoliHeading level="2">{task.name}</HoliHeading>
        <HoliUserAvatar
          imageSrc={task.creator.avatar}
          label={userFullName(task.creator) || t('spaces.tasks.creator.anonymous')}
          initials={task.creator.avatarLabel || ''}
          defaultColor={task.creator.avatarDefaultColor || ''}
          size="micro"
        />
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="global" size={16} color={colors.grey} style={styles.spaced} />
          <HoliText style={styles.spaced}>{task.location}</HoliText>
        </View>
        <View style={styles.iconGroupContainer}>
          <HoliIcon icon="time" size={16} color={colors.grey} style={styles.spaced} />
          <HoliText style={styles.spaced}>{t(`spaces.tasks.regularity.${task.regularity}`)}</HoliText>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <HoliReadMore numberOfLines={3}>
          <HoliText>{task.description}</HoliText>
        </HoliReadMore>
      </View>
      <HoliButton
        label={t('spaces.tasks.cta_claim')}
        onPress={() => ({})} // TODO add action
        testID={'spaces-tasks-cta-claim'}
        inline
        style={styles.ctaClaimButton}
      >
        <HoliText>{t('spaces.tasks.cta_claim')}</HoliText>
      </HoliButton>
      <View style={styles.spotsClaimedContainer}>
        <HoliText size="small">
          {t('spaces.tasks.spots_claimed', { taken: task.slotsTaken, available: task.slotsAvailable })}
        </HoliText>
      </View>
    </View>
  )
}

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    headingAvatarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    taskItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColorGrey,
      backgroundColor: colors.backgroundColorWhite,
      padding: 24,
      marginRight: 10,
      width: Platform.select({
        native: screenWidth - 24 - 24 - 20,
        web: screenWidth > +vars.breakpointS ? 300 : screenWidth - 24 - 24 - 20,
      }),
    },
    descriptionContainer: { marginBottom: 16 },
    ctaClaimButton: { marginBottom: 16 },
    iconsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    iconGroupContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaced: {
      marginRight: 5,
    },
    spotsClaimedContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })

export default SpaceTaskTile
