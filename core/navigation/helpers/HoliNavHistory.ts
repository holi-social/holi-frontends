import { makeVar } from '@apollo/client'

export class HoliNavHistory {
  private static _history = makeVar<string[]>([])

  public static get history() {
    return HoliNavHistory._history()
  }

  public static add(routeName: string) {
    HoliNavHistory._history([routeName, ...HoliNavHistory._history()])
  }

  public static replace(routeName: string) {
    HoliNavHistory._history([routeName, ...HoliNavHistory._history().slice(1)])
  }

  public static shift() {
    HoliNavHistory._history(HoliNavHistory._history().slice(1))
  }
}
