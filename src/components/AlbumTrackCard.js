import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './AlbumTrackCard.module.css';
import axios from 'axios';
import Message from './upload/Message';
import { MdCancel, MdEdit } from 'react-icons/md';
import { PiArrowsClockwiseBold } from "react-icons/pi";

const AlbumTrackCard = ({ fileName, id, metadata, fileSize, duration, onTrackUploaded, onUploadTrackSuccess }) => {
  const [title, setTitle] = useState(metadata.title || ''); // Use the title from metadata
  const [location, setLocation] = useState(metadata.location || ''); // Use the location from metadata
  const [key, setKey] = useState(metadata.key || ''); // Use the key from metadata
  const [showFileName, setShowFileName] = useState(fileName || '');
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Flag to track if the track is saved
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (metadata) {
      setTitle(metadata.title);
      setShowFileName(metadata.fileName);
      setLocation(metadata.location);
      setKey(metadata.key);
      setIsSaved(true); 
      
      handleSaveTrack();

      console.log('Saving track:', title);

    }
  }, [metadata]);

  const handleTrackNameChange = (e) => {
    const newName = e.target.value;
    setTitle(newName);
  };

  const handleSaveTrack = () => {
    const artistid = 3;

    if (isSaved) {
      return;
    }

    const track = {
      title: title,
      location: location,
      artistid: artistid,
      key: key,
    };


    axios
      .post('http://localhost:5000/tracks', track)
      .then((response) => {
        const trackId = response.data.id; 

        console.log('Track saved successfully. Track ID:', trackId, title )
        console.log('artistID !!!!',artistid);
        setIsSaved(true); 

        onUploadTrackSuccess(trackId);


      })
      
      .catch((error) => {
        console.error('Error saving track:', error);
        setMessage('Error saving track');
      });
  };

  return (
    <div key={uuidv4()}>
      {message && <Message msg={message} />}
      <div className="card">
        <div className={styles.trackCard}>
          <div className={styles.title}>
            <input
              label="Title:"
              name="title"
              className="form-control"
              value={title}
              onChange={handleTrackNameChange}
            />
            <div className={styles.icons}>
              <MdEdit />
              <PiArrowsClockwiseBold />
              <MdCancel />
              {showFileName && null}
            </div>
          </div>
          <div>
            <div className={styles.trackDetails}>
              <div className={styles.fileName}>{showFileName}</div>
              <div className={styles.fileSize}>{fileSize} MB</div>
              <div className={styles.duration}>{duration} min</div>
            </div>
          </div>
        </div>
        <div className={styles.progressBar}>
          {uploading && (
            <div className={styles.progress} style={{ width: `${progress}%` }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumTrackCard;
