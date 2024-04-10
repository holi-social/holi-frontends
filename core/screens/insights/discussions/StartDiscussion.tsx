import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import ResponsesContainer from '@holi/core/screens/insights/discussions/ResponsesContainer'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import Spacing from '@holi/ui/foundations/Spacing'

export type StartDiscussionProps = {
  discussionId: string
  insightId: string
}

const StartDiscussion = ({ insightId, discussionId }: StartDiscussionProps) => {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { openLoginModal } = useLoginModal()

  return (
    <Pressable
      onPress={() =>
        isLoggedIn
          ? navigate(`/insights/${insightId}/discussions/${discussionId}/comment`)
          : openLoginModal({
              description: t('comments.loginRedirect.text'),
            })
      }
    >
      <ResponsesContainer>
        <View style={styles.container}>
          {isLoggedIn && user && (
            <HoliAvatar
              imageSrc={user.avatar}
              imageBlurhash={user.avatarBlurhash}
              label={user.fullName || t('user.profileView.anonymous')}
              initials={user.avatarLabel}
              defaultColor={user.avatarDefaultColor}
              size="micro"
            />
          )}
          <HoliText color="gray300" bold size="small">
            {t('insights.discussions.start')}
          </HoliText>
        </View>
      </ResponsesContainer>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing['3xs'],
    alignItems: 'center',
  },
})

export default StartDiscussion
