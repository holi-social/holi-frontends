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
  JSONObject: { input: any; output: any }
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

/** Appointment(id, title, slug, invite_only, start_date_time, end_date_time, location, geolocation, location_details, video_call_link, description, thumbnail, thumbnail_blurhash, permission, space, creator, created, modified, is_deleted, deleted_at) */
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
  /** Indicates whether the user's account has been verified. */
  isVerified: Scalars['Boolean']['output']
  lastName?: Maybe<Scalars['String']['output']>
  location?: Maybe<Scalars['String']['output']>
  pronouns?: Maybe<Scalars['String']['output']>
  role?: Maybe<UserRole>
  sdgs: Array<Maybe<Sdg>>
  /** @deprecated Deprecated since 1.52. Use skills_v2 instead. */
  skills: Array<Maybe<Skill>>
  skillsV2: Array<Maybe<Scalars['String']['output']>>
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

export enum BookmarkType {
  Initiative = 'INITIATIVE',
  Insight = 'INSIGHT',
  Quote = 'QUOTE',
  Recommendation = 'RECOMMENDATION',
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
  categoryId?: InputMaybe<Scalars['UUID']['input']>
  description: Scalars['String']['input']
  geolocation?: InputMaybe<GeolocationPointInput>
  image?: InputMaybe<Scalars['Upload']['input']>
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
  geolocation?: InputMaybe<GeolocationPointInput>
  location?: InputMaybe<Scalars['String']['input']>
  locationType: LocationType
  name: Scalars['String']['input']
  regularity: Regularity
  skills?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>
  skillsV2?: InputMaybe<Array<Scalars['String']['input']>>
  slotsAvailable?: InputMaybe<Scalars['Int']['input']>
  spaceId: Scalars['UUID']['input']
  thumbnail?: InputMaybe<Scalars['Upload']['input']>
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

/** FeedPost(id, title, slug, description, visibility, topics_v2, category, creator, created_at, image, image_blurhash, link_preview, language_code, location, geolocation, priority_duration) */
export type FeedPost = {
  __typename?: 'FeedPost'
  category?: Maybe<FeedPostCategory>
  commenters: UserPaged
  createdAt: Scalars['String']['output']
  creator?: Maybe<User>
  description: Scalars['String']['output']
  geolocation?: Maybe<GeolocationPoint>
  id: Scalars['UUID']['output']
  image?: Maybe<Scalars['String']['output']>
  imageBlurhash?: Maybe<Scalars['String']['output']>
  images?: Maybe<Array<Maybe<FeedPostImage>>>
  language?: Maybe<Scalars['String']['output']>
  linkPreview?: Maybe<LinkPreview>
  location?: Maybe<Scalars['String']['output']>
  mentions?: Maybe<Array<Maybe<User>>>
  myReaction: ReactionCounts
  reactions: ReactionCounts
  slug: Scalars['String']['output']
  title?: Maybe<Scalars['String']['output']>
  topics?: Maybe<Array<Topic>>
  topicsV2?: Maybe<Array<Scalars['String']['output']>>
  totalComments: Scalars['Int']['output']
  visibility: VisibilityLevel
}

/** FeedPost(id, title, slug, description, visibility, topics_v2, category, creator, created_at, image, image_blurhash, link_preview, language_code, location, geolocation, priority_duration) */
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
  /** @deprecated This type has been renamed. Keep for backwards compatibility. Versions 1.14.XX */
  isBookmarked: Scalars['Boolean']['output']
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

export type InsightQuoteRecommendationInitiative = Initiative | Insight | Quote | Recommendation

export type InspirationPostCategory = {
  __typename?: 'InspirationPostCategory'
  id: Scalars['UUID']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
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

/** LocationDetails(id, complete_address, geolocation, city, state, country) */
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
  /** @deprecated This has been renamed. Keep for <= 1.14.5 */
  bookmark: Result
  /** @deprecated Use 'favorite' mutation instead. Keep for version <=1.14.5 */
  bookmarkInsight: Result
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
  inviteToSpaceByEmail: Result
  lastSeenNotification: NewNotificationsResponse
  moderation_createReport: Moderation_ReportConfirmation
  notifications_updatePreferences: Array<Maybe<Notifications_WorkflowPreferences>>
  registerDevice: Result
  /** @deprecated Use 'unfavorite' mutation instead. Keep for version <=1.14.5 */
  removeInsightBookmark: Result
  removeReactionFromComment: Comment
  reportContent: Result
  /** @deprecated This has been renamed. Keep for <= 1.14.5 */
  unbookmark: Result
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
  updateVotes: Choice
  validateSpace: Result
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

export type MutationBookmarkArgs = {
  bookmarkId: Scalars['UUID']['input']
  bookmarkType: BookmarkType
}

export type MutationBookmarkInsightArgs = {
  insightId: Scalars['UUID']['input']
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

export type MutationRemoveInsightBookmarkArgs = {
  insightId: Scalars['UUID']['input']
}

export type MutationRemoveReactionFromCommentArgs = {
  input: CommentReactionInput
}

export type MutationReportContentArgs = {
  contentType: ContentType
  description?: InputMaybe<Scalars['String']['input']>
  objectId: Scalars['UUID']['input']
}

export type MutationUnbookmarkArgs = {
  bookmarkId: Scalars['UUID']['input']
  bookmarkType: BookmarkType
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

/** Poll(id, question_text, created, modified, creator, is_edited, is_closed, is_deleted, status, is_public) */
export type Poll = {
  __typename?: 'Poll'
  choices: Array<Choice>
  created: Scalars['DateTime']['output']
  creator: User
  id: Scalars['UUID']['output']
  isPublic: Scalars['Boolean']['output']
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
  appGoodNews_articles?: Maybe<AppGoodNews_GoodNewsArticlesQueryResponse>
  appVolunteering_engagement?: Maybe<AppVolunteering_Engagement>
  /**
   * Retrieves a list of recommendations based on the request parameters "topics", "skills" and "geoLocationId" (using deprecated topics & skills V2). "topics" contains slugs of the "Topic" type, "skills" contains slugs of the "Skill" type, "geoLocationId" contains the ID of a location as returned by the "geo_*" queries.
   * @deprecated Use engagementRecosV2 instead. (since v1.51)
   */
  appVolunteering_engagementRecos: AppVolunteering_EngagementRecosResponse
  /** Retrieves a list of recommendations based on the request parameters "topics", "skills" and "geoLocationId" (using topics & skills V2). "topics" contains slugs of the "Topic" type, "skills" contains slugs of the "Skill" type, "geoLocationId" contains the ID of a location as returned by the "geo_*" queries. */
  appVolunteering_engagementRecosV2: AppVolunteering_EngagementRecosResponse
  /** @deprecated Use filteredEngagementsV2 instead. (since v1.51) */
  appVolunteering_filteredEngagements: AppVolunteering_EngagementsResponse
  appVolunteering_filteredEngagementsV2: AppVolunteering_EngagementsResponse
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
  sdgs: SdgPaged
  /** @deprecated Deprecated since 1.52. Use V2 instead, which is now a static hard coded set of slugs. */
  skills: SkillPaged
  spaceById?: Maybe<Space>
  spaces: SpacePaged
  spacesByName: SpacePaged
  taskById?: Maybe<Task>
  tasksBySpaceId: TaskPaged
  /** @deprecated Deprecated since 1.52. Use V2 instead, which is now a static hard coded set of slugs. */
  topics: TopicPaged
  translation_detectLanguage: Scalars['String']['output']
  translation_translate: Scalars['String']['output']
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
  location?: InputMaybe<Scalars['String']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  remoteOnly?: InputMaybe<Scalars['Boolean']['input']>
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

export type QuerySpacesByNameArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
  substring: Scalars['String']['input']
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
  OneTime = 'ONE_TIME',
  ProjectBased = 'PROJECT_BASED',
  Regularly = 'REGULARLY',
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

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
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
  sdgs: Array<Maybe<Sdg>>
  tasks: Array<Task>
  title: Scalars['String']['output']
  /** @deprecated Deprecated since version 1.52, use topics_v2 instead. */
  topics: Array<Maybe<Topic>>
  topicsV2: Array<Scalars['String']['output']>
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
export type SpaceAppointmentsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
export type SpaceChildSpacesArgs = {
  geolocation?: InputMaybe<Scalars['GeoJSON']['input']>
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
export type SpaceInvitesArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
export type SpaceMembersArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
export type SpaceMembershipRequestsArgs = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

/** Community(id, creator, name, title, description, rules, avatar, avatar_blurhash, cover, cover_blurhash, created, type, color, user_adjective, users_adjective, invites_enabled, is_deleted, location, topics_v2, geolocation, contact_description, contact_email, contact_phone) */
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

/** Task(id, name, description, community, creator, created, slots_available, slots_taken, visibility, location_type, location, geolocation, regularity, skills_v2, thumbnail, thumbnail_blurhash, contact_email, contact_phone, deleted_at) */
export type Task = {
  __typename?: 'Task'
  contactEmail: Scalars['String']['output']
  contactPhone?: Maybe<Scalars['String']['output']>
  created: Scalars['DateTime']['output']
  creator: User
  description: Scalars['String']['output']
  geolocation?: Maybe<GeolocationPoint>
  id: Scalars['UUID']['output']
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
  categoryId?: InputMaybe<Scalars['UUID']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  existingImages?: InputMaybe<Array<InputMaybe<FeedPostImageMetadata>>>
  geolocation?: InputMaybe<GeolocationPointInput>
  image?: InputMaybe<Scalars['Upload']['input']>
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
  geolocation?: InputMaybe<GeolocationPointInput>
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
  /** @deprecated This has been renamed. Keep for <= 1.14.5 */
  bookmarkId: Scalars['String']['output']
  /** @deprecated This has been renamed. Keep for <= 1.14.5 */
  bookmarkItem: InsightQuoteRecommendationInitiative
  /** @deprecated This has been renamed. Keep for <= 1.14.5 */
  bookmarkType: Scalars['String']['output']
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
  connectionStatusToMyself?: UserConnectionStatus
  interests: Array<{ __typename?: 'Topic'; id: string; title: string; slug: string }>
  sdgs: Array<{ __typename?: 'SDG'; id: string; title: string; slug: string }>
  skills: Array<{ __typename?: 'Skill'; id: string; title: string; slug: string }>
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
    connectionStatusToMyself?: UserConnectionStatus
    interests: Array<{ __typename?: 'Topic'; id: string; title: string; slug: string }>
    sdgs: Array<{ __typename?: 'SDG'; id: string; title: string; slug: string }>
    skills: Array<{ __typename?: 'Skill'; id: string; title: string; slug: string }>
  }
}

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
  interests {
    id
    title
    slug
  }
  sdgs {
    id
    title
    slug
  }
  skills {
    id
    title
    slug
  }
  connectionStatusToMyself
}
    `
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
