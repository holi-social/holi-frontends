import { Insight } from '@holi/core/screens/insights/types'
import { Paged } from '@holi/core/types'

export type FavoritesResponse = {
  favorites: Paged<Favorites>
}

export interface Favorites {
  id: string
  favoritableId: string
  favoritableType: string
  favoritable: Insight
}
