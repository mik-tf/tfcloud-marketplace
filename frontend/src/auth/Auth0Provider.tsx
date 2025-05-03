import React, { ReactNode } from 'react';
import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Get environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;
  
  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!domain || !clientId) {
    console.error('Auth0 domain or client ID not provided');
    return <>{children}</>;
  }

  return (
    <Auth0ProviderBase
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0ProviderBase>
  );
};

export default Auth0Provider;