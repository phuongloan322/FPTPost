import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { getPostsForUser } from '../../businessLogic/post';
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger';
const logger = createLogger('getPostsForUser');

// TODO: Get all TODO items for a current user
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Write your code here
  console.log("Processing Event ", event);
  const userId = getUserId(event);
  logger.info(`UserId: ${userId}`);
  const posts = await getPostsForUser(userId);
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      posts: posts}),
  };
});

handler.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
