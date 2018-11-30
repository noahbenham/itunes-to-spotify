import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'terra-form-input';
import Button, { ButtonVariants } from 'terra-button';
import { doFetch } from './fetch';

export default function CreatePlaylist(props) {
  const [response, setResponse] = useState();
  const [playlistName, setPlaylistName] = useState('Imported from iTunes');

  if (!response) {
    doFetch('playlists').then(setResponse);
  }
  console.warn(response);

  return (
    <>
      <Input
        name="Playlist Name"
        value={playlistName}
        onChange={setPlaylistName}
        required
      />
      <Button text="Create & import" variant={ButtonVariants.EMPHASIS} />
    </>
  );  
}

CreatePlaylist.props = {
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
}
