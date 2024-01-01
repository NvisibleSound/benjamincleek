import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './TrackUploader.module.css';
import { BsUpload } from "react-icons/bs";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Message from '../upload/Message';
import TrackPhoto from '../upload/TrackPhoto';
import { MdCancel } from 'react-icons/md';
import { PiArrowsClockwiseBold } from "react-icons/pi";

const TrackCard = ({ filename, id, onReplace, onDeleteFile, metadata, onMetadataChange }) => {
  const [trackName, setTrackName] = useState('');
  const [fileName, setFileName] = useState(filename || '');
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {
    if (metadata) {
      setTrackName(metadata.trackName);
      setFileName(metadata.fileName);
      setLocation(metadata.location);
      setKey(metadata.key);
    }
  }, [metadata]);

  const handleMetadataChange = (newTrackName) => {
    if (onMetadataChange) {
      onMetadataChange({
        trackName: newTrackName,
        fileName,
        location,
        key,
        // ... other metadata fields ...
      });
    }
  };

  const onChange = (e) => {
    const selectedTrack = e.target.files[0];
    if (selectedTrack) {
      setTrack(selectedTrack);
      setFileName(selectedTrack.name);
      setTrackName(selectedTrack.name);
    }
  };

  const handleTrackNameChange = (e) => {
    const newName = e.target.value;
    setTrackName(newName);
    handleMetadataChange(newName);
  };

  const handleReplaceTrack = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const updateLocation = (location) => {
    setTrack((prevState) => ({
      ...prevState,
      location: location,
    }));
  };
  
  const handleDeleteFile = async () => {
    try {
      if (id) {
        // Make a DELETE request to the backend endpoint
        await axios.delete(`http://localhost:5000/buskaudio/tracks/${id}/delete`, {
          data: {
            bucketName: 'buskaudio'
          },
        });

        // Update the fileurl in the state
        updateLocation('');

        setMessage('File deleted successfully');
      } else {
        setMessage('Unable to delete file: Missing track information');
      }
    } catch (error) {
      setMessage('Error deleting the file');
    }
  };
  
  
  
  
  return (
    <div key={uuidv4()}>
      {message && <Message msg={message} />}
      <div className="card">
        <div className={styles.uploadTrack}>
          <TrackPhoto />
            <div className={styles.textColumn}>
              {filename ? (
                <div className={styles.trackName}>
                  {filename}
                </div>
                ) : (
                  <div className={styles.trackName}>
                    <input
                      type="text"
                      value={trackName}
                      onChange={handleTrackNameChange}
                      style={{ marginLeft: '15px', width: '30vw' }}
                    />
                  </div>
                )
              }
              <div className={styles.trackDetails}>
                <div className={styles.trackMetadata}>
                  <div className={styles.metadataLabel}>Location:</div>
                  <div className={styles.metadataValue}>
                    {location}
                  </div>
                </div>
                <div className={styles.trackMetadata}>
                  <div className={styles.metadataLabel}>Key:</div>
                  <div className={styles.metadataValue}>{key}</div>
                </div>
              </div>
                     
            <div className={styles.icons}>
              <PiArrowsClockwiseBold
                style={{ marginLeft: 6, marginRight: 2, fontSize: 20, cursor: 'pointer' }}
                onClick={handleReplaceTrack}
              />
              <MdCancel
                style={{ fontSize: 30, cursor: 'pointer' }}
                onClick={handleDeleteFile}
              />
              {filename && (
                <>
                
                </>
              )}
          </div>
        </div>
        <div className={styles.progressBar}>
          {uploading && (
            <div className={styles.progress} style={{ width: `${progress}%` }}></div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};


const TrackUploader = (props) => {
  const [uploadedTracks, setUploadedTracks] = useState([]);
  const [message, setMessage] = useState('');

  const handleUpload = async (files) => {
    try {
      for (const file of files) {
        if (!file) continue; // Skip empty files

        // File type validation
        const allowedTypes = ['audio/mpeg', 'audio/wav'];
        if (!allowedTypes.includes(file.type)) {
          setMessage('Invalid file type. Please select a .wav or .mp3 file.');
          return;
        }

        // File size validation
        const maxSize = 10 * 1024 * 2048; // 10MB
        if (file.size > maxSize) {
          setMessage('File size exceeds the maximum limit');
          return;
        }

        // Create a new FormData object
        const formData = new FormData();
        formData.append('file', file);

        // Make a POST request to upload the track
        const response = await axios.post('http://localhost:5000/benjamincleek/audio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newTrack = {
          id: uuidv4(),
          name: file.name,
          trackName: file.name,
          location: response.data.location,
          key: response.data.key,
        };
        
        props.onUploadSuccess(newTrack.trackName, newTrack.location, newTrack.key);
        props.onChangeLocation(newTrack.location);
        props.onChangeKey(newTrack.key);


        // Log the location and key to the console
        console.log('Location:', newTrack.location);
        console.log('Key:', newTrack.key);

        setUploadedTracks((prevTracks) => [...prevTracks, newTrack]);
        setMessage('Track uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading track');
    }
  };

  const handleRemoveTrack = async (key) => {
    try {
      // Make a DELETE request to the backend endpoint
      await axios.delete(`http://localhost:5000/buskaudio/tracks/${key}/delete`, {
        params: {
          bucketName: 'buskaudio', // Replace with your actual bucket name
        },
      });
  
      // Remove the track from the uploadedTracks state array
      setUploadedTracks((prevTracks) => {
        return prevTracks.filter((prevTrack) => prevTrack.key !== key);
      });
  
      // setMessage('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage('Error deleting the file');
    }
  };
  

  return (
    <div className={styles.TrackUploader}>
      <div className={styles.sandbox}>
        <Dropzone onDrop={handleUpload} multiple>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={styles.dropzone}>
                <BsUpload className={styles.uploadIcon} />
                <p>Drag and drop files here or click to select files</p>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
      {message && <div className={styles.message}>{message}</div>}
      {Array.isArray(uploadedTracks) &&
        uploadedTracks.map((track) => (
          <TrackCard
            key={track.id}
            filename={track.name}
            id={track.id}
            metadata={{
              trackName: track.trackName,
              fileName: track.name,
              location: track.location,
              key: track.key,
            }}
            onReplace={() => {}}
            onDeleteFile={() => {}}
            onMetadataChange={() => {}}
          />
        ))}
    </div>
  );
};

export default TrackUploader;

