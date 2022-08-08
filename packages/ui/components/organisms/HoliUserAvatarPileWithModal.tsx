import React, { useState } from 'react'

import { User } from '@holi/core/screens/userprofile/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'

interface HoliUserAvatarPileWithModalProps {
  users: User[]
  title: string
  category?: string
}

const HoliUserAvatarPileWithModal: React.VFC<HoliUserAvatarPileWithModalProps> = ({ users, title, category }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <HoliButton label={title} transparent onPress={() => setShowModal(true)} testID="avatar-pile-open-modal-button">
        <HoliUserAvatarPile users={users} counter collapse />
      </HoliButton>
      <HoliModal relativeHeight={0.85} show={showModal} onDismiss={() => setShowModal(false)}>
        <HoliUserCardsModalContent
          title={title}
          users={users}
          category={category}
          onDismiss={() => setShowModal(false)}
        />
      </HoliModal>
    </>
  )
}

export default HoliUserAvatarPileWithModal
