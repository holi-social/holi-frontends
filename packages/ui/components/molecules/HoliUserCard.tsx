import { AccessibilityPropsWeb } from 'packages/ui/@types/reactNativeWeb'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type HoliUserCardVariant = 'small' | 'normal'

export type HoliUserCardProps = {
  user: User
  variant?: HoliUserCardVariant
  category?: string
  style?: StyleProp<ViewStyle>
  disableFocusability?: boolean
  accessibilityLabel?: string
}

const HoliUserCard: React.VFC<HoliUserCardProps> = ({
  user,
  variant = 'normal',
  category,
  style,
  disableFocusability,
  accessibilityLabel,
}: HoliUserCardProps) => {
  const { t } = useTranslation()
  const styles = getStyles(variant)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityLabel,
  }

  if (!user) {
    return <View style={[styles.cardContainer, style]} />
  }

  const { firstName, lastName, avatar, avatarLabel, avatarDefaultColor, aboutMe } = user

  const nameLabel = `${firstName || ''} ${lastName || ''}`.trim()
  return (
    <>
      <View {...accessibilityProps} style={[styles.cardContainer, style]} testID="user-card">
        <HoliUserAvatar
          imageSrc={avatar}
          label={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
          initials={avatarLabel}
          defaultColor={avatarDefaultColor}
          size="extralarge"
        />
        {variant === 'normal' && (
          <>
            <HoliText style={styles.textStyle} bold>
              {nameLabel}
            </HoliText>
            {category && <HoliChip style={styles.chip} text={category} label={category} checked hideIcon disabled />}
            <View style={styles.aboutMeContainer}>
              <HoliText style={styles.textStyleAboutMe}>{aboutMe}</HoliText>
            </View>
          </>
        )}
      </View>
      {variant === 'small' && (
        <View style={styles.textContainer}>
          <HoliText style={styles.textStyleSmall} size="small">
            {nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
          </HoliText>
        </View>
      )}
    </>
  )
}

export default HoliUserCard

const getStyles = (variant: HoliUserCardVariant) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 16,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: colors.softwhite,
      padding: variant === 'normal' ? 24 : 16,
      height: variant === 'normal' ? '100%' : 'auto',
    },
    chip: {
      marginBottom: 8,
      alignSelf: 'center',
    },
    aboutMeContainer: {
      marginTop: 8,
      justifyContent: 'center',
    },
    textStyleAboutMe: { textAlign: 'center' },
    textContainer: {
      marginTop: 16,
    },
    textStyle: {
      textAlign: 'center',
      marginVertical: 8,
    },
    textStyleSmall: {
      textAlign: 'center',
    },
  })
