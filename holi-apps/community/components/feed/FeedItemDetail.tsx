import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import theme from '@holi/shared/styles/theme'
import GraphQLError from '@holi/shared/components/GraphQLError'

import { PostByIdQueryResult, POST_BY_ID } from './queries'
import FeedImage from './FeedImage'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 5,
  },
  text: {},
  more: {
    alignSelf: 'flex-end',
  },
  user: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  views: {
    color: theme.colors.text,
  },
  footer: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export interface FeedItemDetailProps {
  postId: string
}

const FeedItemDetail: React.VoidFunctionComponent<FeedItemDetailProps> = (props) => {
  const { loading, error, data } = useQuery<PostByIdQueryResult>(POST_BY_ID, {
    variables: {
      id: props.postId,
    },
  })

  if (error) {
    console.error('Error fetching feed', error)
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (data) {
    const post = data.Post

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{post.title}</Text>
        {post.image && <FeedImage image={post.image} />}
        <Text style={styles.text}>{post.text}</Text>
        <View style={styles.footer}>
          <Text style={styles.user}>{post.User.name}</Text>
          <Text style={styles.views}>({post.views} views)</Text>
        </View>
      </ScrollView>
    )
  }
  return <Text>no data</Text>
}

export default FeedItemDetail
