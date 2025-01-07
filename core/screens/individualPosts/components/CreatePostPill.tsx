import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Pencil } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type FilterType = 'visibility' | 'topic' | 'category'

type FilterTypeInfo = {
  text: string
}

const filterTypes: Record<FilterType, FilterTypeInfo> = {
  visibility: {
    text: 'individuals.post.category.label.visibility',
  },
  category: {
    text: 'individuals.post.category.label.category',
  },
  topic: {
    text: 'individuals.post.category.label.topic',
  },
}
interface Props {
  label?: string | null
  filterType: FilterType
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const BORDER_RADIUS = 48

const CreatePostPill: React.FC<PropsWithSkeleton<Props>> = ({
  loading,
  label,
  filterType,
  onPress,
  style,
  testID = 'spaces-filter-pill',
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { t } = useTranslation()
  const icon = label ? Pencil : Add

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
      label={label || t(filterTypes[filterType].text)}
      style={style}
      contentStyle={[styles.buttonContent, styles[filterType]]}
      transparent
      inline
      onPress={onPress}
      testID={testID}
    >
      <HoliText bold numberOfLines={1}>
        {label || t(filterTypes[filterType].text)}
      </HoliText>
      <HoliIcon icon={icon} size={16} color={theme.colors.foreground30} />
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
      backgroundColor: theme.colors.brandA100,
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

export default CreatePostPill
