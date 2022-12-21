import React from 'react'
import { View } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'

type GoodNewsTeaserComponentProps = {
  article: GoodNewsArticle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: () => any
}

// TODO HOLI-2669 this is a temporary placeholder component, replace with real one
const GoodNewsTeaserComponent: React.VFC<GoodNewsTeaserComponentProps> = (props: GoodNewsTeaserComponentProps) => {
  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
      }}
    >
      <GoodNewsArticleComponent article={props.article} />
      <HoliButton label={'Load More'} onPress={props.fetchMore} testID="btn-goodnews-list-load-more">
        {'Load more'}
      </HoliButton>
    </View>
  )
}

export default GoodNewsTeaserComponent
