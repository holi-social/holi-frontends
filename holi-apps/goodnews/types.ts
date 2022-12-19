export type GoodNewsCategory =
  | 'ANIMAL_RIGHTS'
  | 'CLIMATE'
  | 'DIGITIZATION'
  | 'EDUCATION'
  | 'GLOBAL_HEALTH'
  | 'HUMAN_RIGHTS'
  | 'SUSTAINABILITY'

export type GoodNewsArticle = {
  id: string
  date: string
  headline: string
  teaserText: string
  pictureUrl: string
  pictureCredit: string | undefined
  articleUrl: string
  source: string | undefined
  sortKey: number
  category: GoodNewsCategory | undefined
  language: 'de' | 'en'
}
