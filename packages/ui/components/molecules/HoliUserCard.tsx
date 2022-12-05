import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type HoliUserCardVariant = 'small' | 'normal'

export type HoliUserCardProps = {
  user: User
  variant?: HoliUserCardVariant
  testID?: string
  category?: string
  style?: StyleProp<ViewStyle>
  disableFocusability?: boolean
  label?: string
}

const HoliUserCard: React.VFC<HoliUserCardProps> = ({
  user,
  variant = 'normal',
  testID,
  category,
  style,
  disableFocusability,
  label,
}: HoliUserCardProps) => {
  const { t } = useTranslation()
  const styles = getStyles(variant)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityLabel: label,
  }

  if (!user) {
    return <View style={[styles.cardContainer, style]} />
  }

  const { fullName, avatar, avatarLabel, avatarDefaultColor, aboutMe } = user

  return (
    <>
      <View {...accessibilityProps} style={[styles.cardContainer, style]} testID={testID || 'user-card'}>
        <HoliUserAvatar
          imageSrc={avatar}
          label={fullName || t('user.profileView.anonymous')}
          initials={avatarLabel}
          defaultColor={avatarDefaultColor}
          size="extralarge"
        />
        {variant === 'normal' && (
          <>
            <HoliText style={styles.textStyle} bold>
              {fullName}
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
            {fullName || t('user.profileView.anonymous')}
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
