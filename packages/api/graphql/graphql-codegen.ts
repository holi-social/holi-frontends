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
  replies?: Maybe<Array<Comment>>
  text: Scalars['String']['output']
  totalReplies: Scalars['Int']['output']
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

export enum FavoritableType {
  Insight = 'INSIGHT',
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
}

/** Insight(id, title, description, creator, date_published, header_image, header_image_blurhash, topic, topic_v2) */
export type Insight = {
  __typename?: 'Insight'
  creator?: Maybe<User>
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
  favorite: Result
  generateAppointmentIcsFile: Scalars['String']['output']
  getImagekitAuthParams: ImageKitAuthParams
  inviteToSpaceByEmail: Result
  lastSeenNotification: NewNotificationsResponse
  moderation_createReport: Moderation_ReportConfirmation
  notifications_updatePreferences: Array<Maybe<Notifications_WorkflowPreferences>>
  registerDevice: Result
  removeReactionFromComment: Comment
  reportContent: Result
  unfavorite: Result
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

export type MutationUnfavoriteArgs = {
  favoritableId: Scalars['UUID']['input']
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
  text: Scalars['String']['output']
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
  connectedUsers: UserPaged
  connectionsByUserId: UserPaged
  discoverSpaces: Array<Maybe<DiscoverSpaces>>
  discoverSpacesDefaultTopicsV2: Array<Scalars['String']['output']>
  discussionById: Discussion
  /** @deprecated This query is deprecated. Please switch to using the 'favorites' query instead. */
  favoriteInsights: InsightPaged
  favorites: UserFavoritePaged
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

export type QueryFavoriteInsightsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export type QueryFavoritesArgs = {
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
  text: Scalars['String']['output']
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
  description_de?: Maybe<Scalars['String']['output']>
  description_en?: Maybe<Scalars['String']['output']>
  external_url?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  image_url?: Maybe<Scalars['String']['output']>
  link_locators?: Maybe<Typesense_DocumentLinkLocators>
  location?: Maybe<Scalars['String']['output']>
  location_lat_lng?: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  location_type?: Maybe<Scalars['String']['output']>
  organizer_image_url?: Maybe<Scalars['String']['output']>
  organizer_name?: Maybe<Scalars['String']['output']>
  skills_v2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  source?: Maybe<Scalars['String']['output']>
  title_de?: Maybe<Scalars['String']['output']>
  title_en?: Maybe<Scalars['String']['output']>
  topics_v2?: Maybe<Array<Maybe<Scalars['String']['output']>>>
  type: Typesense_DocumentType
  user_full_name?: Maybe<Scalars['String']['output']>
}

export type Typesense_DocumentLinkLocators = {
  __typename?: 'Typesense_DocumentLinkLocators'
  profile?: Maybe<Scalars['String']['output']>
  space?: Maybe<Scalars['String']['output']>
  task?: Maybe<Scalars['String']['output']>
  volunteering?: Maybe<Scalars['String']['output']>
}

export enum Typesense_DocumentType {
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
  isOidc: Scalars['Boolean']['output']
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
  favoritable: Insight
  favoritableId: Scalars['UUID']['output']
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
      favoritable: {
        __typename: 'Insight'
        id: string
        title: string
        description: string
        datePublished: any
        headerImage?: string
        headerImageBlurhash?: string
        initiatives: Array<{ __typename?: 'Initiative'; link: string }>
        creator?: { __typename?: 'User'; fullName: string; avatar?: string }
      }
    }>
  }
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

export type TaskFragment = {
  __typename?: 'Task'
  id: string
  name: string
  description: string
  thumbnail?: string
  thumbnailBlurhash?: string
  location?: string
  locationType: LocationType
  interactionType?: InteractionType
  regularity: Regularity
  skillsV2: Array<string>
  interactionSignupLink?: string
  space: {
    __typename?: 'Space'
    id: string
    title: string
    name: string
    avatar?: string
    avatarBlurhash?: string
    avatarDefaultColor: string
  }
}

export type RecommendedTasksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type RecommendedTasksQuery = {
  __typename?: 'Query'
  recommendedTasks: {
    __typename?: 'TaskPaged'
    totalResults: number
    data: Array<{
      __typename?: 'Task'
      id: string
      name: string
      description: string
      thumbnail?: string
      thumbnailBlurhash?: string
      location?: string
      locationType: LocationType
      interactionType?: InteractionType
      regularity: Regularity
      skillsV2: Array<string>
      interactionSignupLink?: string
      space: {
        __typename?: 'Space'
        id: string
        title: string
        name: string
        avatar?: string
        avatarBlurhash?: string
        avatarDefaultColor: string
      }
    }>
  }
}

export type SpaceRecommendationQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type SpaceRecommendationQuery = {
  __typename?: 'Query'
  recommendedSpaces: {
    __typename?: 'SpacePaged'
    totalResults: number
    data: Array<{
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
    }>
  }
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
    locationType: LocationType
    interactionType?: InteractionType
    contactEmail: string
    contactPhone?: string
    thumbnail?: string
    thumbnailBlurhash?: string
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
            }
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

export type VolunteeringByIdQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type VolunteeringByIdQuery = {
  __typename?: 'Query'
  appVolunteering_engagement?: {
    __typename?: 'AppVolunteering_Engagement'
    id?: string
    title?: string
    description?: string
    url?: string
    imageUrl?: string
    source?: string
    location?: string
    latitude?: number
    longitude?: number
    topicsV2?: Array<string>
    skillsV2?: Array<string>
    organizer?: { __typename?: 'AppVolunteering_Organizer'; name?: string; imageUrl?: string }
  }
}

export type SimilarVolunteeringSliderQueryVariables = Exact<{
  id: Scalars['String']['input']
  offset?: Scalars['Int']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type SimilarVolunteeringSliderQuery = {
  __typename?: 'Query'
  appVolunteering_similarRecommendations: {
    __typename?: 'AppVolunteering_EngagementsResponse'
    totalResults: number
    data: Array<{
      __typename?: 'AppVolunteering_Engagement'
      location?: string
      topicsV2?: Array<string>
      skillsV2?: Array<string>
      title?: string
      imageUrl?: string
      id?: string
    }>
  }
}

export type TrackEngagementViewMutationVariables = Exact<{
  id: Scalars['String']['input']
}>

export type TrackEngagementViewMutation = {
  __typename?: 'Mutation'
  appVolunteering_trackEngagementView: { __typename?: 'AppVolunteering_TrackEngagementViewResponse'; id?: string }
}

export const TaskFragmentDoc = gql`
    fragment Task on Task {
  id
  name
  description
  space {
    id
    title
    name
    avatar
    avatarBlurhash
    avatarDefaultColor
  }
  thumbnail
  thumbnailBlurhash
  location
  locationType
  interactionType
  regularity
  skillsV2
  interactionSignupLink
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
  external_url
  commitment_label
  commitment_duration
  location_type
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
export const FavoritesDocument = gql`
    query Favorites($offset: Int! = 0, $limit: Int! = 10) {
  favorites(offset: $offset, limit: $limit) {
    data {
      id
      favoritableId
      favoritableType
      favoritable {
        ... on Insight {
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
        }
      }
    }
    totalResults
  }
}
    `

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
export const RecommendedTasksDocument = gql`
    query RecommendedTasks($limit: Int) {
  recommendedTasks(limit: $limit) {
    data {
      ...Task
    }
    totalResults
  }
}
    ${TaskFragmentDoc}`

/**
 * __useRecommendedTasksQuery__
 *
 * To run a query within a React component, call `useRecommendedTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecommendedTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecommendedTasksQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useRecommendedTasksQuery(
  baseOptions?: Apollo.QueryHookOptions<RecommendedTasksQuery, RecommendedTasksQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RecommendedTasksQuery, RecommendedTasksQueryVariables>(RecommendedTasksDocument, options)
}
export function useRecommendedTasksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RecommendedTasksQuery, RecommendedTasksQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RecommendedTasksQuery, RecommendedTasksQueryVariables>(RecommendedTasksDocument, options)
}
export function useRecommendedTasksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<RecommendedTasksQuery, RecommendedTasksQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RecommendedTasksQuery, RecommendedTasksQueryVariables>(
    RecommendedTasksDocument,
    options
  )
}
export type RecommendedTasksQueryHookResult = ReturnType<typeof useRecommendedTasksQuery>
export type RecommendedTasksLazyQueryHookResult = ReturnType<typeof useRecommendedTasksLazyQuery>
export type RecommendedTasksSuspenseQueryHookResult = ReturnType<typeof useRecommendedTasksSuspenseQuery>
export type RecommendedTasksQueryResult = Apollo.QueryResult<RecommendedTasksQuery, RecommendedTasksQueryVariables>
export const SpaceRecommendationDocument = gql`
    query SpaceRecommendation($limit: Int) {
  recommendedSpaces(limit: $limit) {
    data {
      ...SpaceCard
    }
    totalResults
  }
}
    ${SpaceCardFragmentDoc}`

