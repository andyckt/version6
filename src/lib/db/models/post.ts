import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { IMediaItem } from './media';
import { IUser } from './user';

// Collection name
const COLLECTION = 'posts';

// Post status
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

// MongoDB Post interface
export interface IPost {
  _id?: ObjectId;               // MongoDB ObjectId
  userId: ObjectId | string;    // Reference to user who created the post
  title: string;                // Post title
  description?: string;         // Post description
  location?: string;            // Location where the post was created
  hashtags: string[];           // Hashtags for the post
  media: Array<{
    mediaId: ObjectId | string; // Reference to media item
    sortOrder: number;          // Order of the media in the post
  }>;
  taggedAccounts: Array<{
    username: string;           // Username of tagged account
    accountType?: string;       // Type of account (user, merchant, etc.)
  }>;
  created: Date;                // Post creation date
  updated?: Date;               // Post last updated date
  status: PostStatus;           // Post status
  likes: number;                // Like count
  views: number;                // View count
  bookmarks: number;            // Bookmark count
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Create a new post
 */
export async function createPost(postData: Omit<IPost, '_id' | 'created' | 'likes' | 'views' | 'bookmarks'>): Promise<IPost> {
  const { db } = await connectToDatabase();
  
  const finalPostData: Omit<IPost, '_id'> = {
    ...postData,
    created: new Date(),
    likes: 0,
    views: 0,
    bookmarks: 0
  };
  
  const result = await db.collection<IPost>(COLLECTION).insertOne(finalPostData);
  
  // Return the new post with the generated ID
  return {
    ...finalPostData,
    _id: result.insertedId,
  };
}

/**
 * Get a post by ID
 */
export async function getPostById(id: string | ObjectId): Promise<IPost | null> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  return db.collection<IPost>(COLLECTION).findOne({ _id: objectId });
}

/**
 * Get all published posts
 */
export async function getPublishedPosts(limit: number = 20, skip: number = 0): Promise<IPost[]> {
  const { db } = await connectToDatabase();
  
  return db.collection<IPost>(COLLECTION)
    .find({ status: PostStatus.PUBLISHED })
    .sort({ created: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Get posts by user ID
 */
export async function getPostsByUserId(userId: string | ObjectId, limit: number = 20, skip: number = 0): Promise<IPost[]> {
  const { db } = await connectToDatabase();
  const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  return db.collection<IPost>(COLLECTION)
    .find({ userId: userObjectId, status: PostStatus.PUBLISHED })
    .sort({ created: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Update a post
 */
export async function updatePost(id: string | ObjectId, updateData: Partial<IPost>): Promise<IPost | null> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  // Don't allow updating these fields directly
  const { _id, created, likes, views, bookmarks, ...safeUpdateData } = updateData;
  
  const result = await db.collection<IPost>(COLLECTION).findOneAndUpdate(
    { _id: objectId },
    { 
      $set: {
        ...safeUpdateData,
        updated: new Date()
      } 
    },
    { returnDocument: 'after' }
  );
  
  return result;
}

/**
 * Increment post statistics (likes, views, bookmarks)
 */
export async function incrementPostStat(
  id: string | ObjectId, 
  stat: 'likes' | 'views' | 'bookmarks', 
  increment: number = 1
): Promise<void> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  await db.collection<IPost>(COLLECTION).updateOne(
    { _id: objectId },
    { $inc: { [stat]: increment } }
  );
}

/**
 * Delete a post (soft delete by changing status)
 */
export async function deletePost(id: string | ObjectId): Promise<boolean> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const result = await db.collection<IPost>(COLLECTION).updateOne(
    { _id: objectId },
    { $set: { status: PostStatus.DELETED, updated: new Date() } }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Initialize Post Collection with indexes
 */
export async function initPostCollection(): Promise<void> {
  const { db } = await connectToDatabase();
  
  // Create indexes
  await db.collection(COLLECTION).createIndexes([
    { key: { userId: 1 }, name: 'userId_idx' },
    { key: { status: 1 }, name: 'status_idx' },
    { key: { created: -1 }, name: 'created_idx' },
    { key: { hashtags: 1 }, name: 'hashtags_idx' },
    { key: { taggedAccounts: 1 }, name: 'taggedAccounts_idx' },
    { key: { location: 1 }, name: 'location_idx' },
  ]);
}

/**
 * Get full post data with populated media and user info
 */
export async function getPostWithDetails(id: string | ObjectId): Promise<any | null> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  // Use aggregation to join collections
  const posts = await db.collection<IPost>(COLLECTION).aggregate([
    { $match: { _id: objectId } },
    // Lookup user information
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        pipeline: [
          { 
            $project: { 
              _id: 1, 
              username: 1, 
              displayName: 1, 
              verified: 1,
              profileImage: 1,
              email: 1 
            }
          }
        ],
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    // Lookup media information
    {
      $lookup: {
        from: 'media',
        let: { mediaIds: '$media.mediaId' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', { $map: { input: '$$mediaIds', as: 'mid', in: { $toObjectId: '$$mid' } } }] } } },
          { $project: { 
            _id: 1, 
            type: 1, 
            width: 1, 
            height: 1, 
            aspectRatio: 1, 
            variants: 1 
          }}
        ],
        as: 'mediaItems'
      }
    },
    // Add fields to transform the media array with sort order
    {
      $addFields: {
        mediaDetails: {
          $map: {
            input: '$media',
            as: 'mediaRef',
            in: {
              $mergeObjects: [
                { sortOrder: '$$mediaRef.sortOrder' },
                { $arrayElemAt: [
                  '$mediaItems',
                  { $indexOfArray: [
                    { $map: { input: '$mediaItems', as: 'item', in: { $toString: '$$item._id' } } },
                    { $toString: '$$mediaRef.mediaId' }
                  ]}
                ]}
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        // Sort the media details by sortOrder
        mediaDetails: { $sortArray: { input: '$mediaDetails', sortBy: { sortOrder: 1 } } }
      }
    },
    // Project to shape the final result
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        location: 1,
        hashtags: 1,
        created: 1,
        updated: 1,
        status: 1,
        likes: 1,
        views: 1,
        bookmarks: 1,
        user: 1,
        mediaDetails: 1,
        taggedAccounts: 1
      }
    }
  ]).toArray();
  
  if (posts.length === 0) return null;
  return posts[0];
} 