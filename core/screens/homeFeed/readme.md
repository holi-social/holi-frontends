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
  const { data: dataNewContent, refetch: refetchNewContent } = useQuery(newContentQuery, {
    variables: {
      limit: PAGE_SIZE_EXTERNAL_DATA,
      offset: 0,
    },
    onError: (error) =>
      logError(error, 'Failed to load new content', {
        location: 'useFeedQuery.newContentQuery',
      }),
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

## For the Matching Team

### Option to Revert to Legacy Feed

If the Matching Team wants to take over, they can:

1. Remove the new feed implementation by deleting:
   - `Feed.web.tsx`
   - `Feed.tsx`
   - New card components:
     - `VolunteeringCard`
     - `GoodNewsCard`
     - `InsightCard`

2. Use `FeedLegacy.tsx` exclusively by modifying `HomeFeed.tsx`:

```typescript
const HomeFeed = () => {
  return <FeedLegacy />
}
```

### Benefits of Legacy Feed

- Simpler implementation
- Separate sections for different content types
- Easier to maintain for the Matching Team
- Better suited for A/B testing different recommendation algorithms

## Important Notes

- Ensure proper error handling for new content types
- Maintain consistent loading states
- Consider performance implications when adding new content types
- Test thoroughly with different screen sizes and devices
- Update tracking events for new content types

## Legacy Feed Structure

The legacy feed is organized in sections:

```typescript
<ScrollView>
  <View style={styles.sections}>
    <HomeFeedHeader />
    <AttendingChallengeEvents />
    <AllPosts />
    <InsightsOfTheWeek />
    <Recommendations />
    {isLoggedIn && <UserSuggestions />}
  </View>
</ScrollView>
