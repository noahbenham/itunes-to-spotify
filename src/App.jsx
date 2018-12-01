import React, { useState } from 'react';
import querystring from 'querystring';
import { IntlProvider } from 'react-intl';
import AppContent from './AppContent';
import { doFetch, setRequestToken } from './fetch';
import './App.scss';
import { messages } from './aggregated-translations/en';

function doAuth() {
  const query = querystring.stringify({
    client_id: 'b8a685d74a88484cb51c857ae0a2b1d3',
    redirect_uri: 'http://localhost:3000',
    scope: 'user-read-private',
    response_type: 'token'
  });
  window.location.replace(`https://accounts.spotify.com/authorize?${query}`);
};



export default function App() {
  const [authToken, setAuthToken] = useState();
  const [userInfo, setUserInfo] = useState();

  if (!authToken) {
    if (!window.location.hash) {
      doAuth();
    } else {
      const { access_token: accessToken } = querystring.parse(window.location.hash.substring(1));
      setAuthToken(accessToken);
      setRequestToken(accessToken);
    }
  } else if (!userInfo) {
    doFetch('me').then((response) => {
      if (response.ok) {
        response.json().then(setUserInfo);
      }
    });
  }

  if (!authToken || !userInfo) {
    return (
      <div className="App">
        <h1>Just a sec</h1>
        <h4>I'm logging you into Spotify...</h4>
      </div>
    )
  }

  return (
    <IntlProvider locale="en" messages={messages}>
      <div className="App">
        <h1>Hi, {userInfo.id}.</h1>
        <AppContent />
      </div>
    </IntlProvider>
  )
}
