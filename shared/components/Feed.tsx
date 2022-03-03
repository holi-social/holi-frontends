import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import { FlatList, Text, ListRenderItemInfo } from "react-native";
import Button from './ui/button'

const ALL_POSTS_QUERY = gql`
  query Posts($offset: Int, $limit: Int) {
    allPosts(offset: $offset, limit: $limit) {
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

  const feedItem = ({ item }: ListRenderItemInfo<Post>) => {
    return (
      <Text>
        "{item.title}" by {item.User.name} (viewed {item.views} times)
      </Text>
    );
  };

  return (
    <>
      <FlatList
        data={data?.allPosts}
        renderItem={feedItem}
        keyExtractor={(post) => `${post.id}`}
      />
      <Button text={`Fetch more (offset ${data.allPosts.length})`} style={{}} onPress={() => {
        fetchMore({
          variables: {
            offset: data.allPosts.length
          }
        })
      }} />
    </>
  );
}
