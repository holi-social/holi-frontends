import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ResourceCategory = {
  id: string
  icon: HoliIconType
  translationKey: string
  path: string
  display: boolean
  inMaintenance: boolean
}

interface ResourceCategoryTileProps {
  rc: ResourceCategory
  onPress?: (resourceCategoryData: ResourceCategory) => void
  style?: StyleProp<ViewStyle>
  active?: boolean
}

const ResourceCategoryTile: React.FC<ResourceCategoryTileProps> = ({
  rc,
  onPress,
  style,
}: ResourceCategoryTileProps) => {
  const { t } = useTranslation()
  const name = t(rc.translationKey)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const onTilePress = useCallback(() => {
    onPress?.(rc)
  }, [onPress, rc])

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onTilePress}
      disabled={rc.inMaintenance}
      style={[styles.contentContainer, style]}
      testID={`resource-category-tile-${rc.id}`}
    >
      <View style={styles.categoryTile}>
        {!!rc.icon && (
          <HoliIcon
            icon={rc.icon}
            size={30}
            colorOverride={!rc.inMaintenance ? colors.foreground30 : colors.foreground10}
          />
        )}

        {rc.inMaintenance && (
          <View style={styles.inactiveContainer}>
            <HoliText size="extrasmall" color="white100">
              {t('allTools.drawer.maintenance.label')}
            </HoliText>
          </View>
        )}
      </View>

      <HoliText
        selectable={false}
        style={[styles.categoryName, !rc.inMaintenance ? { color: colors.foreground30 } : { marginTop: 4 }]}
        size={'extrasmall'}
      >
        {name}
      </HoliText>
    </HoliButton>
  )
}

export default ResourceCategoryTile

const tileWidth = 76

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    contentContainer: {
      width: tileWidth + 2, // container width should be wider than the tileWidth to avoid the title text breaking
      overflow: 'hidden',
      wordBreak: 'break-word',
      padding: 0,
    } as ViewStyle,
    categoryTile: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background10,
      borderColor: theme.colors.background30,
      borderRadius: 16,
      borderWidth: 1,
      width: tileWidth,
      height: tileWidth,
    },
    categoryName: {
      paddingTop: 4,
      alignSelf: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
    inactiveContainer: {
      position: 'absolute',
      bottom: -6,
      height: 16,
      paddingHorizontal: 4,
      borderRadius: 500,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.foreground10,
    },
  })
