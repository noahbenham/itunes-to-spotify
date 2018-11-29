let authToken;

export function setRequestToken(tokenToSet) {
  authToken = tokenToSet;
}

/**
 * Base URL already defined.
 * @param {*} urlSuffix 
 * @param {*} options 
 */
export async function doFetch(urlSuffix, options = {}) {
  return fetch(`https://api.spotify.com/v1/${urlSuffix}`, {
    headers:{
      'Authorization': `'Bearer ${authToken}`
    },
    ...options,
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.warn(response);
    }
  });
}