import plist from 'plist';
import querystring from 'querystring';
import { doFetch } from './fetch';

export function parseXml(rawFileData) {
  const parsedXml = plist.parse(rawFileData);
  return Object.values(parsedXml.Tracks).reduce((acc, track, ind) => {
    if (track.Genre === 'Podcast') return acc;
    
    acc[ind] = {
      title: track.Name,
      artist: track.Artist,
      uuid: ind,
    };
    return acc;
  }, {});
}

export async function fetchSpotifyEquivalents(tracks) {
  const promises = Object.values(tracks).map(async (track, ind) => {
    const fetchResponse = doFetch('search?' + querystring.stringify({
      q: `${track.title} ${track.artist}`,
      type: 'track',
    }));
    return fetchResponse.then(response => {
      if (response) {
        response.uuid = tracks[ind].uuid;
      }
      return response;
    });
  });
  return Promise.all(promises);
}
