export interface UserData {
  id: string
}

export const getUsers = async (): Promise<Array<UserData>> => {
  return Promise.resolve([{ id: '123' }, { id: '321' }])
}
