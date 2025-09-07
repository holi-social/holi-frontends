/**
 * @file NOT EDIT! Automatically generated code with `@graphql-codegen`.
 * If you need to develop the types of your Schema or queries and fragments for the front end,
 * execute `yarn schema:generate` or `schema:watch`.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T
export type InputMaybe<T> = T
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  AppVolunteering_GeoJSON: { input: any; output: any }
  Date: { input: any; output: any }
  DateTime: { input: any; output: any }
  DateTimeISO: { input: any; output: any }
  GeoJSON: { input: any; output: any }
  GeoJSONInput: { input: any; output: any }
  Geo_GeoJSON: { input: any; output: any }
  JSON: { input: any; output: any }
  JSONObject: { input: any; output: any }
  ObjMap: { input: any; output: any }
  UUID: { input: string; output: string }
  Upload: { input: any; output: any }
  Void: { input: any; output: any }
}

export enum AccountType {
  Apple = 'APPLE',
  Email = 'EMAIL',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
  Otp = 'OTP',
  Unknown = 'UNKNOWN',
}

export type AddCollaborationToolInput = {
  collectionType: CollectionType
  description?: InputMaybe<Scalars['String']['input']>
  spaceId: Scalars['UUID']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  title: Scalars['String']['input']
  url: Scalars['String']['input']
}

export type AddExternalLinkInput = {
  name: Scalars['String']['input']
  spaceId: Scalars['UUID']['input']
  type: ExternalLinkType
  url: Scalars['String']['input']
}

export type AppDonations_Author = {
  __typename?: 'AppDonations_Author'
  name: Scalars['String']['output']
  picture?: Maybe<Array<Maybe<AppDonations_Picture>>>
}

export type AppDonations_Initiative = {
  __typename?: 'AppDonations_Initiative'
  city: Scalars['String']['output']
  country: Scalars['String']['output']
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  picture?: Maybe<Array<Maybe<AppDonations_Picture>>>
  url?: Maybe<Scalars['String']['output']>
}

export type AppDonations_News = {
  __typename?: 'AppDonations_News'
  author?: Maybe<AppDonations_Author>
  body: Scalars['String']['output']
  id: Scalars['Int']['output']
  publishDate: Scalars['String']['output']
  title: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type AppDonations_Picture = {
  __typename?: 'AppDonations_Picture'
  height?: Maybe<Scalars['Int']['output']>
  type: Scalars['String']['output']
  url: Scalars['String']['output']
  width?: Maybe<Scalars['Int']['output']>
}

export type AppDonations_Project = {
  __typename?: 'AppDonations_Project'
  categories: Array<Maybe<Scalars['String']['output']>>
  city?: Maybe<Scalars['String']['output']>
  country?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  donationUrl?: Maybe<Scalars['String']['output']>
  donationsCount: Scalars['Int']['output']
  id: Scalars['Int']['output']
  initiative: AppDonations_Initiative
  news: Array<Maybe<AppDonations_News>>
  newsCount: Scalars['Int']['output']
  newsUrl?: Maybe<Scalars['String']['output']>
  openAmountInCents: Scalars['Int']['output']
  picture?: Maybe<Array<Maybe<AppDonations_Picture>>>
  progressPercentage: Scalars['Int']['output']
  summary?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
}

export type AppDonations_ProjectNewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
}

export type AppDonations_ProjectsResponse = {
  __typename?: 'AppDonations_ProjectsResponse'
  data: Array<Maybe<AppDonations_Project>>
  totalResults: Scalars['Int']['output']
}

export type AppEvents_Event = {
  __typename?: 'AppEvents_Event'
  endDate?: Maybe<Scalars['String']['output']>
  eventDetails: AppEvents_EventDetails
  id: Scalars['String']['output']
  imageUrl: Scalars['String']['output']
  isRemote: Scalars['Boolean']['output']
  location?: Maybe<AppEvents_Location>
  organisationName: Scalars['String']['output']
  startDate?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
}

export type AppEvents_EventDetails = {
  __typename?: 'AppEvents_EventDetails'
  description: Scalars['String']['output']
  externalLink?: Maybe<Scalars['String']['output']>
  meetingLink?: Maybe<Scalars['String']['output']>
}

export type AppEvents_EventResponse = {
  __typename?: 'AppEvents_EventResponse'
  data?: Maybe<AppEvents_Event>
}

export type AppEvents_EventsResponse = {
  __typename?: 'AppEvents_EventsResponse'
  data?: Maybe<Array<Maybe<AppEvents_Event>>>
  totalResults: Scalars['Int']['output']
}

export type AppEvents_Location = {
  __typename?: 'AppEvents_Location'
  city?: Maybe<Scalars['String']['output']>
  street?: Maybe<Scalars['String']['output']>
  streetNo?: Maybe<Scalars['String']['output']>
  zipCode?: Maybe<Scalars['String']['output']>
}

export type AppEvents_NearbyEventsResponse = {
  __typename?: 'AppEvents_NearbyEventsResponse'
  data?: Maybe<Array<Maybe<AppEvents_Event>>>
}

export enum AppGoodNews_Category {
  AnimalRights = 'ANIMAL_RIGHTS',
  Climate = 'CLIMATE',
  Digitization = 'DIGITIZATION',
  Education = 'EDUCATION',
  GlobalHealth = 'GLOBAL_HEALTH',
  HumanRights = 'HUMAN_RIGHTS',
  Sustainability = 'SUSTAINABILITY',
}

export type AppGoodNews_GoodNewsArticle = {
  __typename?: 'AppGoodNews_GoodNewsArticle'
  articleUrl: Scalars['String']['output']
  category?: Maybe<AppGoodNews_Category>
  date: Scalars['String']['output']
  headline: Scalars['String']['output']
  id: Scalars['String']['output']
  language?: Maybe<Scalars['String']['output']>
  pictureCredit?: Maybe<Scalars['String']['output']>
  pictureUrl: Scalars['String']['output']
  sortKey: Scalars['Int']['output']
  source?: Maybe<Scalars['String']['output']>
  teaserText: Scalars['String']['output']
}

export type AppGoodNews_GoodNewsArticlesQueryResponse = {
  __typename?: 'AppGoodNews_GoodNewsArticlesQueryResponse'
  articles: Array<Maybe<AppGoodNews_GoodNewsArticle>>
  previousDateTeaser?: Maybe<AppGoodNews_GoodNewsArticle>
}

/** AppVersion(id, version, build_number, need_update, created, app_store_url, play_store_url) */
export type AppVersionResponse = {
  __typename?: 'AppVersionResponse'
  appStoreUrl: Scalars['String']['output']
  needUpdate: Scalars['String']['output']
  playStoreUrl: Scalars['String']['output']
}

export type AppVolunteering_Engagement = {
  __typename?: 'AppVolunteering_Engagement'
  description?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  imageUrl?: Maybe<Scalars['String']['output']>
  latitude?: Maybe<Scalars['Float']['output']>
  location?: Maybe<Scalars['String']['output']>
  longitude?: Maybe<Scalars['Float']['output']>
  /**
   * If this engagement is part of a recommendation query response, matchedGeoLocationDistanceInMeters contains the distance (in meters) between the engagement and the location given in the query.
   * @deprecated Use the identically named field in the EngagementReco type returned by the engagementRecos query instead. (since v1.34)
   */
  matchedGeoLocationDistanceInMeters?: Maybe<Scalars['Float']['output']>
  /**
   * If this engagement is part of a recommendation query response, matchedSkills contains the slugs of matched skills. The order is defined as follows: 1) skills that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence)
   * @deprecated Use the identically named field in the EngagementReco type returned by the engagementRecos query instead. (since v1.34)
   */
  matchedSkills?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /**
   * If this engagement is part of a recommendation query response, matchedTopics contains the slugs of matched topics. The order is defined as follows: 1) topics that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence)
   * @deprecated Use the identically named field in the EngagementReco type returned by the engagementRecos query instead. (since v1.34)
   */
  matchedTopics?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  organizer?: Maybe<AppVolunteering_Organizer>
  /**
   * An array of skill slugs matching the engagement. Ordered by confidence DESC (typically, may be subject to change).
   * @deprecated Use skillsV2 instead. (since v1.51)
   */
  skills?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** An array of skill V2 slugs matching the engagement. Ordered by confidence DESC (typically, may be subject to change). */
  skillsV2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  source?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  /**
   * An array of topic slugs matching the engagement. Ordered by confidence DESC (typically, may be subject to change).
   * @deprecated Use topicsV2 instead. (since v1.51)
   */
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** An array of topic V2 slugs matching the engagement. Ordered by confidence DESC (typically, may be subject to change).  */
  topicsV2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  url?: Maybe<Scalars['String']['output']>
}

export type AppVolunteering_EngagementReco = {
  __typename?: 'AppVolunteering_EngagementReco'
  engagement: AppVolunteering_Engagement
  /** Contains the distance (in meters) between the engagement and the location given in the query. */
  matchedGeoLocationDistanceInMeters?: Maybe<Scalars['Float']['output']>
  /**
   * Contains the slugs of matched skills. The order is defined as follows: 1) skills that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence)
   * @deprecated Use matchedSkillsV2 instead. (since v1.51)
   */
  matchedSkills?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** Contains the V2 slugs of matched skills. The order is defined as follows: 1) skills that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence) */
  matchedSkillsV2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /**
   * Contains the slugs of matched topics. The order is defined as follows: 1) topics that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence)
   * @deprecated Use matchedTopicsV2 instead. (since v1.51)
   */
  matchedTopics?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** Contains the V2 slugs of matched topics. The order is defined as follows: 1) topics that were part of the query come first (sorted by matching confidence). 2) other topics the engagement matches (sorted by matching confidence) */
  matchedTopicsV2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
}

export type AppVolunteering_EngagementRecosResponse = {
  __typename?: 'AppVolunteering_EngagementRecosResponse'
  data: Array<Maybe<AppVolunteering_EngagementReco>>
  totalResults: Scalars['Int']['output']
}

export type AppVolunteering_EngagementsResponse = {
  __typename?: 'AppVolunteering_EngagementsResponse'
  data: Array<Maybe<AppVolunteering_Engagement>>
  totalResults: Scalars['Int']['output']
}

export type AppVolunteering_Organizer = {
  __typename?: 'AppVolunteering_Organizer'
  imageUrl?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
}

export type AppVolunteering_TrackEngagementViewResponse = {
  __typename?: 'AppVolunteering_TrackEngagementViewResponse'
  id?: Maybe<Scalars['String']['output']>
}

/** Appointment(id, title, slug, invite_only, start_date_time, end_date_time, location, geolocation, geolocation_geojson, location_details, video_call_link, description, thumbnail, thumbnail_blurhash, permission, space, creator, created, modified, is_deleted, deleted_at) */
export type Appointment = {
  __typename?: 'Appointment'
  creator?: Maybe<User>
  description: Scalars['String']['output']
  endDateTime: Scalars['DateTime']['output']
  /** @deprecated Use `location_details` instead */
  geolocation?: Maybe<GeolocationPoint>
  hasVideoCallLink?: Maybe<Scalars['Boolean']['output']>
  id: Scalars['UUID']['output']
  inviteOnly: Scalars['Boolean']['output']
  isHybrid?: Maybe<Scalars['Boolean']['output']>
  /** @deprecated Use `location_details` instead */
  location?: Maybe<Scalars['String']['output']>
  locationDetails?: Maybe<LocationDetails>
  participants?: Maybe<Array<User>>
  permission: PermissionType
  slug: Scalars['String']['output']
  startDateTime: Scalars['DateTime']['output']
  thumbnail?: Maybe<Scalars['String']['output']>
  thumbnailBlurhash?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  videoCallLink?: Maybe<VideoCallLink>
}

export type AppointmentPaged = {
  __typename?: 'AppointmentPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Appointment>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum AspectRatio {
  OneOne = 'ONE_ONE',
  SixteenNine = 'SIXTEEN_NINE',
}

/**
 * Custom user model to change behaviour of the default user model
 * such as validation and required fields.
 */
export type AuthenticatedUser = {
  __typename?: 'AuthenticatedUser'
  aboutMe?: Maybe<Scalars['String']['output']>
  accountType: AccountType
  avatar?: Maybe<Scalars['String']['output']>
  avatarBlurhash?: Maybe<Scalars['String']['output']>
  avatarDefaultColor: Scalars['String']['output']
  avatarLabel: Scalars['String']['output']
  connectionStatusToMyself?: Maybe<UserConnectionStatus>
  connectionStatusToSpace: Array<Maybe<SpaceUserConnectionType>>
  email: Scalars['String']['output']
  engagementLevel?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  /** Can be an empty string */
  fullName: Scalars['String']['output']
  geolocationId?: Maybe<Scalars['String']['output']>
  /** Required. 36 characters or fewer. Letters, digits and _ only. */
  id: Scalars['UUID']['output']
  /** 255 characters or fewer. Must start with a lowercase letter and contain lowercase letters, digits, '_', '-' and '.' only. */
  identity?: Maybe<Scalars['String']['output']>
  /** @deprecated Deprecated since 1.52. Use interests_v2 instead. */
  interests: Array<Maybe<Topic>>
  interestsV2: Array<Maybe<Scalars['String']['output']>>
  /** Designates whether the user is an employee. */
  isEmployee: Scalars['Boolean']['output']
  isOidc: Scalars['Boolean']['output']
  /** Indicates whether the user's account has been verified. */
  isVerified: Scalars['Boolean']['output']
  lastName?: Maybe<Scalars['String']['output']>
  location?: Maybe<Scalars['String']['output']>
  pronouns?: Maybe<Scalars['String']['output']>
  role?: Maybe<UserRole>
  /** @deprecated Deprecated since 1.53. */
  sdgs: Array<Maybe<Sdg>>
  /** @deprecated Deprecated since 1.52. Use skills_v2 instead. */
  skills: Array<Maybe<Skill>>
  skillsV2: Array<Maybe<Scalars['String']['output']>>
  trackingConsentAdPartners?: Maybe<Scalars['Boolean']['output']>
  trackingConsentAnalytics?: Maybe<Scalars['Boolean']['output']>
  trackingConsentPersonalization?: Maybe<Scalars['Boolean']['output']>
}

/**
 * Custom user model to change behaviour of the default user model
 * such as validation and required fields.
 */
export type AuthenticatedUserConnectionStatusToSpaceArgs = {
  spaceId: Scalars['UUID']['input']
}

/** Choice(id, poll, choice_text, votes, _order) */
export type Choice = {
  __typename?: 'Choice'
  choiceText: Scalars['String']['output']
  id: Scalars['UUID']['output']
  votes: Scalars['Int']['output']
}

/** CollaborationTool(id, url, title, collection_type, description, domain, creator, community, created_at, thumbnail, thumbnail_blurhash) */
export type CollaborationTool = {
  __typename?: 'CollaborationTool'
  collectionType: CollectionType
  description?: Maybe<Scalars['String']['output']>
  domain: Scalars['String']['output']
  id: Scalars['UUID']['output']
  thumbnail?: Maybe<Scalars['String']['output']>
  thumbnailBlurhash?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  url: Scalars['String']['output']
}

export type CollaborationToolPaged = {
  __typename?: 'CollaborationToolPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<CollaborationTool>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum CollectionType {
  Calendars = 'CALENDARS',
  Collaboration = 'COLLABORATION',
  Communication = 'COMMUNICATION',
  GoodToKnow = 'GOOD_TO_KNOW',
  InfoMaterial = 'INFO_MATERIAL',
  Others = 'OTHERS',
  Surveys = 'SURVEYS',
  UsedServices = 'USED_SERVICES',
}

/** Comment(id, commentable_type, commentable_id, parent_comment, created, modified, commenter, text, language_code, is_edited, is_deleted) */
export type Comment = {
  __typename?: 'Comment'
  created: Scalars['DateTime']['output']
  creator: User
  id: Scalars['UUID']['output']
  language?: Maybe<Scalars['String']['output']>
  links: Array<Maybe<LinkPreview>>
  mentions: Array<Maybe<User>>
  modified: Scalars['DateTime']['output']
  myReaction: ReactionCounts
  parentCommentId?: Maybe<Scalars['UUID']['output']>
  reactions: ReactionCounts
  reactors: UserPaged
  replies?: Maybe<Array<Comment>>
  text: Scalars['String']['output']
  totalReplies: Scalars['Int']['output']
}

/** Comment(id, commentable_type, commentable_id, parent_comment, created, modified, commenter, text, language_code, is_edited, is_deleted) */
export type CommentReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type CommentPaged = {
  __typename?: 'CommentPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Comment>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type CommentReactionInput = {
  commentId: Scalars['UUID']['input']
  reactionType: ReactionType
}

export type Commentable = {
  __typename?: 'Commentable'
  commenters: UserPaged
  comments: CommentPaged
  id: Scalars['UUID']['output']
  topComment?: Maybe<Comment>
  totalComments: Scalars['Int']['output']
  type: CommentableType
}

export type CommentableCommentersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type CommentableCommentsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  parentCommentId?: InputMaybe<Scalars['UUID']['input']>
}

export enum CommentableType {
  Discussion = 'DISCUSSION',
  FeedPost = 'FEED_POST',
  Post = 'POST',
}

/** CompletedTask(id, task, user, completed_at) */
export type CompletedTask = {
  __typename?: 'CompletedTask'
  completedAt: Scalars['DateTime']['output']
  id: Scalars['UUID']['output']
  task: Task
  user: User
}

export enum ContentType {
  FeedPost = 'FEED_POST',
  Post = 'POST',
  PostComment = 'POST_COMMENT',
  Space = 'SPACE',
  SpaceAppointment = 'SPACE_APPOINTMENT',
  SpaceTask = 'SPACE_TASK',
  User = 'USER',
}

export type CreateAppointmentInput = {
  description?: InputMaybe<Scalars['String']['input']>
  endDateTime: Scalars['String']['input']
  geolocation?: InputMaybe<GeolocationPointInput>
  inviteOnly: Scalars['Boolean']['input']
  location?: InputMaybe<Scalars['String']['input']>
  locationDetails?: InputMaybe<LocationDetailsInput>
  participantIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  permission: PermissionType
  spaceId: Scalars['UUID']['input']
  startDateTime: Scalars['String']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  title: Scalars['String']['input']
  videoCallInfo?: InputMaybe<Scalars['String']['input']>
  videoCallLink?: InputMaybe<Scalars['String']['input']>
}

export type CreateCommentInput = {
  commentableId: Scalars['UUID']['input']
  commentableType: CommentableType
  language?: InputMaybe<Scalars['String']['input']>
  parentCommentId?: InputMaybe<Scalars['UUID']['input']>
  text: Scalars['String']['input']
}

export type CreateFeedPostInput = {
  aspectRatio?: InputMaybe<AspectRatio>
  categoryId?: InputMaybe<Scalars['UUID']['input']>
  description: Scalars['String']['input']
  geolocation?: InputMaybe<GeolocationPointInput>
  image?: InputMaybe<Scalars['Upload']['input']>
  imageUrls?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  images?: InputMaybe<Array<InputMaybe<FeedPostImageInput>>>
  language?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
  topicIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
  visibility: VisibilityLevel
}

export type CreatePollInput = {
  questionText: Scalars['String']['input']
}

export type CreatePostCommentInput = {
  postId: Scalars['UUID']['input']
  text: Scalars['String']['input']
}

export type CreatePostCommentOutput = {
  __typename?: 'CreatePostCommentOutput'
  postById: Post
  postComment: PostComment
}

export type CreatePostInput = {
  image?: InputMaybe<Scalars['Upload']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  spaceId: Scalars['UUID']['input']
  text: Scalars['String']['input']
  title?: InputMaybe<Scalars['String']['input']>
  visibility: VisibilityType
}

export type CreateSpaceInput = {
  cover: Scalars['Upload']['input']
  description: Scalars['String']['input']
  title: Scalars['String']['input']
  topics?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
}

export type CreateTaskInput = {
  contactEmail: Scalars['String']['input']
  contactPhone?: InputMaybe<Scalars['String']['input']>
  description: Scalars['String']['input']
  duration?: InputMaybe<Duration>
  geolocation?: InputMaybe<GeolocationPointInput>
  impact?: InputMaybe<Scalars['String']['input']>
  interactionSignupLink?: InputMaybe<Scalars['String']['input']>
  interactionType?: InputMaybe<InteractionType>
  location?: InputMaybe<Scalars['String']['input']>
  locationType: LocationType
  name: Scalars['String']['input']
  regularity: Regularity
  skills?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  slotsAvailable?: InputMaybe<Scalars['Int']['input']>
  spaceId: Scalars['UUID']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  timeframeEndDate?: InputMaybe<Scalars['String']['input']>
  timeframeStartDate?: InputMaybe<Scalars['String']['input']>
  visibility: VisibilityType
}

export enum DeviceType {
  Android = 'ANDROID',
  Ios = 'IOS',
}

export type DiscoverSpaces = {
  __typename?: 'DiscoverSpaces'
  /** @deprecated Deprecated since version 1.0.16, use location_id instead */
  location?: Maybe<Scalars['String']['output']>
  locationId?: Maybe<Scalars['String']['output']>
  /** @deprecated Deprecated since version 1.52, use skill_v2 instead */
  skillId?: Maybe<Scalars['UUID']['output']>
  skillV2?: Maybe<Scalars['String']['output']>
  spaces: SpacePaged
  /** @deprecated Deprecated since version 1.52, use topic_v2 instead */
  topicId?: Maybe<Scalars['UUID']['output']>
  topicV2?: Maybe<Scalars['String']['output']>
}

/** Discussion(id, insight, question) */
export type Discussion = {
  __typename?: 'Discussion'
  id: Scalars['UUID']['output']
  question: Scalars['String']['output']
}

export enum Duration {
  Days_1 = 'DAYS_1',
  Days_2 = 'DAYS_2',
  Days_3OrMore = 'DAYS_3_OR_MORE',
  Hours_1to2 = 'HOURS_1to2',
  Hours_2to4 = 'HOURS_2to4',
  Hours_4to6 = 'HOURS_4to6',
  Indeterminate = 'INDETERMINATE',
  Minutes_10to15 = 'MINUTES_10to15',
  Minutes_15to30 = 'MINUTES_15to30',
  Minutes_30to60 = 'MINUTES_30to60',
}

/** ExternalLink(id, url, community, type, name) */
export type ExternalLink = {
  __typename?: 'ExternalLink'
  id: Scalars['UUID']['output']
  name: Scalars['String']['output']
  type: ExternalLinkType
  url: Scalars['String']['output']
}

export enum ExternalLinkType {
  Discord = 'DISCORD',
  Facebook = 'FACEBOOK',
  Instagram = 'INSTAGRAM',
  Linkedin = 'LINKEDIN',
  Other = 'OTHER',
  Twitter = 'TWITTER',
  Whatsapp = 'WHATSAPP',
}

/** ExternalVolunteeringOpportunity(external_id) */
export type ExternalVolunteeringOpportunity = {
  __typename?: 'ExternalVolunteeringOpportunity'
  externalId: Scalars['String']['output']
}

export enum FavoritableType {
  ExternalVolunteeringOpportunity = 'EXTERNAL_VOLUNTEERING_OPPORTUNITY',
  Insight = 'INSIGHT',
  Task = 'TASK',
}

export type FeedItem = {
  __typename?: 'FeedItem'
  feedPost?: Maybe<FeedPost>
  insight?: Maybe<Insight>
  spacePost?: Maybe<Post>
}

