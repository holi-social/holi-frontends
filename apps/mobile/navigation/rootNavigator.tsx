import React, { useContext } from 'react'
import { Button, Pressable, SafeAreaView, Text, View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { Registration } from '@holi/core/auth/screens/Registration'
import { UserContext } from '@holi/core/user/UserContextProvider'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import theme from '@holi/ui/styles/theme/theme'

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

export type VolunteeringAppScreensList = {
  VolunteeringAppHome: undefined
}

export type HomeStackScreensList = {
  HomeFeed: undefined
  Topic: TopicScreenParams
  Post: PostScreenParams
  UserProfile: UserProfileScreenParams
  Notifications: undefined
}

export type BottomTabsScreensList = {
  Home: undefined
  Chat: undefined
  Search: undefined
}

export type RootStackScreensList = {
  // the actual app
  Core: undefined
  // apps from the HOLI store
  VolunteeringApp: undefined
  // all modals
  Login: undefined
  Logout: undefined
  Registration: undefined
  TopicEditorModal: TopicEditorModalParams
}

const HomeStack = createNativeStackNavigator<HomeStackScreensList>()
const ChatStack = createNativeStackNavigator<ChatStackScreensList>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreensList>()
const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()
const RootStack = createNativeStackNavigator<RootStackScreensList>()

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

const HomeFeedComponent: React.VFC = () => {
  const { navigate } = useRouting()
  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Apps</Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => navigate('/apps/volunteering')}>
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="work" size={20} />
            <Text>Volunteering</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => navigate('/apps/volunteering')}>
          <View style={{ flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Holicon icon="support" size={20} />
            <Text>Donations</Text>
          </View>
        </Pressable>
      </View>
      <Text style={{ fontSize: 18, paddingTop: 20 }}>
        This week’s topics are Immigration, Education and Sustainability
      </Text>
      {[...fakeTopics.keys()].map((topicId) => (
        <Button key={topicId} onPress={() => navigate(`/topics/${topicId}`)} title={fakeTopics.get(topicId).title} />
      ))}
    </View>
  )
}

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

type TopicEditorModalProps = NativeStackScreenProps<RootStackScreensList, 'TopicEditorModal'>
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
  const { user } = useContext(UserContext)
  if (user) {
    // Logged-in
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{user.name}&lsquo;s Profile</Text>
        <Button onPress={() => navigate('/logout')} title="Logout" />
      </View>
    )
  } else {
    // Logged-out
    return (
      <View style={{ padding: 10 }}>
        <Text>Profile userId={userId}</Text>
        <Button onPress={() => navigate('/login')} title="Login" />
        <Button onPress={() => navigate('/registration')} title="Register" />
      </View>
    )
  }
}

const NotificationsScreen: React.VFC = () => (
  <View style={{ padding: 10 }}>
    <Text>Notifications</Text>
  </View>
)

const ChatHomeScreen: React.VFC = () => (
  <View style={{ padding: 10 }}>
    <Text>Chat Home</Text>
  </View>
)

const VolunteeringAppHomeScreen: React.VFC = () => (
  <View style={{ padding: 10 }}>
    <Text>Volunteering App Home</Text>
  </View>
)

export const ChatStackNavigator: React.VFC = () => (
  <ChatStack.Navigator
    initialRouteName="ChatHome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChatStack.Screen name="ChatHome" component={ChatHomeScreen} />
  </ChatStack.Navigator>
)

export const HomeStackNavigator: React.VFC = () => (
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
          return (
            <Pressable onPress={() => navigate('/notifications')}>
              <Holicon icon="notification" size={20} color={theme.colors.fontColorBlack} />
            </Pressable>
          )
        },
        headerRight: () => {
          const { navigate } = useRouting()
          return (
            <Pressable onPress={() => navigate('/profile/danbim')}>
              <Holicon icon="person" size={25} color={theme.colors.fontColorBlack} />
            </Pressable>
          )
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
  </HomeStack.Navigator>
)

export const AppWrapper: React.FC = ({ children }) => {
  const { navigate } = useRouting()
  return (
    <SafeAreaView style={{ padding: 10, position: 'absolute', bottom: 10, right: 10 }}>
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <Pressable onPress={() => navigate('/')}>
          <Holicon icon="home" size={30} color={theme.colors.fontColorBlack} />
        </Pressable>
        <Pressable onPress={() => navigate('/search')}>
          <Holicon icon="search" size={30} color={theme.colors.fontColorBlack} />
        </Pressable>
      </View>
      {children}
    </SafeAreaView>
  )
}

export const VolunteeringAppNavigator: React.VFC = () => (
  <SafeAreaView style={{ padding: 10, height: '100%' }}>
    <VolunteeringAppStack.Navigator initialRouteName="VolunteeringAppHome">
      <VolunteeringAppStack.Screen name="VolunteeringAppHome" component={VolunteeringAppHomeScreen} />
    </VolunteeringAppStack.Navigator>
    <AppWrapper />
  </SafeAreaView>
)

export const BottomTabsNavigator: React.VFC = () => (
  <BottomTabs.Navigator initialRouteName="Home">
    <BottomTabs.Screen
      name="Home"
      options={{
        headerShown: false, // don't show on root level as the content comes with a header
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon icon="home" size={25} color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey} />
          )
        },
      }}
      component={HomeStackNavigator} // chat is complex, probably needs a navigator
    />
    <BottomTabs.Screen
      name="Chat"
      component={ChatStackNavigator} // chat is complex, probably needs a navigator
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon
              icon="comment"
              size={25}
              color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey}
            />
          )
        },
      }}
    />
    <BottomTabs.Screen
      name="Search"
      component={SearchScreen} // a simple component should do
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon
              icon="search"
              size={25}
              color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey}
            />
          )
        },
      }}
    />
  </BottomTabs.Navigator>
)

export const RootNavigator: React.VFC = () => (
  <RootStack.Navigator
    initialRouteName="Core"
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen name="Core" component={BottomTabsNavigator} />
    <RootStack.Screen name="VolunteeringApp" component={VolunteeringAppNavigator} />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
      }}
    >
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Logout" component={Logout} />
      <RootStack.Screen name="Registration" component={Registration} />
      <RootStack.Screen name="TopicEditorModal" component={TopicEditorModal} />
    </RootStack.Group>
  </RootStack.Navigator>
)
