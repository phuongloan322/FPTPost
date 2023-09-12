import React, { useEffect, useState } from 'react';
import { getPosts } from '../api/posts-api';
import { useAuth0 } from '@auth0/auth0-react';
import { Row, Spin, Button, Col, Input } from 'antd'; // Thêm 'Input' vào đây
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import FormPost from '../components/Form/PostForm';
import { toast } from 'react-hot-toast';

const Main = (props) => {
  const { getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();
  const [state, setState] = useState({
    posts: [],
    idToken: '',
    isFetching: true,
  });

  // Định nghĩa biến searchTerm và hàm xử lý khi thay đổi Input
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchPost = async () => {
    setState({ ...state, isFetching: true });
    const res = await getIdTokenClaims();
    const idToken = res.__raw;
    const listPost = await getPosts(idToken);
    console.log('🚀 ~ file: Main.js:14 ~ fetchPost ~ listPost:', listPost);
    setState({
      posts: listPost.posts,
      idToken,
      isFetching: false,
    });
    toast.success('Fetch post successfully');
  };
  useEffect(() => {
    fetchPost();
  }, []);


  const handleSearch = () => {
    const { posts } = state; // Lấy danh sách posts từ state
    console.log('Search Posts:', searchTerm);
    console.log('Posts:', posts);


    if(searchTerm == '' || searchTerm == null)  {
      fetchPost();
    } else {
      const filteredPosts = posts.filter((post) => {
        // Kiểm tra xem tiêu đề và nội dung của bài viết có tồn tại
        if (post.title != null) {
          // Kiểm tra xem tiêu đề hoặc nội dung của bài viết có chứa searchTerm
          return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return false; // Trả về false nếu tiêu đề hoặc nội dung không tồn tại
      });

      // Ví dụ: In ra danh sách filteredPosts vào console
      console.log('Filtered Posts:', filteredPosts);
      setState({ posts: filteredPosts });
    }
  };

  const renderPosts = () => {
    const { posts, idToken } = state;
    if (state.isFetching) {
      return <Spin />;
    }
    if (posts.length <= 0 && !state.isFetching) {
      return <p>No post - Please create</p>;
    }
    return posts.map((p) => {
      return (
        <Col>
          <Post key={p.postId} post={p} idToken={idToken} />
        </Col>
      );
    });
  };
  return (
    <Row style={{ width: '100vw' }} justify="center">
      <Col span={24}>
        <Row style={{ float:'left', width:'100px', marginLeft: '100px' }} justify="end">
          <Button style={{ marginLeft: '8px', backgroundColor: 'darkblue', color: 'white' }}
            onClick={() => {
              navigate('/create-post');
            }}
          > Create Post
          </Button>
          <br/>
        </Row>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchInputChange}
            style={{ marginRight: '8px' }}
          />
          <Button style={{ marginLeft: '8px', backgroundColor: 'blue', color: 'white' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </Col>
      <Row justify="center" gutter={[16, 16]}>
        {renderPosts()}
      </Row>
    </Row>
  );
};

export default Main;
