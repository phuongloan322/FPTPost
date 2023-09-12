// Hook
import { useContext } from 'react';
import { Auth0Context } from 'auth0-js';

export const useAuth0 = () => {
  const { isAuthenticated, loginWithRedirect, logout, getIdToken } = useContext(Auth0Context);
  return { isAuthenticated, loginWithRedirect, logout, getIdToken };
};
