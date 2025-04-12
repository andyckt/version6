# MongoDB & API Structure for Post System

## Overview

This document outlines the database structure, API endpoints, and performance optimizations for the post creation feature, integrating with MongoDB and Cloudinary.

## Database Collections

### Posts Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  userId: ObjectId,          // Reference to user collection
  username: String,          // Denormalized for quick access
  createdAt: Date,
  
  // Engagement metrics - denormalized for performance
  likes: Number,
  bookmarks: Number,
  views: Number,
  
  // Content categorization
  hashtags: [String],        // Used for filtering in ContentGrid
  location: String,          // Location where post was created
  
  // References to other entities
  taggedAccounts: [
    { username: String }     // References to merchant accounts
  ],
  
  // Media references - only store IDs and display metadata
  media: [
    {
      mediaId: ObjectId,     // Reference to media collection
      isPrimary: Boolean,    // Flag for thumbnail in grid (usually first image)
      position: Number       // For ordering multiple media items
    }
  ]
}
```

### Media Collection (Existing Structure)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,              // "image" or "video"
  originalFilename: String,
  mimeType: String,
  created: Date,
  status: String,            // "active", "processing", etc.
  width: Number,
  height: Number,
  aspectRatio: String,       // e.g., "3:4"
  
  // Different size variants for optimization
  variants: {
    original: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      cloudinaryId: String
    },
    grid: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      cloudinaryId: String
    },
    thumbnail: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      cloudinaryId: String
    },
    medium: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      cloudinaryId: String
    },
    large: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      cloudinaryId: String
    }
  },
  
  metadata: {
    originalUploadTimestamp: String
    // Other metadata fields as needed
  }
}
```

### Comments Collection (Optional - for scalability)

```javascript
{
  _id: ObjectId,
  postId: ObjectId,          // Reference to post
  userId: ObjectId,          // User who created the comment
  username: String,          // Denormalized for display
  userProfileImage: String,  // Denormalized for display
  text: String,
  createdAt: Date,
  likes: Number,
  
  // For threaded comments
  parentId: ObjectId,        // Null for top-level comments
  isReply: Boolean           // Whether this is a reply
}
```

## API Endpoints

### ContentGrid API

**Endpoint:** `GET /api/posts/grid`

**Purpose:** Fetch minimal data needed for the ContentGrid component

**Query Parameters:**
- `limit`: Number of posts to return (default: 30)
- `cursor`: ID-based pagination cursor
- `category`: Optional filter by category/hashtag

**Response:**
```javascript
{
  posts: [
    {
      _id: "postId1",
      title: "Post title",
      username: "username",
      userProfileImage: "profile-url", 
      likes: 42,
      bookmarks: 18,
      views: 128,
      hashtags: ["food", "shanghai"], 
      
      // Just the primary image in grid size
      primaryImage: {
        url: "https://res.cloudinary.com/dzmaishhi/image/upload/v1744447074/media/grid/...",
        aspectRatio: "3:4",
        width: 200,
        height: 267
      }
    },
    // More posts...
  ],
  nextCursor: "lastPostId" // For pagination
}
```

### Post Detail API

**Endpoint:** `GET /api/posts/:id`

**Purpose:** Fetch complete data for a single post

**Response:**
```javascript
{
  _id: "postId1",
  title: "Post title",
  description: "Full post description with @mentions...",
  username: "username",
  userProfileImage: "profile-url",
  userDisplayName: "User Display Name",
  createdAt: "2025-03-18T10:30:00Z",
  likes: 42,
  bookmarks: 18,
  views: 129, // Incremented on view
  hashtags: ["food", "shanghai"],
  location: "Shanghai, China",
  
  // Expanded media array with all needed variants
  media: [
    {
      _id: "mediaId1",
      type: "image",
      position: 0,
      variants: {
        grid: { url: "grid-url", width: 200, height: 267 },
        thumbnail: { url: "thumb-url", width: 300, height: 400 },
        medium: { url: "medium-url", width: 800, height: 1067 },
        large: { url: "large-url", width: 1080, height: 1440 }
        // Original may be excluded to save bandwidth
      }
    },
    // More media items...
  ],
  
  // Full tagged accounts information
  taggedAccounts: [
    { 
      username: "merchantname",
      displayName: "Merchant Display Name",
      profileImage: "merchant-profile-url",
      verified: true
    },
    // More tagged accounts...
  ]
}
```

