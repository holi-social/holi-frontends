import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { createParam } from 'solito'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TopicEditors } from '@holi/core/topics/TopicEditors'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliModal from '@holi/ui/components/HoliModal'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

import { fakeTopics } from './fakeTopics'

const { useParam } = createParam<TopicScreenParams>()

export type TopicScreenParams = {
  topicId: string
}

export const TopicsScreen: React.VFC = () => {
  const [showModal, setShowModal] = useState(false)
  const [topicId = ''] = useParam('topicId')
  const { navigate } = useRouting()
  const topic = fakeTopics.get(topicId)
  if (!topic) return <HoliText>Topic {topicId} not found</HoliText>

  const { setNavigationHeader } = useNavigationHeader()
  const title = `Topic ${topicId}`
  setNavigationHeader({
    title: title,
    titleElement: () => (
      <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
        {title}
      </HoliText>
    ),
  })

  return (
    <View style={styles.topicView}>
      <HoliText type={HoliTextType.super} styles={{ alignSelf: 'center' }}>
        Topic topicId={topicId}
      </HoliText>

      <HoliButton label="Topic Editors" inline onPress={() => setShowModal(true)}>
        Topic Editors
      </HoliButton>

      <HoliText type={HoliTextType.heading1} styles={{ paddingBottom: 10 }}>
        {topic.title}
      </HoliText>
      <HoliText>{topic.text}</HoliText>
      <HoliText type={HoliTextType.heading3}>Posts</HoliText>
      {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
        <HoliButton
          key={postId}
          label={topic.posts[postId].text}
          inline
          transparent
          style={styles.post}
          onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}
        >
          <HoliText>{topic.posts[postId].text}</HoliText>
        </HoliButton>
      ))}
      <HoliModal
        show={showModal}
        onDismiss={() => {
          setShowModal(false)
        }}
      >
        <TopicEditors topicId={topicId || ''}></TopicEditors>
      </HoliModal>
    </View>
  )
}

const styles = StyleSheet.create({
  topicView: {
    padding: 10,
    flex: 1,
  },
  text: {
    paddingBottom: 10,
  },
  post: {
    borderWidth: 1,
    borderColor: 'pink',
  },
})