export type FeedItemPaged = {
  __typename?: 'FeedItemPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<FeedItem>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** FeedPost(id, title, slug, description, visibility, topics_v2, category, poll, creator, created_at, image, image_blurhash, link_preview, language_code, location, geolocation, geolocation_geojson, priority_duration, image_urls, aspect_ratio) */
export type FeedPost = {
  __typename?: 'FeedPost'
  aspectRatio?: Maybe<AspectRatio>
  category?: Maybe<FeedPostCategory>
  commenters: UserPaged
  createdAt: Scalars['String']['output']
  creator?: Maybe<User>
  description: Scalars['String']['output']
  geolocation?: Maybe<GeolocationPoint>
  id: Scalars['UUID']['output']
  image?: Maybe<Scalars['String']['output']>
  imageBlurhash?: Maybe<Scalars['String']['output']>
  imageUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  images?: Maybe<Array<Maybe<FeedPostImage>>>
  language?: Maybe<Scalars['String']['output']>
  linkPreview?: Maybe<LinkPreview>
  location?: Maybe<Scalars['String']['output']>
  mentions?: Maybe<Array<Maybe<User>>>
  myReaction: ReactionCounts
  poll?: Maybe<Poll>
  reactions: ReactionCounts
  reactors: UserPaged
  slug: Scalars['String']['output']
  title?: Maybe<Scalars['String']['output']>
  topics?: Maybe<Array<Topic>>
  topicsV2?: Maybe<Array<Scalars['String']['output']>>
  totalComments: Scalars['Int']['output']
  visibility: VisibilityLevel
}

/** FeedPost(id, title, slug, description, visibility, topics_v2, category, poll, creator, created_at, image, image_blurhash, link_preview, language_code, location, geolocation, geolocation_geojson, priority_duration, image_urls, aspect_ratio) */
export type FeedPostCommentersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** FeedPost(id, title, slug, description, visibility, topics_v2, category, poll, creator, created_at, image, image_blurhash, link_preview, language_code, location, geolocation, geolocation_geojson, priority_duration, image_urls, aspect_ratio) */
export type FeedPostReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Feed Posts have an assigned category that is displayed above the post. */
export type FeedPostCategory = {
  __typename?: 'FeedPostCategory'
  id: Scalars['UUID']['output']
  idx: Scalars['Int']['output']
  isEnabled: Scalars['Boolean']['output']
  label: Scalars['String']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type FeedPostCategoryPaged = {
  __typename?: 'FeedPostCategoryPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<FeedPostCategory>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** FeedPostImage(id, feed_post, image, image_blurhash, order, uploaded_at, alt_text, aspect_ratio) */
export type FeedPostImage = {
  __typename?: 'FeedPostImage'
  altText?: Maybe<Scalars['String']['output']>
  aspectRatio?: Maybe<AspectRatio>
  id: Scalars['UUID']['output']
  image: Scalars['String']['output']
  imageBlurhash: Scalars['String']['output']
  order: Scalars['Int']['output']
}

export type FeedPostImageInput = {
  altText?: InputMaybe<Scalars['String']['input']>
  aspectRatio?: InputMaybe<AspectRatio>
  image: Scalars['Upload']['input']
  order: Scalars['Int']['input']
}

export type FeedPostImageMetadata = {
  altText?: InputMaybe<Scalars['String']['input']>
  aspectRatio?: InputMaybe<AspectRatio>
  id: Scalars['UUID']['input']
  order: Scalars['Int']['input']
}

export type FeedPostPaged = {
  __typename?: 'FeedPostPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<FeedPost>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type GenericPost = FeedPost | Post

export type GenericPostPaged = {
  __typename?: 'GenericPostPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<GenericPost>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type Geo_Coordinates = {
  __typename?: 'Geo_Coordinates'
  latitude: Scalars['Float']['output']
  longitude: Scalars['Float']['output']
}

export type Geo_Place = {
  __typename?: 'Geo_Place'
  city?: Maybe<Scalars['String']['output']>
  coordinates: Geo_Coordinates
  country: Scalars['String']['output']
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  state?: Maybe<Scalars['String']['output']>
}

export type Geo_PlaceDetails = {
  __typename?: 'Geo_PlaceDetails'
  geolocation: Scalars['Geo_GeoJSON']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
}

export type GeolocationPoint = {
  __typename?: 'GeolocationPoint'
  latitude: Scalars['Float']['output']
  longitude: Scalars['Float']['output']
}

export type GeolocationPointInput = {
  latitude: Scalars['Float']['input']
  longitude: Scalars['Float']['input']
}

export type ImageKitAuthParams = {
  __typename?: 'ImageKitAuthParams'
  expire: Scalars['String']['output']
  publicKey: Scalars['String']['output']
  signature: Scalars['String']['output']
  token: Scalars['String']['output']
}

/** Initiative(id, insight, category, link, link_preview, comment) */
export type Initiative = {
  __typename?: 'Initiative'
  category: Scalars['String']['output']
  comment?: Maybe<Scalars['String']['output']>
  id: Scalars['UUID']['output']
  link: Scalars['String']['output']
  linkPreview: LinkPreview
  myReaction: ReactionCounts
  reactions: ReactionCounts
  reactors: UserPaged
}

/** Initiative(id, insight, category, link, link_preview, comment) */
export type InitiativeReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type Insight = {
  __typename?: 'Insight'
  creator: User
  datePublished: Scalars['Date']['output']
  description: Scalars['String']['output']
  discussions: Array<Discussion>
  headerImage?: Maybe<Scalars['String']['output']>
  headerImageBlurhash?: Maybe<Scalars['String']['output']>
  id: Scalars['UUID']['output']
  initiative: Initiative
  initiatives: Array<Initiative>
  /** A list of all users involved interacting with the insight (excluding the insight creator). Includes authors of all the posts and all commenters of any posts and discussions */
  involvedUsers: UserPaged
  isFavorite: Scalars['Boolean']['output']
  numberOfPosts: Scalars['Int']['output']
  polls: Array<Poll>
  posts: Array<Post>
  quote: Quote
  quotes: Array<Quote>
  recommendation: Recommendation
  recommendations: Array<Recommendation>
  title: Scalars['String']['output']
  /** @deprecated Deprecated since version 1.52, use topic_v2 instead. */
  topic?: Maybe<Topic>
  topicV2?: Maybe<Scalars['String']['output']>
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type InsightInitiativeArgs = {
  id: Scalars['UUID']['input']
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type InsightInvolvedUsersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type InsightQuoteArgs = {
  id: Scalars['UUID']['input']
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type InsightRecommendationArgs = {
  id: Scalars['UUID']['input']
}

export type InsightPaged = {
  __typename?: 'InsightPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Insight>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type InsightPreview = {
  __typename?: 'InsightPreview'
  creator?: Maybe<User>
  datePublished: Scalars['Date']['output']
  description: Scalars['String']['output']
  headerImage?: Maybe<Scalars['String']['output']>
  headerImageBlurhash?: Maybe<Scalars['String']['output']>
  id: Scalars['UUID']['output']
  title: Scalars['String']['output']
}

export type InsightPreviewPaged = {
  __typename?: 'InsightPreviewPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<InsightPreview>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type InsightTaskExternalVolunteeringOpportunity = ExternalVolunteeringOpportunity | Insight | Task

export type InspirationPostCategory = {
  __typename?: 'InspirationPostCategory'
  id: Scalars['UUID']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
}

export enum InteractionType {
  Chat = 'CHAT',
  Link = 'LINK',
  Ready = 'READY',
}

/** LinkPreview(id, requested_url, url, title, description, type, image, site_name, icon, fetched_at) */
export type LinkPreview = {
  __typename?: 'LinkPreview'
  description: Scalars['String']['output']
  fetchedAt: Scalars['DateTime']['output']
  icon?: Maybe<Scalars['String']['output']>
  id: Scalars['UUID']['output']
  image: Scalars['String']['output']
  origin: Scalars['String']['output']
  requestedUrl: Scalars['String']['output']
  siteName: Scalars['String']['output']
  title: Scalars['String']['output']
  type: Scalars['String']['output']
  url: Scalars['String']['output']
}

/** LocationDetails(id, complete_address, geolocation, geolocation_geojson, city, state, country) */
export type LocationDetails = {
  __typename?: 'LocationDetails'
  city?: Maybe<Scalars['String']['output']>
  completeAddress?: Maybe<Scalars['String']['output']>
  country?: Maybe<Scalars['String']['output']>
  geolocation?: Maybe<GeolocationPoint>
  state?: Maybe<Scalars['String']['output']>
}

export type LocationDetailsInput = {
  city?: InputMaybe<Scalars['String']['input']>
  completeAddress?: InputMaybe<Scalars['String']['input']>
  country?: InputMaybe<Scalars['String']['input']>
  geolocation?: InputMaybe<GeolocationPointInput>
  state?: InputMaybe<Scalars['String']['input']>
}

export enum LocationType {
  Hybrid = 'HYBRID',
  Onsite = 'ONSITE',
  Remote = 'REMOTE',
}

export enum Moderation_ContentType {
  ChatMessage = 'CHAT_MESSAGE',
  Comment = 'COMMENT',
  FeedPost = 'FEED_POST',
  Post = 'POST',
  Space = 'SPACE',
  SpaceAppointment = 'SPACE_APPOINTMENT',
  SpaceLinkhubTool = 'SPACE_LINKHUB_TOOL',
  SpaceTask = 'SPACE_TASK',
  User = 'USER',
}

export enum Moderation_Reason {
  FalseIdentity = 'FALSE_IDENTITY',
  Harassment = 'HARASSMENT',
  HateSpeech = 'HATE_SPEECH',
  IllegalActivity = 'ILLEGAL_ACTIVITY',
  Misinformation = 'MISINFORMATION',
  Other = 'OTHER',
  Pornography = 'PORNOGRAPHY',
  PrivacyViolation = 'PRIVACY_VIOLATION',
  Spam = 'SPAM',
}

export type Moderation_ReportConfirmation = {
  __typename?: 'Moderation_ReportConfirmation'
  success: Scalars['Boolean']['output']
}

export type Moderation_ReportSubmission = {
  contentId: Scalars['UUID']['input']
  contentType: Moderation_ContentType
  details: Scalars['String']['input']
  reason?: InputMaybe<Moderation_Reason>
}

export type Moderation_Success = {
  __typename?: 'Moderation_Success'
  success: Scalars['Boolean']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  addCollaborationTool: CollaborationTool
  addComment: Comment
  addExternalLink: ExternalLink
  addReactionToComment: Comment
  anonCount?: Maybe<Scalars['Void']['output']>
  appVolunteering_trackEngagementView: AppVolunteering_TrackEngagementViewResponse
  blockUser: Result
  completeReadyToGoTask: CompletedTask
  createAppointment: Appointment
  createFeedPost: FeedPost
  createPoll: Poll
  createSpace: Space
  /** @deprecated Changed return type to reflect created entity, use create_space_post_2. Deprecated since v1.1.0 */
  createSpacePost: Space
  createSpacePost2: Post
  createTask: Task
  deleteAppointment: Result
  deleteAuthenticatedUser: Result
  deleteCollaborationTool: Result
  deleteComment: Result
  deleteExternalLink: Result
  deleteFeedPost: Result
  /** @deprecated Comments can be deleted from other objects. Use deleteComment mutation. */
  deletePostComment: Result
  deleteSpace: Result
  deleteSpacePost: Space
  deleteTask: Result
  /** @deprecated use newer api with string favoritable ids to favorite all the things, keep for <=1.57.1 */
  favorite: Result
  favoriteV2: Result
  generateAppointmentIcsFile: Scalars['String']['output']
  getImagekitAuthParams: ImageKitAuthParams
  inviteToSpaceByEmail: Result
  lastSeenNotification: NewNotificationsResponse
  moderation_createReport: Moderation_ReportConfirmation
  notifications_updatePreferences: Array<Maybe<Notifications_WorkflowPreferences>>
  registerDevice: Result
  removeReactionFromComment: Comment
  reportContent: Result
  rewards_markBadgeUnlockAsSeen: Rewards_UnlockedBadge
  /** @deprecated use newer api with string favoritable ids to favorite all the things, keep for <=1.57.1 */
  unfavorite: Result
  unfavoriteV2: Result
  unsubscribeFromNewsletter: Result
  updateAppointment: Appointment
  /** @deprecated Deprecated in favor of 'updateAuthenticatedUserV2'. */
  updateAuthenticatedUser: User
  updateAuthenticatedUserV2: AuthenticatedUser
  updateCollaborationTool: CollaborationTool
  updateConnectionWithUser: User
  updateExternalLink: ExternalLink
  updateFeedPost: FeedPost
  updateFeedPostReaction: FeedPost
  updateInitiativeReaction: Initiative
  /** @deprecated Comments can be added to other objects. Use updateComment mutation. */
  updatePostComment: CreatePostCommentOutput
  /** @deprecated Comment reactions can be added to other objects. Use updateCommentReaction mutation. */
  updatePostCommentReaction: PostComment
  updatePostReaction: Post
  updateQuoteReaction: Quote
  updateRecommendationReaction: Recommendation
  updateSpace: Space
  updateSpacePost: Post
  /** When no userId is provided, the logged in user is used instead. */
  updateSpaceUserConnection: Space
  updateTask: Task
  updateVolunteeringOpportunityStatus: VolunteeringOpportunityStatus
  /** @deprecated Use vote_on_poll instead. */
  updateVotes: Choice
  validateSpace: Result
  voteOnPoll: Result
}

export type MutationAddCollaborationToolArgs = {
  input: AddCollaborationToolInput
}

export type MutationAddCommentArgs = {
  input: CreateCommentInput
}

export type MutationAddExternalLinkArgs = {
  input: AddExternalLinkInput
}

export type MutationAddReactionToCommentArgs = {
  input: CommentReactionInput
}

export type MutationAnonCountArgs = {
  counterName: Scalars['String']['input']
}

export type MutationAppVolunteering_TrackEngagementViewArgs = {
  id: Scalars['String']['input']
}

export type MutationBlockUserArgs = {
  userId: Scalars['UUID']['input']
}

export type MutationCompleteReadyToGoTaskArgs = {
  id: Scalars['UUID']['input']
}

export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput
}

export type MutationCreateFeedPostArgs = {
  input: CreateFeedPostInput
}

export type MutationCreatePollArgs = {
  input: CreatePollInput
}

export type MutationCreateSpaceArgs = {
  input: CreateSpaceInput
}

export type MutationCreateSpacePostArgs = {
  input: CreatePostInput
}

export type MutationCreateSpacePost2Args = {
  input: CreatePostInput
}

export type MutationCreateTaskArgs = {
  input: CreateTaskInput
}

export type MutationDeleteAppointmentArgs = {
  appointmentId: Scalars['UUID']['input']
}

export type MutationDeleteCollaborationToolArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteCommentArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteExternalLinkArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteFeedPostArgs = {
  postId: Scalars['UUID']['input']
}

export type MutationDeletePostCommentArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteSpaceArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteSpacePostArgs = {
  id: Scalars['UUID']['input']
}

export type MutationDeleteTaskArgs = {
  id: Scalars['UUID']['input']
}

export type MutationFavoriteArgs = {
  favoritableId: Scalars['UUID']['input']
  favoritableType: FavoritableType
}

export type MutationFavoriteV2Args = {
  favoritableId: Scalars['String']['input']
  favoritableType: FavoritableType
}

export type MutationGenerateAppointmentIcsFileArgs = {
  appointmentId: Scalars['UUID']['input']
}

export type MutationInviteToSpaceByEmailArgs = {
  email: Scalars['String']['input']
  spaceId: Scalars['UUID']['input']
}

export type MutationLastSeenNotificationArgs = {
  notificationId: Scalars['UUID']['input']
}

export type MutationModeration_CreateReportArgs = {
  input: Moderation_ReportSubmission
}

export type MutationNotifications_UpdatePreferencesArgs = {
  input: Notifications_UpdatePreferencesInput
}

export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput
}

export type MutationRemoveReactionFromCommentArgs = {
  input: CommentReactionInput
}

export type MutationReportContentArgs = {
  contentType: ContentType
  description?: InputMaybe<Scalars['String']['input']>
  objectId: Scalars['UUID']['input']
}

export type MutationRewards_MarkBadgeUnlockAsSeenArgs = {
  unlockId: Scalars['ID']['input']
}

export type MutationUnfavoriteArgs = {
  favoritableId: Scalars['UUID']['input']
  favoritableType: FavoritableType
}

export type MutationUnfavoriteV2Args = {
  favoritableId: Scalars['String']['input']
  favoritableType: FavoritableType
}

export type MutationUnsubscribeFromNewsletterArgs = {
  token: Scalars['String']['input']
}

export type MutationUpdateAppointmentArgs = {
  input: UpdateAppointmentInput
}

export type MutationUpdateAuthenticatedUserArgs = {
  input: UpdateAuthenticatedUserInput
}

export type MutationUpdateAuthenticatedUserV2Args = {
  input: UpdateAuthenticatedUserInput
}

export type MutationUpdateCollaborationToolArgs = {
  input: UpdateCollaborationToolInput
}

export type MutationUpdateConnectionWithUserArgs = {
  input: UpdateConnectionWithUserInput
}

export type MutationUpdateExternalLinkArgs = {
  input: UpdateExternalLinkInput
}

export type MutationUpdateFeedPostArgs = {
  input: UpdateFeedPostInput
}

export type MutationUpdateFeedPostReactionArgs = {
  postId: Scalars['UUID']['input']
  reactionAction: ReactionAction
  reactionType: ReactionType
}

export type MutationUpdateInitiativeReactionArgs = {
  initiativeId: Scalars['UUID']['input']
  reactionAction: ReactionAction
  reactionType: ReactionType
}

export type MutationUpdatePostCommentArgs = {
  input: CreatePostCommentInput
}

export type MutationUpdatePostCommentReactionArgs = {
  id: Scalars['UUID']['input']
  reactionAction: ReactionAction
  reactionType: ReactionType
}

export type MutationUpdatePostReactionArgs = {
  id: Scalars['UUID']['input']
  reactionAction: ReactionAction
  reactionType: ReactionType
}

export type MutationUpdateQuoteReactionArgs = {
  quoteId: Scalars['UUID']['input']
  reactionAction: ReactionAction
  reactionType: ReactionType
}

export type MutationUpdateRecommendationReactionArgs = {
  reactionAction: ReactionAction
  reactionType: ReactionType
  recommendationId: Scalars['UUID']['input']
}

export type MutationUpdateSpaceArgs = {
  input: UpdateSpaceInput
}

export type MutationUpdateSpacePostArgs = {
  input: UpdatePostInput
}

export type MutationUpdateSpaceUserConnectionArgs = {
  connectAction: UpdateConnectionAction
  connectionType: SpaceUserConnectionType
  message?: InputMaybe<Scalars['String']['input']>
  spaceId: Scalars['UUID']['input']
  userId?: InputMaybe<Scalars['UUID']['input']>
}

export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput
}

export type MutationUpdateVolunteeringOpportunityStatusArgs = {
  newStatus?: VolunteeringOpportunityStatusValue
  volunteeringOpportunityId: Scalars['String']['input']
}

export type MutationUpdateVotesArgs = {
  id: Scalars['UUID']['input']
}

export type MutationValidateSpaceArgs = {
  input: ValidateSpaceInput
}

export type MutationVoteOnPollArgs = {
  choiceIds: Array<Scalars['UUID']['input']>
  pollId: Scalars['UUID']['input']
}

export type MySpaces = {
  __typename?: 'MySpaces'
  section: Scalars['String']['output']
  spaces: SpacePaged
  type: SpaceUserConnectionType
}

export type MySpacesSpacesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type NewNotificationsResponse = {
  __typename?: 'NewNotificationsResponse'
  id?: Maybe<Scalars['UUID']['output']>
  status: Scalars['Boolean']['output']
}

/** Notification(id, owner, created, read, notification_type, content_type, object_id) */
export type Notification = {
  __typename?: 'Notification'
  created: Scalars['DateTime']['output']
  id: Scalars['UUID']['output']
  notificationType: NotificationType
  options?: Maybe<NotificationOptions>
  owner: User
  read: Scalars['Boolean']['output']
}

export type NotificationOptions = {
  __typename?: 'NotificationOptions'
  message?: Maybe<Scalars['String']['output']>
  post?: Maybe<Post>
  postComment?: Maybe<PostComment>
  space?: Maybe<Space>
  teaser?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type NotificationPaged = {
  __typename?: 'NotificationPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Notification>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum NotificationType {
  /** CONNECTION_ACCEPTED */
  Ca = 'CA',
  /** COMMUNITY_ADMIN_PRIVILEGES_GRANTED */
  Capg = 'CAPG',
  /** COMMUNITY_ADMIN_PRIVILEGES_REVOKED */
  Capr = 'CAPR',
  /** CONNECTION_CONFIRMED */
  Cc = 'CC',
  /** COMMUNITY_INVITE */
  Ci = 'CI',
  /** COMMUNITY_INVITE_DECLINED */
  Cid = 'CID',
  /** COMMUNITY_MEMBERSHIP_REQUEST */
  Cmr = 'CMR',
  /** COMMUNITY_MEMBERSHIP_APPROVED */
  Cmra = 'CMRA',
  /** COMMUNITY_MEMBERSHIP_REVOKED */
  Cmre = 'CMRE',
  /** COMMUNITY_NEW_POST */
  Cnp = 'CNP',
  /** CONNECTION_REQUEST */
  Cr = 'CR',
  /** FOLLOW */
  F = 'F',
  /** FOLLOW_REQUEST */
  Fr = 'FR',
  /** FOLLOW_REQUEST_APPROVED */
  Fra = 'FRA',
  /** POST_COMMENT */
  Pc = 'PC',
  /** POST_COMMENT_REPLY */
  Pcr = 'PCR',
  /** POST_COMMENT_REACTION */
  Pcra = 'PCRA',
  /** POST_COMMENT_USER_MENTION */
  Pcum = 'PCUM',
  /** POST_REACTION */
  Pr = 'PR',
  /** POST_USER_MENTION */
  Pum = 'PUM',
  /** RELEASE_INFO */
  Rel = 'REL',
  /** USER_NEW_POST */
  Unp = 'UNP',
}

export enum Notifications_Channel {
  Email = 'email',
  Push = 'push',
}

export type Notifications_ChannelPreferences = {
  __typename?: 'Notifications_ChannelPreferences'
  email?: Maybe<Scalars['Boolean']['output']>
  push?: Maybe<Scalars['Boolean']['output']>
}

export type Notifications_UpdatePreferencesInput = {
  channel: Notifications_Channel
  enabled: Scalars['Boolean']['input']
  id: Scalars['String']['input']
}

export type Notifications_WorkflowPreferences = {
  __typename?: 'Notifications_WorkflowPreferences'
  category: Scalars['String']['output']
  id: Scalars['String']['output']
  preferences: Notifications_ChannelPreferences
}

export type Onboarding = {
  __typename?: 'Onboarding'
  steps: Array<Maybe<OnboardingStep>>
}

/** OnboardingStep(id, community, text, step_number, created_at) */
export type OnboardingStep = {
  __typename?: 'OnboardingStep'
  text?: Maybe<Scalars['String']['output']>
}

export type OnboardingStepInput = {
  text: Scalars['String']['input']
}

export enum PermissionType {
  Admins = 'ADMINS',
  Participants = 'PARTICIPANTS',
}

/** Poll(id, question_text, created, modified, creator, is_edited, is_closed, is_deleted, status, is_public, is_multi_select, max_choices) */
export type Poll = {
  __typename?: 'Poll'
  choices: Array<Choice>
  created: Scalars['DateTime']['output']
  creator: User
  id: Scalars['UUID']['output']
  isMultiSelect: Scalars['Boolean']['output']
  isPublic: Scalars['Boolean']['output']
  maxChoices: Scalars['Int']['output']
  modified: Scalars['DateTime']['output']
  questionText: Scalars['String']['output']
}

/** Post(id, title, text, created, modified, creator, comments_enabled, public_reactions, community, language_code, is_edited, is_closed, is_deleted, status, is_public) */
export type Post = {
  __typename?: 'Post'
  commenters: UserPaged
  comments: Array<Maybe<PostComment>>
  commentsEnabled: Scalars['Boolean']['output']
  created: Scalars['DateTime']['output']
  creator: User
  id: Scalars['UUID']['output']
  image?: Maybe<PostImage>
  inspirationPostCategory?: Maybe<InspirationPostCategory>
  /** A list of all users involved. Author of the post plus all commenters */
  involvedUsers: UserPaged
  isPublic: Scalars['Boolean']['output']
  language?: Maybe<Scalars['String']['output']>
  links: Array<Maybe<LinkPreview>>
  mentions: Array<Maybe<User>>
  modified: Scalars['DateTime']['output']
  /** Only present, when the current user reacted to this post */
  myReaction: ReactionCounts
  numberOfComments: Scalars['Int']['output']
  reactions: ReactionCounts
  reactors: UserPaged
  space?: Maybe<Space>
  text?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** Post(id, title, text, created, modified, creator, comments_enabled, public_reactions, community, language_code, is_edited, is_closed, is_deleted, status, is_public) */
export type PostCommentersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Post(id, title, text, created, modified, creator, comments_enabled, public_reactions, community, language_code, is_edited, is_closed, is_deleted, status, is_public) */
export type PostInvolvedUsersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Post(id, title, text, created, modified, creator, comments_enabled, public_reactions, community, language_code, is_edited, is_closed, is_deleted, status, is_public) */
export type PostReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Comment(id, commentable_type, commentable_id, parent_comment, created, modified, commenter, text, language_code, is_edited, is_deleted) */
export type PostComment = {
  __typename?: 'PostComment'
  created: Scalars['DateTime']['output']
  creator: User
  id: Scalars['UUID']['output']
  language?: Maybe<Scalars['String']['output']>
  links: Array<Maybe<LinkPreview>>
  mentions: Array<Maybe<User>>
  modified: Scalars['DateTime']['output']
  /** Only present, when the current user reacted to this post comment */
  myReaction: ReactionCounts
  post: Post
  reactions: ReactionCounts
  reactors: UserPaged
  text: Scalars['String']['output']
}

/** Comment(id, commentable_type, commentable_id, parent_comment, created, modified, commenter, text, language_code, is_edited, is_deleted) */
export type PostCommentReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** PostImage(id, post, image, image_blurhash, width, height) */
export type PostImage = {
  __typename?: 'PostImage'
  blurhash?: Maybe<Scalars['String']['output']>
  height: Scalars['Int']['output']
  id: Scalars['UUID']['output']
  url: Scalars['String']['output']
  width: Scalars['Int']['output']
}

export type PostPaged = {
  __typename?: 'PostPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Post>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type Query = {
  __typename?: 'Query'
  allPosts: GenericPostPaged
  appDonations_project: AppDonations_Project
  appDonations_projects: AppDonations_ProjectsResponse
  appEvents_event: AppEvents_EventResponse
  appEvents_events: AppEvents_EventsResponse
  appEvents_nearbyEvents: AppEvents_NearbyEventsResponse
  appGoodNews_articles?: Maybe<AppGoodNews_GoodNewsArticlesQueryResponse>
  /** @deprecated Query engagements using typesense instead. (since v1.55) */
  appVolunteering_engagement?: Maybe<AppVolunteering_Engagement>
  /**
   * Retrieves a list of recommendations based on the request parameters "topics", "skills" and "geoLocationId" (using deprecated topics & skills V2). "topics" contains slugs of the "Topic" type, "skills" contains slugs of the "Skill" type, "geoLocationId" contains the ID of a location as returned by the "geo_*" queries.
   * @deprecated Use engagementRecosV2 instead. (since v1.51)
   */
  appVolunteering_engagementRecos: AppVolunteering_EngagementRecosResponse
  /**
   * Retrieves a list of recommendations based on the request parameters "topics", "skills" and "geoLocationId" (using topics & skills V2). "topics" contains slugs of the "Topic" type, "skills" contains slugs of the "Skill" type, "geoLocationId" contains the ID of a location as returned by the "geo_*" queries.
   * @deprecated Query engagements using typesense instead. (since v1.55)
   */
  appVolunteering_engagementRecosV2: AppVolunteering_EngagementRecosResponse
  /** @deprecated Use filteredEngagementsV2 instead. (since v1.51) */
  appVolunteering_filteredEngagements: AppVolunteering_EngagementsResponse
  /** @deprecated Query engagements using typesense instead. (since v1.55) */
  appVolunteering_filteredEngagementsV2: AppVolunteering_EngagementsResponse
  /** @deprecated Query engagements using typesense instead. (since v1.55) */
  appVolunteering_similarRecommendations: AppVolunteering_EngagementsResponse
  appointment: Appointment
  appointments: AppointmentPaged
  /** @deprecated Deprecated in favor of 'authenticatedUserV2'. */
  authenticatedUser?: Maybe<User>
  authenticatedUserV2?: Maybe<AuthenticatedUser>
  checkAppVersion: AppVersionResponse
  collaborationTools: CollaborationToolPaged
  commentById: Comment
  commentable: Commentable
  committedVolunteeringOpportunities: VolunteeringOpportunityStatusPaged
  connectedUsers: UserPaged
  connectionsByUserId: UserPaged
  discoverSpaces: Array<Maybe<DiscoverSpaces>>
  discoverSpacesDefaultTopicsV2: Array<Scalars['String']['output']>
  discussionById: Discussion
  favorite: UserFavorite
  favorites: UserFavoritePaged
  favoritesByType: UserFavoritePaged
  feed: FeedItemPaged
  feedInsights: InsightPreviewPaged
  feedPostCategories: FeedPostCategoryPaged
  /** @deprecated feed_posts is deprecated, use all_posts instead. */
  feedPosts: FeedPostPaged
  geo_placeDetails: Geo_PlaceDetails
  geo_placesAutocomplete: Array<Maybe<Geo_Place>>
  hasNewNotifications: NewNotificationsResponse
  insightAuthors: UserPaged
  insightById?: Maybe<Insight>
  insightsByUserId: InsightPaged
  inspirationPosts: PostPaged
  lastInsights: InsightPaged
  myConnections: UserPaged
  myPosts: FeedPostPaged
  mySpaces: Array<Maybe<MySpaces>>
  notifications: NotificationPaged
  notifications_preferences: Array<Maybe<Notifications_WorkflowPreferences>>
  pollById?: Maybe<Poll>
  post: FeedPost
  postById?: Maybe<Post>
  postsByUserId: FeedPostPaged
  recommendedSpaces: SpacePaged
  recommendedTasks: TaskPaged
  rewards_badges: Rewards_BadgesOverview
  rewards_counter: Rewards_RewardsCounter
  rewards_globalCounter: Rewards_RewardsCounter
  rewards_transactions: Rewards_PagedTransactions
  /** @deprecated Deprecated since 1.53. */
  sdgs: SdgPaged
  /** @deprecated Deprecated since 1.52. Use V2 instead, which is now a static hard coded set of slugs. */
  skills: SkillPaged
  spaceById?: Maybe<Space>
  spaces: SpacePaged
  taskById?: Maybe<Task>
  tasksBySpaceId: TaskPaged
  /** @deprecated Deprecated since 1.52. Use V2 instead, which is now a static hard coded set of slugs. */
  topics: TopicPaged
  translation_detectLanguage: Scalars['String']['output']
  translation_translate: Scalars['String']['output']
  /**
   *
   * >**Method**: `GET`
   * >**Base URL**: `{env.TYPESENSE_API_URL}`
   * >**Path**: `/collections/{env.TYPESENSE_COLLECTION}/documents/search?q=*&filter_by=id:{args.documentType}_{args.id}&&type:{args.documentType}&per_page=1&exclude_fields=embedding,similarity_embedding,topics_skills_embedding_v2`
   *
   *
   */
  typesense_documentById?: Maybe<Typesense_SearchResponse>
  /**
   *
   * >**Method**: `POST`
   * >**Base URL**: `{env.TYPESENSE_API_URL}`
   * >**Path**: `/multi_search?collection={env.TYPESENSE_COLLECTION}`
   *
   *
   */
  typesense_multiSearch?: Maybe<Typesense_MultiSearchResponse>
  userById?: Maybe<User>
  userByName: UserPaged
  userHasVotedByPollId: Scalars['Boolean']['output']
  userSuggestions: UserPaged
  usersByChatIdentities: UserPaged
  volunteeringOpportunityStatus?: Maybe<VolunteeringOpportunityStatus>
}

export type QueryAllPostsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryAppDonations_ProjectArgs = {
  id: Scalars['Int']['input']
}

export type QueryAppDonations_ProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryAppEvents_EventArgs = {
  id: Scalars['String']['input']
}

export type QueryAppEvents_EventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  localOnly?: InputMaybe<Scalars['Boolean']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryAppEvents_NearbyEventsArgs = {
  geolocationId?: InputMaybe<Scalars['ID']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryAppGoodNews_ArticlesArgs = {
  lastDate?: InputMaybe<Scalars['String']['input']>
}

export type QueryAppVolunteering_EngagementArgs = {
  id: Scalars['String']['input']
}

export type QueryAppVolunteering_EngagementRecosArgs = {
  geolocationId?: InputMaybe<Scalars['String']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  skills?: InputMaybe<Array<Scalars['String']['input']>>
  topics?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryAppVolunteering_EngagementRecosV2Args = {
  geolocationId?: InputMaybe<Scalars['String']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  skills?: InputMaybe<Array<Scalars['String']['input']>>
  topics?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryAppVolunteering_FilteredEngagementsArgs = {
  geolocationId?: InputMaybe<Scalars['String']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  skills?: InputMaybe<Array<Scalars['String']['input']>>
  topics?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryAppVolunteering_FilteredEngagementsV2Args = {
  geolocationId?: InputMaybe<Scalars['String']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  skills?: InputMaybe<Array<Scalars['String']['input']>>
  topics?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryAppVolunteering_SimilarRecommendationsArgs = {
  id: Scalars['String']['input']
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryAppointmentArgs = {
  idOrSlug: Scalars['String']['input']
}

export type QueryAppointmentsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  spaceId: Scalars['UUID']['input']
  statusType?: StatusType
}

export type QueryCheckAppVersionArgs = {
  buildNumber: Scalars['String']['input']
  version: Scalars['String']['input']
}

export type QueryCollaborationToolsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  spaceId: Scalars['UUID']['input']
}

export type QueryCommentByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryCommentableArgs = {
  id: Scalars['UUID']['input']
  type: CommentableType
}

export type QueryCommittedVolunteeringOpportunitiesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryConnectedUsersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryConnectionsByUserIdArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  userId: Scalars['UUID']['input']
}

export type QueryDiscoverSpacesArgs = {
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  limit?: Scalars['Int']['input']
  location?: InputMaybe<Scalars['String']['input']>
  offset?: Scalars['Int']['input']
  skillIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  topicIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryDiscussionByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryFavoriteArgs = {
  favoritableId: Scalars['String']['input']
}

export type QueryFavoritesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFavoritesByTypeArgs = {
  favoritableType: FavoritableType
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFeedArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFeedInsightsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFeedPostCategoriesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFeedPostsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryGeo_PlaceDetailsArgs = {
  id: Scalars['String']['input']
}

export type QueryGeo_PlacesAutocompleteArgs = {
  level?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  text: Scalars['String']['input']
}

export type QueryInsightAuthorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryInsightByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryInsightsByUserIdArgs = {
  id: Scalars['UUID']['input']
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryInspirationPostsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryLastInsightsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryMyConnectionsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryMyPostsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryNotificationsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryPollByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryPostArgs = {
  idOrSlug: Scalars['String']['input']
}

export type QueryPostByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryPostsByUserIdArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  userId: Scalars['UUID']['input']
}

export type QueryRecommendedSpacesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryRecommendedTasksArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryRewards_TransactionsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QuerySdgsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QuerySkillsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QuerySpaceByIdArgs = {
  idOrName: Scalars['String']['input']
}

export type QuerySpacesArgs = {
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  limit?: Scalars['Int']['input']
  location?: InputMaybe<Scalars['String']['input']>
  memberId?: InputMaybe<Scalars['UUID']['input']>
  offset?: Scalars['Int']['input']
  skillIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillSlugs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  topicId?: InputMaybe<Scalars['UUID']['input']>
  topicSlug?: InputMaybe<Scalars['String']['input']>
  topicSlugs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryTaskByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryTasksBySpaceIdArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  spaceId: Scalars['UUID']['input']
}

export type QueryTopicsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryTranslation_DetectLanguageArgs = {
  text: Scalars['String']['input']
}

export type QueryTranslation_TranslateArgs = {
  targetLanguage: Scalars['String']['input']
  text: Scalars['String']['input']
}

export type QueryTypesense_DocumentByIdArgs = {
  documentType: Scalars['String']['input']
  id: Scalars['String']['input']
}

export type QueryTypesense_MultiSearchArgs = {
  input?: InputMaybe<Typesense_MultiSearchRequest_Input>
}

export type QueryUserByIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryUserByNameArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  substring: Scalars['String']['input']
}

export type QueryUserHasVotedByPollIdArgs = {
  id: Scalars['UUID']['input']
}

export type QueryUserSuggestionsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryUsersByChatIdentitiesArgs = {
  identities: Array<Scalars['String']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryVolunteeringOpportunityStatusArgs = {
  volunteeringOpportunityId: Scalars['String']['input']
}

/** Quote(id, insight, text, author, author_profession, link, link_preview, category, comment) */
export type Quote = {
  __typename?: 'Quote'
  author: Scalars['String']['output']
  authorProfession: Scalars['String']['output']
  category: Scalars['String']['output']
  comment: Scalars['String']['output']
  id: Scalars['UUID']['output']
  link: Scalars['String']['output']
  linkPreview: LinkPreview
  myReaction: ReactionCounts
  reactions: ReactionCounts
  reactors: UserPaged
  text: Scalars['String']['output']
}

/** Quote(id, insight, text, author, author_profession, link, link_preview, category, comment) */
export type QuoteReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export enum ReactionAction {
  Remove = 'REMOVE',
  Set = 'SET',
}

export type ReactionCounts = {
  __typename?: 'ReactionCounts'
  HEART: Scalars['Int']['output']
}

export enum ReactionType {
  Heart = 'HEART',
}

/** Recommendation(id, insight, category, link, link_preview, comment) */
export type Recommendation = {
  __typename?: 'Recommendation'
  category: Scalars['String']['output']
  comment: Scalars['String']['output']
  id: Scalars['UUID']['output']
  link: Scalars['String']['output']
  linkPreview: LinkPreview
  myReaction: ReactionCounts
  reactions: ReactionCounts
  reactors: UserPaged
}

/** Recommendation(id, insight, category, link, link_preview, comment) */
export type RecommendationReactorsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type RegisterDeviceInput = {
  deviceType: DeviceType
  token: Scalars['String']['input']
}

export enum Regularity {
  Negotiable = 'NEGOTIABLE',
  OnceMonth = 'ONCE_MONTH',
  OnceWeek = 'ONCE_WEEK',
  OneTime = 'ONE_TIME',
  ProjectBased = 'PROJECT_BASED',
  Regularly = 'REGULARLY',
  SeveralTimesWeek = 'SEVERAL_TIMES_WEEK',
}

export type Result = {
  __typename?: 'Result'
  success: Scalars['Boolean']['output']
}

export type Rewards_BadgesOverview = {
  __typename?: 'Rewards_BadgesOverview'
  inProgress: Array<Maybe<Rewards_InProgressBadge>>
  unlocked: Array<Maybe<Rewards_UnlockedBadge>>
}

export type Rewards_InProgressBadge = {
  __typename?: 'Rewards_InProgressBadge'
  progressGoal?: Maybe<Scalars['Int']['output']>
  progressMade?: Maybe<Scalars['Int']['output']>
  slug: Scalars['String']['output']
}

export type Rewards_PagedTransactions = {
  __typename?: 'Rewards_PagedTransactions'
  data: Array<Maybe<Rewards_Transaction>>
  totalResults: Scalars['Int']['output']
}

export enum Rewards_RewardType {
  ChallengeSubmitted = 'ChallengeSubmitted',
  ExternalVolunteeringOpportunityStarted = 'ExternalVolunteeringOpportunityStarted',
  GoodDeedPostCreated = 'GoodDeedPostCreated',
}

export type Rewards_RewardsCounter = {
  __typename?: 'Rewards_RewardsCounter'
  counter?: Maybe<Scalars['Int']['output']>
}

export type Rewards_Transaction = {
  __typename?: 'Rewards_Transaction'
  createdAt: Scalars['DateTimeISO']['output']
  id: Scalars['ID']['output']
  rewardType: Rewards_RewardType
}

export type Rewards_UnlockedBadge = {
  __typename?: 'Rewards_UnlockedBadge'
  id: Scalars['ID']['output']
  seenAt?: Maybe<Scalars['DateTimeISO']['output']>
  slug: Scalars['String']['output']
  unlockedAt: Scalars['DateTimeISO']['output']
}

/**
 * SDG == Sustainable Development Goals. The 17 goals defined by the UN.
 * see: https://sdgs.un.org/
 */
export type Sdg = {
  __typename?: 'SDG'
  id: Scalars['UUID']['output']
  number: Scalars['Int']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type SdgPaged = {
  __typename?: 'SDGPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Sdg>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** A skill is something that a user is capable of and that a task can request. */
export type Skill = {
  __typename?: 'Skill'
  id: Scalars['UUID']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type SkillPaged = {
  __typename?: 'SkillPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Skill>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type Space = {
  __typename?: 'Space'
  appointments: AppointmentPaged
  avatar?: Maybe<Scalars['String']['output']>
  avatarBlurhash?: Maybe<Scalars['String']['output']>
  avatarDefaultColor: Scalars['String']['output']
  childSpaces: SpacePaged
  collaborationTools: Array<Maybe<CollaborationTool>>
  connectionStatusToMyself: Array<Maybe<SpaceUserConnectionType>>
  contactDescription?: Maybe<Scalars['String']['output']>
  contactEmail?: Maybe<Scalars['String']['output']>
  contactPhone?: Maybe<Scalars['String']['output']>
  cover?: Maybe<Scalars['String']['output']>
  coverBlurhash?: Maybe<Scalars['String']['output']>
  created: Scalars['DateTime']['output']
  creator?: Maybe<User>
  description?: Maybe<Scalars['String']['output']>
  geolocation?: Maybe<GeolocationPoint>
  hasPrivatePosts: Scalars['Boolean']['output']
  hasPublicPosts: Scalars['Boolean']['output']
  id: Scalars['UUID']['output']
  /** A list of all active invites to this space */
  invites: SpaceInvitePaged
  links: Array<Maybe<ExternalLink>>
  location?: Maybe<Scalars['String']['output']>
  /** A list of all active members and their role */
  members: SpaceMemberPaged
  /** A list of all active membership requests */
  membershipRequests: SpaceMembershipRequestPaged
  name: Scalars['String']['output']
  onboarding?: Maybe<Onboarding>
  parentSpace?: Maybe<Space>
  posts: PostPaged
  /** A list of space members that can be contacted for information. */
  representatives: Array<SpaceMember>
  /** @deprecated Deprecated since version 1.53. */
  sdgs: Array<Maybe<Sdg>>
  tasks: Array<Task>
  title: Scalars['String']['output']
  /** @deprecated Deprecated since version 1.52, use topics_v2 instead. */
  topics: Array<Maybe<Topic>>
  topicsV2: Array<Scalars['String']['output']>
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpaceAppointmentsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpaceChildSpacesArgs = {
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpaceInvitesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpaceMembersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpaceMembershipRequestsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, geolocation_geojson, contact_description, contact_email, contact_phone) */
export type SpacePostsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  visibility?: VisibilityFilter
}

/** CommunityInvite(id, creator, invited_user, community) */
export type SpaceInvite = {
  __typename?: 'SpaceInvite'
  community: Space
  creator: User
  id: Scalars['UUID']['output']
  invitedUser: User
}

export type SpaceInvitePaged = {
  __typename?: 'SpaceInvitePaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<SpaceInvite>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** An object representing the membership of a user in a community */
export type SpaceMember = {
  __typename?: 'SpaceMember'
  community: Space
  created: Scalars['DateTime']['output']
  id: Scalars['UUID']['output']
  isAdministrator: Scalars['Boolean']['output']
  user: User
}

export type SpaceMemberPaged = {
  __typename?: 'SpaceMemberPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<SpaceMember>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/** CommunityMembershipRequest(id, community, user, message) */
export type SpaceMembershipRequest = {
  __typename?: 'SpaceMembershipRequest'
  community: Space
  id: Scalars['UUID']['output']
  message?: Maybe<Scalars['String']['output']>
  user: User
}

export type SpaceMembershipRequestPaged = {
  __typename?: 'SpaceMembershipRequestPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<SpaceMembershipRequest>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type SpacePaged = {
  __typename?: 'SpacePaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Space>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum SpaceUserConnectionType {
  Administrator = 'ADMINISTRATOR',
  Creator = 'CREATOR',
  Follower = 'FOLLOWER',
  Member = 'MEMBER',
  MembershipInvitee = 'MEMBERSHIP_INVITEE',
  MembershipRequestor = 'MEMBERSHIP_REQUESTOR',
}

export enum StatusType {
  Past = 'PAST',
  Upcoming = 'UPCOMING',
}

/** Task(id, interaction_signup_link, name, description, impact, community, creator, created, timeframe_start_date, timeframe_end_date, regularity, duration, interaction_type, slots_available, slots_taken, visibility, location_type, location, geolocation, geolocation_geojson, skills_v2, thumbnail, thumbnail_blurhash, contact_email, contact_phone, deleted_at) */
export type Task = {
  __typename?: 'Task'
  contactEmail: Scalars['String']['output']
  contactPhone?: Maybe<Scalars['String']['output']>
  created: Scalars['DateTime']['output']
  creator: User
  description: Scalars['String']['output']
  duration?: Maybe<Duration>
  geolocation?: Maybe<GeolocationPoint>
  id: Scalars['UUID']['output']
  impact?: Maybe<Scalars['String']['output']>
  interactionSignupLink?: Maybe<Scalars['String']['output']>
  interactionType?: Maybe<InteractionType>
  isFavorite: Scalars['Boolean']['output']
  location?: Maybe<Scalars['String']['output']>
  locationType: LocationType
  name: Scalars['String']['output']
  regularity: Regularity
  /** @deprecated Deprecated since version 1.52, use skills_v2 instead. */
  skills: Array<Skill>
  skillsV2: Array<Scalars['String']['output']>
  slotsAvailable: Scalars['Int']['output']
  slotsTaken: Scalars['Int']['output']
  space: Space
  thumbnail?: Maybe<Scalars['String']['output']>
  thumbnailBlurhash?: Maybe<Scalars['String']['output']>
  timeframeEndDate?: Maybe<Scalars['Date']['output']>
  timeframeStartDate?: Maybe<Scalars['Date']['output']>
  totalCompletions: Scalars['Int']['output']
  visibility: VisibilityType
}

export type TaskPaged = {
  __typename?: 'TaskPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Task>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

/**
 * A topic is something that a user can be interested in and that categorizes
 * Insights, Posts and Spaces.
 */
export type Topic = {
  __typename?: 'Topic'
  id: Scalars['UUID']['output']
  isDiscoverSpacesDefault: Scalars['Boolean']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type TopicPaged = {
  __typename?: 'TopicPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<Topic>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type Typesense_Document = {
  __typename?: 'Typesense_Document'
  commitment_duration?: Maybe<Scalars['String']['output']>
  commitment_label?: Maybe<Scalars['String']['output']>
  contact?: Maybe<Array<Maybe<Typesense_DocumentContact>>>
  description_de?: Maybe<Scalars['String']['output']>
  description_en?: Maybe<Scalars['String']['output']>
  donation_open_amount_in_cents?: Maybe<Scalars['Int']['output']>
  donation_progress_percentage?: Maybe<Scalars['Int']['output']>
  external_url?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  image_url?: Maybe<Scalars['String']['output']>
  link_locators?: Maybe<Typesense_DocumentLinkLocators>
  location?: Maybe<Scalars['String']['output']>
  location_country_de?: Maybe<Scalars['String']['output']>
  location_country_en?: Maybe<Scalars['String']['output']>
  location_lat_lng?: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  location_type?: Maybe<Scalars['String']['output']>
  organizer_image_url?: Maybe<Scalars['String']['output']>
  organizer_location?: Maybe<Scalars['String']['output']>
  organizer_location_country_de?: Maybe<Scalars['String']['output']>
  organizer_location_country_en?: Maybe<Scalars['String']['output']>
  organizer_name?: Maybe<Scalars['String']['output']>
  organizer_url?: Maybe<Scalars['String']['output']>
  skills_v2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  source?: Maybe<Scalars['String']['output']>
  summary_de?: Maybe<Scalars['String']['output']>
  summary_en?: Maybe<Scalars['String']['output']>
  title_de?: Maybe<Scalars['String']['output']>
  title_en?: Maybe<Scalars['String']['output']>
  topics_v2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  type: Typesense_DocumentType
  user_full_name?: Maybe<Scalars['String']['output']>
}

export type Typesense_DocumentContact = {
  __typename?: 'Typesense_DocumentContact'
  label?: Maybe<Scalars['String']['output']>
  type: Typesense_DocumentContactType
  value: Scalars['String']['output']
}

export enum Typesense_DocumentContactType {
  Email = 'email',
  Person = 'person',
  Phone = 'phone',
  Website = 'website',
}

export type Typesense_DocumentLinkLocators = {
  __typename?: 'Typesense_DocumentLinkLocators'
  donation?: Maybe<Scalars['String']['output']>
  profile?: Maybe<Scalars['String']['output']>
  space?: Maybe<Scalars['String']['output']>
  task?: Maybe<Scalars['String']['output']>
  volunteering?: Maybe<Scalars['String']['output']>
}

export enum Typesense_DocumentType {
  Donation = 'donation',
  Profile = 'profile',
  Space = 'space',
  Task = 'task',
  Volunteering = 'volunteering',
}

export enum Typesense_HttpMethod {
  Connect = 'CONNECT',
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Trace = 'TRACE',
}

/** If the number of results found for a specific query is less than this number, Typesense will attempt to drop the tokens in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set to 0 to disable. Default: 10 */
export enum Typesense_MultiSearchRequestParamsDropTokensMode {
  BothSides_3 = 'both_sides_3',
  LeftToRight = 'left_to_right',
  RightToLeft = 'right_to_left',
}

/** Choose the underlying faceting strategy used. Comma separated string of allows values: exhaustive, top_values or automatic (default). */
export enum Typesense_MultiSearchRequestParamsFacetStrategy {
  Automatic = 'automatic',
  Exhaustive = 'exhaustive',
  TopValues = 'top_values',
}

/** In a multi-field matching context, this parameter determines how the representative text match score of a record is calculated. Possible values are max_score (default) or max_weight. */
export enum Typesense_MultiSearchRequestParamsTextMatchType {
  MaxScore = 'max_score',
  MaxWeight = 'max_weight',
}

/** JSON Schema for Typesense MultiSearchRequest */
export type Typesense_MultiSearchRequest_Input = {
  searches?: InputMaybe<Array<InputMaybe<Typesense_SearchParams_Input>>>
}

/** JSON Schema for Typesense SearchResponse */
export type Typesense_MultiSearchResponse = {
  __typename?: 'Typesense_MultiSearchResponse'
  results: Array<Maybe<Typesense_SearchResponse>>
}

export enum Typesense_OperationMode {
  Always = 'always',
  Fallback = 'fallback',
  Off = 'off',
}

/** JSON Schema for Typesense SearchParams */
export type Typesense_SearchParams_Input = {
  /** The duration (in seconds) that determines how long the search query is cached. This value can be set on a per-query basis. Default: 60. */
  cache_ttl?: InputMaybe<Scalars['Int']['input']>
  /** The collection to search in. */
  collection?: InputMaybe<Scalars['String']['input']>
  /** Enable conversational search. */
  conversation?: InputMaybe<Scalars['Boolean']['input']>
  /** The Id of a previous conversation to continue, this tells Typesense to include prior context when communicating with the LLM. */
  conversation_id?: InputMaybe<Scalars['String']['input']>
  /** The Id of Conversation Model to be used. */
  conversation_model_id?: InputMaybe<Scalars['String']['input']>
  drop_tokens_mode?: InputMaybe<Typesense_MultiSearchRequestParamsDropTokensMode>
  /** If the number of results found for a specific query is less than this number, Typesense will attempt to drop the tokens in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set to 0 to disable. Default: 10. */
  drop_tokens_threshold?: InputMaybe<Scalars['Float']['input']>
  enable_analytics?: InputMaybe<Scalars['Boolean']['input']>
  /** Flag for enabling/disabling the deprecated, old highlight structure in the response. Default: true */
  enable_highlight_v1?: InputMaybe<Scalars['Boolean']['input']>
  enable_lazy_filter?: InputMaybe<Scalars['Boolean']['input']>
  /** If you have some overrides defined but want to disable all of them during query time, you can do that by setting this parameter to false */
  enable_overrides?: InputMaybe<Scalars['Boolean']['input']>
  /** If you have some synonyms defined but want to disable all of them for a particular search query, set enable_synonyms to false. Default: true */
  enable_synonyms?: InputMaybe<Scalars['Boolean']['input']>
  /** Set this parameter to false to disable typos on alphanumerical query tokens. Default: true. */
  enable_typos_for_alpha_numerical_tokens?: InputMaybe<Scalars['Boolean']['input']>
  /** Make Typesense disable typos for numerical tokens. */
  enable_typos_for_numerical_tokens?: InputMaybe<Scalars['Boolean']['input']>
  /** List of fields from the document to exclude in the search result */
  exclude_fields?: InputMaybe<Scalars['String']['input']>
  /** Setting this to true will make Typesense consider all prefixes and typo corrections of the words in the query without stopping early when enough results are found (drop_tokens_threshold and typo_tokens_threshold configurations are ignored). */
  exhaustive_search?: InputMaybe<Scalars['Boolean']['input']>
  /** A list of fields that will be used for faceting your results on. Separate multiple fields with a comma. */
  facet_by?: InputMaybe<Scalars['String']['input']>
  /** Facet values that are returned can now be filtered via this parameter. The matching facet text is also highlighted. For example, when faceting by `category`, you can set `facet_query=category:shoe` to return only facet values that contain the prefix "shoe". */
  facet_query?: InputMaybe<Scalars['String']['input']>
  facet_query_num_typos?: InputMaybe<Scalars['Int']['input']>
  /** Comma separated string of nested facet fields whose parent object should be returned in facet response. */
  facet_return_parent?: InputMaybe<Scalars['String']['input']>
  facet_sample_percent?: InputMaybe<Scalars['Float']['input']>
  facet_sample_threshold?: InputMaybe<Scalars['Int']['input']>
  facet_strategy?: InputMaybe<Typesense_MultiSearchRequestParamsFacetStrategy>
  /** Filter conditions for refining youropen api validator search results. Separate multiple conditions with &&. */
  filter_by?: InputMaybe<Scalars['String']['input']>
  /** Whether the filter_by condition of the search query should be applicable to curated results (override definitions, pinned hits, hidden hits, etc.). Default: false */
  filter_curated_hits?: InputMaybe<Scalars['Boolean']['input']>
  /** You can aggregate search results into groups or buckets by specify one or more `group_by` fields. Separate multiple fields with a comma. To group on a particular field, it must be a faceted field. */
  group_by?: InputMaybe<Scalars['String']['input']>
  /** Maximum number of hits to be returned for every group. If the `group_limit` is set as `K` then only the top K hits in each group are returned in the response. Default: 3 */
  group_limit?: InputMaybe<Scalars['Int']['input']>
  /** Setting this parameter to true will place all documents that have a null value in the group_by field, into a single group. Setting this parameter to false, will cause each document with a null value in the group_by field to not be grouped with other documents. Default: true */
  group_missing_values?: InputMaybe<Scalars['Boolean']['input']>
  /** A list of records to unconditionally hide from search results. A list of `record_id`s to hide. Eg: to hide records with IDs 123 and 456, you'd specify `123,456`. You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by `pinned_hits` and finally `hidden_hits`. */
  hidden_hits?: InputMaybe<Scalars['String']['input']>
  /** The number of tokens that should surround the highlighted text on each side. Default: 4 */
  highlight_affix_num_tokens?: InputMaybe<Scalars['Int']['input']>
  /** The end tag used for the highlighted snippets. Default: `</mark>` */
  highlight_end_tag?: InputMaybe<Scalars['String']['input']>
  /** A list of custom fields that must be highlighted even if you don't query for them */
  highlight_fields?: InputMaybe<Scalars['String']['input']>
  /** List of fields which should be highlighted fully without snippeting */
  highlight_full_fields?: InputMaybe<Scalars['String']['input']>
  /** The start tag used for the highlighted snippets. Default: `<mark>` */
  highlight_start_tag?: InputMaybe<Scalars['String']['input']>
  /** List of fields from the document to include in the search result */
  include_fields?: InputMaybe<Scalars['String']['input']>
  infix?: InputMaybe<Typesense_OperationMode>
  /** Number of hits to fetch. Can be used as an alternative to the per_page parameter. Default: 10. */
  limit?: InputMaybe<Scalars['Int']['input']>
  limit_hits?: InputMaybe<Scalars['Int']['input']>
  /** Control the number of words that Typesense considers for typo and prefix searching. */
  max_candidates?: InputMaybe<Scalars['Int']['input']>
  /** There are also 2 parameters that allow you to control the extent of infix searching max_extra_prefix and max_extra_suffix which specify the maximum number of symbols before or after the query that can be present in the token. For example query "K2100" has 2 extra symbols in "6PK2100". By default, any number of prefixes/suffixes can be present for a match. */
  max_extra_prefix?: InputMaybe<Scalars['Int']['input']>
  /** There are also 2 parameters that allow you to control the extent of infix searching max_extra_prefix and max_extra_suffix which specify the maximum number of symbols before or after the query that can be present in the token. For example query "K2100" has 2 extra symbols in "6PK2100". By default, any number of prefixes/suffixes can be present for a match. */
  max_extra_suffix?: InputMaybe<Scalars['Int']['input']>
  /** Maximum number of facet values to be returned. */
  max_facet_values?: InputMaybe<Scalars['Int']['input']>
  /** Controls the number of similar words that Typesense considers during fuzzy search on filter_by values. Useful for controlling prefix matches like company_name:Acm*. */
  max_filter_by_candidates?: InputMaybe<Scalars['Int']['input']>
  /** Minimum word length for 1-typo correction to be applied. The value of num_typos is still treated as the maximum allowed typos. */
  min_len_1typo?: InputMaybe<Scalars['Int']['input']>
  /** Minimum word length for 2-typo correction to be applied. The value of num_typos is still treated as the maximum allowed typos. */
  min_len_2typo?: InputMaybe<Scalars['Int']['input']>
  /** The ID of the natural language model to use. */
  nl_model_id?: InputMaybe<Scalars['String']['input']>
  /** Whether to use natural language processing to parse the query. */
  nl_query?: InputMaybe<Scalars['Boolean']['input']>
  /** Whether to activate advanced logs that let you see the generated LLM prompts and more. */
  nl_query_debug?: InputMaybe<Scalars['Boolean']['input']>
  /** The number of typographical errors (1 or 2) that would be tolerated. Default: 2 */
  num_typos?: InputMaybe<Scalars['String']['input']>
  /** Identifies the starting point to return hits from a result set. Can be used as an alternative to the page parameter. */
  offset?: InputMaybe<Scalars['Int']['input']>
  /** Comma separated list of tags to trigger the curations rules that match the tags. */
  override_tags?: InputMaybe<Scalars['String']['input']>
  /** Results from this specific page number would be fetched. */
  page?: InputMaybe<Scalars['Int']['input']>
  /** Number of results to fetch per page. Default: 10 */
  per_page?: InputMaybe<Scalars['Int']['input']>
  /** A list of records to unconditionally include in the search results at specific positions. An example use case would be to feature or promote certain items on the top of search results. A list of `record_id:hit_position`. Eg: to include a record with ID 123 at Position 1 and another record with ID 456 at Position 5, you'd specify `123:1,456:5`. You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by `pinned_hits` and finally `hidden_hits`. */
  pinned_hits?: InputMaybe<Scalars['String']['input']>
  /** You can index content from any logographic language into Typesense if you are able to segment / split the text into space-separated words yourself before indexing and querying. Set this parameter to true to do the same */
  pre_segmented_query?: InputMaybe<Scalars['Boolean']['input']>
  /** Boolean field to indicate that the last word in the query should be treated as a prefix, and not as a whole word. This is used for building autocomplete and instant search interfaces. Defaults to true. */
  prefix?: InputMaybe<Scalars['String']['input']>
  /** Search using a bunch of search parameters by setting this parameter to the name of the existing Preset. */
  preset?: InputMaybe<Scalars['String']['input']>
  /** Set this parameter to true to ensure that an exact match is ranked above the others */
  prioritize_exact_match?: InputMaybe<Scalars['Boolean']['input']>
  /** Make Typesense prioritize documents where the query words appear in more number of fields. */
  prioritize_num_matching_fields?: InputMaybe<Scalars['Boolean']['input']>
  /** Make Typesense prioritize documents where the query words appear earlier in the text. */
  prioritize_token_position?: InputMaybe<Scalars['Boolean']['input']>
  /** The query text to search for in the collection. Use * as the search string to return all documents. This is typically useful when used in conjunction with filter_by. */
  q?: InputMaybe<Scalars['String']['input']>
  /** A list of `string` fields that should be queried against. Multiple fields are separated with a comma. */
  query_by?: InputMaybe<Scalars['String']['input']>
  /** The relative weight to give each `query_by` field when ranking results. This can be used to boost fields in priority, when looking for matches. Multiple fields are separated with a comma. */
  query_by_weights?: InputMaybe<Scalars['String']['input']>
  /** Number of times to retry fetching remote embeddings. */
  remote_embedding_num_tries?: InputMaybe<Scalars['Int']['input']>
  /** Timeout (in milliseconds) for fetching remote embeddings. */
  remote_embedding_timeout_ms?: InputMaybe<Scalars['Int']['input']>
  /** When true, computes both text match and vector distance scores for all matches in hybrid search. Documents found only through keyword search will get a vector distance score, and documents found only through vector search will get a text match score. */
  rerank_hybrid_matches?: InputMaybe<Scalars['Boolean']['input']>
  /** Typesense will attempt to return results early if the cutoff time has elapsed. This is not a strict guarantee and facet computation is not bound by this parameter. */
  search_cutoff_ms?: InputMaybe<Scalars['Int']['input']>
  /** Field values under this length will be fully highlighted, instead of showing a snippet of relevant portion. Default: 30 */
  snippet_threshold?: InputMaybe<Scalars['Float']['input']>
  /** A list of numerical fields and their corresponding sort orders that will be used for ordering your results. Up to 3 sort fields can be specified. The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields. If no `sort_by` parameter is specified, results are sorted by `_text_match:desc,default_sorting_field:desc` */
  sort_by?: InputMaybe<Scalars['String']['input']>
  split_join_tokens?: InputMaybe<Typesense_OperationMode>
  /** Name of the stopwords set to apply for this search, the keywords present in the set will be removed from the search query. */
  stopwords?: InputMaybe<Scalars['String']['input']>
  /** Allow synonym resolution on typo-corrected words in the query. Default: 0 */
  synonym_num_typos?: InputMaybe<Scalars['Int']['input']>
  /** Allow synonym resolution on word prefixes in the query. Default: false */
  synonym_prefix?: InputMaybe<Scalars['Boolean']['input']>
  text_match_type?: InputMaybe<Typesense_MultiSearchRequestParamsTextMatchType>
  /** If the number of results found for a specific query is less than this number, Typesense will attempt to look for tokens with more typos until enough results are found. Default: 100 */
  typo_tokens_threshold?: InputMaybe<Scalars['Float']['input']>
  /** Enable server side caching of search query results. By default, caching is disabled. */
  use_cache?: InputMaybe<Scalars['Boolean']['input']>
  /** Vector query expression for fetching documents "closest" to a given query/document vector. */
  vector_query?: InputMaybe<Scalars['String']['input']>
  /** The base64 encoded audio file in 16 khz 16-bit WAV format. */
  voice_query?: InputMaybe<Scalars['String']['input']>
  /** A separate search API key for each search within a multi_search request */
  x_typesense_api_key?: InputMaybe<Scalars['String']['input']>
  x_typesense_user_id?: InputMaybe<Scalars['String']['input']>
}

/** JSON Schema for Typesense SearchResponse */
export type Typesense_SearchResponse = Typesense_SearchResponseError | Typesense_SearchResponseSuccess

export type Typesense_SearchResponseConversation = {
  __typename?: 'Typesense_SearchResponseConversation'
  answer: Scalars['String']['output']
  conversation_history: Typesense_SearchResponseConversationHistory
  conversation_id: Scalars['String']['output']
  query: Scalars['String']['output']
}

export type Typesense_SearchResponseConversationHistory = {
  __typename?: 'Typesense_SearchResponseConversationHistory'
  conversation: Array<Maybe<Scalars['JSON']['output']>>
  id: Scalars['String']['output']
  last_updated: Scalars['Int']['output']
  ttl: Scalars['Int']['output']
}

export type Typesense_SearchResponseError = {
  __typename?: 'Typesense_SearchResponseError'
  /** HTTP error code */
  code: Scalars['Int']['output']
  /** Error description */
  error: Scalars['String']['output']
}

export type Typesense_SearchResponseFacetCounts = {
  __typename?: 'Typesense_SearchResponseFacetCounts'
  counts: Array<Maybe<Typesense_SearchResponseFacetCountsItemCounts>>
  field_name: Scalars['String']['output']
  stats?: Maybe<Typesense_SearchResponseFacetCountsItemStats>
}

export type Typesense_SearchResponseFacetCountsItemCounts = {
  __typename?: 'Typesense_SearchResponseFacetCountsItemCounts'
  count: Scalars['Int']['output']
  highlighted: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type Typesense_SearchResponseFacetCountsItemStats = {
  __typename?: 'Typesense_SearchResponseFacetCountsItemStats'
  avg?: Maybe<Scalars['Float']['output']>
  max?: Maybe<Scalars['Float']['output']>
  min?: Maybe<Scalars['Float']['output']>
  sum?: Maybe<Scalars['Float']['output']>
}

export type Typesense_SearchResponseGeneratedParams = {
  __typename?: 'Typesense_SearchResponseGeneratedParams'
  filter_by?: Maybe<Scalars['String']['output']>
  q?: Maybe<Scalars['String']['output']>
  sort_by?: Maybe<Scalars['String']['output']>
}

export type Typesense_SearchResponseGroupedHit = {
  __typename?: 'Typesense_SearchResponseGroupedHit'
  found?: Maybe<Scalars['Int']['output']>
  group_key: Array<Maybe<Scalars['String']['output']>>
  /** The documents that matched the search query */
  hits: Array<Maybe<Typesense_SearchResponseHit>>
}

export type Typesense_SearchResponseHit = {
  __typename?: 'Typesense_SearchResponseHit'
  curated?: Maybe<Scalars['Boolean']['output']>
  document: Typesense_Document
  geo_distance_meters?: Maybe<Scalars['JSON']['output']>
  highlight: Scalars['JSON']['output']
  /** (Deprecated) Contains highlighted portions of the search fields */
  highlights?: Maybe<Array<Maybe<Typesense_SearchResponseHitHighlight>>>
  text_match?: Maybe<Scalars['Float']['output']>
  text_match_info?: Maybe<Typesense_SearchResponseTextMatchInfo>
  /** Distance between the query vector and matching document's vector value */
  vector_distance?: Maybe<Scalars['Float']['output']>
}

export type Typesense_SearchResponseHitHighlight = {
  __typename?: 'Typesense_SearchResponseHitHighlight'
  field: Scalars['String']['output']
  /** The indices property will be present only for string[] fields and will contain the corresponding indices of the snippets in the search field */
  indices?: Maybe<Array<Maybe<Scalars['Int']['output']>>>
  matched_tokens: Array<Maybe<Scalars['String']['output']>>
  /** Present only for (non-array) string fields */
  snippet?: Maybe<Scalars['String']['output']>
  /** Present only for (array) string[] fields */
  snippets?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** Full field value with highlighting, present only for (non-array) string fields */
  value?: Maybe<Scalars['String']['output']>
  /** Full field value with highlighting, present only for (array) string[] fields */
  values?: Maybe<Array<Maybe<Scalars['String']['output']>>>
}

export type Typesense_SearchResponseLlmResponse = {
  __typename?: 'Typesense_SearchResponseLLMResponse'
  content?: Maybe<Scalars['String']['output']>
  model?: Maybe<Scalars['String']['output']>
}

export type Typesense_SearchResponseParsedNlQuery = {
  __typename?: 'Typesense_SearchResponseParsedNLQuery'
  generated_params?: Maybe<Typesense_SearchResponseGeneratedParams>
  llm_response?: Maybe<Typesense_SearchResponseLlmResponse>
  parse_time_ms?: Maybe<Scalars['Int']['output']>
}

export type Typesense_SearchResponseRequestParams = {
  __typename?: 'Typesense_SearchResponseRequestParams'
  collection_name?: Maybe<Scalars['String']['output']>
  first_q?: Maybe<Scalars['String']['output']>
  page?: Maybe<Scalars['Int']['output']>
  per_page?: Maybe<Scalars['Int']['output']>
  q?: Maybe<Scalars['String']['output']>
  voice_query?: Maybe<Typesense_SearchResponseRequestParamsVoiceQuery>
}

export type Typesense_SearchResponseRequestParamsVoiceQuery = {
  __typename?: 'Typesense_SearchResponseRequestParamsVoiceQuery'
  transcribed_query?: Maybe<Scalars['String']['output']>
}

export type Typesense_SearchResponseSuccess = {
  __typename?: 'Typesense_SearchResponseSuccess'
  conversation?: Maybe<Typesense_SearchResponseConversation>
  facet_counts?: Maybe<Array<Maybe<Typesense_SearchResponseFacetCounts>>>
  /** The number of documents found */
  found: Scalars['Int']['output']
  found_docs?: Maybe<Scalars['Int']['output']>
  grouped_hits?: Maybe<Array<Maybe<Typesense_SearchResponseGroupedHit>>>
  /** The documents that matched the search query */
  hits?: Maybe<Array<Maybe<Typesense_SearchResponseHit>>>
  /** The total number of documents in the collection */
  out_of: Scalars['Int']['output']
  /** The search result page number */
  page: Scalars['Int']['output']
  parsed_nl_query?: Maybe<Typesense_SearchResponseParsedNlQuery>
  request_params: Typesense_SearchResponseRequestParams
  /** Whether the search was cut off */
  search_cutoff?: Maybe<Scalars['Boolean']['output']>
  /** The number of milliseconds the search took */
  search_time_ms: Scalars['Int']['output']
}

export type Typesense_SearchResponseTextMatchInfo = {
  __typename?: 'Typesense_SearchResponseTextMatchInfo'
  best_field_score: Scalars['Float']['output']
  best_field_weight: Scalars['Float']['output']
  fields_matched: Scalars['Int']['output']
  score: Scalars['Float']['output']
  tokens_matched: Scalars['Int']['output']
}

export type UpdateAppointmentInput = {
  appointmentId: Scalars['UUID']['input']
  description?: InputMaybe<Scalars['String']['input']>
  endDateTime?: InputMaybe<Scalars['String']['input']>
  geolocation?: InputMaybe<GeolocationPointInput>
  inviteOnly?: InputMaybe<Scalars['Boolean']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  locationDetails?: InputMaybe<LocationDetailsInput>
  participantIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  permission?: InputMaybe<PermissionType>
  startDateTime?: InputMaybe<Scalars['String']['input']>
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  videoCallInfo?: InputMaybe<Scalars['String']['input']>
  videoCallLink?: InputMaybe<Scalars['String']['input']>
}

export type UpdateAuthenticatedUserInput = {
  aboutMe?: InputMaybe<Scalars['String']['input']>
  avatar?: InputMaybe<Scalars['Upload']['input']>
  engagementLevel?: InputMaybe<Scalars['String']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  geolocation?: InputMaybe<Scalars['GeoJSONInput']['input']>
  interests?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  interestsV2?: InputMaybe<Array<Scalars['String']['input']>>
  lastName?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  pronouns?: InputMaybe<Scalars['String']['input']>
  sdgs?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skills?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  trackingConsentAdPartners?: InputMaybe<Scalars['Boolean']['input']>
  trackingConsentAnalytics?: InputMaybe<Scalars['Boolean']['input']>
  trackingConsentPersonalization?: InputMaybe<Scalars['Boolean']['input']>
}

export type UpdateCollaborationToolInput = {
  collectionType?: InputMaybe<CollectionType>
  description?: InputMaybe<Scalars['String']['input']>
  id: Scalars['UUID']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  url?: InputMaybe<Scalars['String']['input']>
}

export enum UpdateConnectionAction {
  Connect = 'CONNECT',
  Disconnect = 'DISCONNECT',
  GrantAdminAccess = 'GRANT_ADMIN_ACCESS',
  LeaveSpace = 'LEAVE_SPACE',
  RemoveMember = 'REMOVE_MEMBER',
  RevokeAdminAccess = 'REVOKE_ADMIN_ACCESS',
}

export type UpdateConnectionWithUserInput = {
  action: UpdateConnectionAction
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateExternalLinkInput = {
  id: Scalars['UUID']['input']
  name?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<ExternalLinkType>
  url?: InputMaybe<Scalars['String']['input']>
}

export type UpdateFeedPostInput = {
  aspectRatio?: InputMaybe<AspectRatio>
  categoryId?: InputMaybe<Scalars['UUID']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  existingImages?: InputMaybe<Array<InputMaybe<FeedPostImageMetadata>>>
  geolocation?: InputMaybe<GeolocationPointInput>
  image?: InputMaybe<Scalars['Upload']['input']>
  imageUrls?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  language?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  newImages?: InputMaybe<Array<InputMaybe<FeedPostImageInput>>>
  postId: Scalars['UUID']['input']
  title?: InputMaybe<Scalars['String']['input']>
  topicIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
  visibility?: InputMaybe<VisibilityLevel>
}

export type UpdatePostInput = {
  image?: InputMaybe<Scalars['Upload']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  postId: Scalars['UUID']['input']
  text?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  visibility?: InputMaybe<VisibilityType>
}

export type UpdateSpaceInput = {
  avatar?: InputMaybe<Scalars['Upload']['input']>
  contactDescription?: InputMaybe<Scalars['String']['input']>
  contactEmail?: InputMaybe<Scalars['String']['input']>
  contactPhone?: InputMaybe<Scalars['String']['input']>
  cover?: InputMaybe<Scalars['Upload']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  geolocation?: InputMaybe<GeolocationPointInput>
  id: Scalars['UUID']['input']
  location?: InputMaybe<Scalars['String']['input']>
  onboardingSteps?: InputMaybe<Array<InputMaybe<OnboardingStepInput>>>
  sdgs?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  title?: InputMaybe<Scalars['String']['input']>
  topics?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
}

export type UpdateTaskInput = {
  contactEmail: Scalars['String']['input']
  contactPhone?: InputMaybe<Scalars['String']['input']>
  description: Scalars['String']['input']
  duration?: InputMaybe<Duration>
  geolocation?: InputMaybe<GeolocationPointInput>
  impact?: InputMaybe<Scalars['String']['input']>
  interactionSignupLink?: InputMaybe<Scalars['String']['input']>
  interactionType?: InputMaybe<InteractionType>
  location?: InputMaybe<Scalars['String']['input']>
  locationType: LocationType
  name: Scalars['String']['input']
  regularity: Regularity
  skills?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  slotsAvailable?: InputMaybe<Scalars['Int']['input']>
  spaceId: Scalars['UUID']['input']
  taskId: Scalars['UUID']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
  timeframeEndDate?: InputMaybe<Scalars['String']['input']>
  timeframeStartDate?: InputMaybe<Scalars['String']['input']>
  visibility: VisibilityType
}

/**
 * Custom user model to change behaviour of the default user model
 * such as validation and required fields.
 */
export type User = {
  __typename?: 'User'
  aboutMe?: Maybe<Scalars['String']['output']>
  avatar?: Maybe<Scalars['String']['output']>
  avatarBlurhash?: Maybe<Scalars['String']['output']>
  avatarDefaultColor: Scalars['String']['output']
  avatarLabel: Scalars['String']['output']
  connectionStatusToMyself?: Maybe<UserConnectionStatus>
  connectionStatusToSpace: Array<Maybe<SpaceUserConnectionType>>
  engagementLevel?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  /** Can be an empty string */
  fullName: Scalars['String']['output']
  geolocationId?: Maybe<Scalars['String']['output']>
  /** Required. 36 characters or fewer. Letters, digits and _ only. */
  id: Scalars['UUID']['output']
  /** 255 characters or fewer. Must start with a lowercase letter and contain lowercase letters, digits, '_', '-' and '.' only. */
  identity?: Maybe<Scalars['String']['output']>
  /** @deprecated Deprecated since 1.52. Use interests_v2 instead. */
  interests: Array<Maybe<Topic>>
  interestsV2: Array<Maybe<Scalars['String']['output']>>
  lastName?: Maybe<Scalars['String']['output']>
  location?: Maybe<Scalars['String']['output']>
  pronouns?: Maybe<Scalars['String']['output']>
  role?: Maybe<UserRole>
  /** @deprecated Deprecated since 1.53. */
  sdgs: Array<Maybe<Sdg>>
  /** @deprecated Deprecated since 1.52. Use skills_v2 instead. */
  skills: Array<Maybe<Skill>>
  skillsV2: Array<Maybe<Scalars['String']['output']>>
}

/**
 * Custom user model to change behaviour of the default user model
 * such as validation and required fields.
 */
export type UserConnectionStatusToSpaceArgs = {
  spaceId: Scalars['UUID']['input']
}

export enum UserConnectionStatus {
  Connected = 'CONNECTED',
  NotConnected = 'NOT_CONNECTED',
  PendingConfirmation = 'PENDING_CONFIRMATION',
  Requested = 'REQUESTED',
}

/** UserFavorite(id, user, favoritable_id, favoritable_type, created_at) */
export type UserFavorite = {
  __typename?: 'UserFavorite'
  favoritable: InsightTaskExternalVolunteeringOpportunity
  favoritableId: Scalars['String']['output']
  favoritableType: Scalars['String']['output']
  id: Scalars['UUID']['output']
}

export type UserFavoritePaged = {
  __typename?: 'UserFavoritePaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<UserFavorite>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export type UserPaged = {
  __typename?: 'UserPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<User>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum UserRole {
  CommunityManager = 'COMMUNITY_MANAGER',
  CommunityTeam = 'COMMUNITY_TEAM',
  CoFounder = 'CO_FOUNDER',
  Editor = 'EDITOR',
  Internal = 'INTERNAL',
  Journalist = 'JOURNALIST',
  Moderator = 'MODERATOR',
  Regular = 'REGULAR',
}

export type ValidateSpaceInput = {
  cover?: InputMaybe<Scalars['Upload']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  sdgs?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  title?: InputMaybe<Scalars['String']['input']>
  topics?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  topicsV2?: InputMaybe<Array<Scalars['String']['input']>>
}

/** VideoCallLink(id, url, additional_info) */
export type VideoCallLink = {
  __typename?: 'VideoCallLink'
  additionalInfo?: Maybe<Scalars['String']['output']>
  id: Scalars['UUID']['output']
  url: Scalars['String']['output']
}

export enum VisibilityFilter {
  All = 'ALL',
  Members = 'MEMBERS',
  Public = 'PUBLIC',
}

export enum VisibilityLevel {
  Public = 'PUBLIC',
  RegisteredUsersOnly = 'REGISTERED_USERS_ONLY',
}

export enum VisibilityType {
  Members = 'MEMBERS',
  Public = 'PUBLIC',
}

/** VolunteeringOpportunityStatus(id, external_volunteering_opportunity_id, user, status, created_at, updated_at) */
export type VolunteeringOpportunityStatus = {
  __typename?: 'VolunteeringOpportunityStatus'
  externalVolunteeringOpportunityId: Scalars['String']['output']
  status: VolunteeringOpportunityStatusValue
}

export type VolunteeringOpportunityStatusPaged = {
  __typename?: 'VolunteeringOpportunityStatusPaged'
  /** The list of items in this pagination window. */
  data: Array<Maybe<VolunteeringOpportunityStatus>>
  /** Total number of items in the filtered dataset. */
  totalResults: Scalars['Int']['output']
}

export enum VolunteeringOpportunityStatusValue {
  Contacted = 'CONTACTED',
  Doing = 'DOING',
  Done = 'DONE',
  ToDo = 'TO_DO',
  WontDo = 'WONT_DO',
}

export type UserAvatarFragment = {
  __typename?: 'User'
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarLabel: string
  avatarDefaultColor: string
  firstName?: string
  fullName: string
}

export type FullUserAvatarFragment = {
  __typename?: 'User'
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarLabel: string
  avatarDefaultColor: string
  firstName?: string
  fullName: string
  role?: UserRole
}

export type FullAuthenticatedUserFragment = {
  __typename?: 'AuthenticatedUser'
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarDefaultColor: string
  avatarLabel: string
  fullName: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  role?: UserRole
  geolocationId?: string
  engagementLevel?: string
  interestsV2: Array<string>
  skillsV2: Array<string>
  connectionStatusToMyself?: UserConnectionStatus
  trackingConsentAnalytics?: boolean
  trackingConsentPersonalization?: boolean
  trackingConsentAdPartners?: boolean
  isEmployee: boolean
  email: string
  isOidc: boolean
}

export type PostFragmentFragment = {
  __typename: 'Post'
  id: string
  title?: string
  text?: string
  created: any
  modified: any
  numberOfComments: number
  isPublic: boolean
  language?: string
  creator: {
    __typename?: 'User'
    id: string
    identity?: string
    avatar?: string
    avatarBlurhash?: string
    avatarLabel: string
    avatarDefaultColor: string
    firstName?: string
    fullName: string
    role?: UserRole
  }
  commenters: {
    __typename?: 'UserPaged'
    totalResults: number
    data: Array<{
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
      role?: UserRole
    }>
  }
  space?: {
    __typename?: 'Space'
    id: string
    title: string
    name: string
    avatar?: string
    avatarBlurhash?: string
    avatarDefaultColor: string
    connectionStatusToMyself: Array<SpaceUserConnectionType>
  }
  image?: { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }
  links: Array<{
    __typename?: 'LinkPreview'
    requestedUrl: string
    url: string
    title: string
    description: string
    type: string
    image: string
    siteName: string
    origin: string
    icon?: string
  }>
  mentions: Array<{ __typename?: 'User'; id: string; fullName: string }>
  myReaction: { __typename?: 'ReactionCounts'; HEART: number }
  reactions: { __typename?: 'ReactionCounts'; HEART: number }
}

export type PostImageDataFragment = { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }

export type LinkFragmentFragment = {
  __typename?: 'LinkPreview'
  requestedUrl: string
  url: string
  title: string
  description: string
  type: string
  image: string
  siteName: string
  origin: string
  icon?: string
}

export type FavoriteInsightFragment = {
  __typename: 'Insight'
  id: string
  title: string
  description: string
  datePublished: any
  headerImage?: string
  headerImageBlurhash?: string
  isFavorite: boolean
  initiatives: Array<{ __typename?: 'Initiative'; link: string }>
  creator: { __typename?: 'User'; fullName: string; avatar?: string }
}

export type FavoriteTaskFragment = { __typename: 'Task'; id: string }

export type FavoriteExternalVolunteeringOpportunityFragment = {
  __typename: 'ExternalVolunteeringOpportunity'
  externalId: string
}

export type FavoriteMutationVariables = Exact<{
  favoritableId: Scalars['UUID']['input']
  favoritableType: FavoritableType
}>

export type FavoriteMutation = { __typename?: 'Mutation'; favorite: { __typename?: 'Result'; success: boolean } }

export type UnfavoriteMutationVariables = Exact<{
  favoritableId: Scalars['UUID']['input']
  favoritableType: FavoritableType
}>

export type UnfavoriteMutation = { __typename?: 'Mutation'; unfavorite: { __typename?: 'Result'; success: boolean } }

export type FavoriteV2MutationVariables = Exact<{
  favoritableId: Scalars['String']['input']
  favoritableType: FavoritableType
}>

export type FavoriteV2Mutation = { __typename?: 'Mutation'; favoriteV2: { __typename?: 'Result'; success: boolean } }

export type UnfavoriteV2MutationVariables = Exact<{
  favoritableId: Scalars['String']['input']
  favoritableType: FavoritableType
}>

export type UnfavoriteV2Mutation = {
  __typename?: 'Mutation'
  unfavoriteV2: { __typename?: 'Result'; success: boolean }
}

export type FavoriteExternalVolunteeringOpportunityQueryVariables = Exact<{
  favoritableId: Scalars['String']['input']
}>

export type FavoriteExternalVolunteeringOpportunityQuery = {
  __typename?: 'Query'
  favorite: {
    __typename?: 'UserFavorite'
    id: string
    favoritableId: string
    favoritableType: string
    favoritable:
      | { __typename: 'ExternalVolunteeringOpportunity'; externalId: string }
      | { __typename?: 'Insight' }
      | { __typename?: 'Task' }
  }
}

export type FavoriteByFavoritableIdQueryVariables = Exact<{
  favoritableId: Scalars['String']['input']
}>

export type FavoriteByFavoritableIdQuery = {
  __typename?: 'Query'
  favorite: {
    __typename?: 'UserFavorite'
    id: string
    favoritableId: string
    favoritableType: string
    favoritable:
      | { __typename: 'ExternalVolunteeringOpportunity'; externalId: string }
      | {
          __typename: 'Insight'
          id: string
          title: string
          description: string
          datePublished: any
          headerImage?: string
          headerImageBlurhash?: string
          isFavorite: boolean
          initiatives: Array<{ __typename?: 'Initiative'; link: string }>
          creator: { __typename?: 'User'; fullName: string; avatar?: string }
        }
      | { __typename: 'Task'; id: string }
  }
}

export type FavoritesQueryVariables = Exact<{
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type FavoritesQuery = {
  __typename?: 'Query'
  favorites: {
    __typename?: 'UserFavoritePaged'
    totalResults: number
    data: Array<{
      __typename?: 'UserFavorite'
      id: string
      favoritableId: string
      favoritableType: string
      favoritable:
        | { __typename: 'ExternalVolunteeringOpportunity'; externalId: string }
        | {
            __typename: 'Insight'
            id: string
            title: string
            description: string
            datePublished: any
            headerImage?: string
            headerImageBlurhash?: string
            isFavorite: boolean
            initiatives: Array<{ __typename?: 'Initiative'; link: string }>
            creator: { __typename?: 'User'; fullName: string; avatar?: string }
          }
        | { __typename: 'Task'; id: string }
    }>
  }
}

export type GetRewardsCounterQueryVariables = Exact<{ [key: string]: never }>

export type GetRewardsCounterQuery = {
  __typename?: 'Query'
  rewards_counter: { __typename?: 'Rewards_RewardsCounter'; counter?: number }
}

export type SpaceCardFragment = {
  __typename?: 'Space'
  title: string
  name: string
  description?: string
  location?: string
  id: string
  cover?: string
  members: {
    __typename?: 'SpaceMemberPaged'
    totalResults: number
    data: Array<{
      __typename?: 'SpaceMember'
      user: {
        __typename?: 'User'
        id: string
        avatar?: string
        avatarLabel: string
        avatarDefaultColor: string
        avatarBlurhash?: string
        fullName: string
      }
    }>
  }
}

export type SpaceMemberPermissionsFragment = {
  __typename?: 'User'
  aboutMe?: string
  pronouns?: string
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarLabel: string
  avatarDefaultColor: string
  firstName?: string
  fullName: string
}

export type SpaceMemberListFragment = {
  __typename?: 'SpaceMemberPaged'
  totalResults: number
  data: Array<{
    __typename?: 'SpaceMember'
    id: string
    isAdministrator: boolean
    user: {
      __typename?: 'User'
      aboutMe?: string
      pronouns?: string
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
  }>
}

export type SpaceMembershipRequestListFragment = {
  __typename?: 'SpaceMembershipRequestPaged'
  totalResults: number
  data: Array<{
    __typename?: 'SpaceMembershipRequest'
    id: string
    message?: string
    user: {
      __typename?: 'User'
      aboutMe?: string
      pronouns?: string
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
  }>
}

export type SpaceInviteListFragment = {
  __typename?: 'SpaceInvitePaged'
  totalResults: number
  data: Array<{
    __typename?: 'SpaceInvite'
    id: string
    invitedUser: {
      __typename?: 'User'
      aboutMe?: string
      pronouns?: string
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
  }>
}

export type FullTaskFragment = {
  __typename?: 'Task'
  id: string
  name: string
  description: string
  impact?: string
  slotsAvailable: number
  slotsTaken: number
  location?: string
  visibility: VisibilityType
  locationType: LocationType
  interactionType?: InteractionType
  contactEmail: string
  contactPhone?: string
  thumbnail?: string
  thumbnailBlurhash?: string
  regularity: Regularity
  duration?: Duration
  timeframeEndDate?: any
  timeframeStartDate?: any
  totalCompletions: number
  skillsV2: Array<string>
  interactionSignupLink?: string
  geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
  creator: {
    __typename?: 'User'
    id: string
    identity?: string
    avatar?: string
    avatarBlurhash?: string
    avatarLabel: string
    avatarDefaultColor: string
    firstName?: string
    fullName: string
  }
}

export type RelatedSpaceFragment = {
  __typename?: 'Space'
  id: string
  title: string
  location?: string
  description?: string
  cover?: string
  coverBlurhash?: string
  name: string
  avatar?: string
  avatarDefaultColor: string
  members: {
    __typename?: 'SpaceMemberPaged'
    totalResults: number
    data: Array<{
      __typename?: 'SpaceMember'
      user: {
        __typename?: 'User'
        identity?: string
        id: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }>
  }
}

export type FullSpaceFragment = {
  __typename?: 'Space'
  id: string
  title: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  contactDescription?: string
  created: any
  avatar?: string
  avatarBlurhash?: string
  cover?: string
  coverBlurhash?: string
  name: string
  avatarDefaultColor: string
  location?: string
  hasPublicPosts: boolean
  hasPrivatePosts: boolean
  connectionStatusToMyself: Array<SpaceUserConnectionType>
  topicsV2: Array<string>
  creator?: {
    __typename?: 'User'
    id: string
    identity?: string
    avatar?: string
    avatarBlurhash?: string
    avatarLabel: string
    avatarDefaultColor: string
    firstName?: string
    fullName: string
  }
  geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
  links: Array<{ __typename?: 'ExternalLink'; id: string; type: ExternalLinkType; url: string; name: string }>
  collaborationTools: Array<{
    __typename?: 'CollaborationTool'
    id: string
    domain: string
    url: string
    description?: string
    title: string
    collectionType: CollectionType
    thumbnail?: string
    thumbnailBlurhash?: string
  }>
  members: {
    __typename?: 'SpaceMemberPaged'
    totalResults: number
    data: Array<{
      __typename?: 'SpaceMember'
      id: string
      isAdministrator: boolean
      user: {
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }>
  }
  membershipRequests: { __typename?: 'SpaceMembershipRequestPaged'; totalResults: number }
  tasks: Array<{
    __typename?: 'Task'
    id: string
    name: string
    description: string
    impact?: string
    slotsAvailable: number
    slotsTaken: number
    location?: string
    visibility: VisibilityType
    locationType: LocationType
    interactionType?: InteractionType
    contactEmail: string
    contactPhone?: string
    thumbnail?: string
    thumbnailBlurhash?: string
    regularity: Regularity
    duration?: Duration
    timeframeEndDate?: any
    timeframeStartDate?: any
    totalCompletions: number
    skillsV2: Array<string>
    interactionSignupLink?: string
    geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
    creator: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
  }>
  onboarding?: { __typename?: 'Onboarding'; steps: Array<{ __typename?: 'OnboardingStep'; text?: string }> }
  parentSpace?: {
    __typename?: 'Space'
    id: string
    title: string
    location?: string
    description?: string
    cover?: string
    coverBlurhash?: string
    name: string
    avatar?: string
    avatarDefaultColor: string
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMember'
        user: {
          __typename?: 'User'
          identity?: string
          id: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
  }
  childSpaces: {
    __typename?: 'SpacePaged'
    totalResults: number
    data: Array<{
      __typename?: 'Space'
      id: string
      title: string
      location?: string
      description?: string
      cover?: string
      coverBlurhash?: string
      name: string
      avatar?: string
      avatarDefaultColor: string
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            identity?: string
            id: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }>
  }
}

export type SpaceOverviewFragment = {
  __typename?: 'Space'
  id: string
  title: string
  description?: string
  cover?: string
  coverBlurhash?: string
  location?: string
  avatar?: string
  avatarBlurhash?: string
  avatarDefaultColor: string
  name: string
  creator?: { __typename?: 'User'; id: string }
  members: {
    __typename?: 'SpaceMemberPaged'
    totalResults: number
    data: Array<{
      __typename?: 'SpaceMember'
      user: {
        __typename?: 'User'
        identity?: string
        id: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }>
  }
}

export type MemberSpacesFragment = {
  __typename?: 'SpacePaged'
  totalResults: number
  data: Array<{
    __typename?: 'Space'
    id: string
    title: string
    avatar?: string
    avatarBlurhash?: string
    avatarDefaultColor: string
    cover?: string
    coverBlurhash?: string
    name: string
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMember'
        user: {
          __typename?: 'User'
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
  }>
}

export type ValidateSpaceMutationVariables = Exact<{
  input: ValidateSpaceInput
}>

export type ValidateSpaceMutation = {
  __typename?: 'Mutation'
  validateSpace: { __typename?: 'Result'; success: boolean }
}

export type CreateSpaceMutationVariables = Exact<{
  input: CreateSpaceInput
}>

export type CreateSpaceMutation = {
  __typename?: 'Mutation'
  createSpace: {
    __typename?: 'Space'
    id: string
    title: string
    description?: string
    contactEmail?: string
    contactPhone?: string
    contactDescription?: string
    created: any
    avatar?: string
    avatarBlurhash?: string
    cover?: string
    coverBlurhash?: string
    name: string
    avatarDefaultColor: string
    location?: string
    hasPublicPosts: boolean
    hasPrivatePosts: boolean
    connectionStatusToMyself: Array<SpaceUserConnectionType>
    topicsV2: Array<string>
    creator?: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
    geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
    links: Array<{ __typename?: 'ExternalLink'; id: string; type: ExternalLinkType; url: string; name: string }>
    collaborationTools: Array<{
      __typename?: 'CollaborationTool'
      id: string
      domain: string
      url: string
      description?: string
      title: string
      collectionType: CollectionType
      thumbnail?: string
      thumbnailBlurhash?: string
    }>
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMember'
        id: string
        isAdministrator: boolean
        user: {
          __typename?: 'User'
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
    membershipRequests: { __typename?: 'SpaceMembershipRequestPaged'; totalResults: number }
    tasks: Array<{
      __typename?: 'Task'
      id: string
      name: string
      description: string
      impact?: string
      slotsAvailable: number
      slotsTaken: number
      location?: string
      visibility: VisibilityType
      locationType: LocationType
      interactionType?: InteractionType
      contactEmail: string
      contactPhone?: string
      thumbnail?: string
      thumbnailBlurhash?: string
      regularity: Regularity
      duration?: Duration
      timeframeEndDate?: any
      timeframeStartDate?: any
      totalCompletions: number
      skillsV2: Array<string>
      interactionSignupLink?: string
      geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
      creator: {
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }>
    onboarding?: { __typename?: 'Onboarding'; steps: Array<{ __typename?: 'OnboardingStep'; text?: string }> }
    parentSpace?: {
      __typename?: 'Space'
      id: string
      title: string
      location?: string
      description?: string
      cover?: string
      coverBlurhash?: string
      name: string
      avatar?: string
      avatarDefaultColor: string
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            identity?: string
            id: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }
    childSpaces: {
      __typename?: 'SpacePaged'
      totalResults: number
      data: Array<{
        __typename?: 'Space'
        id: string
        title: string
        location?: string
        description?: string
        cover?: string
        coverBlurhash?: string
        name: string
        avatar?: string
        avatarDefaultColor: string
        members: {
          __typename?: 'SpaceMemberPaged'
          totalResults: number
          data: Array<{
            __typename?: 'SpaceMember'
            user: {
              __typename?: 'User'
              identity?: string
              id: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
            }
          }>
        }
      }>
    }
  }
}

export type AddExternalLinkMutationVariables = Exact<{
  input: AddExternalLinkInput
}>

export type AddExternalLinkMutation = {
  __typename?: 'Mutation'
  addExternalLink: { __typename?: 'ExternalLink'; id: string; type: ExternalLinkType; url: string; name: string }
}

export type DeleteSpaceMutationVariables = Exact<{
  id: Scalars['UUID']['input']
}>

export type DeleteSpaceMutation = { __typename?: 'Mutation'; deleteSpace: { __typename?: 'Result'; success: boolean } }

export type UpdateSpaceUserConnectionMutationVariables = Exact<{
  connectAction: UpdateConnectionAction
  connectionType: SpaceUserConnectionType
  spaceId: Scalars['UUID']['input']
  userId?: InputMaybe<Scalars['UUID']['input']>
  message?: InputMaybe<Scalars['String']['input']>
}>

export type UpdateSpaceUserConnectionMutation = {
  __typename?: 'Mutation'
  updateSpaceUserConnection: {
    __typename?: 'Space'
    id: string
    connectionStatusToMyself: Array<SpaceUserConnectionType>
  }
}

export type InviteToSpaceByEmailMutationVariables = Exact<{
  email: Scalars['String']['input']
  spaceId: Scalars['UUID']['input']
}>

export type InviteToSpaceByEmailMutation = {
  __typename?: 'Mutation'
  inviteToSpaceByEmail: { __typename?: 'Result'; success: boolean }
}

export type CreateSpacePostMutationVariables = Exact<{
  input: CreatePostInput
}>

export type CreateSpacePostMutation = {
  __typename?: 'Mutation'
  createSpacePost2: {
    __typename: 'Post'
    id: string
    title?: string
    text?: string
    created: any
    modified: any
    numberOfComments: number
    isPublic: boolean
    language?: string
    space?: {
      __typename?: 'Space'
      id: string
      title: string
      name: string
      avatar?: string
      avatarBlurhash?: string
      avatarDefaultColor: string
      connectionStatusToMyself: Array<SpaceUserConnectionType>
      posts: {
        __typename?: 'PostPaged'
        data: Array<{
          __typename: 'Post'
          id: string
          title?: string
          text?: string
          created: any
          modified: any
          numberOfComments: number
          isPublic: boolean
          language?: string
          creator: {
            __typename?: 'User'
            id: string
            identity?: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
            role?: UserRole
          }
          commenters: {
            __typename?: 'UserPaged'
            totalResults: number
            data: Array<{
              __typename?: 'User'
              id: string
              identity?: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
              role?: UserRole
            }>
          }
          space?: {
            __typename?: 'Space'
            id: string
            title: string
            name: string
            avatar?: string
            avatarBlurhash?: string
            avatarDefaultColor: string
            connectionStatusToMyself: Array<SpaceUserConnectionType>
          }
          image?: { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }
          links: Array<{
            __typename?: 'LinkPreview'
            requestedUrl: string
            url: string
            title: string
            description: string
            type: string
            image: string
            siteName: string
            origin: string
            icon?: string
          }>
          mentions: Array<{ __typename?: 'User'; id: string; fullName: string }>
          myReaction: { __typename?: 'ReactionCounts'; HEART: number }
          reactions: { __typename?: 'ReactionCounts'; HEART: number }
        }>
      }
    }
    creator: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
      role?: UserRole
    }
    commenters: {
      __typename?: 'UserPaged'
      totalResults: number
      data: Array<{
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
        role?: UserRole
      }>
    }
    image?: { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }
    links: Array<{
      __typename?: 'LinkPreview'
      requestedUrl: string
      url: string
      title: string
      description: string
      type: string
      image: string
      siteName: string
      origin: string
      icon?: string
    }>
    mentions: Array<{ __typename?: 'User'; id: string; fullName: string }>
    myReaction: { __typename?: 'ReactionCounts'; HEART: number }
    reactions: { __typename?: 'ReactionCounts'; HEART: number }
  }
}

export type UpdateSpacePostMutationVariables = Exact<{
  input: UpdatePostInput
}>

export type UpdateSpacePostMutation = {
  __typename?: 'Mutation'
  updateSpacePost: {
    __typename: 'Post'
    id: string
    title?: string
    text?: string
    created: any
    modified: any
    numberOfComments: number
    isPublic: boolean
    language?: string
    creator: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
      role?: UserRole
    }
    commenters: {
      __typename?: 'UserPaged'
      totalResults: number
      data: Array<{
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
        role?: UserRole
      }>
    }
    space?: {
      __typename?: 'Space'
      id: string
      title: string
      name: string
      avatar?: string
      avatarBlurhash?: string
      avatarDefaultColor: string
      connectionStatusToMyself: Array<SpaceUserConnectionType>
    }
    image?: { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }
    links: Array<{
      __typename?: 'LinkPreview'
      requestedUrl: string
      url: string
      title: string
      description: string
      type: string
      image: string
      siteName: string
      origin: string
      icon?: string
    }>
    mentions: Array<{ __typename?: 'User'; id: string; fullName: string }>
    myReaction: { __typename?: 'ReactionCounts'; HEART: number }
    reactions: { __typename?: 'ReactionCounts'; HEART: number }
  }
}

export type DeleteSpacePostMutationVariables = Exact<{
  id: Scalars['UUID']['input']
}>

export type DeleteSpacePostMutation = { __typename?: 'Mutation'; deleteSpacePost: { __typename?: 'Space'; id: string } }

export type CompleteReadyToGoTaskMutationVariables = Exact<{
  id: Scalars['UUID']['input']
}>

export type CompleteReadyToGoTaskMutation = {
  __typename?: 'Mutation'
  completeReadyToGoTask: {
    __typename?: 'CompletedTask'
    id: string
    completedAt: any
    task: {
      __typename?: 'Task'
      id: string
      name: string
      description: string
      impact?: string
      slotsAvailable: number
      slotsTaken: number
      location?: string
      visibility: VisibilityType
      locationType: LocationType
      interactionType?: InteractionType
      contactEmail: string
      contactPhone?: string
      thumbnail?: string
      thumbnailBlurhash?: string
      regularity: Regularity
      duration?: Duration
      timeframeEndDate?: any
      timeframeStartDate?: any
      totalCompletions: number
      skillsV2: Array<string>
      interactionSignupLink?: string
      geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
      creator: {
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }
    user: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
  }
}

export type SpaceByIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
}>

export type SpaceByIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    title: string
    description?: string
    contactEmail?: string
    contactPhone?: string
    contactDescription?: string
    created: any
    avatar?: string
    avatarBlurhash?: string
    cover?: string
    coverBlurhash?: string
    name: string
    avatarDefaultColor: string
    location?: string
    hasPublicPosts: boolean
    hasPrivatePosts: boolean
    connectionStatusToMyself: Array<SpaceUserConnectionType>
    topicsV2: Array<string>
    creator?: {
      __typename?: 'User'
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }
    geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
    links: Array<{ __typename?: 'ExternalLink'; id: string; type: ExternalLinkType; url: string; name: string }>
    collaborationTools: Array<{
      __typename?: 'CollaborationTool'
      id: string
      domain: string
      url: string
      description?: string
      title: string
      collectionType: CollectionType
      thumbnail?: string
      thumbnailBlurhash?: string
    }>
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMember'
        id: string
        isAdministrator: boolean
        user: {
          __typename?: 'User'
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
    membershipRequests: { __typename?: 'SpaceMembershipRequestPaged'; totalResults: number }
    tasks: Array<{
      __typename?: 'Task'
      id: string
      name: string
      description: string
      impact?: string
      slotsAvailable: number
      slotsTaken: number
      location?: string
      visibility: VisibilityType
      locationType: LocationType
      interactionType?: InteractionType
      contactEmail: string
      contactPhone?: string
      thumbnail?: string
      thumbnailBlurhash?: string
      regularity: Regularity
      duration?: Duration
      timeframeEndDate?: any
      timeframeStartDate?: any
      totalCompletions: number
      skillsV2: Array<string>
      interactionSignupLink?: string
      geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
      creator: {
        __typename?: 'User'
        id: string
        identity?: string
        avatar?: string
        avatarBlurhash?: string
        avatarLabel: string
        avatarDefaultColor: string
        firstName?: string
        fullName: string
      }
    }>
    onboarding?: { __typename?: 'Onboarding'; steps: Array<{ __typename?: 'OnboardingStep'; text?: string }> }
    parentSpace?: {
      __typename?: 'Space'
      id: string
      title: string
      location?: string
      description?: string
      cover?: string
      coverBlurhash?: string
      name: string
      avatar?: string
      avatarDefaultColor: string
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            identity?: string
            id: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }
    childSpaces: {
      __typename?: 'SpacePaged'
      totalResults: number
      data: Array<{
        __typename?: 'Space'
        id: string
        title: string
        location?: string
        description?: string
        cover?: string
        coverBlurhash?: string
        name: string
        avatar?: string
        avatarDefaultColor: string
        members: {
          __typename?: 'SpaceMemberPaged'
          totalResults: number
          data: Array<{
            __typename?: 'SpaceMember'
            user: {
              __typename?: 'User'
              identity?: string
              id: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
            }
          }>
        }
      }>
    }
  }
}

export type SpaceConnectionStatusToMyselfByIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
}>

export type SpaceConnectionStatusToMyselfByIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    name: string
    connectionStatusToMyself: Array<SpaceUserConnectionType>
  }
}

export type SpaceRealatedSpacesQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type SpaceRealatedSpacesQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    name: string
    title: string
    parentSpace?: {
      __typename?: 'Space'
      id: string
      title: string
      location?: string
      description?: string
      cover?: string
      coverBlurhash?: string
      name: string
      avatar?: string
      avatarDefaultColor: string
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            identity?: string
            id: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }
    childSpaces: {
      __typename?: 'SpacePaged'
      totalResults: number
      data: Array<{
        __typename?: 'Space'
        id: string
        title: string
        location?: string
        description?: string
        cover?: string
        coverBlurhash?: string
        name: string
        avatar?: string
        avatarDefaultColor: string
        members: {
          __typename?: 'SpaceMemberPaged'
          totalResults: number
          data: Array<{
            __typename?: 'SpaceMember'
            user: {
              __typename?: 'User'
              identity?: string
              id: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
            }
          }>
        }
      }>
    }
  }
}

export type SpaceMembershipByIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
}>

export type SpaceMembershipByIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    name: string
    connectionStatusToMyself: Array<SpaceUserConnectionType>
    membershipRequests: { __typename?: 'SpaceMembershipRequestPaged'; totalResults: number }
  }
}

export type RepresentativeBySpaceIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
}>

export type RepresentativeBySpaceIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    connectionStatusToMyself: Array<SpaceUserConnectionType>
    representatives: Array<{ __typename?: 'SpaceMember'; user: { __typename?: 'User'; id: string; identity?: string } }>
  }
}

export type SpaceMembershiByIdAllMembersQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
}>

export type SpaceMembershiByIdAllMembersQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    name: string
    connectionStatusToMyself: Array<SpaceUserConnectionType>
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{ __typename?: 'SpaceMember'; user: { __typename?: 'User'; id: string } }>
    }
  }
}

export type SpacesByMemberQueryVariables = Exact<{
  memberId?: InputMaybe<Scalars['UUID']['input']>
}>

export type SpacesByMemberQuery = {
  __typename?: 'Query'
  spaces: {
    __typename?: 'SpacePaged'
    totalResults: number
    data: Array<{
      __typename?: 'Space'
      id: string
      title: string
      avatar?: string
      avatarBlurhash?: string
      avatarDefaultColor: string
      cover?: string
      coverBlurhash?: string
      name: string
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            id: string
            identity?: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }>
  }
}

export type SpaceMembersBySpaceIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type SpaceMembersBySpaceIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    members: {
      __typename?: 'SpaceMemberPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMember'
        id: string
        isAdministrator: boolean
        user: {
          __typename?: 'User'
          aboutMe?: string
          pronouns?: string
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
  }
}

export type SpaceMembershipRequestsBySpaceIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type SpaceMembershipRequestsBySpaceIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    membershipRequests: {
      __typename?: 'SpaceMembershipRequestPaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceMembershipRequest'
        id: string
        message?: string
        user: {
          __typename?: 'User'
          aboutMe?: string
          pronouns?: string
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
  }
}

export type SpaceInvitesBySpaceIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type SpaceInvitesBySpaceIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    invites: {
      __typename?: 'SpaceInvitePaged'
      totalResults: number
      data: Array<{
        __typename?: 'SpaceInvite'
        id: string
        invitedUser: {
          __typename?: 'User'
          aboutMe?: string
          pronouns?: string
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
        }
      }>
    }
  }
}

export type UsersByNameWithSpaceConnectionQueryVariables = Exact<{
  substring: Scalars['String']['input']
  spaceId: Scalars['UUID']['input']
  limit: Scalars['Int']['input']
  offset: Scalars['Int']['input']
}>

export type UsersByNameWithSpaceConnectionQuery = {
  __typename?: 'Query'
  userByName: {
    __typename?: 'UserPaged'
    totalResults: number
    data: Array<{
      __typename?: 'User'
      connectionStatusToMyself?: UserConnectionStatus
      connectionStatusToSpace: Array<SpaceUserConnectionType>
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }>
  }
}

export type ConnectedUsersWithSpaceConnectionQueryVariables = Exact<{
  spaceId: Scalars['UUID']['input']
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type ConnectedUsersWithSpaceConnectionQuery = {
  __typename?: 'Query'
  connectedUsers: {
    __typename?: 'UserPaged'
    totalResults: number
    data: Array<{
      __typename?: 'User'
      connectionStatusToSpace: Array<SpaceUserConnectionType>
      connectionStatusToMyself?: UserConnectionStatus
      id: string
      identity?: string
      avatar?: string
      avatarBlurhash?: string
      avatarLabel: string
      avatarDefaultColor: string
      firstName?: string
      fullName: string
    }>
  }
}

export type SpacePostsBySpaceIdQueryVariables = Exact<{
  idOrName: Scalars['String']['input']
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
  visibility: VisibilityFilter
}>

export type SpacePostsBySpaceIdQuery = {
  __typename?: 'Query'
  spaceById?: {
    __typename?: 'Space'
    id: string
    hasPublicPosts: boolean
    hasPrivatePosts: boolean
    posts: {
      __typename?: 'PostPaged'
      totalResults: number
      data: Array<{
        __typename: 'Post'
        id: string
        title?: string
        text?: string
        created: any
        modified: any
        numberOfComments: number
        isPublic: boolean
        language?: string
        creator: {
          __typename?: 'User'
          id: string
          identity?: string
          avatar?: string
          avatarBlurhash?: string
          avatarLabel: string
          avatarDefaultColor: string
          firstName?: string
          fullName: string
          role?: UserRole
        }
        commenters: {
          __typename?: 'UserPaged'
          totalResults: number
          data: Array<{
            __typename?: 'User'
            id: string
            identity?: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
            role?: UserRole
          }>
        }
        space?: {
          __typename?: 'Space'
          id: string
          title: string
          name: string
          avatar?: string
          avatarBlurhash?: string
          avatarDefaultColor: string
          connectionStatusToMyself: Array<SpaceUserConnectionType>
        }
        image?: { __typename?: 'PostImage'; id: string; url: string; height: number; width: number }
        links: Array<{
          __typename?: 'LinkPreview'
          requestedUrl: string
          url: string
          title: string
          description: string
          type: string
          image: string
          siteName: string
          origin: string
          icon?: string
        }>
        mentions: Array<{ __typename?: 'User'; id: string; fullName: string }>
        myReaction: { __typename?: 'ReactionCounts'; HEART: number }
        reactions: { __typename?: 'ReactionCounts'; HEART: number }
      }>
    }
  }
}

export type DiscoverSpacesQueryVariables = Exact<{
  topicsV2?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type DiscoverSpacesQuery = {
  __typename?: 'Query'
  discoverSpaces: Array<{
    __typename?: 'DiscoverSpaces'
    topicV2?: string
    locationId?: string
    skillV2?: string
    spaces: {
      __typename?: 'SpacePaged'
      totalResults: number
      data: Array<{
        __typename?: 'Space'
        id: string
        title: string
        description?: string
        cover?: string
        coverBlurhash?: string
        location?: string
        avatar?: string
        avatarBlurhash?: string
        avatarDefaultColor: string
        name: string
        creator?: { __typename?: 'User'; id: string }
        members: {
          __typename?: 'SpaceMemberPaged'
          totalResults: number
          data: Array<{
            __typename?: 'SpaceMember'
            user: {
              __typename?: 'User'
              identity?: string
              id: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
            }
          }>
        }
      }>
    }
  }>
}

export type MySpacesQueryVariables = Exact<{ [key: string]: never }>

export type MySpacesQuery = {
  __typename?: 'Query'
  mySpaces: Array<{
    __typename?: 'MySpaces'
    section: string
    type: SpaceUserConnectionType
    spaces: {
      __typename?: 'SpacePaged'
      totalResults: number
      data: Array<{
        __typename?: 'Space'
        id: string
        title: string
        description?: string
        cover?: string
        coverBlurhash?: string
        location?: string
        avatar?: string
        avatarBlurhash?: string
        avatarDefaultColor: string
        name: string
        creator?: { __typename?: 'User'; id: string }
        members: {
          __typename?: 'SpaceMemberPaged'
          totalResults: number
          data: Array<{
            __typename?: 'SpaceMember'
            user: {
              __typename?: 'User'
              identity?: string
              id: string
              avatar?: string
              avatarBlurhash?: string
              avatarLabel: string
              avatarDefaultColor: string
              firstName?: string
              fullName: string
            }
          }>
        }
      }>
    }
  }>
}

export type SpacesQueryVariables = Exact<{
  topicsV2?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
  offset?: Scalars['Int']['input']
  limit?: Scalars['Int']['input']
}>

export type SpacesQuery = {
  __typename?: 'Query'
  spaces: {
    __typename?: 'SpacePaged'
    totalResults: number
    data: Array<{
      __typename?: 'Space'
      id: string
      title: string
      description?: string
      cover?: string
      coverBlurhash?: string
      location?: string
      avatar?: string
      avatarBlurhash?: string
      avatarDefaultColor: string
      name: string
      creator?: { __typename?: 'User'; id: string }
      members: {
        __typename?: 'SpaceMemberPaged'
        totalResults: number
        data: Array<{
          __typename?: 'SpaceMember'
          user: {
            __typename?: 'User'
            identity?: string
            id: string
            avatar?: string
            avatarBlurhash?: string
            avatarLabel: string
            avatarDefaultColor: string
            firstName?: string
            fullName: string
          }
        }>
      }
    }>
  }
}

export type DiscoverSpacesDefaultTopicsQueryVariables = Exact<{ [key: string]: never }>

export type DiscoverSpacesDefaultTopicsQuery = { __typename?: 'Query'; discoverSpacesDefaultTopicsV2: Array<string> }

export type TaskByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input']
}>

export type TaskByIdQuery = {
  __typename?: 'Query'
  taskById?: {
    __typename?: 'Task'
    id: string
    name: string
    description: string
    impact?: string
    slotsAvailable: number
    slotsTaken: number
    location?: string
    regularity: Regularity
    duration?: Duration
    timeframeStartDate?: any
    timeframeEndDate?: any
    visibility: VisibilityType
    isFavorite: boolean
    locationType: LocationType
    interactionType?: InteractionType
    contactEmail: string
    contactPhone?: string
    thumbnail?: string
    thumbnailBlurhash?: string
    totalCompletions: number
    created: any
    skillsV2: Array<string>
    interactionSignupLink?: string
    creator: { __typename?: 'User'; id: string; avatar?: string; avatarBlurhash?: string; fullName: string }
    space: {
      __typename?: 'Space'
      id: string
      connectionStatusToMyself: Array<SpaceUserConnectionType>
      name: string
      title: string
      avatar?: string
      avatarBlurhash?: string
      topicsV2: Array<string>
    }
    geolocation?: { __typename?: 'GeolocationPoint'; latitude: number; longitude: number }
  }
}

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput
}>

export type CreateTaskMutation = {
  __typename?: 'Mutation'
  createTask: {
    __typename?: 'Task'
    id: string
    name: string
    description: string
    impact?: string
    visibility: VisibilityType
    regularity: Regularity
    duration?: Duration
    timeframeStartDate?: any
    timeframeEndDate?: any
    locationType: LocationType
    location?: string
    contactEmail: string
    contactPhone?: string
    interactionType?: InteractionType
    interactionSignupLink?: string
  }
}

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput
}>

export type UpdateTaskMutation = {
  __typename?: 'Mutation'
  updateTask: {
    __typename?: 'Task'
    id: string
    name: string
    description: string
    impact?: string
    visibility: VisibilityType
    regularity: Regularity
    duration?: Duration
    timeframeStartDate?: any
    timeframeEndDate?: any
    locationType: LocationType
    location?: string
    contactEmail: string
    contactPhone?: string
    thumbnail?: string
    thumbnailBlurhash?: string
    interactionType?: InteractionType
    interactionSignupLink?: string
  }
}

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['UUID']['input']
}>

export type DeleteTaskMutation = { __typename?: 'Mutation'; deleteTask: { __typename?: 'Result'; success: boolean } }

export type FullUserFragment = {
  __typename?: 'User'
  id: string
  identity?: string
  avatar?: string
  avatarBlurhash?: string
  avatarDefaultColor: string
  avatarLabel: string
  fullName: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  role?: UserRole
  geolocationId?: string
  engagementLevel?: string
  interestsV2: Array<string>
  skillsV2: Array<string>
  connectionStatusToMyself?: UserConnectionStatus
}

export type AuthenticatedUserQueryVariables = Exact<{ [key: string]: never }>

export type AuthenticatedUserQuery = {
  __typename?: 'Query'
  authenticatedUser?: {
    __typename?: 'User'
    id: string
    identity?: string
    avatar?: string
    avatarBlurhash?: string
    avatarDefaultColor: string
    avatarLabel: string
    fullName: string
    firstName?: string
    lastName?: string
    aboutMe?: string
    pronouns?: string
    location?: string
    role?: UserRole
    geolocationId?: string
    engagementLevel?: string
    interestsV2: Array<string>
    skillsV2: Array<string>
    connectionStatusToMyself?: UserConnectionStatus
  }
}

export type CommittedVolunteeringOpportunitiesQueryVariables = Exact<{
  offset: Scalars['Int']['input']
  limit: Scalars['Int']['input']
}>

export type CommittedVolunteeringOpportunitiesQuery = {
  __typename?: 'Query'
  committedVolunteeringOpportunities: {
    __typename?: 'VolunteeringOpportunityStatusPaged'
    totalResults: number
    data: Array<{
      __typename?: 'VolunteeringOpportunityStatus'
      status: VolunteeringOpportunityStatusValue
      externalVolunteeringOpportunityId: string
    }>
  }
}

export type GlobalRewardsCounterQueryVariables = Exact<{ [key: string]: never }>

export type GlobalRewardsCounterQuery = {
  __typename?: 'Query'
  rewards_globalCounter: { __typename?: 'Rewards_RewardsCounter'; counter?: number }
}

export type RewardsTransactionsQueryVariables = Exact<{
  offset: Scalars['Int']['input']
  limit: Scalars['Int']['input']
}>

export type RewardsTransactionsQuery = {
  __typename?: 'Query'
  rewards_transactions: {
    __typename?: 'Rewards_PagedTransactions'
    totalResults: number
    data: Array<{ __typename?: 'Rewards_Transaction'; id: string; rewardType: Rewards_RewardType; createdAt: any }>
  }
}

export type BadgesQueryVariables = Exact<{ [key: string]: never }>

export type BadgesQuery = {
  __typename?: 'Query'
  rewards_badges: {
    __typename?: 'Rewards_BadgesOverview'
    inProgress: Array<{
      __typename?: 'Rewards_InProgressBadge'
      progressGoal?: number
      progressMade?: number
      slug: string
    }>
    unlocked: Array<{ __typename?: 'Rewards_UnlockedBadge'; id: string; seenAt?: any; slug: string; unlockedAt: any }>
  }
}

export type MarkBadgeAsSeenMutationVariables = Exact<{
  unlockId: Scalars['ID']['input']
}>

export type MarkBadgeAsSeenMutation = {
  __typename?: 'Mutation'
  rewards_markBadgeUnlockAsSeen: {
    __typename?: 'Rewards_UnlockedBadge'
    id: string
    seenAt?: any
    slug: string
    unlockedAt: any
  }
}

export type FullTypesenseDocumentFragment = {
  __typename?: 'Typesense_Document'
  type: Typesense_DocumentType
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location?: string
  location_lat_lng?: Array<number>
  image_url?: string
  user_full_name?: string
  topics_v2?: Array<string>
  skills_v2?: Array<string>
  source?: string
  organizer_name?: string
  organizer_image_url?: string
  organizer_url?: string
  external_url?: string
  commitment_label?: string
  commitment_duration?: string
  location_type?: string
  link_locators?: {
    __typename?: 'Typesense_DocumentLinkLocators'
    volunteering?: string
    space?: string
    task?: string
    profile?: string
  }
  contact?: Array<{
    __typename?: 'Typesense_DocumentContact'
    type: Typesense_DocumentContactType
    value: string
    label?: string
  }>
}

export type Typesense_DocumentByIdQueryVariables = Exact<{
  id: Scalars['String']['input']
  documentType: Scalars['String']['input']
}>

export type Typesense_DocumentByIdQuery = {
  __typename?: 'Query'
  typesense_documentById?:
    | { __typename?: 'Typesense_SearchResponseError'; error: string; code: number }
    | {
        __typename?: 'Typesense_SearchResponseSuccess'
        hits?: Array<{
          __typename?: 'Typesense_SearchResponseHit'
          document: {
            __typename?: 'Typesense_Document'
            type: Typesense_DocumentType
            id: string
            title_de?: string
            title_en?: string
            description_de?: string
            description_en?: string
            location?: string
            location_lat_lng?: Array<number>
            image_url?: string
            user_full_name?: string
            topics_v2?: Array<string>
            skills_v2?: Array<string>
            source?: string
            organizer_name?: string
            organizer_image_url?: string
            organizer_url?: string
            external_url?: string
            commitment_label?: string
            commitment_duration?: string
            location_type?: string
            link_locators?: {
              __typename?: 'Typesense_DocumentLinkLocators'
              volunteering?: string
              space?: string
              task?: string
              profile?: string
            }
            contact?: Array<{
              __typename?: 'Typesense_DocumentContact'
              type: Typesense_DocumentContactType
              value: string
              label?: string
            }>
          }
        }>
      }
}

export type Typesense_MultiSearchQueryVariables = Exact<{
  input: Typesense_MultiSearchRequest_Input
}>

export type Typesense_MultiSearchQuery = {
  __typename?: 'Query'
  typesense_multiSearch?: {
    __typename?: 'Typesense_MultiSearchResponse'
    results: Array<
      | { __typename?: 'Typesense_SearchResponseError'; error: string; code: number }
      | {
          __typename?: 'Typesense_SearchResponseSuccess'
          found: number
          page: number
          hits?: Array<{
            __typename?: 'Typesense_SearchResponseHit'
            document: {
              __typename?: 'Typesense_Document'
              type: Typesense_DocumentType
              id: string
              title_de?: string
              title_en?: string
              description_de?: string
              description_en?: string
              location?: string
              location_lat_lng?: Array<number>
              image_url?: string
              user_full_name?: string
              topics_v2?: Array<string>
              skills_v2?: Array<string>
              source?: string
              organizer_name?: string
              organizer_image_url?: string
              organizer_url?: string
              external_url?: string
              commitment_label?: string
              commitment_duration?: string
              location_type?: string
              link_locators?: {
                __typename?: 'Typesense_DocumentLinkLocators'
                volunteering?: string
                space?: string
                task?: string
                profile?: string
              }
              contact?: Array<{
                __typename?: 'Typesense_DocumentContact'
                type: Typesense_DocumentContactType
                value: string
                label?: string
              }>
            }
          }>
          facet_counts?: Array<{
            __typename?: 'Typesense_SearchResponseFacetCounts'
            field_name: string
            counts: Array<{
              __typename?: 'Typesense_SearchResponseFacetCountsItemCounts'
              count: number
              value: string
            }>
          }>
        }
    >
  }
}

export type GetEventByIdQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type GetEventByIdQuery = {
  __typename?: 'Query'
  appEvents_event: {
    __typename?: 'AppEvents_EventResponse'
    data?: {
      __typename?: 'AppEvents_Event'
      id: string
      title: string
      organisationName: string
      startDate?: string
      endDate?: string
      isRemote: boolean
      imageUrl: string
      location?: {
        __typename?: 'AppEvents_Location'
        street?: string
        streetNo?: string
        city?: string
        zipCode?: string
      }
      eventDetails: {
        __typename?: 'AppEvents_EventDetails'
        description: string
        externalLink?: string
        meetingLink?: string
      }
    }
  }
}

export type AllEventsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  localOnly?: InputMaybe<Scalars['Boolean']['input']>
}>

export type AllEventsQuery = {
  __typename?: 'Query'
  appEvents_events: {
    __typename?: 'AppEvents_EventsResponse'
    totalResults: number
    data?: Array<{
      __typename?: 'AppEvents_Event'
      id: string
      title: string
      organisationName: string
      startDate?: string
      endDate?: string
      isRemote: boolean
      imageUrl: string
      location?: {
        __typename?: 'AppEvents_Location'
        street?: string
        streetNo?: string
        city?: string
        zipCode?: string
      }
      eventDetails: {
        __typename?: 'AppEvents_EventDetails'
        description: string
        externalLink?: string
        meetingLink?: string
      }
    }>
  }
}

export type NearbyEventsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>
  geolocationId?: InputMaybe<Scalars['ID']['input']>
}>

export type NearbyEventsQuery = {
  __typename?: 'Query'
  appEvents_nearbyEvents: {
    __typename?: 'AppEvents_NearbyEventsResponse'
    data?: Array<{
      __typename?: 'AppEvents_Event'
      id: string
      title: string
      organisationName: string
      startDate?: string
      endDate?: string
      isRemote: boolean
      imageUrl: string
      location?: {
        __typename?: 'AppEvents_Location'
        street?: string
        streetNo?: string
        city?: string
        zipCode?: string
      }
      eventDetails: {
        __typename?: 'AppEvents_EventDetails'
        description: string
        externalLink?: string
        meetingLink?: string
      }
    }>
  }
}

export type FullEventFragment = {
  __typename?: 'AppEvents_Event'
  id: string
  title: string
  organisationName: string
  startDate?: string
  endDate?: string
  isRemote: boolean
  imageUrl: string
  location?: { __typename?: 'AppEvents_Location'; street?: string; streetNo?: string; city?: string; zipCode?: string }
  eventDetails: {
    __typename?: 'AppEvents_EventDetails'
    description: string
    externalLink?: string
    meetingLink?: string
  }
}

export type UpdateVolunteeringOpportunityStatusMutationVariables = Exact<{
  volunteeringOpportunityId: Scalars['String']['input']
  newStatus: VolunteeringOpportunityStatusValue
}>

export type UpdateVolunteeringOpportunityStatusMutation = {
  __typename?: 'Mutation'
  updateVolunteeringOpportunityStatus: {
    __typename?: 'VolunteeringOpportunityStatus'
    externalVolunteeringOpportunityId: string
    status: VolunteeringOpportunityStatusValue
  }
}

export type VolunteeringOpportunityStatusQueryVariables = Exact<{
  volunteeringOpportunityId: Scalars['String']['input']
}>

export type VolunteeringOpportunityStatusQuery = {
  __typename?: 'Query'
  volunteeringOpportunityStatus?: {
    __typename?: 'VolunteeringOpportunityStatus'
    externalVolunteeringOpportunityId: string
    status: VolunteeringOpportunityStatusValue
  }
}

export const FullAuthenticatedUserFragmentDoc = gql`
    fragment FullAuthenticatedUser on AuthenticatedUser {
  id
  identity
  avatar
  avatarBlurhash
  avatarDefaultColor
  avatarLabel
  fullName
  firstName
  lastName
  aboutMe
  pronouns
  location
  role
  geolocationId
  engagementLevel
  interestsV2
  skillsV2
  connectionStatusToMyself
  trackingConsentAnalytics
  trackingConsentPersonalization
  trackingConsentAdPartners
  isEmployee
  email
  isOidc
}
    `
export const FullUserAvatarFragmentDoc = gql`
    fragment FullUserAvatar on User {
  id
  identity
  avatar
  avatarBlurhash
  avatarLabel
  avatarDefaultColor
  firstName
  fullName
  role
}
    `
export const PostImageDataFragmentDoc = gql`
    fragment PostImageData on PostImage {
  id
  url
  height
  width
}
    `
export const LinkFragmentFragmentDoc = gql`
    fragment LinkFragment on LinkPreview {
  requestedUrl
  url
  title
  description
  type
  image
  siteName
  origin
  icon
}
    `
export const PostFragmentFragmentDoc = gql`
    fragment PostFragment on Post {
  __typename
  id
  title
  text
  created
  modified
  creator {
    ...FullUserAvatar
  }
  numberOfComments
  commenters {
    totalResults
    data {
      ...FullUserAvatar
    }
  }
  space {
    id
    title
    name
    avatar
    avatarBlurhash
    avatarDefaultColor
    connectionStatusToMyself
  }
  image {
    ...PostImageData
  }
  links {
    ...LinkFragment
  }
  mentions {
    id
    fullName
  }
  myReaction {
    HEART
  }
  reactions {
    HEART
  }
  isPublic
  language
}
    ${FullUserAvatarFragmentDoc}
${PostImageDataFragmentDoc}
${LinkFragmentFragmentDoc}`
export const FavoriteInsightFragmentDoc = gql`
    fragment FavoriteInsight on Insight {
  __typename
  id
  title
  description
  datePublished
  initiatives {
    link
  }
  creator {
    fullName
    avatar
  }
  headerImage
  headerImageBlurhash
  isFavorite
}
    `
export const FavoriteTaskFragmentDoc = gql`
    fragment FavoriteTask on Task {
  __typename
  id
}
    `
export const FavoriteExternalVolunteeringOpportunityFragmentDoc = gql`
    fragment FavoriteExternalVolunteeringOpportunity on ExternalVolunteeringOpportunity {
  __typename
  externalId
}
    `
export const SpaceCardFragmentDoc = gql`
    fragment SpaceCard on Space {
  title
  name
  description
  location
  id
  cover
  members {
    data {
      user {
        id
        avatar
        avatarLabel
        avatarDefaultColor
        avatarBlurhash
        fullName
      }
    }
    totalResults
  }
}
    `
export const UserAvatarFragmentDoc = gql`
    fragment UserAvatar on User {
  id
  identity
  avatar
  avatarBlurhash
  avatarLabel
  avatarDefaultColor
  firstName
  fullName
}
    `
export const SpaceMemberPermissionsFragmentDoc = gql`
    fragment SpaceMemberPermissions on User {
  ...UserAvatar
  aboutMe
  pronouns
}
    ${UserAvatarFragmentDoc}`
export const SpaceMemberListFragmentDoc = gql`
    fragment SpaceMemberList on SpaceMemberPaged {
  totalResults
  data {
    id
    user {
      ...SpaceMemberPermissions
    }
    isAdministrator
  }
}
    ${SpaceMemberPermissionsFragmentDoc}`
export const SpaceMembershipRequestListFragmentDoc = gql`
    fragment SpaceMembershipRequestList on SpaceMembershipRequestPaged {
  totalResults
  data {
    id
    message
    user {
      ...SpaceMemberPermissions
    }
  }
}
    ${SpaceMemberPermissionsFragmentDoc}`
export const SpaceInviteListFragmentDoc = gql`
    fragment SpaceInviteList on SpaceInvitePaged {
  totalResults
  data {
    id
    invitedUser {
      ...SpaceMemberPermissions
    }
  }
}
    ${SpaceMemberPermissionsFragmentDoc}`
export const FullTaskFragmentDoc = gql`
    fragment FullTask on Task {
  id
  name
  description
  impact
  slotsAvailable
  slotsTaken
  location
  geolocation {
    latitude
    longitude
  }
  visibility
  locationType
  interactionType
  contactEmail
  contactPhone
  thumbnail
  thumbnailBlurhash
  regularity
  duration
  timeframeEndDate
  timeframeStartDate
  totalCompletions
  creator {
    ...UserAvatar
  }
  skillsV2
  interactionSignupLink
}
    ${UserAvatarFragmentDoc}`
export const RelatedSpaceFragmentDoc = gql`
    fragment RelatedSpace on Space {
  id
  title
  location
  description
  cover
  coverBlurhash
  name
  avatar
  avatarDefaultColor
  members(limit: 3) {
    totalResults
    data {
      user {
        identity
        ...UserAvatar
      }
    }
  }
}
    ${UserAvatarFragmentDoc}`
export const FullSpaceFragmentDoc = gql`
    fragment FullSpace on Space {
  id
  title
  description
  contactEmail
  contactPhone
  contactDescription
  created
  creator {
    ...UserAvatar
  }
  avatar
  avatarBlurhash
  cover
  coverBlurhash
  name
  avatarDefaultColor
  location
  hasPublicPosts
  hasPrivatePosts
  geolocation {
    latitude
    longitude
  }
  connectionStatusToMyself
  links {
    id
    type
    url
    name
  }
  collaborationTools {
    id
    domain
    url
    description
    title
    collectionType
    thumbnail
    thumbnailBlurhash
  }
  members(limit: 3) {
    totalResults
    data {
      id
      isAdministrator
      user {
        ...UserAvatar
      }
    }
  }
  membershipRequests(limit: 0) {
    totalResults
  }
  tasks {
    ...FullTask
  }
  topicsV2
  onboarding {
    steps {
      text
    }
  }
  parentSpace {
    ...RelatedSpace
  }
  childSpaces(limit: 4) {
    totalResults
    data {
      ...RelatedSpace
    }
  }
}
    ${UserAvatarFragmentDoc}
${FullTaskFragmentDoc}
${RelatedSpaceFragmentDoc}`
export const SpaceOverviewFragmentDoc = gql`
    fragment SpaceOverview on Space {
  id
  title
  description
  cover
  coverBlurhash
  location
  avatar
  avatarBlurhash
  avatarDefaultColor
  name
  creator {
    id
  }
  members(limit: 3) {
    totalResults
    data {
      user {
        identity
        ...UserAvatar
      }
    }
  }
}
    ${UserAvatarFragmentDoc}`
export const MemberSpacesFragmentDoc = gql`
    fragment MemberSpaces on SpacePaged {
  data {
    id
    title
    avatar
    avatarBlurhash
    avatarDefaultColor
    cover
    coverBlurhash
    name
    members {
      data {
        user {
          ...UserAvatar
        }
      }
      totalResults
    }
  }
  totalResults
}
    ${UserAvatarFragmentDoc}`
export const FullUserFragmentDoc = gql`
    fragment FullUser on User {
  id
  identity
  avatar
  avatarBlurhash
  avatarDefaultColor
  avatarLabel
  fullName
  firstName
  lastName
  aboutMe
  pronouns
  location
  role
  geolocationId
  engagementLevel
  interestsV2
  skillsV2
  connectionStatusToMyself
}
    `
export const FullTypesenseDocumentFragmentDoc = gql`
    fragment FullTypesenseDocument on Typesense_Document {
  type
  id
  title_de
  title_en
  description_de
  description_en
  location
  location_lat_lng
  image_url
  user_full_name
  link_locators {
    volunteering
    space
    task
    profile
  }
  topics_v2
  skills_v2
  source
  organizer_name
  organizer_image_url
  organizer_url
  external_url
  commitment_label
  commitment_duration
  location_type
  contact {
    type
    value
    label
  }
}
    `
export const FullEventFragmentDoc = gql`
    fragment FullEvent on AppEvents_Event {
  id
  title
  organisationName
  startDate
  endDate
  location {
    street
    streetNo
    city
    zipCode
  }
  isRemote
  imageUrl
  eventDetails {
    description
    externalLink
    meetingLink
  }
}
    `
export const FavoriteDocument = gql`
    mutation Favorite($favoritableId: UUID!, $favoritableType: FavoritableType!) {
  favorite(favoritableId: $favoritableId, favoritableType: $favoritableType) {
    success
  }
}
    `
export type FavoriteMutationFn = Apollo.MutationFunction<FavoriteMutation, FavoriteMutationVariables>

/**
 * __useFavoriteMutation__
 *
 * To run a mutation, you first call `useFavoriteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFavoriteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [favoriteMutation, { data, loading, error }] = useFavoriteMutation({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *      favoritableType: // value for 'favoritableType'
 *   },
 * });
 */
export function useFavoriteMutation(
  baseOptions?: Apollo.MutationHookOptions<FavoriteMutation, FavoriteMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<FavoriteMutation, FavoriteMutationVariables>(FavoriteDocument, options)
}
export type FavoriteMutationHookResult = ReturnType<typeof useFavoriteMutation>
export type FavoriteMutationResult = Apollo.MutationResult<FavoriteMutation>
export type FavoriteMutationOptions = Apollo.BaseMutationOptions<FavoriteMutation, FavoriteMutationVariables>
export const UnfavoriteDocument = gql`
    mutation Unfavorite($favoritableId: UUID!, $favoritableType: FavoritableType!) {
  unfavorite(favoritableId: $favoritableId, favoritableType: $favoritableType) {
    success
  }
}
    `
export type UnfavoriteMutationFn = Apollo.MutationFunction<UnfavoriteMutation, UnfavoriteMutationVariables>

/**
 * __useUnfavoriteMutation__
 *
 * To run a mutation, you first call `useUnfavoriteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfavoriteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfavoriteMutation, { data, loading, error }] = useUnfavoriteMutation({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *      favoritableType: // value for 'favoritableType'
 *   },
 * });
 */
export function useUnfavoriteMutation(
  baseOptions?: Apollo.MutationHookOptions<UnfavoriteMutation, UnfavoriteMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnfavoriteMutation, UnfavoriteMutationVariables>(UnfavoriteDocument, options)
}
export type UnfavoriteMutationHookResult = ReturnType<typeof useUnfavoriteMutation>
export type UnfavoriteMutationResult = Apollo.MutationResult<UnfavoriteMutation>
export type UnfavoriteMutationOptions = Apollo.BaseMutationOptions<UnfavoriteMutation, UnfavoriteMutationVariables>
export const FavoriteV2Document = gql`
    mutation FavoriteV2($favoritableId: String!, $favoritableType: FavoritableType!) {
  favoriteV2(favoritableId: $favoritableId, favoritableType: $favoritableType) {
    success
  }
}
    `
export type FavoriteV2MutationFn = Apollo.MutationFunction<FavoriteV2Mutation, FavoriteV2MutationVariables>

/**
 * __useFavoriteV2Mutation__
 *
 * To run a mutation, you first call `useFavoriteV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFavoriteV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [favoriteV2Mutation, { data, loading, error }] = useFavoriteV2Mutation({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *      favoritableType: // value for 'favoritableType'
 *   },
 * });
 */
export function useFavoriteV2Mutation(
  baseOptions?: Apollo.MutationHookOptions<FavoriteV2Mutation, FavoriteV2MutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<FavoriteV2Mutation, FavoriteV2MutationVariables>(FavoriteV2Document, options)
}
export type FavoriteV2MutationHookResult = ReturnType<typeof useFavoriteV2Mutation>
export type FavoriteV2MutationResult = Apollo.MutationResult<FavoriteV2Mutation>
export type FavoriteV2MutationOptions = Apollo.BaseMutationOptions<FavoriteV2Mutation, FavoriteV2MutationVariables>
export const UnfavoriteV2Document = gql`
    mutation UnfavoriteV2($favoritableId: String!, $favoritableType: FavoritableType!) {
  unfavoriteV2(favoritableId: $favoritableId, favoritableType: $favoritableType) {
    success
  }
}
    `
export type UnfavoriteV2MutationFn = Apollo.MutationFunction<UnfavoriteV2Mutation, UnfavoriteV2MutationVariables>

/**
 * __useUnfavoriteV2Mutation__
 *
 * To run a mutation, you first call `useUnfavoriteV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfavoriteV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfavoriteV2Mutation, { data, loading, error }] = useUnfavoriteV2Mutation({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *      favoritableType: // value for 'favoritableType'
 *   },
 * });
 */
export function useUnfavoriteV2Mutation(
  baseOptions?: Apollo.MutationHookOptions<UnfavoriteV2Mutation, UnfavoriteV2MutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnfavoriteV2Mutation, UnfavoriteV2MutationVariables>(UnfavoriteV2Document, options)
}
export type UnfavoriteV2MutationHookResult = ReturnType<typeof useUnfavoriteV2Mutation>
export type UnfavoriteV2MutationResult = Apollo.MutationResult<UnfavoriteV2Mutation>
export type UnfavoriteV2MutationOptions = Apollo.BaseMutationOptions<
  UnfavoriteV2Mutation,
  UnfavoriteV2MutationVariables
>
export const FavoriteExternalVolunteeringOpportunityDocument = gql`
    query FavoriteExternalVolunteeringOpportunity($favoritableId: String!) {
  favorite(favoritableId: $favoritableId) {
    id
    favoritable {
      ...FavoriteExternalVolunteeringOpportunity
    }
    favoritableId
    favoritableType
  }
}
    ${FavoriteExternalVolunteeringOpportunityFragmentDoc}`

/**
 * __useFavoriteExternalVolunteeringOpportunityQuery__
 *
 * To run a query within a React component, call `useFavoriteExternalVolunteeringOpportunityQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoriteExternalVolunteeringOpportunityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoriteExternalVolunteeringOpportunityQuery({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *   },
 * });
 */
export function useFavoriteExternalVolunteeringOpportunityQuery(
  baseOptions: Apollo.QueryHookOptions<
    FavoriteExternalVolunteeringOpportunityQuery,
    FavoriteExternalVolunteeringOpportunityQueryVariables
  > &
    ({ variables: FavoriteExternalVolunteeringOpportunityQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    FavoriteExternalVolunteeringOpportunityQuery,
    FavoriteExternalVolunteeringOpportunityQueryVariables
  >(FavoriteExternalVolunteeringOpportunityDocument, options)
}
export function useFavoriteExternalVolunteeringOpportunityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FavoriteExternalVolunteeringOpportunityQuery,
    FavoriteExternalVolunteeringOpportunityQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    FavoriteExternalVolunteeringOpportunityQuery,
    FavoriteExternalVolunteeringOpportunityQueryVariables
  >(FavoriteExternalVolunteeringOpportunityDocument, options)
}
export function useFavoriteExternalVolunteeringOpportunitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        FavoriteExternalVolunteeringOpportunityQuery,
        FavoriteExternalVolunteeringOpportunityQueryVariables
      >
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    FavoriteExternalVolunteeringOpportunityQuery,
    FavoriteExternalVolunteeringOpportunityQueryVariables
  >(FavoriteExternalVolunteeringOpportunityDocument, options)
}
export type FavoriteExternalVolunteeringOpportunityQueryHookResult = ReturnType<
  typeof useFavoriteExternalVolunteeringOpportunityQuery
>
export type FavoriteExternalVolunteeringOpportunityLazyQueryHookResult = ReturnType<
  typeof useFavoriteExternalVolunteeringOpportunityLazyQuery
>
export type FavoriteExternalVolunteeringOpportunitySuspenseQueryHookResult = ReturnType<
  typeof useFavoriteExternalVolunteeringOpportunitySuspenseQuery
>
export type FavoriteExternalVolunteeringOpportunityQueryResult = Apollo.QueryResult<
  FavoriteExternalVolunteeringOpportunityQuery,
  FavoriteExternalVolunteeringOpportunityQueryVariables
>
export const FavoriteByFavoritableIdDocument = gql`
    query FavoriteByFavoritableId($favoritableId: String!) {
  favorite(favoritableId: $favoritableId) {
    id
    favoritable {
      __typename
      ...FavoriteInsight
      ...FavoriteTask
      ...FavoriteExternalVolunteeringOpportunity
    }
    favoritableId
    favoritableType
  }
}
    ${FavoriteInsightFragmentDoc}
${FavoriteTaskFragmentDoc}
${FavoriteExternalVolunteeringOpportunityFragmentDoc}`

/**
 * __useFavoriteByFavoritableIdQuery__
 *
 * To run a query within a React component, call `useFavoriteByFavoritableIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoriteByFavoritableIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoriteByFavoritableIdQuery({
 *   variables: {
 *      favoritableId: // value for 'favoritableId'
 *   },
 * });
 */
export function useFavoriteByFavoritableIdQuery(
  baseOptions: Apollo.QueryHookOptions<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables> &
    ({ variables: FavoriteByFavoritableIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables>(
    FavoriteByFavoritableIdDocument,
    options
  )
}
export function useFavoriteByFavoritableIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables>(
    FavoriteByFavoritableIdDocument,
    options
  )
}
export function useFavoriteByFavoritableIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<FavoriteByFavoritableIdQuery, FavoriteByFavoritableIdQueryVariables>(
    FavoriteByFavoritableIdDocument,
    options
  )
}
export type FavoriteByFavoritableIdQueryHookResult = ReturnType<typeof useFavoriteByFavoritableIdQuery>
export type FavoriteByFavoritableIdLazyQueryHookResult = ReturnType<typeof useFavoriteByFavoritableIdLazyQuery>
export type FavoriteByFavoritableIdSuspenseQueryHookResult = ReturnType<typeof useFavoriteByFavoritableIdSuspenseQuery>
export type FavoriteByFavoritableIdQueryResult = Apollo.QueryResult<
  FavoriteByFavoritableIdQuery,
  FavoriteByFavoritableIdQueryVariables
>
export const FavoritesDocument = gql`
    query Favorites($offset: Int! = 0, $limit: Int! = 20) {
  favorites(offset: $offset, limit: $limit) {
    data {
      id
      favoritableId
      favoritableType
      favoritable {
        ...FavoriteInsight
        ...FavoriteTask
        ...FavoriteExternalVolunteeringOpportunity
      }
    }
    totalResults
  }
}
    ${FavoriteInsightFragmentDoc}
${FavoriteTaskFragmentDoc}
${FavoriteExternalVolunteeringOpportunityFragmentDoc}`

/**
 * __useFavoritesQuery__
 *
 * To run a query within a React component, call `useFavoritesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoritesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoritesQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useFavoritesQuery(baseOptions?: Apollo.QueryHookOptions<FavoritesQuery, FavoritesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FavoritesQuery, FavoritesQueryVariables>(FavoritesDocument, options)
}
export function useFavoritesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FavoritesQuery, FavoritesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FavoritesQuery, FavoritesQueryVariables>(FavoritesDocument, options)
}
export function useFavoritesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FavoritesQuery, FavoritesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<FavoritesQuery, FavoritesQueryVariables>(FavoritesDocument, options)
}
export type FavoritesQueryHookResult = ReturnType<typeof useFavoritesQuery>
export type FavoritesLazyQueryHookResult = ReturnType<typeof useFavoritesLazyQuery>
export type FavoritesSuspenseQueryHookResult = ReturnType<typeof useFavoritesSuspenseQuery>
export type FavoritesQueryResult = Apollo.QueryResult<FavoritesQuery, FavoritesQueryVariables>
export const GetRewardsCounterDocument = gql`
    query GetRewardsCounter {
  rewards_counter {
    counter
  }
}
    `

/**
 * __useGetRewardsCounterQuery__
 *
 * To run a query within a React component, call `useGetRewardsCounterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRewardsCounterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRewardsCounterQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRewardsCounterQuery(
  baseOptions?: Apollo.QueryHookOptions<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>(GetRewardsCounterDocument, options)
}
export function useGetRewardsCounterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>(
    GetRewardsCounterDocument,
    options
  )
}
export function useGetRewardsCounterSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>(
    GetRewardsCounterDocument,
    options
  )
}
export type GetRewardsCounterQueryHookResult = ReturnType<typeof useGetRewardsCounterQuery>
export type GetRewardsCounterLazyQueryHookResult = ReturnType<typeof useGetRewardsCounterLazyQuery>
export type GetRewardsCounterSuspenseQueryHookResult = ReturnType<typeof useGetRewardsCounterSuspenseQuery>
export type GetRewardsCounterQueryResult = Apollo.QueryResult<GetRewardsCounterQuery, GetRewardsCounterQueryVariables>
export const ValidateSpaceDocument = gql`
    mutation ValidateSpace($input: ValidateSpaceInput!) {
  validateSpace(input: $input) {
    success
  }
}
    `
export type ValidateSpaceMutationFn = Apollo.MutationFunction<ValidateSpaceMutation, ValidateSpaceMutationVariables>

/**
 * __useValidateSpaceMutation__
 *
 * To run a mutation, you first call `useValidateSpaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateSpaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateSpaceMutation, { data, loading, error }] = useValidateSpaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useValidateSpaceMutation(
  baseOptions?: Apollo.MutationHookOptions<ValidateSpaceMutation, ValidateSpaceMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ValidateSpaceMutation, ValidateSpaceMutationVariables>(ValidateSpaceDocument, options)
}
export type ValidateSpaceMutationHookResult = ReturnType<typeof useValidateSpaceMutation>
export type ValidateSpaceMutationResult = Apollo.MutationResult<ValidateSpaceMutation>
export type ValidateSpaceMutationOptions = Apollo.BaseMutationOptions<
  ValidateSpaceMutation,
  ValidateSpaceMutationVariables
>
export const CreateSpaceDocument = gql`
    mutation CreateSpace($input: CreateSpaceInput!) {
  createSpace(input: $input) {
    ...FullSpace
  }
}
    ${FullSpaceFragmentDoc}`
export type CreateSpaceMutationFn = Apollo.MutationFunction<CreateSpaceMutation, CreateSpaceMutationVariables>

/**
 * __useCreateSpaceMutation__
 *
 * To run a mutation, you first call `useCreateSpaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpaceMutation, { data, loading, error }] = useCreateSpaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpaceMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateSpaceMutation, CreateSpaceMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateSpaceMutation, CreateSpaceMutationVariables>(CreateSpaceDocument, options)
}
export type CreateSpaceMutationHookResult = ReturnType<typeof useCreateSpaceMutation>
export type CreateSpaceMutationResult = Apollo.MutationResult<CreateSpaceMutation>
export type CreateSpaceMutationOptions = Apollo.BaseMutationOptions<CreateSpaceMutation, CreateSpaceMutationVariables>
export const AddExternalLinkDocument = gql`
    mutation AddExternalLink($input: AddExternalLinkInput!) {
  addExternalLink(input: $input) {
    id
    type
    url
    name
  }
}
    `
export type AddExternalLinkMutationFn = Apollo.MutationFunction<
  AddExternalLinkMutation,
  AddExternalLinkMutationVariables
>

/**
 * __useAddExternalLinkMutation__
 *
 * To run a mutation, you first call `useAddExternalLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExternalLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExternalLinkMutation, { data, loading, error }] = useAddExternalLinkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddExternalLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<AddExternalLinkMutation, AddExternalLinkMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddExternalLinkMutation, AddExternalLinkMutationVariables>(AddExternalLinkDocument, options)
}
export type AddExternalLinkMutationHookResult = ReturnType<typeof useAddExternalLinkMutation>
export type AddExternalLinkMutationResult = Apollo.MutationResult<AddExternalLinkMutation>
export type AddExternalLinkMutationOptions = Apollo.BaseMutationOptions<
  AddExternalLinkMutation,
  AddExternalLinkMutationVariables
>
export const DeleteSpaceDocument = gql`
    mutation DeleteSpace($id: UUID!) {
  deleteSpace(id: $id) {
    success
  }
}
    `
export type DeleteSpaceMutationFn = Apollo.MutationFunction<DeleteSpaceMutation, DeleteSpaceMutationVariables>

/**
 * __useDeleteSpaceMutation__
 *
 * To run a mutation, you first call `useDeleteSpaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSpaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSpaceMutation, { data, loading, error }] = useDeleteSpaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSpaceMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteSpaceMutation, DeleteSpaceMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteSpaceMutation, DeleteSpaceMutationVariables>(DeleteSpaceDocument, options)
}
export type DeleteSpaceMutationHookResult = ReturnType<typeof useDeleteSpaceMutation>
export type DeleteSpaceMutationResult = Apollo.MutationResult<DeleteSpaceMutation>
export type DeleteSpaceMutationOptions = Apollo.BaseMutationOptions<DeleteSpaceMutation, DeleteSpaceMutationVariables>
export const UpdateSpaceUserConnectionDocument = gql`
    mutation UpdateSpaceUserConnection($connectAction: UpdateConnectionAction!, $connectionType: SpaceUserConnectionType!, $spaceId: UUID!, $userId: UUID, $message: String) {
  updateSpaceUserConnection(
    connectAction: $connectAction
    connectionType: $connectionType
    spaceId: $spaceId
    userId: $userId
    message: $message
  ) {
    id
    connectionStatusToMyself
  }
}
    `
export type UpdateSpaceUserConnectionMutationFn = Apollo.MutationFunction<
  UpdateSpaceUserConnectionMutation,
  UpdateSpaceUserConnectionMutationVariables
>

/**
 * __useUpdateSpaceUserConnectionMutation__
 *
 * To run a mutation, you first call `useUpdateSpaceUserConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSpaceUserConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSpaceUserConnectionMutation, { data, loading, error }] = useUpdateSpaceUserConnectionMutation({
 *   variables: {
 *      connectAction: // value for 'connectAction'
 *      connectionType: // value for 'connectionType'
 *      spaceId: // value for 'spaceId'
 *      userId: // value for 'userId'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useUpdateSpaceUserConnectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSpaceUserConnectionMutation,
    UpdateSpaceUserConnectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateSpaceUserConnectionMutation, UpdateSpaceUserConnectionMutationVariables>(
    UpdateSpaceUserConnectionDocument,
    options
  )
}
export type UpdateSpaceUserConnectionMutationHookResult = ReturnType<typeof useUpdateSpaceUserConnectionMutation>
export type UpdateSpaceUserConnectionMutationResult = Apollo.MutationResult<UpdateSpaceUserConnectionMutation>
export type UpdateSpaceUserConnectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateSpaceUserConnectionMutation,
  UpdateSpaceUserConnectionMutationVariables
>
export const InviteToSpaceByEmailDocument = gql`
    mutation InviteToSpaceByEmail($email: String!, $spaceId: UUID!) {
  inviteToSpaceByEmail(email: $email, spaceId: $spaceId) {
    success
  }
}
    `
export type InviteToSpaceByEmailMutationFn = Apollo.MutationFunction<
  InviteToSpaceByEmailMutation,
  InviteToSpaceByEmailMutationVariables
>

/**
 * __useInviteToSpaceByEmailMutation__
 *
 * To run a mutation, you first call `useInviteToSpaceByEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteToSpaceByEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteToSpaceByEmailMutation, { data, loading, error }] = useInviteToSpaceByEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *      spaceId: // value for 'spaceId'
 *   },
 * });
 */
export function useInviteToSpaceByEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<InviteToSpaceByEmailMutation, InviteToSpaceByEmailMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<InviteToSpaceByEmailMutation, InviteToSpaceByEmailMutationVariables>(
    InviteToSpaceByEmailDocument,
    options
  )
}
export type InviteToSpaceByEmailMutationHookResult = ReturnType<typeof useInviteToSpaceByEmailMutation>
export type InviteToSpaceByEmailMutationResult = Apollo.MutationResult<InviteToSpaceByEmailMutation>
export type InviteToSpaceByEmailMutationOptions = Apollo.BaseMutationOptions<
  InviteToSpaceByEmailMutation,
  InviteToSpaceByEmailMutationVariables
>
export const CreateSpacePostDocument = gql`
    mutation createSpacePost($input: CreatePostInput!) {
  createSpacePost2(input: $input) {
    ...PostFragment
    space {
      posts(offset: 0, limit: 10, visibility: ALL) {
        data {
          ...PostFragment
        }
      }
    }
  }
}
    ${PostFragmentFragmentDoc}`
export type CreateSpacePostMutationFn = Apollo.MutationFunction<
  CreateSpacePostMutation,
  CreateSpacePostMutationVariables
>

/**
 * __useCreateSpacePostMutation__
 *
 * To run a mutation, you first call `useCreateSpacePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpacePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpacePostMutation, { data, loading, error }] = useCreateSpacePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpacePostMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateSpacePostMutation, CreateSpacePostMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateSpacePostMutation, CreateSpacePostMutationVariables>(CreateSpacePostDocument, options)
}
export type CreateSpacePostMutationHookResult = ReturnType<typeof useCreateSpacePostMutation>
export type CreateSpacePostMutationResult = Apollo.MutationResult<CreateSpacePostMutation>
export type CreateSpacePostMutationOptions = Apollo.BaseMutationOptions<
  CreateSpacePostMutation,
  CreateSpacePostMutationVariables
>
export const UpdateSpacePostDocument = gql`
    mutation updateSpacePost($input: UpdatePostInput!) {
  updateSpacePost(input: $input) {
    ...PostFragment
  }
}
    ${PostFragmentFragmentDoc}`
export type UpdateSpacePostMutationFn = Apollo.MutationFunction<
  UpdateSpacePostMutation,
  UpdateSpacePostMutationVariables
>

/**
 * __useUpdateSpacePostMutation__
 *
 * To run a mutation, you first call `useUpdateSpacePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSpacePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSpacePostMutation, { data, loading, error }] = useUpdateSpacePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSpacePostMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateSpacePostMutation, UpdateSpacePostMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateSpacePostMutation, UpdateSpacePostMutationVariables>(UpdateSpacePostDocument, options)
}
export type UpdateSpacePostMutationHookResult = ReturnType<typeof useUpdateSpacePostMutation>
export type UpdateSpacePostMutationResult = Apollo.MutationResult<UpdateSpacePostMutation>
export type UpdateSpacePostMutationOptions = Apollo.BaseMutationOptions<
  UpdateSpacePostMutation,
  UpdateSpacePostMutationVariables
>
export const DeleteSpacePostDocument = gql`
    mutation deleteSpacePost($id: UUID!) {
  deleteSpacePost(id: $id) {
    id
  }
}
    `
export type DeleteSpacePostMutationFn = Apollo.MutationFunction<
  DeleteSpacePostMutation,
  DeleteSpacePostMutationVariables
>

/**
 * __useDeleteSpacePostMutation__
 *
 * To run a mutation, you first call `useDeleteSpacePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSpacePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSpacePostMutation, { data, loading, error }] = useDeleteSpacePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSpacePostMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteSpacePostMutation, DeleteSpacePostMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteSpacePostMutation, DeleteSpacePostMutationVariables>(DeleteSpacePostDocument, options)
}
export type DeleteSpacePostMutationHookResult = ReturnType<typeof useDeleteSpacePostMutation>
export type DeleteSpacePostMutationResult = Apollo.MutationResult<DeleteSpacePostMutation>
export type DeleteSpacePostMutationOptions = Apollo.BaseMutationOptions<
  DeleteSpacePostMutation,
  DeleteSpacePostMutationVariables
>
export const CompleteReadyToGoTaskDocument = gql`
    mutation CompleteReadyToGoTask($id: UUID!) {
  completeReadyToGoTask(id: $id) {
    id
    completedAt
    task {
      ...FullTask
    }
    user {
      ...UserAvatar
    }
  }
}
    ${FullTaskFragmentDoc}
${UserAvatarFragmentDoc}`
export type CompleteReadyToGoTaskMutationFn = Apollo.MutationFunction<
  CompleteReadyToGoTaskMutation,
  CompleteReadyToGoTaskMutationVariables
>

/**
 * __useCompleteReadyToGoTaskMutation__
 *
 * To run a mutation, you first call `useCompleteReadyToGoTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteReadyToGoTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeReadyToGoTaskMutation, { data, loading, error }] = useCompleteReadyToGoTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompleteReadyToGoTaskMutation(
  baseOptions?: Apollo.MutationHookOptions<CompleteReadyToGoTaskMutation, CompleteReadyToGoTaskMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CompleteReadyToGoTaskMutation, CompleteReadyToGoTaskMutationVariables>(
    CompleteReadyToGoTaskDocument,
    options
  )
}
export type CompleteReadyToGoTaskMutationHookResult = ReturnType<typeof useCompleteReadyToGoTaskMutation>
export type CompleteReadyToGoTaskMutationResult = Apollo.MutationResult<CompleteReadyToGoTaskMutation>
export type CompleteReadyToGoTaskMutationOptions = Apollo.BaseMutationOptions<
  CompleteReadyToGoTaskMutation,
  CompleteReadyToGoTaskMutationVariables
>
export const SpaceByIdDocument = gql`
    query SpaceById($idOrName: String!) {
  spaceById(idOrName: $idOrName) {
    ...FullSpace
  }
}
    ${FullSpaceFragmentDoc}`

/**
 * __useSpaceByIdQuery__
 *
 * To run a query within a React component, call `useSpaceByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceByIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *   },
 * });
 */
export function useSpaceByIdQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceByIdQuery, SpaceByIdQueryVariables> &
    ({ variables: SpaceByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceByIdQuery, SpaceByIdQueryVariables>(SpaceByIdDocument, options)
}
export function useSpaceByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceByIdQuery, SpaceByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceByIdQuery, SpaceByIdQueryVariables>(SpaceByIdDocument, options)
}
export function useSpaceByIdSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SpaceByIdQuery, SpaceByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceByIdQuery, SpaceByIdQueryVariables>(SpaceByIdDocument, options)
}
export type SpaceByIdQueryHookResult = ReturnType<typeof useSpaceByIdQuery>
export type SpaceByIdLazyQueryHookResult = ReturnType<typeof useSpaceByIdLazyQuery>
export type SpaceByIdSuspenseQueryHookResult = ReturnType<typeof useSpaceByIdSuspenseQuery>
export type SpaceByIdQueryResult = Apollo.QueryResult<SpaceByIdQuery, SpaceByIdQueryVariables>
export const SpaceConnectionStatusToMyselfByIdDocument = gql`
    query SpaceConnectionStatusToMyselfById($idOrName: String!) {
  spaceById(idOrName: $idOrName) {
    id
    name
    connectionStatusToMyself
  }
}
    `

/**
 * __useSpaceConnectionStatusToMyselfByIdQuery__
 *
 * To run a query within a React component, call `useSpaceConnectionStatusToMyselfByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceConnectionStatusToMyselfByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceConnectionStatusToMyselfByIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *   },
 * });
 */
export function useSpaceConnectionStatusToMyselfByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    SpaceConnectionStatusToMyselfByIdQuery,
    SpaceConnectionStatusToMyselfByIdQueryVariables
  > &
    ({ variables: SpaceConnectionStatusToMyselfByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceConnectionStatusToMyselfByIdQuery, SpaceConnectionStatusToMyselfByIdQueryVariables>(
    SpaceConnectionStatusToMyselfByIdDocument,
    options
  )
}
export function useSpaceConnectionStatusToMyselfByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SpaceConnectionStatusToMyselfByIdQuery,
    SpaceConnectionStatusToMyselfByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceConnectionStatusToMyselfByIdQuery, SpaceConnectionStatusToMyselfByIdQueryVariables>(
    SpaceConnectionStatusToMyselfByIdDocument,
    options
  )
}
export function useSpaceConnectionStatusToMyselfByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SpaceConnectionStatusToMyselfByIdQuery,
        SpaceConnectionStatusToMyselfByIdQueryVariables
      >
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    SpaceConnectionStatusToMyselfByIdQuery,
    SpaceConnectionStatusToMyselfByIdQueryVariables
  >(SpaceConnectionStatusToMyselfByIdDocument, options)
}
export type SpaceConnectionStatusToMyselfByIdQueryHookResult = ReturnType<
  typeof useSpaceConnectionStatusToMyselfByIdQuery
>
export type SpaceConnectionStatusToMyselfByIdLazyQueryHookResult = ReturnType<
  typeof useSpaceConnectionStatusToMyselfByIdLazyQuery
>
export type SpaceConnectionStatusToMyselfByIdSuspenseQueryHookResult = ReturnType<
  typeof useSpaceConnectionStatusToMyselfByIdSuspenseQuery
>
export type SpaceConnectionStatusToMyselfByIdQueryResult = Apollo.QueryResult<
  SpaceConnectionStatusToMyselfByIdQuery,
  SpaceConnectionStatusToMyselfByIdQueryVariables
>
export const SpaceRealatedSpacesDocument = gql`
    query SpaceRealatedSpaces($idOrName: String!, $offset: Int, $limit: Int) {
  spaceById(idOrName: $idOrName) {
    id
    name
    title
    parentSpace {
      ...RelatedSpace
    }
    childSpaces(offset: $offset, limit: $limit) {
      totalResults
      data {
        ...RelatedSpace
      }
    }
  }
}
    ${RelatedSpaceFragmentDoc}`

/**
 * __useSpaceRealatedSpacesQuery__
 *
 * To run a query within a React component, call `useSpaceRealatedSpacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceRealatedSpacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceRealatedSpacesQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpaceRealatedSpacesQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables> &
    ({ variables: SpaceRealatedSpacesQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables>(
    SpaceRealatedSpacesDocument,
    options
  )
}
export function useSpaceRealatedSpacesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables>(
    SpaceRealatedSpacesDocument,
    options
  )
}
export function useSpaceRealatedSpacesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceRealatedSpacesQuery, SpaceRealatedSpacesQueryVariables>(
    SpaceRealatedSpacesDocument,
    options
  )
}
export type SpaceRealatedSpacesQueryHookResult = ReturnType<typeof useSpaceRealatedSpacesQuery>
export type SpaceRealatedSpacesLazyQueryHookResult = ReturnType<typeof useSpaceRealatedSpacesLazyQuery>
export type SpaceRealatedSpacesSuspenseQueryHookResult = ReturnType<typeof useSpaceRealatedSpacesSuspenseQuery>
export type SpaceRealatedSpacesQueryResult = Apollo.QueryResult<
  SpaceRealatedSpacesQuery,
  SpaceRealatedSpacesQueryVariables
>
export const SpaceMembershipByIdDocument = gql`
    query SpaceMembershipById($idOrName: String!) {
  spaceById(idOrName: $idOrName) {
    id
    name
    connectionStatusToMyself
    membershipRequests(limit: 0) {
      totalResults
    }
  }
}
    `

/**
 * __useSpaceMembershipByIdQuery__
 *
 * To run a query within a React component, call `useSpaceMembershipByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceMembershipByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceMembershipByIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *   },
 * });
 */
export function useSpaceMembershipByIdQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables> &
    ({ variables: SpaceMembershipByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables>(
    SpaceMembershipByIdDocument,
    options
  )
}
export function useSpaceMembershipByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables>(
    SpaceMembershipByIdDocument,
    options
  )
}
export function useSpaceMembershipByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceMembershipByIdQuery, SpaceMembershipByIdQueryVariables>(
    SpaceMembershipByIdDocument,
    options
  )
}
export type SpaceMembershipByIdQueryHookResult = ReturnType<typeof useSpaceMembershipByIdQuery>
export type SpaceMembershipByIdLazyQueryHookResult = ReturnType<typeof useSpaceMembershipByIdLazyQuery>
export type SpaceMembershipByIdSuspenseQueryHookResult = ReturnType<typeof useSpaceMembershipByIdSuspenseQuery>
export type SpaceMembershipByIdQueryResult = Apollo.QueryResult<
  SpaceMembershipByIdQuery,
  SpaceMembershipByIdQueryVariables
>
export const RepresentativeBySpaceIdDocument = gql`
    query RepresentativeBySpaceId($idOrName: String!) {
  spaceById(idOrName: $idOrName) {
    connectionStatusToMyself
    representatives {
      user {
        id
        identity
      }
    }
  }
}
    `

/**
 * __useRepresentativeBySpaceIdQuery__
 *
 * To run a query within a React component, call `useRepresentativeBySpaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useRepresentativeBySpaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRepresentativeBySpaceIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *   },
 * });
 */
export function useRepresentativeBySpaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables> &
    ({ variables: RepresentativeBySpaceIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables>(
    RepresentativeBySpaceIdDocument,
    options
  )
}
export function useRepresentativeBySpaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables>(
    RepresentativeBySpaceIdDocument,
    options
  )
}
export function useRepresentativeBySpaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RepresentativeBySpaceIdQuery, RepresentativeBySpaceIdQueryVariables>(
    RepresentativeBySpaceIdDocument,
    options
  )
}
export type RepresentativeBySpaceIdQueryHookResult = ReturnType<typeof useRepresentativeBySpaceIdQuery>
export type RepresentativeBySpaceIdLazyQueryHookResult = ReturnType<typeof useRepresentativeBySpaceIdLazyQuery>
export type RepresentativeBySpaceIdSuspenseQueryHookResult = ReturnType<typeof useRepresentativeBySpaceIdSuspenseQuery>
export type RepresentativeBySpaceIdQueryResult = Apollo.QueryResult<
  RepresentativeBySpaceIdQuery,
  RepresentativeBySpaceIdQueryVariables
>
export const SpaceMembershiByIdAllMembersDocument = gql`
    query SpaceMembershiByIdAllMembers($idOrName: String!) {
  spaceById(idOrName: $idOrName) {
    id
    name
    connectionStatusToMyself
    members(limit: 100000) {
      totalResults
      data {
        user {
          id
        }
      }
    }
  }
}
    `

/**
 * __useSpaceMembershiByIdAllMembersQuery__
 *
 * To run a query within a React component, call `useSpaceMembershiByIdAllMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceMembershiByIdAllMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceMembershiByIdAllMembersQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *   },
 * });
 */
export function useSpaceMembershiByIdAllMembersQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceMembershiByIdAllMembersQuery, SpaceMembershiByIdAllMembersQueryVariables> &
    ({ variables: SpaceMembershiByIdAllMembersQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceMembershiByIdAllMembersQuery, SpaceMembershiByIdAllMembersQueryVariables>(
    SpaceMembershiByIdAllMembersDocument,
    options
  )
}
export function useSpaceMembershiByIdAllMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SpaceMembershiByIdAllMembersQuery,
    SpaceMembershiByIdAllMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceMembershiByIdAllMembersQuery, SpaceMembershiByIdAllMembersQueryVariables>(
    SpaceMembershiByIdAllMembersDocument,
    options
  )
}
export function useSpaceMembershiByIdAllMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceMembershiByIdAllMembersQuery, SpaceMembershiByIdAllMembersQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceMembershiByIdAllMembersQuery, SpaceMembershiByIdAllMembersQueryVariables>(
    SpaceMembershiByIdAllMembersDocument,
    options
  )
}
export type SpaceMembershiByIdAllMembersQueryHookResult = ReturnType<typeof useSpaceMembershiByIdAllMembersQuery>
export type SpaceMembershiByIdAllMembersLazyQueryHookResult = ReturnType<
  typeof useSpaceMembershiByIdAllMembersLazyQuery
>
export type SpaceMembershiByIdAllMembersSuspenseQueryHookResult = ReturnType<
  typeof useSpaceMembershiByIdAllMembersSuspenseQuery
>
export type SpaceMembershiByIdAllMembersQueryResult = Apollo.QueryResult<
  SpaceMembershiByIdAllMembersQuery,
  SpaceMembershiByIdAllMembersQueryVariables
>
export const SpacesByMemberDocument = gql`
    query SpacesByMember($memberId: UUID) {
  spaces(memberId: $memberId) {
    ...MemberSpaces
  }
}
    ${MemberSpacesFragmentDoc}`

/**
 * __useSpacesByMemberQuery__
 *
 * To run a query within a React component, call `useSpacesByMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpacesByMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpacesByMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useSpacesByMemberQuery(
  baseOptions?: Apollo.QueryHookOptions<SpacesByMemberQuery, SpacesByMemberQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpacesByMemberQuery, SpacesByMemberQueryVariables>(SpacesByMemberDocument, options)
}
export function useSpacesByMemberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpacesByMemberQuery, SpacesByMemberQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpacesByMemberQuery, SpacesByMemberQueryVariables>(SpacesByMemberDocument, options)
}
export function useSpacesByMemberSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SpacesByMemberQuery, SpacesByMemberQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpacesByMemberQuery, SpacesByMemberQueryVariables>(SpacesByMemberDocument, options)
}
export type SpacesByMemberQueryHookResult = ReturnType<typeof useSpacesByMemberQuery>
export type SpacesByMemberLazyQueryHookResult = ReturnType<typeof useSpacesByMemberLazyQuery>
export type SpacesByMemberSuspenseQueryHookResult = ReturnType<typeof useSpacesByMemberSuspenseQuery>
export type SpacesByMemberQueryResult = Apollo.QueryResult<SpacesByMemberQuery, SpacesByMemberQueryVariables>
export const SpaceMembersBySpaceIdDocument = gql`
    query SpaceMembersBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
  spaceById(idOrName: $idOrName) {
    id
    members(limit: $limit, offset: $offset) {
      ...SpaceMemberList
    }
  }
}
    ${SpaceMemberListFragmentDoc}`

/**
 * __useSpaceMembersBySpaceIdQuery__
 *
 * To run a query within a React component, call `useSpaceMembersBySpaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceMembersBySpaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceMembersBySpaceIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpaceMembersBySpaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables> &
    ({ variables: SpaceMembersBySpaceIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables>(
    SpaceMembersBySpaceIdDocument,
    options
  )
}
export function useSpaceMembersBySpaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables>(
    SpaceMembersBySpaceIdDocument,
    options
  )
}
export function useSpaceMembersBySpaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceMembersBySpaceIdQuery, SpaceMembersBySpaceIdQueryVariables>(
    SpaceMembersBySpaceIdDocument,
    options
  )
}
export type SpaceMembersBySpaceIdQueryHookResult = ReturnType<typeof useSpaceMembersBySpaceIdQuery>
export type SpaceMembersBySpaceIdLazyQueryHookResult = ReturnType<typeof useSpaceMembersBySpaceIdLazyQuery>
export type SpaceMembersBySpaceIdSuspenseQueryHookResult = ReturnType<typeof useSpaceMembersBySpaceIdSuspenseQuery>
export type SpaceMembersBySpaceIdQueryResult = Apollo.QueryResult<
  SpaceMembersBySpaceIdQuery,
  SpaceMembersBySpaceIdQueryVariables
>
export const SpaceMembershipRequestsBySpaceIdDocument = gql`
    query SpaceMembershipRequestsBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
  spaceById(idOrName: $idOrName) {
    id
    membershipRequests(limit: $limit, offset: $offset) {
      ...SpaceMembershipRequestList
    }
  }
}
    ${SpaceMembershipRequestListFragmentDoc}`

/**
 * __useSpaceMembershipRequestsBySpaceIdQuery__
 *
 * To run a query within a React component, call `useSpaceMembershipRequestsBySpaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceMembershipRequestsBySpaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceMembershipRequestsBySpaceIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpaceMembershipRequestsBySpaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    SpaceMembershipRequestsBySpaceIdQuery,
    SpaceMembershipRequestsBySpaceIdQueryVariables
  > &
    ({ variables: SpaceMembershipRequestsBySpaceIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceMembershipRequestsBySpaceIdQuery, SpaceMembershipRequestsBySpaceIdQueryVariables>(
    SpaceMembershipRequestsBySpaceIdDocument,
    options
  )
}
export function useSpaceMembershipRequestsBySpaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SpaceMembershipRequestsBySpaceIdQuery,
    SpaceMembershipRequestsBySpaceIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceMembershipRequestsBySpaceIdQuery, SpaceMembershipRequestsBySpaceIdQueryVariables>(
    SpaceMembershipRequestsBySpaceIdDocument,
    options
  )
}
export function useSpaceMembershipRequestsBySpaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SpaceMembershipRequestsBySpaceIdQuery,
        SpaceMembershipRequestsBySpaceIdQueryVariables
      >
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceMembershipRequestsBySpaceIdQuery, SpaceMembershipRequestsBySpaceIdQueryVariables>(
    SpaceMembershipRequestsBySpaceIdDocument,
    options
  )
}
export type SpaceMembershipRequestsBySpaceIdQueryHookResult = ReturnType<
  typeof useSpaceMembershipRequestsBySpaceIdQuery
>
export type SpaceMembershipRequestsBySpaceIdLazyQueryHookResult = ReturnType<
  typeof useSpaceMembershipRequestsBySpaceIdLazyQuery
>
export type SpaceMembershipRequestsBySpaceIdSuspenseQueryHookResult = ReturnType<
  typeof useSpaceMembershipRequestsBySpaceIdSuspenseQuery
>
export type SpaceMembershipRequestsBySpaceIdQueryResult = Apollo.QueryResult<
  SpaceMembershipRequestsBySpaceIdQuery,
  SpaceMembershipRequestsBySpaceIdQueryVariables
>
export const SpaceInvitesBySpaceIdDocument = gql`
    query SpaceInvitesBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
  spaceById(idOrName: $idOrName) {
    id
    invites(limit: $limit, offset: $offset) {
      ...SpaceInviteList
    }
  }
}
    ${SpaceInviteListFragmentDoc}`

/**
 * __useSpaceInvitesBySpaceIdQuery__
 *
 * To run a query within a React component, call `useSpaceInvitesBySpaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceInvitesBySpaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceInvitesBySpaceIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpaceInvitesBySpaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables> &
    ({ variables: SpaceInvitesBySpaceIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables>(
    SpaceInvitesBySpaceIdDocument,
    options
  )
}
export function useSpaceInvitesBySpaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables>(
    SpaceInvitesBySpaceIdDocument,
    options
  )
}
export function useSpaceInvitesBySpaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceInvitesBySpaceIdQuery, SpaceInvitesBySpaceIdQueryVariables>(
    SpaceInvitesBySpaceIdDocument,
    options
  )
}
export type SpaceInvitesBySpaceIdQueryHookResult = ReturnType<typeof useSpaceInvitesBySpaceIdQuery>
export type SpaceInvitesBySpaceIdLazyQueryHookResult = ReturnType<typeof useSpaceInvitesBySpaceIdLazyQuery>
export type SpaceInvitesBySpaceIdSuspenseQueryHookResult = ReturnType<typeof useSpaceInvitesBySpaceIdSuspenseQuery>
export type SpaceInvitesBySpaceIdQueryResult = Apollo.QueryResult<
  SpaceInvitesBySpaceIdQuery,
  SpaceInvitesBySpaceIdQueryVariables
>
export const UsersByNameWithSpaceConnectionDocument = gql`
    query UsersByNameWithSpaceConnection($substring: String!, $spaceId: UUID!, $limit: Int!, $offset: Int!) {
  userByName(substring: $substring, limit: $limit, offset: $offset) {
    data {
      ...UserAvatar
      connectionStatusToMyself
      connectionStatusToSpace(spaceId: $spaceId)
    }
    totalResults
  }
}
    ${UserAvatarFragmentDoc}`

/**
 * __useUsersByNameWithSpaceConnectionQuery__
 *
 * To run a query within a React component, call `useUsersByNameWithSpaceConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByNameWithSpaceConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersByNameWithSpaceConnectionQuery({
 *   variables: {
 *      substring: // value for 'substring'
 *      spaceId: // value for 'spaceId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useUsersByNameWithSpaceConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    UsersByNameWithSpaceConnectionQuery,
    UsersByNameWithSpaceConnectionQueryVariables
  > &
    ({ variables: UsersByNameWithSpaceConnectionQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UsersByNameWithSpaceConnectionQuery, UsersByNameWithSpaceConnectionQueryVariables>(
    UsersByNameWithSpaceConnectionDocument,
    options
  )
}
export function useUsersByNameWithSpaceConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UsersByNameWithSpaceConnectionQuery,
    UsersByNameWithSpaceConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UsersByNameWithSpaceConnectionQuery, UsersByNameWithSpaceConnectionQueryVariables>(
    UsersByNameWithSpaceConnectionDocument,
    options
  )
}
export function useUsersByNameWithSpaceConnectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UsersByNameWithSpaceConnectionQuery, UsersByNameWithSpaceConnectionQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UsersByNameWithSpaceConnectionQuery, UsersByNameWithSpaceConnectionQueryVariables>(
    UsersByNameWithSpaceConnectionDocument,
    options
  )
}
export type UsersByNameWithSpaceConnectionQueryHookResult = ReturnType<typeof useUsersByNameWithSpaceConnectionQuery>
export type UsersByNameWithSpaceConnectionLazyQueryHookResult = ReturnType<
  typeof useUsersByNameWithSpaceConnectionLazyQuery
>
export type UsersByNameWithSpaceConnectionSuspenseQueryHookResult = ReturnType<
  typeof useUsersByNameWithSpaceConnectionSuspenseQuery
>
export type UsersByNameWithSpaceConnectionQueryResult = Apollo.QueryResult<
  UsersByNameWithSpaceConnectionQuery,
  UsersByNameWithSpaceConnectionQueryVariables
>
export const ConnectedUsersWithSpaceConnectionDocument = gql`
    query ConnectedUsersWithSpaceConnection($spaceId: UUID!, $offset: Int! = 0, $limit: Int! = 20) {
  connectedUsers(limit: $limit, offset: $offset) {
    totalResults
    data {
      ...UserAvatar
      connectionStatusToSpace(spaceId: $spaceId)
      connectionStatusToMyself
    }
  }
}
    ${UserAvatarFragmentDoc}`

/**
 * __useConnectedUsersWithSpaceConnectionQuery__
 *
 * To run a query within a React component, call `useConnectedUsersWithSpaceConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useConnectedUsersWithSpaceConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectedUsersWithSpaceConnectionQuery({
 *   variables: {
 *      spaceId: // value for 'spaceId'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useConnectedUsersWithSpaceConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    ConnectedUsersWithSpaceConnectionQuery,
    ConnectedUsersWithSpaceConnectionQueryVariables
  > &
    ({ variables: ConnectedUsersWithSpaceConnectionQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ConnectedUsersWithSpaceConnectionQuery, ConnectedUsersWithSpaceConnectionQueryVariables>(
    ConnectedUsersWithSpaceConnectionDocument,
    options
  )
}
export function useConnectedUsersWithSpaceConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ConnectedUsersWithSpaceConnectionQuery,
    ConnectedUsersWithSpaceConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ConnectedUsersWithSpaceConnectionQuery, ConnectedUsersWithSpaceConnectionQueryVariables>(
    ConnectedUsersWithSpaceConnectionDocument,
    options
  )
}
export function useConnectedUsersWithSpaceConnectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        ConnectedUsersWithSpaceConnectionQuery,
        ConnectedUsersWithSpaceConnectionQueryVariables
      >
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    ConnectedUsersWithSpaceConnectionQuery,
    ConnectedUsersWithSpaceConnectionQueryVariables
  >(ConnectedUsersWithSpaceConnectionDocument, options)
}
export type ConnectedUsersWithSpaceConnectionQueryHookResult = ReturnType<
  typeof useConnectedUsersWithSpaceConnectionQuery
>
export type ConnectedUsersWithSpaceConnectionLazyQueryHookResult = ReturnType<
  typeof useConnectedUsersWithSpaceConnectionLazyQuery
>
export type ConnectedUsersWithSpaceConnectionSuspenseQueryHookResult = ReturnType<
  typeof useConnectedUsersWithSpaceConnectionSuspenseQuery
>
export type ConnectedUsersWithSpaceConnectionQueryResult = Apollo.QueryResult<
  ConnectedUsersWithSpaceConnectionQuery,
  ConnectedUsersWithSpaceConnectionQueryVariables
>
export const SpacePostsBySpaceIdDocument = gql`
    query SpacePostsBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 10, $visibility: VisibilityFilter!) {
  spaceById(idOrName: $idOrName) {
    id
    hasPublicPosts
    hasPrivatePosts
    posts(offset: $offset, limit: $limit, visibility: $visibility) {
      data {
        ...PostFragment
      }
      totalResults
    }
  }
}
    ${PostFragmentFragmentDoc}`

/**
 * __useSpacePostsBySpaceIdQuery__
 *
 * To run a query within a React component, call `useSpacePostsBySpaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpacePostsBySpaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpacePostsBySpaceIdQuery({
 *   variables: {
 *      idOrName: // value for 'idOrName'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      visibility: // value for 'visibility'
 *   },
 * });
 */
export function useSpacePostsBySpaceIdQuery(
  baseOptions: Apollo.QueryHookOptions<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables> &
    ({ variables: SpacePostsBySpaceIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables>(
    SpacePostsBySpaceIdDocument,
    options
  )
}
export function useSpacePostsBySpaceIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables>(
    SpacePostsBySpaceIdDocument,
    options
  )
}
export function useSpacePostsBySpaceIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpacePostsBySpaceIdQuery, SpacePostsBySpaceIdQueryVariables>(
    SpacePostsBySpaceIdDocument,
    options
  )
}
export type SpacePostsBySpaceIdQueryHookResult = ReturnType<typeof useSpacePostsBySpaceIdQuery>
export type SpacePostsBySpaceIdLazyQueryHookResult = ReturnType<typeof useSpacePostsBySpaceIdLazyQuery>
export type SpacePostsBySpaceIdSuspenseQueryHookResult = ReturnType<typeof useSpacePostsBySpaceIdSuspenseQuery>
export type SpacePostsBySpaceIdQueryResult = Apollo.QueryResult<
  SpacePostsBySpaceIdQuery,
  SpacePostsBySpaceIdQueryVariables
>
export const DiscoverSpacesDocument = gql`
    query DiscoverSpaces($topicsV2: [String!], $geolocation: GeoJSON, $skillsV2: [String!], $offset: Int! = 0, $limit: Int! = 5) {
  discoverSpaces(
    topicsV2: $topicsV2
    geolocation: $geolocation
    skillsV2: $skillsV2
    offset: $offset
    limit: $limit
  ) {
    topicV2
    locationId
    skillV2
    spaces {
      totalResults
      data {
        ...SpaceOverview
      }
    }
  }
}
    ${SpaceOverviewFragmentDoc}`

/**
 * __useDiscoverSpacesQuery__
 *
 * To run a query within a React component, call `useDiscoverSpacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverSpacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverSpacesQuery({
 *   variables: {
 *      topicsV2: // value for 'topicsV2'
 *      geolocation: // value for 'geolocation'
 *      skillsV2: // value for 'skillsV2'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useDiscoverSpacesQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>(DiscoverSpacesDocument, options)
}
export function useDiscoverSpacesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>(DiscoverSpacesDocument, options)
}
export function useDiscoverSpacesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>(DiscoverSpacesDocument, options)
}
export type DiscoverSpacesQueryHookResult = ReturnType<typeof useDiscoverSpacesQuery>
export type DiscoverSpacesLazyQueryHookResult = ReturnType<typeof useDiscoverSpacesLazyQuery>
export type DiscoverSpacesSuspenseQueryHookResult = ReturnType<typeof useDiscoverSpacesSuspenseQuery>
export type DiscoverSpacesQueryResult = Apollo.QueryResult<DiscoverSpacesQuery, DiscoverSpacesQueryVariables>
export const MySpacesDocument = gql`
    query MySpaces {
  mySpaces {
    section
    type
    spaces {
      totalResults
      data {
        ...SpaceOverview
      }
    }
  }
}
    ${SpaceOverviewFragmentDoc}`

/**
 * __useMySpacesQuery__
 *
 * To run a query within a React component, call `useMySpacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySpacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySpacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySpacesQuery(baseOptions?: Apollo.QueryHookOptions<MySpacesQuery, MySpacesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MySpacesQuery, MySpacesQueryVariables>(MySpacesDocument, options)
}
export function useMySpacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySpacesQuery, MySpacesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MySpacesQuery, MySpacesQueryVariables>(MySpacesDocument, options)
}
export function useMySpacesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MySpacesQuery, MySpacesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MySpacesQuery, MySpacesQueryVariables>(MySpacesDocument, options)
}
export type MySpacesQueryHookResult = ReturnType<typeof useMySpacesQuery>
export type MySpacesLazyQueryHookResult = ReturnType<typeof useMySpacesLazyQuery>
export type MySpacesSuspenseQueryHookResult = ReturnType<typeof useMySpacesSuspenseQuery>
export type MySpacesQueryResult = Apollo.QueryResult<MySpacesQuery, MySpacesQueryVariables>
export const SpacesDocument = gql`
    query Spaces($topicsV2: [String!], $geolocation: GeoJSON, $skillsV2: [String!], $offset: Int! = 0, $limit: Int! = 12) {
  spaces(
    topicsV2: $topicsV2
    geolocation: $geolocation
    skillsV2: $skillsV2
    offset: $offset
    limit: $limit
  ) {
    totalResults
    data {
      ...SpaceOverview
    }
  }
}
    ${SpaceOverviewFragmentDoc}`

/**
 * __useSpacesQuery__
 *
 * To run a query within a React component, call `useSpacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpacesQuery({
 *   variables: {
 *      topicsV2: // value for 'topicsV2'
 *      geolocation: // value for 'geolocation'
 *      skillsV2: // value for 'skillsV2'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpacesQuery(baseOptions?: Apollo.QueryHookOptions<SpacesQuery, SpacesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpacesQuery, SpacesQueryVariables>(SpacesDocument, options)
}
export function useSpacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpacesQuery, SpacesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpacesQuery, SpacesQueryVariables>(SpacesDocument, options)
}
export function useSpacesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SpacesQuery, SpacesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpacesQuery, SpacesQueryVariables>(SpacesDocument, options)
}
export type SpacesQueryHookResult = ReturnType<typeof useSpacesQuery>
export type SpacesLazyQueryHookResult = ReturnType<typeof useSpacesLazyQuery>
export type SpacesSuspenseQueryHookResult = ReturnType<typeof useSpacesSuspenseQuery>
export type SpacesQueryResult = Apollo.QueryResult<SpacesQuery, SpacesQueryVariables>
export const DiscoverSpacesDefaultTopicsDocument = gql`
    query DiscoverSpacesDefaultTopics {
  discoverSpacesDefaultTopicsV2
}
    `

/**
 * __useDiscoverSpacesDefaultTopicsQuery__
 *
 * To run a query within a React component, call `useDiscoverSpacesDefaultTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverSpacesDefaultTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverSpacesDefaultTopicsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverSpacesDefaultTopicsQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>(
    DiscoverSpacesDefaultTopicsDocument,
    options
  )
}
export function useDiscoverSpacesDefaultTopicsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>(
    DiscoverSpacesDefaultTopicsDocument,
    options
  )
}
export function useDiscoverSpacesDefaultTopicsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<DiscoverSpacesDefaultTopicsQuery, DiscoverSpacesDefaultTopicsQueryVariables>(
    DiscoverSpacesDefaultTopicsDocument,
    options
  )
}
export type DiscoverSpacesDefaultTopicsQueryHookResult = ReturnType<typeof useDiscoverSpacesDefaultTopicsQuery>
export type DiscoverSpacesDefaultTopicsLazyQueryHookResult = ReturnType<typeof useDiscoverSpacesDefaultTopicsLazyQuery>
export type DiscoverSpacesDefaultTopicsSuspenseQueryHookResult = ReturnType<
  typeof useDiscoverSpacesDefaultTopicsSuspenseQuery
>
export type DiscoverSpacesDefaultTopicsQueryResult = Apollo.QueryResult<
  DiscoverSpacesDefaultTopicsQuery,
  DiscoverSpacesDefaultTopicsQueryVariables
>
export const TaskByIdDocument = gql`
    query TaskById($id: UUID!) {
  taskById(id: $id) {
    id
    name
    description
    impact
    slotsAvailable
    slotsTaken
    location
    regularity
    duration
    timeframeStartDate
    timeframeEndDate
    visibility
    isFavorite
    locationType
    interactionType
    contactEmail
    contactPhone
    thumbnail
    thumbnailBlurhash
    totalCompletions
    created
    creator {
      id
      avatar
      avatarBlurhash
      fullName
    }
    space {
      id
      connectionStatusToMyself
      name
      title
      avatar
      avatarBlurhash
      topicsV2
    }
    skillsV2
    interactionSignupLink
    geolocation {
      latitude
      longitude
    }
  }
}
    `

/**
 * __useTaskByIdQuery__
 *
 * To run a query within a React component, call `useTaskByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskByIdQuery(
  baseOptions: Apollo.QueryHookOptions<TaskByIdQuery, TaskByIdQueryVariables> &
    ({ variables: TaskByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TaskByIdQuery, TaskByIdQueryVariables>(TaskByIdDocument, options)
}
export function useTaskByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskByIdQuery, TaskByIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TaskByIdQuery, TaskByIdQueryVariables>(TaskByIdDocument, options)
}
export function useTaskByIdSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TaskByIdQuery, TaskByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TaskByIdQuery, TaskByIdQueryVariables>(TaskByIdDocument, options)
}
export type TaskByIdQueryHookResult = ReturnType<typeof useTaskByIdQuery>
export type TaskByIdLazyQueryHookResult = ReturnType<typeof useTaskByIdLazyQuery>
export type TaskByIdSuspenseQueryHookResult = ReturnType<typeof useTaskByIdSuspenseQuery>
export type TaskByIdQueryResult = Apollo.QueryResult<TaskByIdQuery, TaskByIdQueryVariables>
export const CreateTaskDocument = gql`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    name
    description
    impact
    visibility
    regularity
    duration
    timeframeStartDate
    timeframeEndDate
    locationType
    location
    contactEmail
    contactPhone
    interactionType
    interactionSignupLink
  }
}
    `
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options)
}
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>
export const UpdateTaskDocument = gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
    name
    description
    impact
    visibility
    regularity
    duration
    timeframeStartDate
    timeframeEndDate
    locationType
    location
    contactEmail
    contactPhone
    thumbnail
    thumbnailBlurhash
    interactionType
    interactionSignupLink
  }
}
    `
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options)
}
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: UUID!) {
  deleteTask(id: $id) {
    success
  }
}
    `
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options)
}
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>
export const AuthenticatedUserDocument = gql`
    query AuthenticatedUser {
  authenticatedUser {
    ...FullUser
  }
}
    ${FullUserFragmentDoc}`

/**
 * __useAuthenticatedUserQuery__
 *
 * To run a query within a React component, call `useAuthenticatedUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthenticatedUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthenticatedUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthenticatedUserQuery(
  baseOptions?: Apollo.QueryHookOptions<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>(AuthenticatedUserDocument, options)
}
export function useAuthenticatedUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>(
    AuthenticatedUserDocument,
    options
  )
}
export function useAuthenticatedUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>(
    AuthenticatedUserDocument,
    options
  )
}
export type AuthenticatedUserQueryHookResult = ReturnType<typeof useAuthenticatedUserQuery>
export type AuthenticatedUserLazyQueryHookResult = ReturnType<typeof useAuthenticatedUserLazyQuery>
export type AuthenticatedUserSuspenseQueryHookResult = ReturnType<typeof useAuthenticatedUserSuspenseQuery>
export type AuthenticatedUserQueryResult = Apollo.QueryResult<AuthenticatedUserQuery, AuthenticatedUserQueryVariables>
export const CommittedVolunteeringOpportunitiesDocument = gql`
    query CommittedVolunteeringOpportunities($offset: Int!, $limit: Int!) {
  committedVolunteeringOpportunities(offset: $offset, limit: $limit) {
    data {
      status
      externalVolunteeringOpportunityId
    }
    totalResults
  }
}
    `

/**
 * __useCommittedVolunteeringOpportunitiesQuery__
 *
 * To run a query within a React component, call `useCommittedVolunteeringOpportunitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommittedVolunteeringOpportunitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommittedVolunteeringOpportunitiesQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useCommittedVolunteeringOpportunitiesQuery(
  baseOptions: Apollo.QueryHookOptions<
    CommittedVolunteeringOpportunitiesQuery,
    CommittedVolunteeringOpportunitiesQueryVariables
  > &
    ({ variables: CommittedVolunteeringOpportunitiesQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CommittedVolunteeringOpportunitiesQuery, CommittedVolunteeringOpportunitiesQueryVariables>(
    CommittedVolunteeringOpportunitiesDocument,
    options
  )
}
export function useCommittedVolunteeringOpportunitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CommittedVolunteeringOpportunitiesQuery,
    CommittedVolunteeringOpportunitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CommittedVolunteeringOpportunitiesQuery, CommittedVolunteeringOpportunitiesQueryVariables>(
    CommittedVolunteeringOpportunitiesDocument,
    options
  )
}
export function useCommittedVolunteeringOpportunitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        CommittedVolunteeringOpportunitiesQuery,
        CommittedVolunteeringOpportunitiesQueryVariables
      >
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    CommittedVolunteeringOpportunitiesQuery,
    CommittedVolunteeringOpportunitiesQueryVariables
  >(CommittedVolunteeringOpportunitiesDocument, options)
}
export type CommittedVolunteeringOpportunitiesQueryHookResult = ReturnType<
  typeof useCommittedVolunteeringOpportunitiesQuery
>
export type CommittedVolunteeringOpportunitiesLazyQueryHookResult = ReturnType<
  typeof useCommittedVolunteeringOpportunitiesLazyQuery
>
export type CommittedVolunteeringOpportunitiesSuspenseQueryHookResult = ReturnType<
  typeof useCommittedVolunteeringOpportunitiesSuspenseQuery
>
export type CommittedVolunteeringOpportunitiesQueryResult = Apollo.QueryResult<
  CommittedVolunteeringOpportunitiesQuery,
  CommittedVolunteeringOpportunitiesQueryVariables
>
export const GlobalRewardsCounterDocument = gql`
    query GlobalRewardsCounter {
  rewards_globalCounter {
    counter
  }
}
    `

/**
 * __useGlobalRewardsCounterQuery__
 *
 * To run a query within a React component, call `useGlobalRewardsCounterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalRewardsCounterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalRewardsCounterQuery({
 *   variables: {
 *   },
 * });
 */
export function useGlobalRewardsCounterQuery(
  baseOptions?: Apollo.QueryHookOptions<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>(
    GlobalRewardsCounterDocument,
    options
  )
}
export function useGlobalRewardsCounterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>(
    GlobalRewardsCounterDocument,
    options
  )
}
export function useGlobalRewardsCounterSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GlobalRewardsCounterQuery, GlobalRewardsCounterQueryVariables>(
    GlobalRewardsCounterDocument,
    options
  )
}
export type GlobalRewardsCounterQueryHookResult = ReturnType<typeof useGlobalRewardsCounterQuery>
export type GlobalRewardsCounterLazyQueryHookResult = ReturnType<typeof useGlobalRewardsCounterLazyQuery>
export type GlobalRewardsCounterSuspenseQueryHookResult = ReturnType<typeof useGlobalRewardsCounterSuspenseQuery>
export type GlobalRewardsCounterQueryResult = Apollo.QueryResult<
  GlobalRewardsCounterQuery,
  GlobalRewardsCounterQueryVariables