### Post Creation API

**Endpoint:** `POST /api/posts`

**Request Body:**
```javascript
{
  title: "New post title",
  description: "Post description with @mentions",
  hashtags: ["food", "shanghai"],
  location: "Shanghai, China",
  taggedAccounts: [
    { username: "merchantname1" },
    { username: "merchantname2" }
  ],
  media: [
    { mediaId: "existingMediaId1", position: 0 },
    { mediaId: "existingMediaId2", position: 1 }
  ]
}
```

**Response:** Created post object

### Media Upload API (Existing)

**Endpoint:** `POST /api/media`

**Request:** Multipart form data with image/video file

**Response:** Media object with all variants

### Comments API

**Endpoint:** `GET /api/posts/:id/comments`

**Query Parameters:**
- `limit`: Number of comments to return
- `cursor`: For pagination

**Response:**
```javascript
{
  comments: [
    {
      _id: "commentId1",
      username: "commenter",
      userProfileImage: "profile-url",
      text: "Comment text",
      createdAt: "2025-04-12T08:37:58.072+00:00",
      likes: 5,
      replies: [
        // Nested replies if applicable
      ]
    },
    // More comments...
  ],
  nextCursor: "lastCommentId"
}
```

## Performance Optimizations

### For ContentGrid

1. **Cursor-based Pagination**
   - More efficient than offset pagination for large datasets
   - Example: `?limit=20&cursor=lastPostId`

2. **Use Grid Image Variants**
   - Always use the smaller grid variant (200px) for the list view
   - Pre-generate these variants during upload

3. **Virtualized Rendering**
   - Only render items currently visible in the viewport
   - Implement with libraries like `react-virtualized` or `react-window`

4. **Infinite Scroll**
   - Load more posts as the user scrolls
   - Trigger when approaching the bottom of the list

### For Post Detail View

1. **Progressive Loading**
   - Show grid image first while loading higher resolution images
   - Load comments after main content is displayed

2. **State Pre-population**
   - When navigating from grid to detail, use known data immediately:
   ```javascript
   // When clicking a post in ContentGrid
   const handlePostClick = (post) => {
     // Pre-populate state before navigation
     router.push(`/post/${post.id}`);
     
     // Use context or state management to share known data
     setInitialPostData({
       id: post._id,
       title: post.title,
       username: post.username,
       primaryImage: post.primaryImage
     });
   };
   ```

3. **Caching with SWR or React Query**
   - Cache API responses for faster subsequent loads
   - Revalidate data in the background

4. **Update Counters Optimistically**
   - When user likes/bookmarks, update UI immediately
   - Send API request in background to persist

## Data Flow Architecture

For optimal performance, implement the following data flow:

1. **Initial Load**
   - ContentGrid loads with minimal data
   - Posts are displayed with grid-variant images
   - Local storage manages client-side likes/bookmarks state

2. **Post Selection**
   - When a post is selected, pass known data to detail view
   - Detail view displays known data immediately
   - In parallel, fetch complete post details from API
   - Update view when complete data arrives

3. **Comments Loading**
   - Load comments in a separate request
   - Show loading indicator for comments section
   - Implement infinite scroll for comments if many exist

4. **Post Creation**
   - Upload media first using existing MediaUploader
   - Once media IDs are received, create post with references
   - Redirect to post detail view when complete

## Implementation Considerations

1. **Media Handling**
   - Continue using the existing media upload functionality
   - Always mark one media item as primary for grid display
   - Consider lazy loading non-primary media in detail view

2. **Denormalization Strategy**
   - Denormalize username and profile image into posts for performance
   - Keep user relationship via userId for data integrity
   - Update denormalized fields if source data changes

3. **Batch Processing**
   - Use MongoDB aggregation for complex queries
   - Consider scheduled jobs for updating non-critical counts (views)

4. **Monitoring**
   - Track API response times and optimize slow endpoints
   - Monitor database query performance
   - Add indexes for common query patterns:
     ```javascript
     // Example indexes
     db.posts.createIndex({ hashtags: 1 })
     db.posts.createIndex({ userId: 1 })
     db.posts.createIndex({ createdAt: -1 })
     ```

This structure balances proper database normalization with performance optimization for your specific use case. 