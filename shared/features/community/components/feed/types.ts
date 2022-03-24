export interface User {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  text: string
  image: string
  views: number
  User: User
}