>
export const RewardsTransactionsDocument = gql`
    query RewardsTransactions($offset: Int!, $limit: Int!) {
  rewards_transactions(offset: $offset, limit: $limit) {
    totalResults
    data {
      id
      rewardType
      createdAt
    }
  }
}
    `

/**
 * __useRewardsTransactionsQuery__
 *
 * To run a query within a React component, call `useRewardsTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRewardsTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRewardsTransactionsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useRewardsTransactionsQuery(
  baseOptions: Apollo.QueryHookOptions<RewardsTransactionsQuery, RewardsTransactionsQueryVariables> &
    ({ variables: RewardsTransactionsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RewardsTransactionsQuery, RewardsTransactionsQueryVariables>(
    RewardsTransactionsDocument,
    options
  )
}
export function useRewardsTransactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RewardsTransactionsQuery, RewardsTransactionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RewardsTransactionsQuery, RewardsTransactionsQueryVariables>(
    RewardsTransactionsDocument,
    options
  )
}
export function useRewardsTransactionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<RewardsTransactionsQuery, RewardsTransactionsQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RewardsTransactionsQuery, RewardsTransactionsQueryVariables>(
    RewardsTransactionsDocument,
    options
  )
}
export type RewardsTransactionsQueryHookResult = ReturnType<typeof useRewardsTransactionsQuery>
export type RewardsTransactionsLazyQueryHookResult = ReturnType<typeof useRewardsTransactionsLazyQuery>
export type RewardsTransactionsSuspenseQueryHookResult = ReturnType<typeof useRewardsTransactionsSuspenseQuery>
export type RewardsTransactionsQueryResult = Apollo.QueryResult<
  RewardsTransactionsQuery,
  RewardsTransactionsQueryVariables
>
export const BadgesDocument = gql`
    query badges {
  rewards_badges {
    inProgress {
      progressGoal
      progressMade
      slug
    }
    unlocked {
      id
      seenAt
      slug
      unlockedAt
    }
  }
}
    `

/**
 * __useBadgesQuery__
 *
 * To run a query within a React component, call `useBadgesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBadgesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBadgesQuery({
 *   variables: {
 *   },
 * });
 */
