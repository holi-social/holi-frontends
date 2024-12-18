import { getOrCreateRoom } from '@holi/chat/src/store'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useRepresentative } from '@holi/core/screens/spaces/hooks/useRepresentative'
import { QuestionAnswerLine } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useActionDrawerContext } from '@holi/ui/components/organisms/HoliActionDrawer/Drawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

const StartChatDrawerActionButton = ({ spaceIdOrName }: AskQuestionProps) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { hideDrawer } = useActionDrawerContext()
  const { openSignupModal } = useSignupModal()
  const { openToast } = useToast()
  const { navigate } = useRouting()
  const { representativeIdentity } = useRepresentative(spaceIdOrName)
  const [isLoading, setIsLoading] = useState(false)

  const safelyOpenSignupModal = () => {
    /* prevent having two modals open as startChat shows another one for guest, which breaks on ios */
    hideDrawer()

    openSignupModal({
      description: t('chat.start.loginRedirect.text'),
      trackTrigger: 'START_CHAT',
    })
  }

  async function openChatRoom(chatPartnerIdentity: string) {
    try {
      const chatPartnerMatrixId = '@' + chatPartnerIdentity + ':' + chatServerName
      const { room_id } = await getOrCreateRoom([chatPartnerMatrixId])

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
      } else {
        navigate('/chat/rooms/' + room_id)
        hideDrawer()
      }
    } catch (e) {
      logError(e, 'Failed to start ask-question-chat with chat partner ' + chatPartnerIdentity, {
        location: 'StartChatDrawerActionButton.openChatRoom',
      })
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const start = async () => {
    setIsLoading(true)

    if (!isLoggedIn) {
      safelyOpenSignupModal()
      setIsLoading(false)
      return
    }

    if (!representativeIdentity) {
      logError(
        new HoliError('Can not create a chat without a space representatives identity'),
        'Failed to start chat',
        {
          location: 'StartChatDrawerActionButton.start',
        }
      )
      setIsLoading(false)
      return
    }

    try {
      await openChatRoom(representativeIdentity)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      onPress={start}
      variant="primary"
      size="lg"
      label={t('spaces.connectCta')}
    />
  )
}

type AskQuestionProps = {
  spaceIdOrName?: string
}

const AskQuestionButton = (props: {
  testID: string | undefined
  onPress: () => void
}) => {
  const { styles } = useStyles(askQuestionButtonStyles)
  const { t } = useTranslation()
  const label = t('spaces.askInfo')
  return (
    <View
      style={[
        styles.ctaWrapper,
        Platform.OS === 'web' && {
          position: 'fixed',
        },
      ]}
      testID={props.testID}
    >
      <Button onPress={props.onPress} variant="primary" icon={QuestionAnswerLine} size="lg" label={label} />
    </View>
  )
}

const askQuestionButtonStyles = createStyleSheet(() => ({
  ctaWrapper: {
    padding: Spacing.xxs,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: Number(dimensions.maxScreenWidth),
    position: 'absolute',
    marginHorizontal: 'auto',
  },
}))

export const AskQuestion = ({ spaceIdOrName }: AskQuestionProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  if (!spaceIdOrName) return null

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => <AskQuestionButton testID={testID} onPress={onPress} />}
      label={t('global.options')}
      testID="ask-space-question"
    >
      <View style={styles.ctaDrawerContentWrapper}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/spaces/chat.svg')}
          isSvg
          label="chat"
          width={40}
          height={36}
          resizeMode="contain"
        />

        <View style={styles.ctaDrawerContent}>
          <Text size="3xl">{t('spaces.connectTitle')}</Text>
          <Text size="md">{t('spaces.connectDescription')}</Text>
        </View>

        <StartChatDrawerActionButton spaceIdOrName={spaceIdOrName} />
      </View>
    </HoliActionDrawer.Drawer>
  )
}

const stylesheet = createStyleSheet(() => ({
  ctaDrawerContent: {
    flexDirection: 'column',
    gap: 8,
  },
  ctaDrawerContentWrapper: {
    flexDirection: 'column',
    gap: 16,
  },
}))
