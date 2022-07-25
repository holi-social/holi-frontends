import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Platform, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { styleVars } from '@holi/ui/styles/globalVars'

// TODO: adjust this dummy interface to real props
interface TopicPreviewBoxProps {
  id: string
  title: string
  author: string
  image: {
    src: string
  }
  contributors: {
    avatars: { uri: string; label: string }[]
    count: number
  }
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  category: string
}

const TopicPreviewBox: React.VFC<TopicPreviewBoxProps> = ({
  id,
  title,
  image,
  author,
  contributors,
  category,
  ...props
}) => {
  const { navigate } = useRouting()
  const styles = getStyles()
  const { t } = useTranslation()

  return (
    <View {...props}>
      <HoliButton label={title} transparent onPress={() => navigate(`/topics/${id}`)}>
        <Image source={{ uri: image.src }} style={styles.mainImage} />
      </HoliButton>

      <HoliButton label={title} transparent style={styles.title} onPress={() => navigate(`/topics/${id}`)}>
        {title}
      </HoliButton>

      <HoliText style={[styles.author, styles.textGrey]}>
        by {author} in{' '}
        <View>
          {/* Negative marginBottom is used to solve Pressable bug inside an inline Text component */}
          <HoliButton transparent label={category} inline style={[styles.textGrey]}>
            <HoliText bold style={[styles.textGrey, styles.categoryLink]}>
              #{category}
            </HoliText>
          </HoliButton>
        </View>
      </HoliText>

      {contributors.avatars && (
        <HoliButton label={' '} transparent onPress={() => navigate(`/topics/${id}`)}>
          <View style={styles.contributorsContainer}>
            {contributors.avatars.map(({ uri, label }, idx) => (
              <Image
                key={uri}
                source={{ uri }}
                style={[styles.avatar, { marginLeft: idx ? -10 : 0, zIndex: idx * -1 }]}
                accessibilityLabel={label}
              />
            ))}
            <HoliText size="small" style={[styles.contributorsCounter, styles.textGrey]}>
              {contributors.count} {t('homeFeed.discussing')}
            </HoliText>
          </View>
        </HoliButton>
      )}
    </View>
  )
}

export default TopicPreviewBox

const getStyles = () =>
  StyleSheet.create({
    mainImage: {
      aspectRatio: 344 / 218,
      borderRadius: 18,
      marginBottom: 16,
      width: '100%',
    },
    title: {
      marginBottom: 16,
    },
    author: {
      marginBottom: 8,
    },
    avatar: {
      borderColor: styleVars.colors.white,
      borderRadius: 24,
      borderWidth: 2,
      height: 24,
      width: 24,
    },
    contributorsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contributorsCounter: {
      marginLeft: 8,
    },
    categoryLink: {
      ...Platform.select({
        ios: {
          marginBottom: -3,
        },
        android: {
          marginBottom: -4,
        },
      }),
    },
    textGrey: {
      color: styleVars.colors.grey,
    },
  })
