import React, { useState } from 'react';
import { Row, Col, Space } from 'antd';
import { useAuth0 } from '@auth0/auth0-react';
import FormPost from '../components/Form/PostForm';
import { patchPost, getUploadUrl, uploadFile } from '../api/posts-api';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const EditPost = (props) => {
  const { postId } = useParams();
  console.log('🚀 ~ file: EditPost.js:11 ~ EditPost ~ params:', postId);
  const [processing, setProcessing] = useState(false);

  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const onSubmit = async (payload) => {
    console.log('🚀 ~ file: EditPost.js:11 ~ onSubmit ~ payload:', payload);
    const { title = '', image } = payload;
    const res = await getIdTokenClaims();
    const idToken = res.__raw;
    try {
      setProcessing(true);
      if (title) {
        const data = localStorage.getItem('currentPost');
        const post = JSON.parse(data);
        await patchPost(idToken, postId, { title, imageUrl: post[0].imageUrl });
        toast.success('Update title post successfully');
      }
      if (image) {
        const url = await getUploadUrl(idToken, postId);
        console.log('🚀 ~ file: Main.js:14 ~ fetchPost ~ listPost:', url);
        await uploadFile(url, image);
        toast.success('Update image successfully');
      }
    } catch (error) {
      toast.error(`Could not update post: ${error?.message}`);
    }
    setProcessing(false);
  };
  return (
    <>
      <Row style={{ width: '100vw' }} justify="center">
        <Row style={{ width: '90vw' }} justify="center">
          <Col span={20} style={{ backgroundColor: '#fff', padding: '20px' }}>
            <Space direction="vertical" size="large">
              <h3>Edit Post</h3>
              <FormPost onSubmit={onSubmit} processing={processing} isEdit={true} />
            </Space>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default EditPost;
