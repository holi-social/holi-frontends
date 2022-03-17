import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, Text, View, Image } from 'react-native'
import GraphQLError from '../GraphQLError'
import { PostByIdQueryResult, POST_BY_ID } from './queries'

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
  image: {
    flex: -1,
    width: 600,
    height: 352,
    resizeMode: 'contain',
  },
  more: {
    alignSelf: 'flex-end',
  },
  user: {
    fontWeight: 'bold',
    color: '#333',
  },
  views: {
    color: '#333',
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
      <View style={styles.container}>
        <Text style={styles.title}>{post.title}</Text>
        {post.image !== null ? <Image style={styles.image} source={{ uri: post.image }} /> : null}
        <Text style={styles.text}>{post.text}</Text>
        <View style={styles.footer}>
          <Text style={styles.user}>{post.User.name}</Text>
          <Text style={styles.views}>({post.views} views)</Text>
        </View>
      </View>
    )
  }
  return <Text>no data</Text>
}

export default FeedItemDetail
