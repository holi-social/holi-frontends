import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { logError } from '@holi/core/errors/helpers'
import { isSSR } from '@holi/core/helpers/isSSR'
import { type FeedPostCategoriesQueryResult, feedPostCategoriesQuery } from '@holi/core/screens/individualPosts/queries'

export type FeedPostCategories = {
  id: string
  idx: number // sorting index
  name: string
  label: string
  description: string
  image: NodeRequire
}[]

const useFeedPostCategories = () => {
  const { t } = useTranslation()

  const { user } = useLoggedInUser()

  const { data, loading } = useQuery<FeedPostCategoriesQueryResult>(feedPostCategoriesQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) =>
      logError(error, 'Failed to load feed post categories', {
        location: 'useFeedPostCategories.feedPostCategoriesQuery',
      }),
  })

  const categoryPresentationBySlug: Record<
    string,
    { idx: number; name: string; label: string; description: string; image: NodeRequire }
  > = {
    'topic-for-conversation': {
      idx: 1,
      name: t('individuals.post.category.name.conversationTopic'),
      label: t('individuals.post.category.label.conversationTopic'),
      description: t('individuals.post.category.description.conversationTopic'),
      image: require('@holi/ui/assets/img/posts/category-topic-for-conversation-illustrations.svg'),
    },
    'personal-experience': {
      idx: 2,
      name: t('individuals.post.category.name.experience'),
      label: t('individuals.post.category.label.experience'),
      description: t('individuals.post.category.description.experience'),
      image: require('@holi/ui/assets/img/posts/category-personal-experience-illustrations.svg'),
    },
    recommendation: {
      idx: 3,
      name: t('individuals.post.category.name.recommendation'),
      label: t('individuals.post.category.label.recommendation'),
      description: t('individuals.post.category.description.recommendation'),
      image: require('@holi/ui/assets/img/posts/category-recommendation-illustrations.svg'),
    },
    'raise-awareness': {
      idx: 4,
      name: t('individuals.post.category.name.awareness'),
      label: t('individuals.post.category.label.awareness'),
      description: t('individuals.post.category.description.awareness'),
      image: require('@holi/ui/assets/img/posts/category-raise-awareness-illustrations.svg'),
    },
    'founder-update': {
      idx: 5,
      name: t('individuals.post.category.name.foundersUpdate'),
      label: t('individuals.post.category.name.foundersUpdate'),
      description: t('individuals.post.category.name.foundersUpdate'),
      image: require('@holi/ui/assets/img/posts/category-founders-update-illustrations.svg'),
    },
    'good-deed': {
      idx: 6,
      name: t('individuals.post.category.name.goodDeed'),
      label: t('individuals.post.category.label.goodDeed'),
      description: t('individuals.post.category.description.goodDeed'),
      image: require('@holi/ui/assets/img/posts/category-good-deed-illustrations.svg'),
    },
  }

  const presentableCategories = data?.feedPostCategories.data.reduce<FeedPostCategories>((acc, category) => {
    const categoryPresentation = categoryPresentationBySlug[category.slug]
    if (!categoryPresentation) return acc

    const isFounderUpdate = category.slug === 'founder-update'
    const canSeeFounderUpdate = user?.role === 'CO_FOUNDER'
    if (isFounderUpdate && !canSeeFounderUpdate) return acc

    acc.push({
      idx: categoryPresentation.idx,
      id: category.id,
      name: categoryPresentation.name,
      label: categoryPresentation.label,
      description: categoryPresentation.description,
      image: categoryPresentation.image,
    })
    return acc
  }, [])

  const mapCategorySlugToLabel = (slug: string) => {
    const categoryPresentation = categoryPresentationBySlug[slug]
    if (!categoryPresentation) return slug
    return categoryPresentation.label
  }

  return {
    loading: loading,
    categories: presentableCategories?.sort((a, b) => a.idx - b.idx) ?? null,
    mapCategorySlugToLabel,
  }
}

export default useFeedPostCategories
