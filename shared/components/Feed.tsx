import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import {
  FlatList,
  Text,
  ListRenderItemInfo,
  View,
} from "react-native";

const ALL_POSTS_QUERY = gql`
  query {
    allPosts {
      id
      title
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
  views: number;
  User: User;
}

export default function Feed() {

  const { loading, error, data } = useQuery<AllPostsQueryResult>(
    ALL_POSTS_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.log('#### Feed error: ', JSON.stringify(error))
    return (
      <View>
        <Text>Error in Feed :(</Text>
      </View>
    );
  }

  const feedItem = ({ item }: ListRenderItemInfo<Post>) => {
    return (
      <Text>
        "{item.title}" by {item.User.name} (viewed {item.views} times)
      </Text>
    );
  };

  return (
    <FlatList
      data={data?.allPosts}
      renderItem={feedItem}
      keyExtractor={(post) => `${post.id}`}
    />
  );
}
