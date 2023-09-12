import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { v4 as uuidv4 } from 'uuid';
import { getUserId } from '../utils';
import { persistAttachmentUrl, getGeneratedUploadURL } from '../../businessLogic/post';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId;
  console.log('🚀 ~ file: generateUploadUrl.ts:16 ~ postId:', postId);
  const userId = getUserId(event);
  console.log('🚀 ~ file: generateUploadUrl.ts:15 ~ handler ~ userId:', userId);
  const imageId = uuidv4();
  console.log('🚀 ~ file: generateUploadUrl.ts:17 ~ handler ~ imageId:', imageId);

  const signedUrl = await getGeneratedUploadURL(postId);
  // 
  await persistAttachmentUrl(postId, userId);
  console.log("Processing Event ", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
       uploadUrl: signedUrl
    }),
  };
});

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
