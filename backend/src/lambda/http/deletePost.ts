import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { getUserId } from '../utils';
import { deletePost } from '../../businessLogic/post';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get id
  const postId = event.pathParameters.postId;
  const userId = getUserId(event);
  await deletePost(postId, userId);

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
