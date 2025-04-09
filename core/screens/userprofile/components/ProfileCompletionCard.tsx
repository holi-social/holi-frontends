import type React from 'react'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { AddCircleLine, ArrowDownS, ArrowUpS, MapPin2, UserSmile } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spacing } from 'holi-bricks/tokens'
import { ProgressSteps } from '@holi/core/screens/userprofile/components/ProgressSteps'
import GradientBackground from '@holi/core/components/GradientBackground'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { Button } from 'holi-bricks/components/button'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

type Selection = {
  label: string
  select: boolean
  type: 'LOCATION' | 'AVATAR' | 'INTERESTS'
  icon: HoliIconType
}

type ProfileCompletionCardProps = {
  onPressEdit?: () => void
  style?: StyleProp<ViewStyle>
  page: 'profile' | 'home_feed'
}

const getCompletionPercentage = (selections: Selection[]): number => {
  const completedSelections = selections.filter((selection) => selection.select).length
  return selections.length ? (completedSelections / selections.length) * 100 : 0
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ style, onPressEdit, page }) => {
  const { theme } = useTheme()
  const { track } = useTracking()
  const { navigate } = useRouting()
  const { colors } = theme
  const { t } = useTranslation()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { user } = useLoggedInUser()
  const gradientColors = ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']

  const hasInterests = !!user?.interestsV2?.length
  const hasAvatar = !!user?.avatar
  const hasLocation = !!user?.location
  const [showCard, setShowCard] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const isCompleted = hasInterests && hasAvatar && hasLocation
  const [justCompleted, setJustCompleted] = useState(false)
  const paddingBottom = !isExpanded && { paddingBottom: isCompleted ? 16 : 0 }

  const selections: Selection[] = useMemo(
    () => [
      {
        label: t('profile.completion.interests.title'),
        select: hasInterests,
        type: 'INTERESTS',
        icon: AddCircleLine,
      },
      {
        label: t('profile.completion.avatar.title'),
        select: hasAvatar,
        type: 'AVATAR',
        icon: UserSmile,
      },
      {
        label: t('profile.completion.location.title'),
        select: hasLocation,
        type: 'LOCATION',
        icon: MapPin2,
      },
    ],
    [hasInterests, hasAvatar, hasLocation, t]
  )

  const completedSteps = selections.filter((selection) => selection.select).length

  const handleDismiss = useCallback(async () => {
    await AsyncStorage.setItem('profileCardDismissed', 'true')
    track(TrackingEvent.UserProfile.completionDismissed(page))
    setShowCard(false)
  }, [track, page])

  useEffect(() => {
    const checkDismissed = async () => {
      const dismissed = await AsyncStorage.getItem('profileCardDismissed')
      setShowCard(dismissed !== 'true')
    }

    const checkCompletionStatus = async () => {
      if (user) {
        await checkDismissed()

        if (isCompleted) {
          if (!justCompleted) {
            setJustCompleted(true)
            setShowCard(true)

            const timer = setTimeout(() => {
              handleDismiss()
            }, 10000)

            return () => clearTimeout(timer)
          }
        } else {
          setJustCompleted(false)
        }
      }
    }
    checkCompletionStatus()
  }, [user, isCompleted, justCompleted, handleDismiss])

  const Header = () => (
    <Pressable
      style={styles.headerContainer}
      testID={`btn-right-${'testID'}`}
      onPress={() => (!isCompleted ? setIsExpanded(!isExpanded) : null)}
    >
      {isCompleted && (
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_celebrate.png')}
          label={''}
          width={24}
          height={24}
          style={styles.image}
        />
      )}
      <View style={styles.headerTitleContainer}>
        <HoliText bold>
          {!isCompleted ? t('profile.completion.card.title') : t('profile.completion.card.title.completed')}
        </HoliText>
      </View>
      {!isCompleted && (
        <View style={styles.headerRightButton}>
          <HoliIcon icon={isExpanded ? ArrowUpS : ArrowDownS} size={24} colorOverride={colors.foreground30} />
        </View>
      )}
    </Pressable>
  )

  const Selection = () => (
    <View style={styles.selectionContainer}>
      {(isExpanded ? selections : selections.slice(0, 2)).map((selection, index) => (
        <View style={styles.selection} key={index}>
          <HoliIcon
            icon={selection.icon}
            size={24}
            colorOverride={selection.select ? colors.gray200 : colors.black300}
          />
          <HoliText color={selection.select ? 'gray200' : 'black300'}>{selection.label}</HoliText>
        </View>
      ))}
    </View>
  )

  const Buttons = () => (
    <View style={styles.buttons}>
      <Button
        label={t('profile.completion.button.edit')}
        onPress={onPressEdit ?? (() => navigate('/profile'))}
        inline
      />
      <Button label={t('profile.completion.button.dismiss')} onPress={() => handleDismiss()} inline transparent />
    </View>
  )

  return (
    <>
      {showCard && user && (
        <View style={[styles.wrapper, paddingBottom, style]}>
          <Header />
          <ProgressSteps
            percentage={getCompletionPercentage(selections)}
            size="small"
            steps={selections.length}
            completedSteps={completedSteps}
          />
          {!isCompleted &&
            (isExpanded ? (
              <>
                <Selection />
                <Buttons />
              </>
            ) : (
              <>
                <Selection />
                <View style={styles.gradient}>
                  <GradientBackground colors={gradientColors} />
                </View>
              </>
            ))}
        </View>
      )}
    </>
  )
}

export default ProfileCompletionCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      padding: Spacing.xs,
      gap: Spacing.xs,
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitleContainer: {
      flex: 4,
      justifyContent: 'center',
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRightButton: {
      alignSelf: 'flex-start',
      paddingLeft: Spacing.xs,
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 62,
      marginHorizontal: 16,
    },
    buttons: {
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    editButton: {
      paddingVertical: Spacing['3xs'],
      paddingHorizontal: Spacing.xs,
      borderWidth: 1,
      borderRadius: 500,
      backgroundColor: theme.colors.brandColorA20,
    },
    selectionContainer: {
      gap: Spacing['3xs'],
    },
    selection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    image: {
      marginRight: Spacing.xs,
    },
  })
