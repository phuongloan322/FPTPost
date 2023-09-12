import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';

import { updatePost } from '../../businessLogic/post';
import { UpdatePostRequest } from '../../requests/UpdatePostRequest';
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // get postId from body
  const postId = event.pathParameters.postId;
  console.log('🚀 ~ file: updatePost.ts:13 ~ handler ~ postId:', postId);
  // Parse body
  const updatedPost: UpdatePostRequest = JSON.parse(event.body);
  console.log('Handler - updatedPost:', updatedPost);
  const userId = getUserId(event);
  console.log('Handler - userId:', userId);
  // calling update post
  await updatePost(postId, userId, updatedPost);

  return {
    statusCode: 204,
    body: JSON.stringify(true),
  };
});

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
