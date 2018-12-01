import React, { useState, useReducer, useEffect } from 'react';
import Dropbox from './Dropbox';
import TrackTable from './TrackTable';
import CreatePlaylist from './CreatePlaylist';
import { fetchSpotifyEquivalents } from './parser';

function reducer(state, action) {
  switch (action.type) {
    case 'parse_xml':
      return action.data;
    case 'spotify_tracks':
      return action.response.reduce((acc, track) => {
        if (acc[track.uuid] && track) {
          acc[track.uuid] = {
            ...acc[track.uuid],
            retryAfter: track.retryAfter,
            spotify: track.tracks
          };
        }
        return acc;
      }, { ...state });
    default:
      return state;
  }
}


export default function AppContent() {
  const [fetchIn, setFetchIn] = useState();
  const [trackData, dispatchTrackAction] = useReducer(reducer, {});

  const trackArray = Object.values(trackData);
  if (!trackArray.length) {
    return <Dropbox onValidRead={dispatchTrackAction} />;
  }

  const fetchTracks = () => {
    const toFetch = trackArray.filter(track => !track.spotify);
      fetchSpotifyEquivalents(toFetch).then(response => {
        const { retryAfter } = response.find(track => track.retryAfter) || {};
        setFetchIn(retryAfter || -1);
        dispatchTrackAction({ type: 'spotify_tracks', response });
        if (retryAfter) {
          console.log(`Will retry next fetch in ${retryAfter}`);
          setTimeout(fetchTracks, retryAfter);
        }
      });
  }

  useEffect(fetchTracks, []);

  console.log(trackArray);

  const matchCount = trackArray.filter(track => track.spotify && track.spotify.items.length).length;

  return (
    <>
      <p>Found matches for {matchCount}/{trackArray.length} ({Math.round(matchCount/trackArray.length * 100)}%) of your tracks.</p>
      {fetchIn > 0 && <p>Fetching again in {fetchIn} sec.</p>}
      <CreatePlaylist />
      <TrackTable tracks={trackArray} />
    </>
  );
}
