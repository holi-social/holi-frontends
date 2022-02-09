export interface UserData {
  id: string
}

export function getUsers(): Promise<Array<UserData>> {
  return Promise.resolve([{id:"123"},{id:"321"}])
}
