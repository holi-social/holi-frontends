import { getInitials } from '@holi/core/helpers'
import { SearchHitLink } from '@holi/core/screens/search/SearchHitLink'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import type { TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Avatar } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { Trackable, type TrackableBaseProps } from '@holi/core/components/Trackable'

export const HIT_HEIGHT = 65
export const HIT_HEIGHT_PROFILE = 48

export interface SearchHitProps extends TrackableBaseProps {
  hit: TypesenseDocument
}

const getTitle = (language: string, hit: TypesenseDocument): string => {
  if (hit.type === 'profile' && hit.user_full_name) {
    return hit.user_full_name
  }
  if (hit.title_en && (language === 'en' || !hit.title_de)) {
    return hit.title_en
  }
  return hit.title_de ?? ''
}

export const SearchHit = Trackable<SearchHitProps>(({ hit, onPress }: SearchHitProps) => {
  const { t } = useTranslation()
  const language = useUserLanguage()
  const { styles } = useStyles(stylesheet)
  const title = getTitle(language, hit)

  return (
    <SearchHitLink hit={hit} label={title} onPress={onPress}>
      <View style={styles.hitItem(hit.type)} testID={`search-hit-${hit.type}`}>
        <Avatar
          initials={getInitials(title)}
          label={title}
          size={'md'}
          shape={hit.type === 'profile' ? 'circle' : 'square'}
          source={hit.image_url}
        />
        <View style={styles.hitItemContent}>
          <View style={styles.hitItemTags}>
            <Text size={'xs'} color="support">
              {t(`search.typesense.hit.type.${hit.type}`)}
            </Text>
            {hit.location && (
              <>
                <Text size={'xs'} color="support">
                  &middot;
                </Text>
                <View style={styles.hitLocation}>
                  <Text size={'xs'} color="support" numberOfLines={1}>
                    {hit.location}
                  </Text>
                </View>
              </>
            )}
          </View>
          <Text size={'sm'} numberOfLines={hit.type === 'profile' ? 1 : 2}>
            {title}
          </Text>
        </View>
      </View>
    </SearchHitLink>
  )
})

const stylesheet = createStyleSheet(() => ({
  hitItem: (hitType: TypesenseDocumentType) => ({
    flexDirection: 'row',
    columnGap: dimensions.spacingSM,
    height: hitType === 'profile' ? HIT_HEIGHT_PROFILE : HIT_HEIGHT,
    overflow: 'hidden',
  }),
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
