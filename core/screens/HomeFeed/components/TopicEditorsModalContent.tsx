import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import TopicEditorCard from '@holi/core/screens/HomeFeed/components/TopicEditorCard'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type TopicEditorsModalContentProps = {
  users: User[]
  category: string
  onDismiss: () => void
  style?: StyleProp<ViewStyle>
}

const TopicEditorsModalContent: React.VFC<TopicEditorsModalContentProps> = ({
  users,
  category,
  onDismiss,
  style,
}: TopicEditorsModalContentProps) => {
  const styles = getStyles()
  const { t } = useTranslation()
  const isWeb = Platform.OS === 'web'
  const mixins = useStyleMixins()

  return (
    <View style={[styles.container, isWeb && mixins.container, style]}>
      <HoliHeading style={styles.title} size="large">
        {t('topics.contributors.modal.title')}
      </HoliHeading>
      <HoliCarousel
        style={styles.carouselContainer}
        slides={users.map((user) => ({
          children: <TopicEditorCard style={styles.topicEditorCard} user={user} category={category}></TopicEditorCard>,
        }))}
      />

      <View style={[styles.buttonContainer, isWeb && styles.buttonContainerWeb]}>
        <HoliButton label={t('topics.contributors.modal.close')} onPress={onDismiss}>
          {t('topics.contributors.modal.close')}
        </HoliButton>
      </View>
    </View>
  )
}

export default TopicEditorsModalContent

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
    topicEditorCard: {
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
      width: 400,
    },
  })
