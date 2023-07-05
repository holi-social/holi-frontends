import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceCollaboratorOnboardingInfo from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingInfo'
import SpaceJoin from '@holi/core/screens/spaces/details/components/SpaceJoin'
import { Space } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceCollaboratorOnboardingProps {
  space: Space
  visible: boolean
  hide: () => void
}

const SpaceCollaboratorOnboarding: React.FC<SpaceCollaboratorOnboardingProps> = ({ space, visible, hide }) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { visible: infoVisible, show: infoShow, hide: infoHide } = useModalState()
  const [message, setMessage] = useState<string>('')

  return (
    <>
      <HoliModal
        show={visible}
        label={t('spaces.collaborate.onboarding.header')}
        heading={t('spaces.collaborate.onboarding.header')}
        onDismiss={hide}
        autoHeight={false}
        style={styles.modal}
      >
        <View style={mixins.container}>
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
          <View style={styles.button}>
            <SpaceJoin space={space} hideParent={hide} />
          </View>
        </View>
        <HoliModal show={infoVisible} label={t('spaces.collaborate.onboarding.header')} onDismiss={infoHide}>
          <SpaceCollaboratorOnboardingInfo />
        </HoliModal>
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.background30,
    minHeight: '100%',
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
  button: {
    position: 'absolute',
    display: 'none',
    bottom: 20,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    // alignContent: 'flex-end',
    // justifyContent: 'flex-end',
    // marginTop: 'auto',
    // alignSelf: 'center',
    justifySelf: 'center',
  },
})

export default SpaceCollaboratorOnboarding
