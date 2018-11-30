import React from 'react';
import PropTypes from 'prop-types';
import Table from 'terra-table';

const ColumnType = {
  TITLE: 'TITLE',
  ARTIST: 'ARTIST',
  SPOTIFY: 'SPOTIFY',
}

export default function TrackTable(props) {
  if (!props.tracks.length) return null;

  return (
    <Table isStriped>
      <Table.Header>
        <Table.HeaderCell content="Title" key={ColumnType.TITLE} minWidth="small" />
        <Table.HeaderCell content="Artist" key={ColumnType.ARTIST} minWidth="medium" />
        <Table.HeaderCell content="Spotify" key={ColumnType.SPOTIFY} minWidth="medium" />
      </Table.Header>
      <Table.Rows>
      {props.tracks.map(track => {
        const spotifyTracks = track.spotify ? track.spotify.tracks.items : [];
        if (spotifyTracks.length) {
          const spotifyTrack = spotifyTracks[0];
          return (
            <Table.Row key={track.uuid}>
              <Table.Cell content={
                <a href={spotifyTrack.external_urls.spotify}>{track.title}</a>
              } key={ColumnType.TITLE} />
              <Table.Cell content={track.artist} key={ColumnType.ARTIST} />
              <Table.Cell content="?" key={ColumnType.SPOTIFY} />
            </Table.Row>
           )
        }

        return (
          <Table.Row key={track.uuid}>
            <Table.Cell content={track.title} key={ColumnType.TITLE} />
            <Table.Cell content={track.artist} key={ColumnType.ARTIST} />
            <Table.Cell content="---" key={ColumnType.SPOTIFY} />
          </Table.Row>
         )
      })}
      </Table.Rows>
    </Table>
  );
}

TrackTable.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    uuid: PropTypes.number.isRequired
  }))
}

TrackTable.defaultProps = {
  tracks: []
}
