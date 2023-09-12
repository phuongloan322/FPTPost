import React, { useState } from 'react';
import { Row, Col, Space } from 'antd';
import { useAuth0 } from '@auth0/auth0-react';
import FormPost from '../components/Form/PostForm';
import { createPost, getUploadUrl, uploadFile } from '../api/posts-api';
import { toast } from 'react-hot-toast';
const CreatePost = (props) => {
  const [processing, setProcessing] = useState(false);
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const onSubmit = async (payload) => {
    console.log('🚀 ~ file: CreatePost.js:11 ~ onSubmit ~ payload:', payload);
    const { title, image } = payload;
    const res = await getIdTokenClaims();
    const idToken = res.__raw;
    try {
      setProcessing(true);
      if (image) {
        const newPost = await createPost(idToken, { title });
        console.log('🚀 ~ file: CreatePost.js:15 ~ onSubmit ~ newPost:', newPost);
        const { postId } = newPost;
        console.log('🚀 ~ file: CreatePost.js:19 ~ onSubmit ~ postId:', postId);
        const url = await getUploadUrl(idToken, postId);
        console.log('🚀 ~ file: Main.js:14 ~ fetchPost ~ listPost:', url);
        await uploadFile(url, image);
        toast.success('Create post successfully');
      } else {
        const newPost = await createPost(idToken, { title });
        toast.success('Create post successfully');
        console.log('🚀 ~ file: CreatePost.js:15 ~ onSubmit ~ newPost:', newPost.postId);
      }
    } catch (error) {
      toast.error(`Could not create post: ${error?.message}`);
    }
    setProcessing(false);
  };
  return (
    <>
      <Row style={{ width: '100vw' }} justify="center">
        <Row style={{ width: '90vw' }} justify="center">
          <Col span={20} style={{ backgroundColor: '#fff', padding: '20px' }}>
            <Space direction="vertical" size="large">
              <h3>Create Post</h3>
              <FormPost onSubmit={onSubmit} processing={processing} />
            </Space>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default CreatePost;
