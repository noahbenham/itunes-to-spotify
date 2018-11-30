import React, { useState, useReducer } from 'react';
import Dropbox from './Dropbox';
import TrackTable from './TrackTable';
import { fetchSpotifyEquivalents } from './parser';

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


export default function AppContent() {
  const [spotifyFetchStatus, setSpotifyFetchStatus] = useState();
  const [trackData, dispatchTrackAction] = useReducer(reducer, {});

  const trackArray = Object.values(trackData);

  if (trackArray.length && !spotifyFetchStatus) {
    setSpotifyFetchStatus(-1); // sentinel for fetch in-progress
    fetchSpotifyEquivalents(trackData).then(tracks => {
      setSpotifyFetchStatus('done');
      dispatchTrackAction({ type: 'spotify_tracks', tracks });
    });
  }

  console.log(trackArray);

  const matchCount = trackArray.filter(track => track.spotify && track.spotify.tracks.items.length).length;

  return (
    <>
      {trackArray.length
        ? <p>Found matches for {matchCount}/{trackArray.length} ({Math.round(matchCount/trackArray.length * 100)}%) of your tracks.</p>
        : <Dropbox onValidRead={dispatchTrackAction} />
      }
      {/* <button onClick={fetchMore}>Fetch more tracks</button> */}
      <TrackTable tracks={trackArray} />
    </>
  );
}