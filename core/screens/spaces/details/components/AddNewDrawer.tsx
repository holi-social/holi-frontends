import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { RESOURCES_COMING_SOON, RESOURCE_CATEGORIES_LIST } from '@holi/core/constants/spaceConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import ResourceCategoryTile, {
  ResourceCategory,
} from '@holi/core/screens/spaces/details/components/ResourceCategoryTile'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Spaces } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
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
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, +vars.maxScreenWidth) / 2

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
        label={t('allTools.drawer.headline')}
        type="secondary"
        inline
        testID="space-resources-add-button"
        style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
        onPress={show}
      >
        <HoliText style={styles.buttonTitle}>{t('allTools.drawer.toolKit.button.label')}</HoliText>
        <HoliIcon icon={Spaces} size={20} />
      </HoliButton>

      {/* Add new modal (drawer) */}
      <HoliModal
        label={t('allTools.drawer.headline')}
        show={visible}
        onDismiss={hide}
        style={{ backgroundColor: colors.background20 }}
        testID="add-new-drawer-modal"
      >
        <View style={[styles.modalContent, mixins.container]}>
          <HoliHeading level="1">{t('allTools.drawer.headline')}</HoliHeading>
          <View style={styles.listContents}>
            {[...RESOURCE_CATEGORIES_LIST, ...RESOURCES_COMING_SOON].map((resource) => {
              return (
                <ResourceCategoryTile
                  resourceCategoryData={resource}
                  key={resource.id}
                  onPress={onCategoryButtonClick}
                />
              )
            })}
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
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    shadowColor: colors.foreground30,
    backgroundColor: colors.background10,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'visible',
    right: '50%',
  },
  buttonTitle: { marginRight: 6 },
  modalContent: {
    paddingHorizontal: 10,
  },
  listContents: {
    gap: 7,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 48,
  },
})
