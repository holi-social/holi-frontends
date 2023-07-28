import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type ResourceCategory = {
  id: string
  icon: HoliIconType
  translationKey: string
  path?: string
}

interface ResourceCategoryTileProps {
  resourceCategoryData: ResourceCategory
  onPress?: (resourceCategoryData: ResourceCategory) => void
  style?: StyleProp<ViewStyle>
  active?: boolean
}

const ResourceCategoryTile: React.FC<ResourceCategoryTileProps> = ({
  resourceCategoryData,
  onPress,
  style,
  active = false,
}: ResourceCategoryTileProps) => {
  const { t } = useTranslation()
  const name = t(resourceCategoryData.translationKey)
  const isActive = !!resourceCategoryData.path

  const onTilePress = useCallback(() => {
    if (isActive) {
      onPress?.(resourceCategoryData)
    }
  }, [onPress, isActive, resourceCategoryData])

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onTilePress}
      disabled={!isActive}
      style={[styles.categoryTile, style]}
      testID={`resource-category-tile-${resourceCategoryData.id}`}
    >
      <View
        style={[
          styles.contentContainer,
          isActive && { backgroundColor: colors.background10, borderColor: colors.foreground10 },
        ]}
      >
        {!!resourceCategoryData.icon && (
          <HoliIcon
            icon={resourceCategoryData.icon}
            size={30}
            color={isActive ? colors.foreground30 : colors.foreground10}
          />
        )}
        {active && (
          <View style={styles.inactiveContainer}>
            <HoliText size="extrasmall" color="white100">
              {t('allTools.drawer.comingSoon.label')}
            </HoliText>
          </View>
        )}
      </View>

      <HoliText
        selectable={false}
        style={[styles.categoryName, isActive ? { color: colors.foreground30 } : { marginTop: 4 }]}
        size={'extrasmall'}
      >
        {name}
      </HoliText>
    </HoliButton>
  )
}

export default ResourceCategoryTile

const tileWidth = 76

const styles = StyleSheet.create({
  categoryTile: {
    width: tileWidth,
    overflow: 'hidden',
    wordBreak: 'break-word',
    padding: 0,
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderColor: colors.background30,
    borderWidth: 1,
    width: tileWidth,
    height: tileWidth,
  },
  categoryName: {
    paddingTop: 4,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },
  inactiveContainer: {
    position: 'absolute',
    bottom: -6,
    width: 37,
    height: 16,
    borderRadius: 500,
    backgroundColor: colors.foreground10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
