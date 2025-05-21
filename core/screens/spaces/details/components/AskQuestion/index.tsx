import { toMatrixIdentity, getOrCreatePrivateRoom } from '@holi/chat/src/store'
import { AskQuestionActionButton } from '@holi/core/screens/spaces/details/components/AskQuestion/AskQuestionActionButton'
import { useRepresentative } from '@holi/core/screens/spaces/hooks/useRepresentative'
import { StartChatButton } from '@holi/core/screens/spaces/tasks/components/TaskDetailsCTA/StartChatButton'
import { TrackingEvent } from '@holi/core/tracking'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

export type AskQuestionProps = {
  spaceIdOrName?: string
}

export const AskQuestion = ({ spaceIdOrName }: AskQuestionProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { representative } = useRepresentative(spaceIdOrName)

  const getOrCreateRoom = async () => {
    if (!representative) return
    const chatPartnerMatrixId = toMatrixIdentity(representative.identity)
    const { room_id } = await getOrCreatePrivateRoom([chatPartnerMatrixId])
    return room_id
  }

  if (!spaceIdOrName) return null

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => <AskQuestionActionButton testID={testID} onPress={onPress} />}
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

        <StartChatButton
          chatPartners={representative ? [representative] : []}
          label={t('spaces.connectCta')}
          trackingEvent={TrackingEvent.SpaceAskQuestion.askedQuestion}
          getRoomId={getOrCreateRoom}
        />
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
