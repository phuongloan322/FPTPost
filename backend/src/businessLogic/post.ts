import { PostAccess } from '../dataLayer/postAccess';
import { PostItem } from '../models/PostItem';
import { CreatePostRequest } from '../requests/CreatePostRequest';
import { PostUpdate } from '../models/PostUpdate';
import { createLogger } from '../utils/logger'

const logger = createLogger("PortAccess");

const postAccess = new PostAccess();
export async function getAllPosts(userId: string): Promise<PostItem[]>
{
  logger.info(" get all posts");
  return await postAccess.getAllPosts(userId);
}

export async function createPost(newPost: CreatePostRequest, userId: string, postId: string): Promise<CreatePostRequest>
{
  logger.info("Adding new");
  return await postAccess.createPost({
    // Generate via uuid
    postId: postId,
    userId: userId, 
    title: newPost.title,
    imageUrl: newPost?.imageUrl || '',
    createdAt: new Date().toISOString(),
  });
}

export async function getGeneratedUploadURL(postId: string): Promise<string>
{
  return await postAccess.generateUploadUrl(postId);
}

export async function persistAttachmentUrl(
  postId: string,
  userId: string
): Promise<void> 
{
  logger.info(" Attachment post");
  return await postAccess.persistAttachmentUrl(postId, userId);
}

export async function getPostsForUser(userId: string): Promise<PostItem[]>
{
  logger.info(" Get post");
  return await postAccess.getPostsForUser(userId);
}

export async function updatePost(postId: string, userId: string, postUpdate: PostUpdate): Promise<PostUpdate>
{
  logger.info(" Update post");
  return await postAccess.updatePost(postId, userId, postUpdate);
}

export async function deletePost(postId: string, userId: string): Promise<void> 
{
  logger.info(" Delete post ");
  return await postAccess.deletePost(postId, userId);
}
