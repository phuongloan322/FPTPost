import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import {Types} from "aws-sdk/clients/s3"

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// Implement the file stogare logic
export class AttachmentUtils {
    //fileStorage 
    private s3: Types;
    private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET;
    private readonly expires: number = parseInt(process.env.SIGNED_URL_EXPIRATION);


    constructor() {
        this.s3 = new XAWS.S3({ signatureVersion: 'v4' });
    }

    getAttachmentUrl(todoId: string){
        logger.info('get attachment url',todoId)
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }

    public async createAttachmentPresignedUrl(attachmentId: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: this.expires
        }) as string;
    }
}