export function useBadgesQuery(baseOptions?: Apollo.QueryHookOptions<BadgesQuery, BadgesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<BadgesQuery, BadgesQueryVariables>(BadgesDocument, options)
}
export function useBadgesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BadgesQuery, BadgesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<BadgesQuery, BadgesQueryVariables>(BadgesDocument, options)
}
export function useBadgesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BadgesQuery, BadgesQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<BadgesQuery, BadgesQueryVariables>(BadgesDocument, options)
}
export type BadgesQueryHookResult = ReturnType<typeof useBadgesQuery>
export type BadgesLazyQueryHookResult = ReturnType<typeof useBadgesLazyQuery>
export type BadgesSuspenseQueryHookResult = ReturnType<typeof useBadgesSuspenseQuery>
export type BadgesQueryResult = Apollo.QueryResult<BadgesQuery, BadgesQueryVariables>
export const MarkBadgeAsSeenDocument = gql`
    mutation markBadgeAsSeen($unlockId: ID!) {
  rewards_markBadgeUnlockAsSeen(unlockId: $unlockId) {
    id
    seenAt
    slug
    unlockedAt
  }
}
    `
export type MarkBadgeAsSeenMutationFn = Apollo.MutationFunction<
  MarkBadgeAsSeenMutation,
  MarkBadgeAsSeenMutationVariables
