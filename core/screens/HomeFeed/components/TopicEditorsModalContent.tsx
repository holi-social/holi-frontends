import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TextStyle, View, ViewStyle } from 'react-native'

import TopicEditorCard from '@holi/core/screens/HomeFeed/components/TopicEditorCard'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type TopicEditorsModalContentProps = {
  users: User[]
}

const TopicEditorsModalContent: React.FunctionComponent<TopicEditorsModalContentProps> = ({
  users,
}: TopicEditorsModalContentProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()

  if (!users) {
    return <View style={styles.container as ViewStyle}></View>
  }
  return (
    <View style={styles.container as ViewStyle}>
      <HoliText style={styles.title as TextStyle}>This week's topic editors</HoliText>
      <View style={styles.carouselContainer}>
        <HoliCarousel
          slides={users.map((user) => ({
            children: <TopicEditorCard user={user}></TopicEditorCard>,
          }))}
        ></HoliCarousel>
      </View>
    </View>
  )
}

export default TopicEditorsModalContent

const getStyles = (theme: HoliTheme) => ({
  container: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28 * 1.2,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  carouselContainer: {
    marginTop: 24,
  },
})
