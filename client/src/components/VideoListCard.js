import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VideoListCard.module.css';

const VideoListCard = ({ location, name, onSelectVideo, isSelected }) => {
  const [filename, setFilename] = useState('');

  const handleCardClick = () => {
    onSelectVideo(location); 

    console.log("!!!onSelectVideo:", onSelectVideo);
  };

  useEffect(() => {
    const fetchFilename = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/videos/`);
        setFilename(response.data.filename);
      } catch (error) {
        console.error('Error fetching filename:', error);
      }
    };

    fetchFilename();
  }, [location]);

  return (
    <div onClick={handleCardClick}>
      <div className={styles.info}>
        <div className={styles.trackNumber}> {name} </div>
        <div className={styles.title}> {filename} </div>
      </div>
      <div className={styles.formattedTime}></div>
    </div>
  );
};

export default VideoListCard;
