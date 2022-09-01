import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export type HoliUserCardsModalContentProps = {
  users: User[]
  onDismiss: () => void
  category?: string // optional string for the text in the chip inside the HoliUserCard
  title?: string
  style?: StyleProp<ViewStyle>
}

const HoliUserCardsModalContent: React.VFC<HoliUserCardsModalContentProps> = ({
  users,
  onDismiss,
  category,
  title,
  style,
}: HoliUserCardsModalContentProps) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]}>
      <ScrollView>
        <HoliHeading level="1" style={styles.title} size="large">
          {title || t('user.cards.modal.title')}
        </HoliHeading>

        <HoliCarousel
          style={styles.carouselContainer}
          slides={users.map((user) => ({
            children: <HoliUserCard style={styles.userCard} user={user} category={category} />,
          }))}
        />
      </ScrollView>

      <HoliButton label={t('user.cards.modal.close')} onPress={onDismiss} testID="user-cards-modal-content-close">
        {t('user.cards.modal.close')}
      </HoliButton>
    </View>
  )
}

export default HoliUserCardsModalContent

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    maxHeight: '100%',
  },

  title: {
    textAlign: 'center',
  },
  carouselContainer: {
    marginTop: 24,
    paddingBottom: 80,
  },
  userCard: {
    width: '100%',
  },
})