>

/**
 * __useMarkBadgeAsSeenMutation__
 *
 * To run a mutation, you first call `useMarkBadgeAsSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkBadgeAsSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markBadgeAsSeenMutation, { data, loading, error }] = useMarkBadgeAsSeenMutation({
 *   variables: {
 *      unlockId: // value for 'unlockId'
 *   },
 * });
 */
export function useMarkBadgeAsSeenMutation(
  baseOptions?: Apollo.MutationHookOptions<MarkBadgeAsSeenMutation, MarkBadgeAsSeenMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<MarkBadgeAsSeenMutation, MarkBadgeAsSeenMutationVariables>(MarkBadgeAsSeenDocument, options)
}
export type MarkBadgeAsSeenMutationHookResult = ReturnType<typeof useMarkBadgeAsSeenMutation>
export type MarkBadgeAsSeenMutationResult = Apollo.MutationResult<MarkBadgeAsSeenMutation>
export type MarkBadgeAsSeenMutationOptions = Apollo.BaseMutationOptions<
  MarkBadgeAsSeenMutation,
  MarkBadgeAsSeenMutationVariables
>
export const Typesense_DocumentByIdDocument = gql`
    query typesense_documentById($id: String!, $documentType: String!) {
  typesense_documentById(id: $id, documentType: $documentType) {
    ... on Typesense_SearchResponseSuccess {
      hits {
        document {
          ...FullTypesenseDocument
        }
      }
    }
    ... on Typesense_SearchResponseError {
      error
      code
    }
  }
}
    ${FullTypesenseDocumentFragmentDoc}`

