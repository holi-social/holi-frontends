import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceCollaboratorOnboardingInfo from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingInfo'
import { useSpaceJoinRequest } from '@holi/core/screens/spaces/details/components/useSpaceJoinRequest'
import { Space } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useKeyboard, useSoftKeyboard } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceCollaboratorOnboardingProps {
  space: Space
  visible: boolean
  hideOnboarding: () => void
}

const SpaceCollaboratorOnboarding: React.FC<SpaceCollaboratorOnboardingProps> = ({
  space,
  visible,
  hideOnboarding,
}) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { visible: infoVisible, show: infoShow, hide: infoHide } = useModalState()
  const { show: showJoinOverlay, hide: hideJoinOverlay, props: joinOverlayProps } = useModalState()
  const [message, setMessage] = useState<string>('')
  const { isKeyboardOpen } = useKeyboard()
  const { isSoftkeyboardOpen } = useSoftKeyboard()
  const keyboardPresent = isKeyboardOpen || isSoftkeyboardOpen

  const { submitJoinRequest } = useSpaceJoinRequest(space, showJoinOverlay, message)

  const completeOnboarding = useCallback(() => {
    hideJoinOverlay()
    hideOnboarding()
  }, [hideJoinOverlay, hideOnboarding])

  return (
    <>
      <HoliModal
        show={visible}
        label={t('spaces.collaborate.onboarding.header')}
        heading={t('spaces.collaborate.onboarding.header')}
        onDismiss={hideOnboarding}
        autoHeight={false}
        style={styles.modal}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.collaborate.onboarding.request')}
          onActionButtonPress={submitJoinRequest}
          style={[styles.modalContentWrapper, keyboardPresent && styles.modalWithKeyboard]}
          headlineStyle={styles.headline}
        >
          <View>
            <View style={styles.imageContainer}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_sparkle.svg')}
                isSvg
                width={72}
                height={72}
                label={t('spaces.collaborate.onboarding.image.sparkle.label')}
              />
            </View>
            <HoliText size="extralarge" bold={false}>
              {t('spaces.collaborate.onboarding.title')}
            </HoliText>
            <HoliText style={styles.desc}>{t('spaces.collaborate.onboarding.desc')}</HoliText>
            <HoliTextInput
              placeholder={t('spaces.collaborate.onboarding.input')}
              accessibilityLabel={t('spaces.collaborate.onboarding.input')}
              style={styles.input}
              noOfVisibleLines={5}
              showCharacterCount
              inputLabel={t('spaces.collaborate.onboarding.input.label')}
              maxNoOfVisibleLines={5}
              maxNoOfCharacters={1000}
              isRequired={false}
              value={message}
              onChange={setMessage}
            />
            <HoliText size="extrasmall" style={styles.optional}>
              {t('spaces.collaborate.onboarding.optional')}
            </HoliText>

            <HoliButton label={t('spaces.collaborate.onboarding.active')} onPress={infoShow} transparent>
              <View style={styles.info}>
                <HoliIcon icon="information" />
                <HoliText>{t('spaces.collaborate.onboarding.active')}</HoliText>
              </View>
            </HoliButton>
          </View>
        </HoliModalContentWrapper>

        <HoliModal show={infoVisible} label={t('spaces.collaborate.onboarding.header')} onDismiss={infoHide}>
          <View style={[mixins.container, styles.infoModal]}>
            <SpaceCollaboratorOnboardingInfo />
          </View>
        </HoliModal>
      </HoliModal>

      <HoliModal
        heading={t('spaces.collaborate.onboarding.header')}
        label={'space.join.overlay'}
        {...joinOverlayProps}
        testID="space-join-overlay"
        autoHeight={false}
        relativeHeight={1}
        style={styles.modalHeader}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.join.overlay.button')}
          onActionButtonPress={completeOnboarding}
          style={styles.modalContentWrapper}
          headlineStyle={styles.headline}
        >
          <View style={styles.imageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_mail.svg')}
              isSvg
              width={72}
              height={72}
              label={t('spaces.collaborate.onboarding.image.mail.label')}
            />
          </View>
          <HoliText size="extralarge">{t('spaces.join.overlay.title')}</HoliText>
          <HoliText style={styles.text}>{t('spaces.join.overlay.text')}</HoliText>
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.background30,
    minHeight: '100%',
  },
  modalWithKeyboard: {
    bottom: 150,
  },
  modalHeader: {
    backgroundColor: colors.background30,
  },
  modalContentWrapper: {
    paddingHorizontal: 24,
    backgroundColor: colors.background30,
    paddingBottom: 24,
  },
  headline: {
    textAlign: 'left',
    marginHorizontal: 0,
  },
  text: {
    marginTop: 16,
    marginBottom: 40,
    color: colors.foreground20,
  },
  imageContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  desc: {
    marginVertical: 16,
  },
  input: {
    marginVertical: 16,
  },
  optional: {
    marginTop: -32,
    color: colors.foreground20,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 32,
  },
  infoModal: {
    marginBottom: 20,
  },
})

export default SpaceCollaboratorOnboarding
