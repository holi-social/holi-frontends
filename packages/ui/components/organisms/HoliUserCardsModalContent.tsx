import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliUserCardsModalContentProps = {
  users: User[]
  onDismiss: () => void
  category?: string // optional string for the text in the chip inside the HoliUserCard
  title?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliUserCardsModalContent: React.FC<HoliUserCardsModalContentProps> = ({
  users,
  onDismiss,
  category,
  title,
  style,
  testID,
}: HoliUserCardsModalContentProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

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
      <>
        <HoliCarousel
          marginHorizontal={Spacing.md}
          slides={uniqueUsers.map((user) => ({
            children: (
              <View style={styles.link}>
                <HoliLink
                  href={`/profile/${user.id}`}
                  label={t('user.visitProfile', { name: user.fullName })}
                  onPress={onDismiss}
                >
                  <HoliUserCard
                    user={user}
                    category={category}
                    disableFocusability
                    style={{ borderColor: theme.colors.black300 }}
                  />
                </HoliLink>
              </View>
            ),
          }))}
        />
        <HoliGap />
      </>
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
