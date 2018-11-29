import React, { useState, useReducer } from 'react';
import querystring from 'querystring';
import Dropbox from './Dropbox';
import TrackTable from './TrackTable';
import { doFetch, setRequestToken } from './fetch';
import { fetchSpotifyEquivalents } from './parser';
import './App.scss';

function doAuth() {
  const query = querystring.stringify({
    client_id: 'b8a685d74a88484cb51c857ae0a2b1d3',
    redirect_uri: 'http://localhost:3000',
    scope: 'user-read-private',
    response_type: 'token'
  });
  window.location.replace(`https://accounts.spotify.com/authorize?${query}`);
};

function reducer(state, action) {
  switch (action.type) {
    case 'parse_xml':
      return action.data;
    case 'spotify_tracks':
      return action.tracks.reduce((acc, track) => {
        acc[track.uuid].spotify = track;
        return acc;
      }, { ...state });
    default:
      return state;
  }
}

export default function App() {
  const [authToken, setAuthToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [spotifyFetchStatus, setSpotifyFetchStatus] = useState();
  const [trackData, dispatchTrackAction] = useReducer(reducer, {});

  const trackArray = Object.values(trackData);

  if (authToken) {
    if (!userInfo) {
      doFetch('me').then(response => setUserInfo(response));
    }

    if (trackArray.length && !spotifyFetchStatus) {
      setSpotifyFetchStatus(-1); // sentinel for fetch in-progress
      fetchSpotifyEquivalents(trackData).then(tracks => {
        setSpotifyFetchStatus('done');
        dispatchTrackAction({ type: 'spotify_tracks', tracks });
      });
    }
  } else if (window.location.hash) {
    const { access_token: accessToken } = querystring.parse(window.location.hash.substring(1));
    setAuthToken(accessToken);
    setRequestToken(accessToken);
  } else {
    doAuth();
  }

  if (!authToken || !userInfo) {
    return (
      <div className="App">
        <h1>Just a sec</h1>
        <h4>I'm logging you into Spotify...</h4>
      </div>
    )
  }

  console.log(trackArray);

  const matchCount = trackArray.filter(track => track.spotify && track.spotify.tracks.items.length).length;

  return (
    <div className="App">
      <h1>Hi, {userInfo.id}.</h1>
      {trackArray.length
        ? <p>Found matches for {matchCount}/{trackArray.length} ({Math.round(matchCount/trackArray.length * 100)}%) of your tracks.</p>
        : <Dropbox onValidRead={dispatchTrackAction} />
      }
      {/* <button onClick={fetchMore}>Fetch more tracks</button> */}
      <TrackTable tracks={trackArray} />
    </div>
  );
}