/**
 * __useSpaceRecommendationQuery__
 *
 * To run a query within a React component, call `useSpaceRecommendationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpaceRecommendationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpaceRecommendationQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSpaceRecommendationQuery(
  baseOptions?: Apollo.QueryHookOptions<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>(
    SpaceRecommendationDocument,
    options
  )
}
export function useSpaceRecommendationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>(
    SpaceRecommendationDocument,
    options
  )
}
export function useSpaceRecommendationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SpaceRecommendationQuery, SpaceRecommendationQueryVariables>(
    SpaceRecommendationDocument,
    options
  )
}
export type SpaceRecommendationQueryHookResult = ReturnType<typeof useSpaceRecommendationQuery>
export type SpaceRecommendationLazyQueryHookResult = ReturnType<typeof useSpaceRecommendationLazyQuery>
export type SpaceRecommendationSuspenseQueryHookResult = ReturnType<typeof useSpaceRecommendationSuspenseQuery>
export type SpaceRecommendationQueryResult = Apollo.QueryResult<
  SpaceRecommendationQuery,
  SpaceRecommendationQueryVariables
>
export const TaskByIdDocument = gql`
    query taskById($id: UUID!) {
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
    locationType
    interactionType
    contactEmail
    contactPhone
    thumbnail
    thumbnailBlurhash
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
export const VolunteeringByIdDocument = gql`
    query VolunteeringById($id: String!) {
  appVolunteering_engagement(id: $id) {
    id
    title
    description
    url
    imageUrl
    source
    organizer {
      name
      imageUrl
    }
    location
    latitude
    longitude
    topicsV2
    skillsV2
  }
}
    `

/**
 * __useVolunteeringByIdQuery__
 *
 * To run a query within a React component, call `useVolunteeringByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolunteeringByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolunteeringByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVolunteeringByIdQuery(
  baseOptions: Apollo.QueryHookOptions<VolunteeringByIdQuery, VolunteeringByIdQueryVariables> &
    ({ variables: VolunteeringByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>(VolunteeringByIdDocument, options)
}
export function useVolunteeringByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>(VolunteeringByIdDocument, options)
}
export function useVolunteeringByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>(
    VolunteeringByIdDocument,
    options
  )
}
export type VolunteeringByIdQueryHookResult = ReturnType<typeof useVolunteeringByIdQuery>
export type VolunteeringByIdLazyQueryHookResult = ReturnType<typeof useVolunteeringByIdLazyQuery>
export type VolunteeringByIdSuspenseQueryHookResult = ReturnType<typeof useVolunteeringByIdSuspenseQuery>
export type VolunteeringByIdQueryResult = Apollo.QueryResult<VolunteeringByIdQuery, VolunteeringByIdQueryVariables>
export const SimilarVolunteeringSliderDocument = gql`
    query SimilarVolunteeringSlider($id: String!, $offset: Int! = 0, $limit: Int = 10) {
  appVolunteering_similarRecommendations(id: $id, offset: $offset, limit: $limit) {
    totalResults
    data {
      location
      topicsV2
      skillsV2
      title
      imageUrl
      id
    }
  }
}
    `

/**
 * __useSimilarVolunteeringSliderQuery__
 *
 * To run a query within a React component, call `useSimilarVolunteeringSliderQuery` and pass it any options that fit your needs.
 * When your component renders, `useSimilarVolunteeringSliderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSimilarVolunteeringSliderQuery({
 *   variables: {
 *      id: // value for 'id'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSimilarVolunteeringSliderQuery(
  baseOptions: Apollo.QueryHookOptions<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables> &
    ({ variables: SimilarVolunteeringSliderQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables>(
    SimilarVolunteeringSliderDocument,
    options
  )
}
export function useSimilarVolunteeringSliderLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables>(
    SimilarVolunteeringSliderDocument,
    options
  )
}
export function useSimilarVolunteeringSliderSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SimilarVolunteeringSliderQuery, SimilarVolunteeringSliderQueryVariables>(
    SimilarVolunteeringSliderDocument,
    options
  )
}
export type SimilarVolunteeringSliderQueryHookResult = ReturnType<typeof useSimilarVolunteeringSliderQuery>
export type SimilarVolunteeringSliderLazyQueryHookResult = ReturnType<typeof useSimilarVolunteeringSliderLazyQuery>
export type SimilarVolunteeringSliderSuspenseQueryHookResult = ReturnType<
  typeof useSimilarVolunteeringSliderSuspenseQuery
>
export type SimilarVolunteeringSliderQueryResult = Apollo.QueryResult<
  SimilarVolunteeringSliderQuery,
  SimilarVolunteeringSliderQueryVariables
>
export const TrackEngagementViewDocument = gql`
    mutation TrackEngagementView($id: String!) {
  appVolunteering_trackEngagementView(id: $id) {
    id
  }
}
    `
export type TrackEngagementViewMutationFn = Apollo.MutationFunction<
  TrackEngagementViewMutation,
  TrackEngagementViewMutationVariables
>

/**
 * __useTrackEngagementViewMutation__
 *
 * To run a mutation, you first call `useTrackEngagementViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackEngagementViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackEngagementViewMutation, { data, loading, error }] = useTrackEngagementViewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrackEngagementViewMutation(
  baseOptions?: Apollo.MutationHookOptions<TrackEngagementViewMutation, TrackEngagementViewMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<TrackEngagementViewMutation, TrackEngagementViewMutationVariables>(
    TrackEngagementViewDocument,
    options
  )
}
export type TrackEngagementViewMutationHookResult = ReturnType<typeof useTrackEngagementViewMutation>
export type TrackEngagementViewMutationResult = Apollo.MutationResult<TrackEngagementViewMutation>
export type TrackEngagementViewMutationOptions = Apollo.BaseMutationOptions<
  TrackEngagementViewMutation,
  TrackEngagementViewMutationVariables
>
