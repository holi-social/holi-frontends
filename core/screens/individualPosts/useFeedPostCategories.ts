import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import { isSSR } from '@holi/core/helpers/isSSR'
import { FeedPostCategoriesQueryResult, feedPostCategoriesQuery } from '@holi/core/screens/individualPosts/queries'

export type FeedPostCategories = {
  id: string
  name: string
  label: string
  description: string
  image: NodeRequire
}[]

const useFeedPostCategories = () => {
  const { t } = useTranslation()

  const { data, loading } = useQuery<FeedPostCategoriesQueryResult>(feedPostCategoriesQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) =>
      logError(error, 'Failed to load feed post categories', {
        location: 'useFeedPostCategories.feedPostCategoriesQuery',
      }),
  })

  const categoryPresentationBySlug: Record<
    string,
    { name: string; label: string; description: string; image: NodeRequire }
  > = {
    'topic-for-conversation': {
      name: t('individuals.post.category.name.conversationTopic'),
      label: t('individuals.post.category.label.conversationTopic'),
      description: t('individuals.post.category.description.conversationTopic'),
      image: require('@holi/ui/assets/img/posts/category-topic-for-conversation-illustrations.svg'),
    },
    'personal-experience': {
      name: t('individuals.post.category.name.experience'),
      label: t('individuals.post.category.label.experience'),
      description: t('individuals.post.category.description.experience'),
      image: require('@holi/ui/assets/img/posts/category-personal-experience-illustrations.svg'),
    },
    recommendation: {
      name: t('individuals.post.category.name.recommendation'),
      label: t('individuals.post.category.label.recommendation'),
      description: t('individuals.post.category.description.recommendation'),
      image: require('@holi/ui/assets/img/posts/category-recommendation-illustrations.svg'),
    },
    'raise-awareness': {
      name: t('individuals.post.category.name.awareness'),
      label: t('individuals.post.category.label.awareness'),
      description: t('individuals.post.category.description.awareness'),
      image: require('@holi/ui/assets/img/posts/category-raise-awareness-illustrations.svg'),
    },
  }

  const presentableCategories = data?.feedPostCategories.data.reduce<FeedPostCategories>((acc, category) => {
    const categoryPresentation = categoryPresentationBySlug[category.slug]
    if (categoryPresentation) {
      acc.push({
        id: category.id,
        name: categoryPresentation.name,
        label: categoryPresentation.label,
        description: categoryPresentation.description,
        image: categoryPresentation.image,
      })
    }
    return acc
  }, [])

  return {
    loading: loading,
    categories: presentableCategories ?? null,
  }
}

export default useFeedPostCategories
