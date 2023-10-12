let token: string | null = null

// gregor: novu uses localStorage internally,
// i think we don't need to persist the token,
// they are fine to live in memory
// also localStorage doesn't work for mobile
export const novuTokenStorage = {
  getItem: () => token,
  removeItem: () => {
    token = null
  },
  setItem: (_: string, value: string) => {
    token = value
  },
}
