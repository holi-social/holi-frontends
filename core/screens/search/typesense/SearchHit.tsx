import { getInitials } from '@holi/core/helpers'
import { SearchHitLink } from '@holi/core/screens/search/typesense/SearchHitLink'
import { useUserLanguage } from '@holi/core/screens/search/typesense/hooks'
import type { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Avatar } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { Trackable, type TrackableBaseProps } from '@holi/core/components/Trackable'

export const HIT_HEIGHT = 48

export interface SearchHitProps extends TrackableBaseProps {
  hit: SearchHitData
}

export const SearchHit = Trackable<SearchHitProps>(({ hit, onPress }: SearchHitProps) => {
  const { t } = useTranslation()
  const language = useUserLanguage()
  const { styles } = useStyles(stylesheet)
  const useTitleEn = (language === 'en' && hit.title_en) || (language == 'de' && !hit.title_de)
  const interimTitle = (useTitleEn ? hit.title_en : hit.title_de) as string
  const finalTitle = (hit.type == 'profile' ? hit.user_full_name : interimTitle) as string
  return (
    <SearchHitLink hit={hit} label={finalTitle} onPress={onPress}>
      <View style={styles.hitItem}>
        <Avatar
          initials={getInitials(finalTitle)}
          label={finalTitle}
          size={'md'}
          shape={hit.type === 'profile' ? 'circle' : 'square'}
          role={'img'}
          imgSrc={hit.image_url}
        />
        <View style={styles.hitItemContent}>
          <View style={styles.hitItemTags}>
            <Text size={'xs'} variant={'secondary'}>
              {t(`search.typesense.hit.type.${hit.type}`)}
            </Text>
            {hit.location && (
              <>
                <Text size={'xs'} variant={'secondary'}>
                  &middot;
                </Text>
                <View style={styles.hitLocation}>
                  <Text size={'xs'} variant={'secondary'} numberOfLines={1}>
                    {hit.location}
                  </Text>
                </View>
              </>
            )}
          </View>
          <Text size={'sm'} numberOfLines={Platform.OS === 'android' ? 0 : 1}>
            {finalTitle}
          </Text>
        </View>
      </View>
    </SearchHitLink>
  )
})

const stylesheet = createStyleSheet(() => ({
  hitItem: {
    flexDirection: 'row',
    columnGap: dimensions.spacingSM,
    height: HIT_HEIGHT,
    overflow: 'hidden',
  },
  hitItemContent: {
    flex: 1,
    rowGap: dimensions.spacingXs,
  },
  hitItemTags: {
    flexDirection: 'row',
    columnGap: dimensions.spacingXs,
  },
  hitLocation: {
    flex: 1,
    ...Platform.select({
      android: {
        // Workaround for strange text behaviour on android
        minWidth: '200%',
      },
    }),
  },
}))
