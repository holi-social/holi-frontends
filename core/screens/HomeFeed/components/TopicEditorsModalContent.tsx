import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import TopicEditorCard from '@holi/core/screens/HomeFeed/components/TopicEditorCard'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import theme from '@holi/ui/styles/theme'

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

  return (
    <View style={[styles.container, style]}>
      <HoliHeading style={styles.title} size="large" testID="feed-topic-editors-headline">
        {t('topics.contributors.modal.title')}
      </HoliHeading>
      <HoliCarousel
        style={styles.carouselContainer}
        slides={users.map((user) => ({
          children: <TopicEditorCard style={styles.topicEditorCard} user={user} category={category}></TopicEditorCard>,
        }))}
      />

      <View style={styles.buttonContainer}>
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
      ...(Platform.OS === 'web' ? theme.mixins.container : {}),
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
      ...(Platform.OS === 'web'
        ? {
            alignSelf: 'center',
            width: 400,
          }
        : {}),
    },

    // buttonContainerWeb: {
    //   alignSelf: 'center',
    //   width: 400,
    // },
  })
