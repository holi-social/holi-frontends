import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export type HoliUserCardsModalContentProps = {
  users: User[]
  onDismiss: () => void
  category?: string // optional string for the text in the chip inside the HoliUserCard
  title?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliUserCardsModalContent: React.VFC<HoliUserCardsModalContentProps> = ({
  users,
  onDismiss,
  category,
  title,
  style,
  testID,
}: HoliUserCardsModalContentProps) => {
  const { t } = useTranslation()

  const uniqueUsers = users.reduce((newArr: User[], nextUser: User) => {
    return newArr.some((user) => user.id === nextUser.id) ? newArr : [...newArr, nextUser]
  }, [])

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
        slides={
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          uniqueUsers.map((user) => ({
            children: (
              <HoliLink
                href={`/profile/${user.id}`}
                label={t('user.visitProfile', { name: user.fullName })}
                onPress={onDismiss}
                textStyle={styles.link} // used for WEB
                style={styles.link}
              >
                <HoliUserCard style={styles.userCard} user={user} category={category} disableFocusability />
              </HoliLink>
            ),
          }))
        }
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
  link: {
    display: 'flex',
    flex: 1,
  },
  userCard: {
    flex: 1,
  },
})
