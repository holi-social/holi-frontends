import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import Button from './ui/button'
import {
  FlatList,
  Text,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const ALL_POSTS_QUERY = gql`
  query Posts($offset: Int, $limit: Int) {
    allPosts(offset: $offset, limit: $limit) {
      id
      title
      text
      views
      User {
        id
        name
      }
    }
  }
`;

interface AllPostsQueryResult {
  allPosts: Post[];
}

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  text: string;
  views: number;
  User: User;
}

export default function Feed() {
  const { loading, error, data, fetchMore } = useQuery<AllPostsQueryResult>(
    ALL_POSTS_QUERY,
    {
      variables: {
        offset: 0,
        limit: 10
      }
    }
  );

  if (error) {
    console.error("Error fetching feed", error);
    if (error.message) {
      return <Text>{error.message}</Text>;
    } else {
      return (
        <Text>
          Errors: {JSON.stringify(error)}
          {error.graphQLErrors.map(({ message }, i) => (
            <Text key={i}>{message}</Text>
          ))}
        </Text>
      );
    }
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const feedItemStyles = StyleSheet.create({
    item: {
      paddingTop: 10,
      paddingBottom: 10,
      maxWidth: 600,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      paddingBottom: 5,
    },
    text: {
    },
    user: {
      fontWeight: "bold",
      color: "#333",
    },
    views: {
      color: "#333",
    },
    footer: {
      paddingTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

  const feedItem = ({ item }: ListRenderItemInfo<Post>) => {
    return (
      <Pressable onPress={() => {}} style={feedItemStyles.item}>
        <Text style={feedItemStyles.title}>{item.title}</Text>
        <Text style={feedItemStyles.text} numberOfLines={3}>{item.text}</Text>
        <View style={feedItemStyles.footer}>
          <Text style={feedItemStyles.user}>{item.User.name}</Text>
          <Text style={feedItemStyles.views}>({item.views} views)</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <FlatList
        data={data?.allPosts}
        renderItem={feedItem}
        keyExtractor={(post) => `${post.id}`}
      />
      <Button text={`Fetch more (offset ${data!.allPosts.length})`} onPress={() => {
        fetchMore({
          variables: {
            offset: data!.allPosts.length
          }
        })
      }} />
    </>
  );
}
