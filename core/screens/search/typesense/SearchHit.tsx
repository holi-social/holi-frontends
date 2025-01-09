import { getInitials } from '@holi/core/helpers'
import { SearchHitLink } from '@holi/core/screens/search/typesense/SearchHitLink'
import { useUserLanguage } from '@holi/core/screens/search/typesense/hooks'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Avatar } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

export type SearchHitProps = {
  hit: SearchHitData
}

export const SearchHit = ({ hit }: SearchHitProps) => {
  const { t } = useTranslation()
  const language = useUserLanguage()
  const { styles } = useStyles(stylesheet)
  const useTitleEn = (language === 'en' && hit.title_en) || (language == 'de' && !hit.title_de)
  const title = (useTitleEn ? hit.title_en : hit.title_de) as string
  return (
    <SearchHitLink hit={hit} label={title}>
      <View style={styles.hitItemColumnsLayout}>
        <Avatar
          initials={getInitials(title)}
          label={title}
          size={'md'}
          shape={hit.type === 'profile' ? 'circle' : 'square'}
          role={'img'}
          imgSrc={hit.image_url}
        />
        <View style={styles.hitItemRightColumnLayout}>
          <View style={styles.hitItemTypeLocationLayout}>
            <Text size={'xs'} variant={'secondary'}>
              {t(`search.typesense.hit.type.${hit.type}`)}
            </Text>
            {hit.location && (
              <>
                <Text size={'xs'} variant={'secondary'}>
                  &middot;
                </Text>
                <Text size={'xs'} variant={'secondary'}>
                  {hit.location}
                </Text>
              </>
            )}
          </View>
          <Text size={'sm'}>{title}</Text>
        </View>
      </View>
    </SearchHitLink>
  )
}

// TODO restyle after introducing <Screen> component (HOLI-10827)
const stylesheet = createStyleSheet(() => ({
  hitItemColumnsLayout: { flexDirection: 'row', columnGap: dimensions.spacingSM },
  hitItemRightColumnLayout: { flexDirection: 'column', rowGap: dimensions.spacingXs },
  hitItemTypeLocationLayout: { flexDirection: 'row', columnGap: dimensions.spacingXs },
}))
