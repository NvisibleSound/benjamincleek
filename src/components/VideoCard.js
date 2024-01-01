import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './VideoUploader.module.css';
import axios from 'axios';
import { MdCancel } from 'react-icons/md';
import { PiArrowsClockwiseBold } from "react-icons/pi";

const VideoCard = ({ id, metadata, onMetadataChange }) => {
  const [name, setName] = useState('');
  const [filename, setFileName] = useState('');
  const [location, setLocation] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {
    if (metadata) {
      setName(metadata.name);
      setFileName(metadata.filename);
      setLocation(metadata.location);
      setKey(metadata.key);
    }
  }, [metadata]);

  const handleMetadataChange = (newName) => {
    if (onMetadataChange) {
      onMetadataChange({
        name: newName,
        filename,
        location,
        key,
      });
    }
  };

  const handleSaveVideoMetadata = async () => {
    try {
      const videoMetadata = {
        name,
        filename,
        location,
        key,
      };

      console.log('Sending video data:', videoMetadata);

      const response = await axios.post('http://localhost:5000/videos', videoMetadata);

      const videoId = response.data.id;

      console.log('Video saved successfully. Video ID:', videoId, name);

      // You can handle the video save success as needed, e.g., update UI or trigger other actions
    } catch (error) {
      console.error('Error saving video:', error);
      // Handle error saving video metadata
    }
  };

  const handleVideoNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    handleMetadataChange(newName);
  };

  return (
    <div key={uuidv4()}>
      <div className="card">
        <div className={styles.uploadVideo}>
          <div className={styles.textColumn}>
            {filename ? (
              <div className={styles.videoname}>
                {filename}
              </div>
            ) : (
              <div className={styles.videoname}>
                <input
                  type="text"
                  value={name}
                  onChange={handleVideoNameChange}
                  style={{ marginLeft: '15px', width: '30vw' }}
                />
              </div>
            )}
            <div className={styles.videoDetails}>
              <div className={styles.videoMetadata}>
                <div className={styles.metadataLabel}>Location:</div>
                <div className={styles.metadataValue}>
                  {location}
                </div>
              </div>
              <div className={styles.videoMetadata}>
                <div className={styles.metadataLabel}>Key:</div>
                <div className={styles.metadataValue}>{key}</div>
              </div>
            </div>
          </div>
          <div className={styles.icons}>
            <PiArrowsClockwiseBold onClick={handleSaveVideoMetadata} />
            <MdCancel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