/**
 * __useTypesense_DocumentByIdQuery__
 *
 * To run a query within a React component, call `useTypesense_DocumentByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTypesense_DocumentByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTypesense_DocumentByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      documentType: // value for 'documentType'
 *   },
 * });
 */
export function useTypesense_DocumentByIdQuery(
  baseOptions: Apollo.QueryHookOptions<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables> &
    ({ variables: Typesense_DocumentByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables>(
    Typesense_DocumentByIdDocument,
    options
  )
}
export function useTypesense_DocumentByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables>(
    Typesense_DocumentByIdDocument,
    options
  )
}
export function useTypesense_DocumentByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<Typesense_DocumentByIdQuery, Typesense_DocumentByIdQueryVariables>(
    Typesense_DocumentByIdDocument,
    options
  )
}
export type Typesense_DocumentByIdQueryHookResult = ReturnType<typeof useTypesense_DocumentByIdQuery>
export type Typesense_DocumentByIdLazyQueryHookResult = ReturnType<typeof useTypesense_DocumentByIdLazyQuery>
export type Typesense_DocumentByIdSuspenseQueryHookResult = ReturnType<typeof useTypesense_DocumentByIdSuspenseQuery>
export type Typesense_DocumentByIdQueryResult = Apollo.QueryResult<
  Typesense_DocumentByIdQuery,
  Typesense_DocumentByIdQueryVariables
