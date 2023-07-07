import { Draft } from 'immer'

export type AtomRecipe<T> = (draft: Draft<T>) => void

export function isAtomRecipe<T>(recipe: AtomRecipe<T> | T): recipe is AtomRecipe<T> {
  return typeof recipe === 'function'
}
