import { useQuery } from '@apollo/client'
import {
  FlatList,
  Text,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from 'react-native'
import { Post } from './types'
import { ALL_POSTS_QUERY, AllPostsQueryResult } from './queries'
import GraphQLError from '../GraphQLError'

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

const feedItem =
  (onItemPressed: (post: Post) => void) =>
  ({ item }: ListRenderItemInfo<Post>) => {
    return (
      <Pressable
        onPress={() => onItemPressed(item)}
        style={feedItemStyles.item}
      >
        <Text style={feedItemStyles.title}>{item.title}</Text>
        <Text style={feedItemStyles.text} numberOfLines={3}>
          {item.text}
        </Text>
        {Platform.OS === 'web' ? (
          <Text style={feedItemStyles.more}>more</Text>
        ) : null}
        <View style={feedItemStyles.footer}>
          <Text style={feedItemStyles.user}>{item.User.name}</Text>
          <Text style={feedItemStyles.views}>({item.views} views)</Text>
        </View>
      </Pressable>
    )
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
  const { loading, error, data, fetchMore } = useQuery<AllPostsQueryResult>(
    ALL_POSTS_QUERY,
    {
      variables: {
        offset: 0,
        limit: 10,
      },
    }
  )

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
        renderItem={feedItem(onItemPressed)}
        keyExtractor={(post) => post.id}
        onEndReached={(info: { distanceFromEnd: number }) => {
          fetchMore({
            variables: {
              offset: data!.allPosts.length,
            },
          })
        }}
      />
    </View>
  )
}

export default Feed
