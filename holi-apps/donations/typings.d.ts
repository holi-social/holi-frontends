interface Picture {
  url: string
  type: 'original' | 'small'
}

interface Project {
  id: number
  title: string
  category: string
  donationsCount: number
  progressPercentage: number
  openAmountInCents: number
  picture: Picture[]
}
