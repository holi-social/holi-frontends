export interface Submitter {
  id: string
  username: string
  avatarUrl?: string | null
}

export interface Submission {
  id: string
  submissionDate: string
  imageUrl: string
  videoUrl: string
  playerPath: string
  submitter: Submitter
}

export interface Challenge {
  id: string
  title: string
  participants: number
  challengeDetailPath: string
  submissions: Submission[]
  lastSubmittedDate: string
}

export interface ChallengeEvent {
  id: string
  title: string
  teaserImageUrl: string
  startDate: string
  endDate: string
  link: string
}

export interface ChallengeTeaser {
  id: string
  title: string
  url: string
  submissionsCount: number
  cover: string | null
  isUpcoming: boolean
}
