import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import client from '@holi/api/graphql/client'
import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { Space, SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

interface SpaceCollaboratorOnboardingProps {
  space: Space
  visible: boolean
  hideOnboarding: () => void
  onboarding: boolean
}

const SpaceCollaboratorOnboarding: React.FC<SpaceCollaboratorOnboardingProps> = ({
  space,
  visible,
  hideOnboarding,
  onboarding = false,
}) => {
  const { t } = useTranslation()
  const [message, setMessage] = useState<string>('')

  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
      update: (cache) => {
        cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
      },
      onError(error) {
        client.cache.evict({ id: client.cache.identify(space) })

        if (error.message.includes('Not requested to join community')) {
          displayError(error, t('spaces.join.error.already-revoked'))
        } else {
          displayError(error, t('spaces.join.error'))
        }
      },
    }
  )

  const submitJoinRequest = () => {
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
      })
    }
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
        message: message === '' ? null : message,
        spaceId: space.id,
      },
    })
  }

  const insets = useSafeAreaInsets()

  const styles = createStyles(insets.bottom)

  return (
    <>
      <HoliModal
        show={visible}
        label={t('spaces.collaborate.onboarding.header')}
        heading={t('spaces.collaborate.onboarding.header')}
        onDismiss={hideOnboarding}
        autoHeight={false}
        relativeHeight={1}
        style={styles.modal}
      >
        <FormWrapper
          onSave={onboarding ? hideOnboarding : submitJoinRequest}
          saveButtonDisabled={loading}
          loading={loading}
          buttonLabel={onboarding ? t('spaces.join.overlay.button') : t('spaces.collaborate.onboarding.request')}
          testID="space-join-request-modal"
          keyboardShouldPersistTaps="never"
          isModal={false}
          renderProp={() => {
            if (onboarding) {
              return (
                <>
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
                </>
              )
            }
            return (
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

                {/* <HoliButton label={t('spaces.collaborate.onboarding.active')} onPress={infoShow} transparent>
              <View style={styles.info}>
                <HoliIcon icon="information" />
                <HoliText>{t('spaces.collaborate.onboarding.active')}</HoliText>
              </View>
            </HoliButton> */}
              </View>
            )
          }}
        />

        {/* <HoliModal show={infoVisible} label={t('spaces.collaborate.onboarding.header')} onDismiss={infoHide}>
          <View style={[mixins.container, styles.infoModal]}>
            <SpaceCollaboratorOnboardingInfo />
          </View>
        </HoliModal> */}
      </HoliModal>
    </>
  )
}

const createStyles = (bottomInsets: number) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.background20,
      ...Platform.select({
        // TODO: Fix FormWrapper usage to avoid this
        ios: {
          paddingBottom: bottomInsets > 0 ? 90 : 0,
        },
        web: {
          paddingBottom: 70,
        },
      }),
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
    // info: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   gap: 4,
    //   marginTop: 32,
    // },
    // infoModal: {
    //   marginBottom: 20,
    // },
  })

export default SpaceCollaboratorOnboarding
