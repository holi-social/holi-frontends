import React from 'react'
import { View } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'

type GoodNewsTeaserComponentProps = {
  article: GoodNewsArticle
  fetchMore: () => void
  accessible?: boolean
}

// TODO HOLI-2669 this is a temporary placeholder component, replace with real one
const GoodNewsTeaserComponent: React.VFC<GoodNewsTeaserComponentProps> = ({
  article,
  fetchMore,
  accessible = true,
}: GoodNewsTeaserComponentProps) => {
  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
      }}
      accessibilityElementsHidden={!accessible}
      importantForAccessibility={accessible ? 'yes' : 'no-hide-descendants'}
    >
      <GoodNewsArticleComponent article={article} />
      <HoliButton label={'Load More'} onPress={fetchMore} testID="btn-goodnews-list-load-more">
        {'Load more'}
      </HoliButton>
    </View>
  )
}

export default GoodNewsTeaserComponent
