import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

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

const HoliUserCard: React.FC<HoliUserCardProps> = ({
  user,
  variant = 'normal',
  testID,
  category,
  style,
  disableFocusability,
  label,
}: HoliUserCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(variant, theme), [theme, variant])

  const accessibilityProps: AccessibilityPropsWeb = {
    accessible: !disableFocusability,
    'aria-label': label,
  }

  if (!user) {
    return <View style={[styles.cardContainer, style]} />
  }

  const { fullName, avatar, avatarBlurhash, avatarLabel, aboutMe } = user

  return (
    <>
      <View {...accessibilityProps} style={[styles.cardContainer, style]} testID={testID || 'user-card'}>
        <Avatar
          source={avatar}
          imgPlaceholder={avatarBlurhash}
          label={fullName || t('user.profileView.anonymous')}
          initials={avatarLabel}
          size="xl"
        />
        {variant === 'normal' && (
          <>
            <HoliText style={styles.textStyle} bold>
              {fullName}
            </HoliText>
            {!!category && (
              <View style={styles.chip}>
                <ChipLabel color="blue">{category}</ChipLabel>
              </View>
            )}
            <View style={styles.aboutMeContainer}>
              <HoliText style={styles.textStyleAboutMe}>{aboutMe}</HoliText>
            </View>
          </>
        )}
        {variant === 'small' && (
          <View style={styles.textContainer}>
            <HoliText style={styles.textStyleSmall} size="small">
              {fullName || t('user.profileView.anonymous')}
            </HoliText>
          </View>
        )}
      </View>
    </>
  )
}

export default HoliUserCard

const getStyles = (variant: HoliUserCardVariant, theme: HoliTheme) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 16,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.colors.background10,
      padding: variant === 'normal' ? 24 : 16,
      height: 'auto',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.gray200,
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
