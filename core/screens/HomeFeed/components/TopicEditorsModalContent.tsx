import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'

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
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
}

const TopicEditorsModalContent: React.FunctionComponent<TopicEditorsModalContentProps> = ({
  users,
  category,
  onDismiss,
  style,
}: TopicEditorsModalContentProps) => {
  const styles = getStyles()
  const { t } = useTranslation()
  const isWeb = Platform.OS === 'web'

  if (!users) {
    return <View style={[styles.container, style]}></View>
  }
  return (
    <View style={[styles.container, isWeb ? theme.mixins.container : {}, style]}>
      <HoliHeading style={styles.title} size="large">
        {t('topics.contributors.modal.title')}
      </HoliHeading>
      <HoliCarousel
        style={styles.carouselContainer}
        slides={users.map((user) => ({
          children: <TopicEditorCard style={styles.topicEditorCard} user={user} category={category}></TopicEditorCard>,
        }))}
      ></HoliCarousel>

      <View style={[styles.buttonContainer, isWeb ? styles.buttonContainerWeb : {}]}>
        <HoliButton label={t('topics.contributors.modal.close')} inline onPress={onDismiss}>
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
      marginTop: 24,
      marginHorizontal: 24,
    },
    buttonContainerWeb: {
      alignSelf: 'center',
      width: 400,
    },
  })
