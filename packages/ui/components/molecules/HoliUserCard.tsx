import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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
}

const HoliUserCard: React.FunctionComponent<HoliUserCardProps> = ({
  user,
  variant = 'normal',
  category,
  style,
}: HoliUserCardProps) => {
  const { t } = useTranslation()
  const styles = getStyles(variant)

  if (!user) {
    return <View style={[styles.container, style]} />
  }

  const { firstName, lastName, avatar, avatarLabel, avatarDefaultColor, aboutMe } = user

  const nameLabel = `${firstName || ''} ${lastName || ''}`.trim()
  return (
    <View style={[styles.container, style]}>
      <View style={styles.cardContainer} accessible testID="user-card">
        <HoliUserAvatar
          imageSrc={avatar}
          nameLabel={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
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
            <View style={styles.textStyleAboutMe}>
              <HoliText style={styles.textStyle}>{aboutMe}</HoliText>
            </View>
          </>
        )}
      </View>
      {variant === 'small' && (
        <View>
          <HoliText style={styles.textStyle} size="small">
            {nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
          </HoliText>
        </View>
      )}
    </View>
  )
}

export default HoliUserCard

const getStyles = (variant: HoliUserCardVariant) =>
  StyleSheet.create({
    container: {
      display: 'inline-block',
    },
    cardContainer: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: colors.softwhite,
      padding: variant === 'normal' ? 24 : 16,
      borderRadius: 16,
      ...Platform.select({
        web: {
          height: '100%',
        },
      }),
    },
    chip: {
      marginVertical: 8,
      alignSelf: 'center',
    },
    textStyle: {
      marginTop: variant === 'normal' ? 8 : 16,
      textAlign: 'center',
    },
    textStyleAboutMe: {
      justifyContent: 'center',
    },
  })
