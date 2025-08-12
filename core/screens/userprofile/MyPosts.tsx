import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'

const MyPosts = () => {
  const { t } = useTranslation()

  return (
    <Screen
      preset="fixed"
      headerOptions={{
        title: t('posts.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
      <MyPostsTab />
    </Screen>
  )
}

export default MyPosts
