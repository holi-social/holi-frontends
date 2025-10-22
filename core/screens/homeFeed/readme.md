# Home Feed

## Overview

The feed system combines different types of content (feed posts, volunteering recommendations, good news articles, and insights) into a unified feed. This documentation explains how to add new content types to the feed and provides guidance for the Matching Team.

## Current Implementation

The feed logic is primarily handled in `useFeedQuery.tsx` which:

1. Fetches different types of content
2. Combines them based on specific frequencies
3. Returns a unified feed data structure

Current frequencies:

```typescript
const PAGE_SIZE_EXTERNAL_DATA
const PAGE_SIZE_FEED
const VOLUNTEERING_FREQUENCY
const GOOD_NEWS_FREQUENCY
const INSIGHTS_FREQUENCY
```

## Adding a New Content Type

### 1. Add Type Definition

First, extend the `FeedItem` interface in `types.ts`:

```typescript
export interface FeedItem {
  post?: Post
  feedPost?: FeedPost | Post
  spacePost?: FeedPost | Post
  insight?: Insight
  // Add your new type here
  newContentType?: NewContentType
}
```

### 2. Create Query

Add a new query to fetch your content:

```typescript
const NEW_CONTENT_FREQUENCY = 12 // every X items, one new content

export const useFeedQuery = () => {
  // Add your query
  const { data: dataNewContent, refetch: refetchNewContent, error: newContentError } = useQuery(newContentQuery, {
    variables: {
      limit: PAGE_SIZE_EXTERNAL_DATA,
      offset: 0,
    },
  })
  useOnRefresh(refetchNewContent)
  useApolloErrorLogging(newContentError, 'Failed to load new content', {
    location: 'useFeedQuery.newContentQuery',
  })
```

### 3. Modify Combined Feed Logic

Add your content to the `combinedFeedData` logic:

```typescript
// Insert new content after every NEW_CONTENT_FREQUENCY feed items
newContent.forEach((item: NewContentType, index: number) => {
  const insertPosition = (index + 1) * NEW_CONTENT_FREQUENCY
  if (insertPosition < combined.length) {
    combined.splice(insertPosition, 0, { newContentType: item })
  }
})
```

### 4. Create Content Card Component

Create a new card component to render your content type:

```typescript
const NewContentCard: React.FC<NewContentCardProps> = ({ content }) => {
  return (
    <View>
      {/* Your card implementation */}
    </View>
  )
}
```

### 5. Add Card to Feed Renderer

Add your card to the feed rendering logic in `Feed.web.tsx`:

```typescript
{item.newContentType && (
  <NewContentCard
    key={item.newContentType.id}
    content={item.newContentType}
  />
)}
```
