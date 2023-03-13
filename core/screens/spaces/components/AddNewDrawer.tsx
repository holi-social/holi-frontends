import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleSheet, View } from 'react-native'

import { RESOURCES_COMING_SOON, RESOURCE_CATEGORIES_LIST } from '@holi/core/constants/spaceConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import ResourceCategoryTile, { ResourceCategory } from '@holi/core/screens/spaces/components/ResourceCategoryTile'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface AddNewDrawerProps {
  spaceIdOrName: string | undefined
}

const AddNewDrawer: React.FC<AddNewDrawerProps> = ({ spaceIdOrName }: AddNewDrawerProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { visible, show, hide } = useModalState()
  const { navigate } = useRouting()

  const onCategoryButtonClick = useCallback(
    ({ path }: ResourceCategory) => {
      if (path) {
        hide()
        navigate(`/spaces/${spaceIdOrName}${path}`)
      }
    },
    [hide, navigate, spaceIdOrName]
  )

  return (
    <>
      {/* Floating apps button */}
      <HoliButton
        label={t('addNew.drawer.headline')}
        testID="space-resources-add-button"
        style={styles.overlayButton}
        onPress={show}
      >
        <HoliIcon icon="add" size={20} />
      </HoliButton>

      {/* Add new modal (drawer) */}
      <HoliModal label={t('addNew.drawer.headline')} show={visible} onDismiss={hide} testID="add-new-drawer-modal">
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="1">{t('addNew.drawer.headline')}</HoliHeading>
          <View style={styles.categoriesContainer}>
            <FlatList
              data={RESOURCE_CATEGORIES_LIST}
              horizontal={true}
              renderItem={({ item, index }: { item: ResourceCategory; index: number }) => {
                return (
                  <ResourceCategoryTile
                    resourceCategoryData={item}
                    key={item.id}
                    onPress={onCategoryButtonClick}
                    style={index > 0 && { marginLeft: 15 }}
                  />
                )
              }}
            />
          </View>
          <HoliHeading level="3">{t('addNew.drawer.comingSoon.headline')}</HoliHeading>
          <View style={styles.categoriesContainer}>
            <FlatList
              data={RESOURCES_COMING_SOON}
              horizontal={true}
              renderItem={({ item, index }: { item: ResourceCategory; index: number }) => {
                return (
                  <ResourceCategoryTile
                    resourceCategoryData={item}
                    key={item.id}
                    onPress={onCategoryButtonClick}
                    style={index > 0 && { marginLeft: 15 }}
                  />
                )
              }}
            />
          </View>
        </View>
      </HoliModal>
    </>
  )
}

export default AddNewDrawer

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background20,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: vars.topBarHeight,
    right: 24,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    justifyContent: 'center',
  },
  modalContent: {
    paddingHorizontal: 10,
  },
  categoriesContainer: {
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
})
