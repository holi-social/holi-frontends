import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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
  const screenHeight = Dimensions.get('window').height
  const styles = getStyles(screenHeight)
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ScrollView>
        <HoliHeading level="1" style={styles.title} size="large" testID={`${testID}-heading`}>
          {title || t('user.cards.modal.title')}
        </HoliHeading>
        <HoliCarousel
          style={styles.carouselContainer}
          slides={users.map((user) => ({
            children: <HoliUserCard style={styles.userCard} user={user} category={category} />,
          }))}
        />
      </ScrollView>

      <HoliButton
        style={styles.closeButton}
        label={t('user.cards.modal.close')}
        onPress={onDismiss}
        testID={`${testID}-close-btn`}
      >
        {t('user.cards.modal.close')}
      </HoliButton>
    </View>
  )
}

export default HoliUserCardsModalContent

const getStyles = (screenHeight: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      width: '100%',
      maxHeight: screenHeight - 80,
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
    closeButton: {
      bottom: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
