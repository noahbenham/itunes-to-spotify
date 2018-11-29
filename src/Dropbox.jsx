import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone'
import { parseXml } from './parser';

function onDrop(acceptedFiles, onValidRead) {
  acceptedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = parseXml(reader.result);
      onValidRead({ type: 'parse_xml', data });
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
  });
}

export default function Dropbox(props) {
  return (
    <div className="drop-center">
      <Dropzone
        accept="text/xml"
        multiple={false}
        onDrop={acceptedFiles => onDrop(acceptedFiles, props.onValidRead)}
      >
        <p>Drag or click to upload your library.xml</p>
      </Dropzone>
    </div>
  )
}

Dropbox.propTypes = {
  onValidRead: PropTypes.func.isRequired
}
