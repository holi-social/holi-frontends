import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export type HoliUserCardsModalContentProps = {
  users: User[]
  onDismiss: () => void
  category?: string // optional string for the text in the chip inside the HoliUserCard
  title?: string
}

const HoliUserCardsModalContent: React.VFC<HoliUserCardsModalContentProps> = ({
  users,
  onDismiss,
  category,
  title,
}: HoliUserCardsModalContentProps) => {
  const { t } = useTranslation()

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.cards.modal.close')}
      onActionButtonPress={onDismiss}
      headlineText={title || t('user.cards.modal.title')}
      actionButtonTestID="user-cards-modal-content-close"
    >
      <HoliCarousel
        style={styles.carouselContainer}
        slides={users.map((user) => ({
          children: <HoliUserCard style={styles.userCard} user={user} category={category} disableFocusability />,
        }))}
      />
    </HoliModalContentWrapper>
  )
}

export default HoliUserCardsModalContent

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 24,
    paddingBottom: 80,
  },
  userCardContainer: {
    width: '100%',
  },
  userCard: { flex: 1 },
})
