import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliNavigationLink from '@holi/ui/components/atoms/HoliNavigationLink'
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
        slides={uniqueUsers.map((user) => ({
          children: (
            <View style={styles.link}>
              <HoliNavigationLink
                href={`/profile/${user.id}`}
                label={t('user.visitProfile', { name: user.fullName })}
                onPress={onDismiss}
              >
                <HoliUserCard user={user} category={category} disableFocusability />
              </HoliNavigationLink>
            </View>
          ),
        }))}
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
      native: {
        flexShrink: 1,
        height: '100%',
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
