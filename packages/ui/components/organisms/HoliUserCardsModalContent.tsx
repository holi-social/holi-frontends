import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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
  const styles = getStyles()
  const { t } = useTranslation()
  const isWeb = Platform.OS === 'web'

  return (
    <View style={[styles.container, style]}>
      <HoliHeading style={[styles.title]} size="large">
        {title || t('user.cards.modal.title')}
      </HoliHeading>
      <HoliCarousel
        style={styles.carouselContainer}
        slides={users.map((user) => ({
          children: <HoliUserCard style={styles.UserCard} user={user} category={category}></HoliUserCard>,
        }))}
      />

      <View style={[styles.buttonContainer, isWeb && styles.buttonContainerWeb]}>
        <HoliButton label={t('user.cards.modal.close')} onPress={onDismiss} testID="user-cards-modal-content-close">
          {t('user.cards.modal.close')}
        </HoliButton>
      </View>
    </View>
  )
}

export default HoliUserCardsModalContent

const getStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      height: '100%',
    },
    title: {
      paddingHorizontal: 24,
      textAlign: 'center',
    },
    carouselContainer: {
      marginTop: 24,
      display: 'flex',
    },
    UserCard: {
      width: '100%',
    },
    buttonContainer: {
      paddingHorizontal: 24,
      bottom: 70,
      position: 'absolute',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainerWeb: {
      alignSelf: 'center',
      maxWidth: 450,
    },
  })
