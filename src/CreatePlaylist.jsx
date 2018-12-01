import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'terra-form-input';
import Button, { ButtonVariants } from 'terra-button';
import { doFetch } from './fetch';

export default function CreatePlaylist(props) {
  const [response, setResponse] = useState();
  const [playlistName, setPlaylistName] = useState('Imported from iTunes');

  const clickCreateButton = () => {
    const body = JSON.stringify({
      "name": playlistName,
      "description": "Created with itunes-to-spotify https://github.com/noahbenham/itunes-to-spotify",
      "public": false
    });
    doFetch('playlists', { method: 'POST', body }).then(response => {
      if (response.ok) {
        response.json().then(setResponse);
      }
    });
  };

  console.log(response);

  return (
    <div style={{ display: 'flex', marginBottom: '15px' }}>
      <Input
        name="Playlist Name"
        value={playlistName}
        onChange={setPlaylistName}
        required
      />
      <Button
        text="Create & import"
        variant={ButtonVariants.EMPHASIS}
        style={{ flexShrink: 0 }}
        onClick={clickCreateButton}
      />
    </div>
  );  
}

CreatePlaylist.props = {
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
}
