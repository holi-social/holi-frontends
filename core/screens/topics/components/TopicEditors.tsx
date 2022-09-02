import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

type TopicEditorsProps = {
  topicId: string
}

const TopicEditors: React.FunctionComponent<TopicEditorsProps> = ({ topicId }) => {
  const { t } = useTranslation()

  return (
    <View style={{ padding: 10 }}>
      <HoliHeading level="1" size="super" testID="topic-editors-headline">
        {t('topics.topic.editors.title', { topicId })}
      </HoliHeading>
    </View>
  )
}

export default TopicEditors
