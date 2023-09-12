import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import App from './App';
import EditPost from './pages/EditPost';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout, Button, Row, Space } from 'antd';

const { Header, Content, Footer } = Layout;
const LogoutButton = () => {
  const { logout, user } = useAuth0();
  console.log('🚀 ~ file: routing.js:13 ~ LogoutButton ~ user:', user);
  return (
    <Row gutter={16} align="large">
      <Space direction="horizontal" size="medium">
        <p style={{ marginBottom: '5px', marginRight: '10px' }}>{user?.nickname}</p>
        <Button
          size="large"
          type="primary"
          onClick={() =>
            logout({
              returnTo: window.location.origin,
            })
          }
        >
          Exit
        </Button>
      </Space>
    </Row>
  );
};
const LoginButton = () => {
  const { isAuthenticated, loginWithPopup } = useAuth0();
  if (isAuthenticated) {
  }
  return (
    <Button size="large" type="primary" onClick={() => loginWithPopup()}>
      Login
    </Button>
  );
};
const Routing = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }} color="#fff">
      <a href="/" style={{marginLeft: '50px', fontSize: '32px', color: 'darkblue'}}>FPTPost</a>
        <Row style={{ width: '100%' }} justify="end">
          {/* {this.logInLogOutButton()} */}
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Row>
      </Header>
      <Content style={{ height: '90vh', marginTop: '20px' }}>
        <Routes>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default Routing;
