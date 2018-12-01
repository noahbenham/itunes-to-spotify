let authToken;

export function setRequestToken(tokenToSet) {
  authToken = tokenToSet;
}

/**
 * Base URL already defined.
 * @param {*} urlSuffix 
 * @param {*} options 
 */
export function doFetch(urlSuffix, options = {}) {
  return fetch(`https://api.spotify.com/v1/${urlSuffix}`, {
    headers:{
      'Authorization': `'Bearer ${authToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  });
}