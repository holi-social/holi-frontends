import React from 'react'
import { useQuery } from '@apollo/client'
import { FlatList, Text, ListRenderItemInfo, Pressable, StyleSheet, View, Platform, Dimensions } from 'react-native'
import theme from '@holi/ui/styles/theme'
import GraphQLError from '@holi/ui/components/GraphQLError'
import FeedImage from '@holi-apps/community/components/feed/FeedImage'

import { Post } from './types'
import { ALL_POSTS_QUERY, AllPostsQueryResult } from './queries'

const feedItemStyles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    maxWidth: 600,
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

const renderFeedItem = (onItemPressed: (post: Post) => void): React.VoidFunctionComponent<ListRenderItemInfo<Post>> => {
  const Item: React.VoidFunctionComponent<ListRenderItemInfo<Post>> = ({ item }) => {
    return (
      <Pressable onPress={() => onItemPressed(item)} style={feedItemStyles.item}>
        <Text style={feedItemStyles.title}>{item.title}</Text>
        {item.image && <FeedImage image={item.image} />}
        <Text style={feedItemStyles.text} numberOfLines={3}>
          {item.text}
        </Text>
        {Platform.OS === 'web' ? <Text style={feedItemStyles.more}>more</Text> : null}
        <View style={feedItemStyles.footer}>
          <Text style={feedItemStyles.user}>{item.User.name}</Text>
          <Text style={feedItemStyles.views}>({item.views} views)</Text>
        </View>
      </Pressable>
    )
  }
  return Item
}

const feedStyles = StyleSheet.create({
  feed: {
    // constrained height required to get infinite loading behavior right
    // (without it onEndReached fires until the whole has been loaded)
    maxHeight: Dimensions.get('window').height,
  },
})

export interface FeedProps {
  onItemPressed: (post: Post) => void
}

const Feed: React.VoidFunctionComponent<FeedProps> = ({ onItemPressed }) => {
  const { loading, error, data, fetchMore } = useQuery<AllPostsQueryResult>(ALL_POSTS_QUERY, {
    variables: {
      offset: 0,
      limit: 10,
    },
  })

  if (error) {
    console.error('Error fetching feed', error)
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={feedStyles.feed}>
      <FlatList
        data={data?.allPosts}
        renderItem={renderFeedItem(onItemPressed)}
        keyExtractor={(post) => post.id}
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.allPosts.length,
            },
          })
        }}
      />
    </View>
  )
}

export default Feed
