export const filterTypes = ['all', 'users', 'spaces'] as const

export type FilterType = (typeof filterTypes)[number]
