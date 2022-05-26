import React from 'react'
import { Button, Pressable, Text, View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { Registration } from '@holi/core/auth/screens/Registration'
import useRouting from '@holi/ui/components/navigation/useRouting'

export type UserProfileScreenParams = {
  userId: string
}

export type TopicScreenParams = {
  topicId: string
}

export type TopicEditorModalParams = {
  topicId: string
}

export type PostScreenParams = {
  topicId: string
  postId: string
}

export type ChatStackScreensList = {
  ChatHome: undefined
}

export type HomeStackScreensList = {
  HomeFeed: undefined
  Topic: TopicScreenParams
  TopicEditorModal: TopicEditorModalParams
  Post: PostScreenParams
  UserProfile: UserProfileScreenParams
  Notifications: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
}

export type RootStackScreensList = {
  Home: undefined
  Chat: undefined
  Search: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreensList>()
const ChatStack = createNativeStackNavigator<ChatStackScreensList>()
const RootTabs = createBottomTabNavigator<RootStackScreensList>()

const HomeFeedComponent: React.FC = () => {
  const { navigate } = useRouting()
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 18 }}>This week’s topics are Immigration, Education and Sustainability</Text>
      {[...fakeTopics.keys()].map((topicId) => (
        <Button key={topicId} onPress={() => navigate(`/topics/${topicId}`)} title={fakeTopics.get(topicId).title} />
      ))}
    </View>
  )
}

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
  'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.'

const fakeTopics = new Map()
fakeTopics.set('abc', {
  title: 'What does it mean to be a refugee in Europe?',
  text:
    'Most of the world’s refugees take shelter in refugee camps, run by the United Nations Refugee Agency. Refugee ' +
    'camps are safe but temporary shelters, where refugees can live before their resettlement into other countries. ' +
    '\n' +
    '\n' +
    loremIpsum,
  posts: {
    123: { author: 'Max Arghentzu', text: '123 ' + loremIpsum },
    321: { author: 'Max Arghentzu', text: '321 ' + loremIpsum },
  },
})
fakeTopics.set('bca', {
  title: 'How can we stop a climate catastrophe?',
  text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
    'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.',
  posts: {
    456: { author: 'Max Arghentzu', text: '456 ' + loremIpsum },
    654: { author: 'Max Arghentzu', text: '654 ' + loremIpsum },
  },
})

type TopicScreenProps = NativeStackScreenProps<HomeStackScreensList, 'Topic'>
const TopicScreen: React.FC<TopicScreenProps> = ({ navigation, route }: TopicScreenProps) => {
  const { topicId } = route.params
  const { navigate } = useRouting()
  return (
    <View style={{ padding: 10 }}>
      <Text>Topic topidId={topicId}</Text>
      <Button onPress={() => navigate(`/topics/${topicId}/editors`)} title="Topic Editors" />
      <Text style={{ fontSize: 24, paddingBottom: 10 }}>{fakeTopics.get(topicId).title}</Text>
      <Text style={{ paddingBottom: 10 }}>{fakeTopics.get(topicId).text}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Posts</Text>
      {[...Object.getOwnPropertyNames(fakeTopics.get(topicId).posts)].map((postId) => (
        <Pressable key={postId} onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}>
          <Text style={{ paddingTop: 10 }}>{fakeTopics.get(topicId).posts[postId].text}</Text>
        </Pressable>
      ))}
    </View>
  )
}

type TopicEditorModalProps = NativeStackScreenProps<HomeStackScreensList, 'TopicEditorModal'>
const TopicEditorModal: React.FC<TopicEditorModalProps> = ({ navigation, route }) => {
  const { topicId } = route.params
  return (
    <View style={{ padding: 10 }}>
      <Text>This week&lsquo;s topic editors for topicId={topicId}</Text>
    </View>
  )
}

type PostScreenProps = NativeStackScreenProps<HomeStackScreensList, 'Post'>
const PostScreen: React.FC<PostScreenProps> = ({ navigation, route }) => {
  const { topicId, postId } = route.params
  return (
    <View style={{ justifyContent: 'center', padding: 10 }}>
      <Text>
        Topic {topicId} Post {postId}
      </Text>
      <Text style={{ paddingTop: 10 }}>by {fakeTopics.get(topicId).posts[postId].author}</Text>
      <Text style={{ paddingTop: 10 }}>{fakeTopics.get(topicId).posts[postId].text}</Text>
    </View>
  )
}

const SearchScreen: React.FC = () => (
  <View style={{ padding: 10 }}>
    <Text>Search</Text>
  </View>
)

type UserProfileScreenProps = NativeStackScreenProps<HomeStackScreensList, 'UserProfile'>
const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation, route }) => {
  const { navigate } = useRouting()
  const { userId } = route.params
  return (
    <View style={{ padding: 10 }}>
      <Text>Profile userId={userId}</Text>
      <Button onPress={() => navigate('/login')} title="Login" />
      <Button onPress={() => navigate('/logout')} title="Logout" />
      <Button onPress={() => navigate('/registration')} title="Register" />
    </View>
  )
}

const NotificationsScreen: React.FC = () => (
  <View style={{ padding: 10 }}>
    <Text>Notifications</Text>
  </View>
)

const ChatHomeScreen: React.FC = () => (
  <View style={{ padding: 10 }}>
    <Text>Chat Home</Text>
  </View>
)

export const ChatStackNavigator: React.VoidFunctionComponent = () => (
  <ChatStack.Navigator
    initialRouteName="ChatHome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChatStack.Screen name="ChatHome" component={ChatHomeScreen} />
  </ChatStack.Navigator>
)

export const HomeStackNavigator = () => (
  <HomeStack.Navigator
    initialRouteName="HomeFeed"
    screenOptions={{
      headerShown: true,
    }}
  >
    <HomeStack.Screen
      name="HomeFeed"
      component={HomeFeedComponent}
      options={{
        title: 'Good Morning',
        headerLeft: () => {
          const { navigate } = useRouting()
          return <Button onPress={() => navigate('/notifications')} title="<!>" />
        },
        headerRight: () => {
          const { navigate } = useRouting()
          return <Button onPress={() => navigate('/profile/danbim')} title="Profile" />
        },
      }}
    />
    <HomeStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{
        title: 'Profile',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Topic"
      component={TopicScreen}
      options={{
        title: 'Topic',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Post"
      component={PostScreen}
      options={{
        title: 'Post',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        title: 'Notifications',
        headerBackTitle: '',
        animation: 'slide_from_bottom',
      }}
    />
    {/* modals are only correctly rendered on android when in root navigator */}
    <HomeStack.Group
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
      }}
    >
      <HomeStack.Screen name="Login" component={Login} />
      <HomeStack.Screen name="Logout" component={Logout} />
      <HomeStack.Screen name="Registration" component={Registration} />
      <HomeStack.Screen name="TopicEditorModal" component={TopicEditorModal} />
    </HomeStack.Group>
  </HomeStack.Navigator>
)

export const RootTabsNavigator: React.VoidFunctionComponent = () => (
  <RootTabs.Navigator initialRouteName="Home">
    <RootTabs.Screen
      name="Home"
      options={{
        headerShown: false, // don't show on root level as the content comes with a header
      }}
      component={HomeStackNavigator} // chat is complex, probably needs a navigator
    />
    <RootTabs.Screen
      name="Chat"
      component={ChatStackNavigator} // chat is complex, probably needs a navigator
    />
    <RootTabs.Screen
      name="Search"
      component={SearchScreen} // a simple component should do
    />
  </RootTabs.Navigator>
)
