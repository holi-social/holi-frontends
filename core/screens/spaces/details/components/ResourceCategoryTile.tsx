import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { FeatureToggleName, FeatureToggleState, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { FeatureToggleStatus } from '@holi/core/screens/homeFeed/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type ResourceCategory = {
  id: string
  icon: HoliIconType
  translationKey: string
  featureToggleName?: FeatureToggleName
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
}: ResourceCategoryTileProps) => {
  const { t } = useTranslation()
  const name = t(resourceCategoryData.translationKey)
  const isActive = !!resourceCategoryData.path
  const ftState: FeatureToggleState | undefined = useFeatureToggle(resourceCategoryData.featureToggleName)
  const ftMaintenance = ftState.status === FeatureToggleStatus.MAINTENANCE

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
      disabled={!isActive || ftMaintenance}
      style={[styles.contentContainer, style]}
      testID={`resource-category-tile-${resourceCategoryData.id}`}
    >
      <View style={styles.categoryTile}>
        {!!resourceCategoryData.icon && (
          <HoliIcon
            icon={resourceCategoryData.icon}
            size={30}
            color={isActive && !ftMaintenance ? colors.foreground30 : colors.foreground10}
          />
        )}

        {(!isActive || ftMaintenance) && (
          <View style={styles.inactiveContainer}>
            <HoliText size="extrasmall" color="white100">
              {ftMaintenance ? t('allTools.drawer.maintenance.label') : t('allTools.drawer.comingSoon.label')}
            </HoliText>
          </View>
        )}
      </View>

      <HoliText
        selectable={false}
        style={[styles.categoryName, isActive && !ftMaintenance ? { color: colors.foreground30 } : { marginTop: 4 }]}
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
  contentContainer: {
    width: tileWidth + 2, // container width should be wider than the tileWidth to avoid the title text breaking
    overflow: 'hidden',
    wordBreak: 'break-word',
    padding: 0,
  },
  categoryTile: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background10,
    borderColor: colors.background30,
    borderRadius: 16,
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
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.foreground10,
  },
})
