import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AlbumPageTrackCard.module.css';

const AlbumPageTrackCard = ({ trackNumber, track, onSelectTrack, title, artistid, albumid, isSelected }) => {
  const [artistname, setArtistName] = useState(''); 
  const [albumname, setAlbumName] = useState(''); 
  const [dataFetched, setDataFetched] = useState(false); 


  const minPlays = 1;
  const maxPlays = 1000;
  const randomPlays = Math.floor(Math.random() * (maxPlays - minPlays + 1)) + minPlays;

  // Generate a random time (in minutes and seconds, up to 10 minutes)
  const maxMinutes = 10;
  const randomMinutes = Math.floor(Math.random() * (maxMinutes + 1));
  const randomSeconds = Math.floor(Math.random() * 60); // Random seconds (0 to 59)
  const formattedTime = `${randomMinutes}:${randomSeconds < 10 ? '0' : ''}${randomSeconds}`;

  
  useEffect(() => {
    const fetchData = async () => {
      if (!dataFetched) {
        if (artistid !== null) {
          try {
            const artistResponse = await axios.get(`http://localhost:5000/artist/${artistid}`);
            setArtistName(artistResponse.data.artistname);
          } catch (error) {
            console.error(`Error fetching artist name for ID ${artistid}:`, error);
            setArtistName('-'); // Handle the error gracefully
          }
        } else {
          setArtistName('-');
        }
  
        if (albumid !== null) {
          try {
            const albumResponse = await axios.get(`http://localhost:5000/albums/${albumid}`);
            setAlbumName(albumResponse.data.albumname);
          } catch (error) {
            console.error(`Error fetching album name for ID ${albumid}:`, error);
            setAlbumName('-'); // Handle the error gracefully
          }
        } else {
          setAlbumName('-');
        }
  
        setDataFetched(true); // Mark the data as fetched
      }
    };
  
    fetchData();
  }, [artistid, albumid, dataFetched]);
  
  // const handleLinkClick = (event, link) => {
  //   if (link === 'artist' || link === 'album') {
  //     return; // Prevent audio playback when clicking on Artist or Album links
  //   }

  //   console.log('Calling onSelectTrack with:', track);
  //   onSelectTrack(track);
  // };

  const handleCardClick = () => {
    onSelectTrack(track.location);
  };

  let trackCardStyle;

  if (track.selected) {
    trackCardStyle = styles.selected;
  } else {
    trackCardStyle = styles.notSelected;
  }

  

  return (
    <div className={`${styles.AlbumPageTrackCard} ${trackCardStyle}  ${isSelected ? styles.selected : ''}`} onClick={handleCardClick}>
      <div className={styles.info}>
        <div className={styles.trackNumber}> { trackNumber } </div>
        <div className={styles.title}> { title } </div>
      </div>
      {/* <div className={styles.plays}>{randomPlays}</div> */}
      <div className={styles.formattedTime}>{formattedTime}</div>
    </div>
  );
};

export default AlbumPageTrackCard;

