import React from 'react';
import { Card, Popconfirm } from 'antd';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deletePost } from '../api/posts-api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const Post = (props) => {
  const { post, idToken } = props;
  const navigate = useNavigate();
  const confirm = async () => {
    // Check token
    if (!idToken) {
      return;
    }
    try {
      await deletePost(idToken, post.postId);
      toast.success(`Post ${post.title} has been deleted`);
    } catch (error) {
      toast.error(`Could not delete: ${error.message}`);
    }
  };

  const _onEdit = () => {
    localStorage.setItem('currentPost', JSON.stringify([post]));
    navigate(`/edit-post/${post.postId}`);
  };
  if (!post.imageUrl) {
    return (
      <Card
        title={post.title}
        style={{ width: 300 }}
        actions={[
          <EditOutlined key="edit" onClick={_onEdit} />,
          <Popconfirm
            title="Delete the task"
            description="Delete this task?"
            onConfirm={confirm}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined key="delete" />
          </Popconfirm>,
        ]}
      >
        <p>This post has no Image, you can add it by clicking on Edit</p>
      </Card>
    );
  }

  return (
    <>
      <Card
        hoverable
        style={{ width: 300 }}
        actions={[
          <EditOutlined key="edit" onClick={_onEdit} />,
          <Popconfirm
            title="Delete task"
            description="Delete this Post?"
            onConfirm={confirm}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined key="delete" />
          </Popconfirm>,
        ]}
        cover={<img alt="example" src={post.imageUrl} />}
      >
        <Meta title={post.title} description={moment(post.createdAt).format('MMMM Do YYYY, h:mm a')} />
      </Card>
    </>
  );
};

export default Post;
