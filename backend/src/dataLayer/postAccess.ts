import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { PostItem } from '../models/PostItem';
import { PostUpdate } from '../models/PostUpdate';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('PostAccess');

// Implement dataLayer
export class PostAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly postTable = process.env.POST_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = Number(process.env?.SIGNED_URL_EXPIRATION || 400)
  ) {}

  async getAllPosts(userId: string): Promise<PostItem[]> {
    logger.info('Getting all');
    const result = await this.docClient
      .query({
        TableName: this.postTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();
    const items = result.Items;
    return items as PostItem[];
  }
  async getSpecificPost(userId: string, postId): Promise<PostItem[]> {
    logger.info('Getting specific');
    const result = await this.docClient
      .query({
        TableName: this.postTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId, postId = :postId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':postId': postId,
        },
      })
      .promise();
    const items = result.Items;
    return items as PostItem[];
  }

  async createPost(postItem: PostItem): Promise<PostItem> {
    logger.info('Creating new post');
    await this.docClient
      .put({
        TableName: this.postTable,
        Item: postItem,
      })
      .promise();
    return postItem;
  }

  async updatePost(postId: string, userId: string, postUpdate: PostUpdate): Promise<PostUpdate> {
    logger.info('Updating post');
    await this.docClient
      .update({
        TableName: this.postTable,
        Key: {
          postId,
          userId,
        },
        UpdateExpression: 'set #title = :t, imageUrl = :i',
        ExpressionAttributeValues: {
          ':t': postUpdate.title,
          ':i': postUpdate.imageUrl,
        },
        ExpressionAttributeNames: {
          '#title': 'title',
        },
      })
      .promise();
    return postUpdate;
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    logger.info('Deleting post');
    await this.docClient
      .delete({
        TableName: this.postTable,
        Key: {
          postId,
          userId,
        },
      })
      .promise();
  }

  async persistAttachmentUrl(
    postId: string,
    userId: string
  ): Promise<void> {
    logger.info('Persisting an attachment url');
    console.log(
      '🚀 ~ file: postsAccess.ts:88 ~ PostAccess ~ persistAttachmentUrl ~ attachmentURl:',
      `https://${this.bucketName}.s3.amazonaws.com/${postId}`,
      postId,
      userId
    );
    await this.docClient
      .update({
        TableName: this.postTable,
        Key: {
          postId,
          userId,
        },
        UpdateExpression: 'set imageUrl = :a',
        ExpressionAttributeValues: {
          ':a': `https://${this.bucketName}.s3.amazonaws.com/${postId}`,
        },
      })
      .promise();
  }

  async generateUploadUrl(postId: string): Promise<string> {
    logger.info('Generate upload url');
    const s3 = new XAWS.S3({
      signatureVersion: 'v4',
    });
    return s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: postId,
      Expires: this.urlExpiration,
    });
  }

  async getPostsForUser(userId: string): Promise<PostItem[]> {
    logger.info('Getting all posts for user');
    const result = await this.docClient
      .query({
        TableName: this.postTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();
    const items = result.Items;
    return items as PostItem[];
  }
}
