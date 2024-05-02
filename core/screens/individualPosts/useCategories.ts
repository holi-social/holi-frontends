import { useTranslation } from 'react-i18next'

const useCategories = () => {
  const { t } = useTranslation()

  const categories = [
    {
      name: t('individuals.post.category.name.topic'),
      image: require('@holi/ui/assets/img/posts/category-topic-for-conversation-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.experience'),
      image: require('@holi/ui/assets/img/posts/category-personal-experience-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.recommendation'),
      image: require('@holi/ui/assets/img/posts/category-recommendation-illustrations.svg'),
    },
    {
      name: t('individuals.post.category.name.awareness'),
      image: require('@holi/ui/assets/img/posts/category-raise-awareness-illustrations.svg'),
    },
  ]

  return categories
}

export default useCategories
