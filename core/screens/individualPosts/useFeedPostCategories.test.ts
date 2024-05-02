import { renderHook } from '@testing-library/react-hooks'

import useFeedPostCategories from '@holi/core/screens/individualPosts/useFeedPostCategories'

jest.mock('@apollo/client', () => {
  const response = {
    feedPostCategories: {
      data: [
        {
          id: 'aac090da-1355-4fc5-a582-ef359c30b483',
          slug: 'non-existing-type',
          title: 'Unsupported',
        },
        {
          id: 'c6bbd246-1cd3-4fe0-bd1c-63f403609093',
          slug: 'recommendation',
          title: 'Recommendation',
        },
      ],
    },
  }
  return {
    __esModule: true,
    useQuery: () => ({ data: response, loading: false, error: null }),
  }
})

test('useFeedPostCategories combines backend categories with presentation configuration', async () => {
  const { result } = renderHook(() => useFeedPostCategories())

  expect(result.current).toStrictEqual({
    loading: false,
    categories: [
      {
        id: 'c6bbd246-1cd3-4fe0-bd1c-63f403609093',
        name: 'individuals.post.category.name.recommendation',
        image: expect.anything(),
      },
    ],
  })
})