>
export const Typesense_MultiSearchDocument = gql`
    query typesense_multiSearch($input: Typesense_MultiSearchRequest_Input!) {
  typesense_multiSearch(input: $input) {
    results {
      ... on Typesense_SearchResponseSuccess {
        found
        page
        hits {
          document {
            ...FullTypesenseDocument
          }
        }
        facet_counts {
          counts {
            count
            value
          }
          field_name
        }
      }
      ... on Typesense_SearchResponseError {
        error
        code
      }
    }
  }
}
    ${FullTypesenseDocumentFragmentDoc}`

/**
 * __useTypesense_MultiSearchQuery__
 *
 * To run a query within a React component, call `useTypesense_MultiSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTypesense_MultiSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTypesense_MultiSearchQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTypesense_MultiSearchQuery(
  baseOptions: Apollo.QueryHookOptions<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables> &
    ({ variables: Typesense_MultiSearchQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables>(
    Typesense_MultiSearchDocument,
    options
  )
}
export function useTypesense_MultiSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables>(
    Typesense_MultiSearchDocument,
    options
  )
}
export function useTypesense_MultiSearchSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<Typesense_MultiSearchQuery, Typesense_MultiSearchQueryVariables>(
    Typesense_MultiSearchDocument,
    options
  )
}
export type Typesense_MultiSearchQueryHookResult = ReturnType<typeof useTypesense_MultiSearchQuery>
export type Typesense_MultiSearchLazyQueryHookResult = ReturnType<typeof useTypesense_MultiSearchLazyQuery>
export type Typesense_MultiSearchSuspenseQueryHookResult = ReturnType<typeof useTypesense_MultiSearchSuspenseQuery>
export type Typesense_MultiSearchQueryResult = Apollo.QueryResult<
  Typesense_MultiSearchQuery,
  Typesense_MultiSearchQueryVariables
>
export const GetEventByIdDocument = gql`
    query getEventById($id: String!) {
  appEvents_event(id: $id) {
    data {
      ...FullEvent
    }
  }
}
    ${FullEventFragmentDoc}`

/**
 * __useGetEventByIdQuery__
 *
 * To run a query within a React component, call `useGetEventByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEventByIdQuery(
  baseOptions: Apollo.QueryHookOptions<GetEventByIdQuery, GetEventByIdQueryVariables> &
    ({ variables: GetEventByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetEventByIdQuery, GetEventByIdQueryVariables>(GetEventByIdDocument, options)
}
export function useGetEventByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetEventByIdQuery, GetEventByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetEventByIdQuery, GetEventByIdQueryVariables>(GetEventByIdDocument, options)
}
export function useGetEventByIdSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEventByIdQuery, GetEventByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetEventByIdQuery, GetEventByIdQueryVariables>(GetEventByIdDocument, options)
}
export type GetEventByIdQueryHookResult = ReturnType<typeof useGetEventByIdQuery>
export type GetEventByIdLazyQueryHookResult = ReturnType<typeof useGetEventByIdLazyQuery>
export type GetEventByIdSuspenseQueryHookResult = ReturnType<typeof useGetEventByIdSuspenseQuery>
export type GetEventByIdQueryResult = Apollo.QueryResult<GetEventByIdQuery, GetEventByIdQueryVariables>
export const AllEventsDocument = gql`
    query allEvents($offset: Int = 0, $limit: Int = 5, $localOnly: Boolean) {
  appEvents_events(offset: $offset, limit: $limit, localOnly: $localOnly) {
    totalResults
    data {
      ...FullEvent
    }
  }
}
    ${FullEventFragmentDoc}`

/**
 * __useAllEventsQuery__
 *
 * To run a query within a React component, call `useAllEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEventsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      localOnly: // value for 'localOnly'
 *   },
 * });
 */
