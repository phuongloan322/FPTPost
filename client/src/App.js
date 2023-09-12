import React from 'react';
import { Row } from 'antd';
import Main from './pages/Main';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <>
      {!isAuthenticated ? (
        <Row justify="center" style={{ marginTop: '50px' }}>
          <h1>Welcome to website FPT Post!</h1>
        </Row>
      ) : (
        <Main />
      )}
    </>
  );
};

export default App;
