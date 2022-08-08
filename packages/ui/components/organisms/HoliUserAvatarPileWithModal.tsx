import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { HoliTheme } from '@holi/ui/styles/theme'

interface HoliUserAvatarPileWithModalProps {
  users: User[]
  modalTitle: string
  usersToShow?: number
  avatarsTitle?: string
  category?: string
  inlineAvatarsTitle?: boolean
  avatarSize?: 'micro' | 'small'
}

const HoliUserAvatarPileWithModal: React.VFC<HoliUserAvatarPileWithModalProps> = ({
  users,
  modalTitle,
  usersToShow,
  avatarsTitle,
  category,
  avatarSize,
  inlineAvatarsTitle,
}) => {
  const [showModal, setShowModal] = useState(false)
  const styles = getStyles()

  return (
    <>
      <HoliButton
        label={modalTitle}
        transparent
        onPress={() => setShowModal(true)}
        testID="avatar-pile-open-modal-button"
      >
        {!inlineAvatarsTitle && (
          <HoliText size="small" style={styles.avatarsTopTitle} testID="avatars-top-title">
            {avatarsTitle}
          </HoliText>
        )}
        <HoliUserAvatarPile
          users={users}
          size={avatarSize}
          counter={inlineAvatarsTitle}
          usersToShow={usersToShow}
          collapse
        >
          {inlineAvatarsTitle && avatarsTitle}
        </HoliUserAvatarPile>
      </HoliButton>
      <HoliModal relativeHeight={0.85} show={showModal} onDismiss={() => setShowModal(false)}>
        <HoliUserCardsModalContent
          title={modalTitle}
          users={users}
          category={category}
          onDismiss={() => setShowModal(false)}
        />
      </HoliModal>
    </>
  )
}

const getStyles = () =>
  StyleSheet.create({
    avatarsTopTitle: {
      marginBottom: 8,
    },
  })

export default HoliUserAvatarPileWithModal