export function useAllEventsQuery(baseOptions?: Apollo.QueryHookOptions<AllEventsQuery, AllEventsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, options)
}
export function useAllEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllEventsQuery, AllEventsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, options)
}
export function useAllEventsSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllEventsQuery, AllEventsQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, options)
}
export type AllEventsQueryHookResult = ReturnType<typeof useAllEventsQuery>
export type AllEventsLazyQueryHookResult = ReturnType<typeof useAllEventsLazyQuery>
export type AllEventsSuspenseQueryHookResult = ReturnType<typeof useAllEventsSuspenseQuery>
export type AllEventsQueryResult = Apollo.QueryResult<AllEventsQuery, AllEventsQueryVariables>
export const NearbyEventsDocument = gql`
    query nearbyEvents($limit: Int = 5, $geolocationId: ID) {
  appEvents_nearbyEvents(limit: $limit, geolocationId: $geolocationId) {
    data {
      ...FullEvent
    }
  }
}
    ${FullEventFragmentDoc}`

/**
 * __useNearbyEventsQuery__
 *
 * To run a query within a React component, call `useNearbyEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNearbyEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNearbyEventsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      geolocationId: // value for 'geolocationId'
 *   },
 * });
 */
export function useNearbyEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<NearbyEventsQuery, NearbyEventsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NearbyEventsQuery, NearbyEventsQueryVariables>(NearbyEventsDocument, options)
}
export function useNearbyEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NearbyEventsQuery, NearbyEventsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NearbyEventsQuery, NearbyEventsQueryVariables>(NearbyEventsDocument, options)
}
export function useNearbyEventsSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NearbyEventsQuery, NearbyEventsQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<NearbyEventsQuery, NearbyEventsQueryVariables>(NearbyEventsDocument, options)
}
export type NearbyEventsQueryHookResult = ReturnType<typeof useNearbyEventsQuery>
export type NearbyEventsLazyQueryHookResult = ReturnType<typeof useNearbyEventsLazyQuery>
export type NearbyEventsSuspenseQueryHookResult = ReturnType<typeof useNearbyEventsSuspenseQuery>
export type NearbyEventsQueryResult = Apollo.QueryResult<NearbyEventsQuery, NearbyEventsQueryVariables>
export const UpdateVolunteeringOpportunityStatusDocument = gql`
    mutation UpdateVolunteeringOpportunityStatus($volunteeringOpportunityId: String!, $newStatus: VolunteeringOpportunityStatusValue!) {
  updateVolunteeringOpportunityStatus(
    volunteeringOpportunityId: $volunteeringOpportunityId
    newStatus: $newStatus
  ) {
    externalVolunteeringOpportunityId
    status
  }
}
    `
export type UpdateVolunteeringOpportunityStatusMutationFn = Apollo.MutationFunction<
  UpdateVolunteeringOpportunityStatusMutation,
  UpdateVolunteeringOpportunityStatusMutationVariables
>

/**
 * __useUpdateVolunteeringOpportunityStatusMutation__
 *
 * To run a mutation, you first call `useUpdateVolunteeringOpportunityStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVolunteeringOpportunityStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVolunteeringOpportunityStatusMutation, { data, loading, error }] = useUpdateVolunteeringOpportunityStatusMutation({
 *   variables: {
 *      volunteeringOpportunityId: // value for 'volunteeringOpportunityId'
 *      newStatus: // value for 'newStatus'
 *   },
 * });
 */
export function useUpdateVolunteeringOpportunityStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateVolunteeringOpportunityStatusMutation,
    UpdateVolunteeringOpportunityStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateVolunteeringOpportunityStatusMutation,
    UpdateVolunteeringOpportunityStatusMutationVariables
  >(UpdateVolunteeringOpportunityStatusDocument, options)
}
export type UpdateVolunteeringOpportunityStatusMutationHookResult = ReturnType<
  typeof useUpdateVolunteeringOpportunityStatusMutation
>
export type UpdateVolunteeringOpportunityStatusMutationResult =
  Apollo.MutationResult<UpdateVolunteeringOpportunityStatusMutation>
export type UpdateVolunteeringOpportunityStatusMutationOptions = Apollo.BaseMutationOptions<
  UpdateVolunteeringOpportunityStatusMutation,
  UpdateVolunteeringOpportunityStatusMutationVariables
>
export const VolunteeringOpportunityStatusDocument = gql`
    query VolunteeringOpportunityStatus($volunteeringOpportunityId: String!) {
  volunteeringOpportunityStatus(
    volunteeringOpportunityId: $volunteeringOpportunityId
  ) {
    externalVolunteeringOpportunityId
    status
  }
}
    `

/**
 * __useVolunteeringOpportunityStatusQuery__
 *
 * To run a query within a React component, call `useVolunteeringOpportunityStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolunteeringOpportunityStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolunteeringOpportunityStatusQuery({
 *   variables: {
 *      volunteeringOpportunityId: // value for 'volunteeringOpportunityId'
 *   },
 * });
 */
export function useVolunteeringOpportunityStatusQuery(
  baseOptions: Apollo.QueryHookOptions<
    VolunteeringOpportunityStatusQuery,
    VolunteeringOpportunityStatusQueryVariables
  > &
    ({ variables: VolunteeringOpportunityStatusQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<VolunteeringOpportunityStatusQuery, VolunteeringOpportunityStatusQueryVariables>(
    VolunteeringOpportunityStatusDocument,
    options
  )
}
export function useVolunteeringOpportunityStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    VolunteeringOpportunityStatusQuery,
    VolunteeringOpportunityStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<VolunteeringOpportunityStatusQuery, VolunteeringOpportunityStatusQueryVariables>(
    VolunteeringOpportunityStatusDocument,
    options
  )
}
export function useVolunteeringOpportunityStatusSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<VolunteeringOpportunityStatusQuery, VolunteeringOpportunityStatusQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<VolunteeringOpportunityStatusQuery, VolunteeringOpportunityStatusQueryVariables>(
    VolunteeringOpportunityStatusDocument,
    options
  )
}
export type VolunteeringOpportunityStatusQueryHookResult = ReturnType<typeof useVolunteeringOpportunityStatusQuery>
export type VolunteeringOpportunityStatusLazyQueryHookResult = ReturnType<
  typeof useVolunteeringOpportunityStatusLazyQuery
>
export type VolunteeringOpportunityStatusSuspenseQueryHookResult = ReturnType<
  typeof useVolunteeringOpportunityStatusSuspenseQuery
>
export type VolunteeringOpportunityStatusQueryResult = Apollo.QueryResult<
  VolunteeringOpportunityStatusQuery,
  VolunteeringOpportunityStatusQueryVariables
>
