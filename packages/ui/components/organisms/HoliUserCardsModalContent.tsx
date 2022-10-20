import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import { User } from '@holi/core/screens/userprofile/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export type HoliUserCardsModalContentProps = {
  users: User[]
  onDismiss: () => void
  onUserPress?: (user: User) => void
  category?: string // optional string for the text in the chip inside the HoliUserCard
  title?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliUserCardsModalContent: React.VFC<HoliUserCardsModalContentProps> = ({
  users,
  onDismiss,
  onUserPress,
  category,
  title,
  style,
  testID,
}: HoliUserCardsModalContentProps) => {
  const { t } = useTranslation()

  return (
    <HoliModalContentWrapper
      actionButtonText={t('user.cards.modal.close')}
      onActionButtonPress={onDismiss}
      headlineText={title ?? t('user.cards.modal.title')}
      testID={testID}
      style={[styles.modalContentWrapper, style]}
    >
      <HoliCarousel
        marginHorizontal={20}
        slides={users.map((user) => {
          const userCard = <HoliUserCard style={styles.userCard} user={user} category={category} disableFocusability />

          return {
            children: onUserPress ? (
              <HoliButton
                transparent
                label={t('user.visitProfile', { name: userFullName(user) })}
                onPress={() => onUserPress(user)}
              >
                {userCard}
              </HoliButton>
            ) : (
              userCard
            ),
          }
        })}
      />
    </HoliModalContentWrapper>
  )
}

export default HoliUserCardsModalContent

const styles = StyleSheet.create({
  modalContentWrapper: {
    ...Platform.select({
      web: {
        maxWidth: '100%',
      },
    }),
  },
  userCard: {
    flex: 1,
  },
})
