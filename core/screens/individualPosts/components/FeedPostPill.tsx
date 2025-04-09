import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Pencil } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type PostSetting = 'visibility' | 'topic' | 'category'

type SettingPresentation = {
  label: string
}

const placeholderSettingPresentationByPostSetting: Record<PostSetting, SettingPresentation> = {
  visibility: {
    label: 'individuals.post.category.label.visibility',
  },
  category: {
    label: 'individuals.post.category.label.category',
  },
  topic: {
    label: 'individuals.post.category.label.topic',
  },
}

interface Props {
  label?: string | null
  setting: PostSetting
  onPress?: (setting: PostSetting) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const BORDER_RADIUS = 48

const FeedPostPill: React.FC<PropsWithSkeleton<Props>> = ({
  loading,
  label,
  setting,
  onPress,
  style,
  testID = `create-posts-${setting}-pill`,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()
  const icon = label ? Pencil : Add

  const handlePress = useCallback(() => {
    if (onPress && setting) {
      onPress(setting)
    }
  }, [setting, onPress])

  if (loading) {
    const paddingVertical = styles.buttonContent.paddingVertical
    return (
      <HoliText
        loading={true}
        numberOfLines={1}
        style={StyleSheet.flatten([styles.buttonContent, styles.loadingContent, style])}
        skeletonOptions={{ borderRadius: BORDER_RADIUS, width: '100%', paddingVertical }}
        testID={testID + '-loading'}
      />
    )
  }

  return (
    <HoliButton
      label={label || t(placeholderSettingPresentationByPostSetting[setting].label)}
      style={style}
      contentStyle={[styles.buttonContent, styles[setting]]}
      transparent
      inline
      onPress={handlePress}
      testID={testID}
    >
      <HoliText bold numberOfLines={1}>
        {label || t(placeholderSettingPresentationByPostSetting[setting].label)}
      </HoliText>
      <HoliIcon icon={icon} size={16} colorOverride={theme.colors.foreground30} />
    </HoliButton>
  )
}
const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    generic: {
      backgroundColor: theme.colors.background10,
    },
    visibility: {
      backgroundColor: theme.colors.background10,
    },
    topic: {
      backgroundColor: theme.colors.brandColorC10,
    },
    category: {
      backgroundColor: theme.dark ? theme.colors.brandA300 : theme.colors.brandA100,
    },
    buttonContent: {
      borderColor: theme.colors.foreground30,
      borderRadius: BORDER_RADIUS,
      borderWidth: 1,
      paddingVertical: 4,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    loadingContent: {
      borderColor: 'transparent',
      paddingVertical: 0,
      paddingHorizontal: 0,
      width: 220,
    },
  })

export default FeedPostPill
