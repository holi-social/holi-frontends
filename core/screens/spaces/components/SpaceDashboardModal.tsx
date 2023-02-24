import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { colors, vars } from '@holi/ui/styles/globalVars'

/** Modal overlay button position:
 * autoheight = true causes that the
 * overlay button shifts out of the view.
 * To fix it, the HoliModalContentWrapper's height
 * should fit to the modal height.
 */
const MAX_MODAL_HEIGHT = 0.93
export type SpaceDashboardModalParams = {
  spaceId: string | undefined
}
const SpaceDashboardModal: React.VFC<SpaceDashboardModalParams> = ({ spaceId }: SpaceDashboardModalParams) => {
  const { t } = useTranslation()
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions()
  const [showModal, setShowModal] = useState(false)
  const { navigate } = useRouting()

  const closeModal = () => {
    setShowModal(false)
    navigate(`/spaces/${spaceId}/spaceCollaborators`)
  }

  let imageWidth = 271
  let imageHeight = 342
  const largerThanAnyCellphone =
    deviceWidth > parseInt(vars.largestMobileWidth, 10) && deviceHeight > parseInt(vars.largestMobileHeight, 10)
  if (largerThanAnyCellphone) {
    imageWidth = imageWidth * 1.2
    imageHeight = imageHeight * 1.2
  }

  return (
    <View style={styles.overlayContainer}>
      <HoliButton label={t('spaces.dashboard.openBtn')} onPress={() => setShowModal(true)} style={styles.overlayButton}>
        {t('spaces.dashboard.openBtn')}
      </HoliButton>
      <HoliModal
        label={t('spaces.dashboard.title')}
        autoHeight={true}
        relativeHeight={MAX_MODAL_HEIGHT}
        show={showModal}
        onDismiss={closeModal}
      >
        <HoliModalContentWrapper
          actionButtonText={t('global.gotIt')}
          onActionButtonPress={closeModal}
          style={{ maxHeight: `${MAX_MODAL_HEIGHT * 100}%` }}
        >
          <View style={styles.modalContent}>
            <HoliHeading level="2" size="small" style={{ color: colors.foreground20 }}>
              {t('spaces.dashboard.title')}
            </HoliHeading>
            <HoliHeading level="3" size="large" style={styles.heading}>
              {t('global.comingSoon')}
            </HoliHeading>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/space_dashboard.svg')}
              width={imageWidth}
              height={imageHeight}
              label={''}
              isSvg={true}
              resizeMode="stretch"
              style={styles.illustration}
            />
            <HoliText style={styles.text}>{t('spaces.dashboard.description')}</HoliText>
          </View>
        </HoliModalContentWrapper>
      </HoliModal>
    </View>
  )
}

export default SpaceDashboardModal

const styles = StyleSheet.create({
  overlayContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 42,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  overlayButton: {
    marginHorizontal: 'auto',
    maxWidth: vars.maxButtonWidth,
  },
  modalContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    marginTop: 8,
  },
  illustration: {
    marginTop: 32,
  },
  text: {
    maxWidth: vars.maxWidthForReadableText,
    marginVertical: 32,
    textAlign: 'center',
  },
})
