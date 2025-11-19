import type { StoreObject } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import type React from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import FormWrapper from '@holi/core/components/FormWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import SpaceCollaboratorOnboardingSteps from '@holi/core/screens/spaces/details/components/SpaceCollaboratorOnboardingSteps'
import {
  type Space,
  UpdateConnectionAction,
  SpaceUserConnectionType,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

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
  const { track } = useTracking()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const [message, setMessage] = useState<string>('')
  const { visible: infoVisible, show: infoShow, hide: infoHide } = useModalState()
  const client = useApolloClient()

  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { displayError } = useErrorHandling()

  const [updateSpaceUserConnection] = useUpdateSpaceUserConnectionMutation({
    // refetchQueries does not work on unmounted components and leads to buggy behavior, consider explicit cache eviction as per https://github.com/apollographql/apollo-client/issues/5419#issuecomment-1242511457
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
    },
    onError(error) {
      if (!('__typename' in space)) {
        console.error('Object is missing __typename attribute:', space) // eslint-disable-line no-console
      }
      client.cache.evict({ id: client.cache.identify(space as unknown as StoreObject) })
      const context = {
        location: 'SpaceCollaboratorOnboarding.updateSpaceUserConnection',
        spaceId: space.id,
      }

      if (error.message.includes('Not requested to join community')) {
        displayError(error, 'Failed to request space membership as it was already handled', {
          displayMessage: t('spaces.join.error.already-revoked'),
          ...context,
        })
      } else {
        displayError(error, 'Failed to request space membership', {
          displayMessage: t('spaces.join.error'),
          ...context,
        })
      }
    },
  })

  const submitJoinRequest = async () => {
    if (!isLoggedIn) {
      return openSignupModal({
        description: t('spaces.join.loginRedirect.text', { spaceName: space.title }),
        trackTrigger: 'JOIN_SPACE',
      })
    }

    return updateSpaceUserConnection({
      variables: {
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.MembershipRequestor,
        message: message === '' ? undefined : message,
        spaceId: space.id,
      },
      onCompleted: () => track(TrackingEvent.Spaces.RequestToJoin.sent(space.id)),
    })
  }

  const insets = useSafeAreaInsets()
  const styles = useMemo(() => getStyles(insets.bottom, theme), [insets.bottom, theme])

  return (
    <>
      <HoliModal
        shown={visible}
        label={t('spaces.collaborate.onboarding.header')}
        heading={t('spaces.collaborate.onboarding.header')}
        onDismiss={hideOnboarding}
        autoHeight={false}
        relativeHeight={1}
        style={styles.modal}
      >
        <FormWrapper
          onSave={onboarding ? async () => hideOnboarding() : submitJoinRequest}
          buttonLabel={onboarding ? t('spaces.join.overlay.button') : t('spaces.collaborate.onboarding.request')}
          testID="space-join-request-modal"
          showBottomBar
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
                  aria-label={t('spaces.collaborate.onboarding.input')}
                  style={styles.input}
                  noOfVisibleLines={5}
                  showCharacterCount
                  inputLabel={t('spaces.collaborate.onboarding.input.label')}
                  maxNoOfVisibleLines={5}
                  maxNoOfCharacters={240}
                  isRequired={false}
                  value={message}
                  onChange={setMessage}
                />
                <HoliText size="extrasmall" style={styles.optional}>
                  {t('spaces.collaborate.onboarding.optional')}
                </HoliText>

                {space.onboarding?.steps && space.onboarding.steps.length > 0 && (
                  <HoliButton label={t('spaces.collaborate.onboarding.active')} onPress={infoShow} transparent>
                    <View style={styles.info}>
                      <HoliIcon icon={Information} />
                      <HoliText>{t('spaces.collaborate.onboarding.active')}</HoliText>
                    </View>
                  </HoliButton>
                )}
              </View>
            )
          }}
        />

        <HoliModal shown={infoVisible} label={t('spaces.collaborate.onboarding.header')} onDismiss={infoHide}>
          <SpaceCollaboratorOnboardingSteps
            steps={space?.onboarding?.steps || []}
            header={t('spaces.collaborate.onboarding.info.header')}
            style={[mixins.container, styles.infoModal]}
          />
        </HoliModal>
      </HoliModal>
    </>
  )
}

const getStyles = (bottomInsets: number, theme: HoliTheme) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background20,
      paddingBottom: 70,
      ...Platform.select({
        // TODO: Fix FormWrapper usage to avoid this
        ios: {
          paddingBottom: bottomInsets > 0 ? 90 : 0,
        },
        android: {
          paddingBottom: 85,
        },
      }),
    },
    text: {
      marginTop: 16,
      marginBottom: 40,
      color: theme.colors.foreground20,
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
      color: theme.colors.foreground20,
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
