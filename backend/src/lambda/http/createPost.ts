import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { CreatePostRequest } from '../../requests/CreatePostRequest';
import { getUserId } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../../utils/logger';
import { createPost } from '../../businessLogic/post';

const logger = createLogger('createPost');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event);
  const postPayload: CreatePostRequest = JSON.parse(event.body);
  const postId = uuidv4();
  //user id
  const userId = getUserId(event);
  console.log('Handler - userId:', userId);
  //new item
  const newItem = await createPost(postPayload, userId, postId);
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem,
    }),
  };
});

handler
  .use(
    cors({
      credentials: true,
    })
  )
  .use(httpErrorHandler());
