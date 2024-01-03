import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import styles from './AlbumAbout.module.css';

import AlbumPageTrackCard from './AlbumPageTrackCard';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';



const AlbumAbout = ({ artistid, albumid }) => {
  const [trackData, setTrackData] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState('');
  const audioPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  
  const getTrackNumber = (index) => {
    return index + 1;
  };
  
  const [album, setAlbum] = useState({
    id: '',
    fileurl: '',
    albumname: '',
    artistname: '',
    releasedate: '',
    trackids: '',
    genres: '',
    tags: '',
    credits: '',
  });




  useEffect(() => {
    const albumUrl = `http://localhost:5000/albums/${albumid}`;
  
    axios.get(albumUrl)
      .then(({ data }) => {
        setAlbum(data);
        const trackidRegex = /"(\d+)"/g;
        const tracksString = data.trackids || ''; 
        const parsedTrackids = Array.from(
          tracksString.matchAll(trackidRegex),
          (match) => parseInt(match[1])
        );
  
        const promises = parsedTrackids.map((trackids) => {
          const trackUrl = `http://localhost:5000/tracks/${trackids}`;
          return axios.get(trackUrl);
        });
  
        Promise.all(promises)
          .then((responses) => {
            const trackDetails = responses.map((response, index) => ({
              ...response.data,  // Spread all properties from the original track
              index: index + 1,
            }));

            setTrackData(trackDetails);
            setSelectedTrack(trackDetails[0]?.location?.fileurl || '');

          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [albumid]);
  

  const handleSelectTrack = (location, title) => {
    console.log('Selected Track:', location.fileurl || location);
    setSelectedTrack(location.fileurl || location);
    setCurrentTitle(title);

  };
  
  const handleNextTrack = () => {
    const currentTrackIndex = trackData.findIndex(
      (track) => track.location.fileurl === selectedTrack
    );
    
    const nextTrackIndex = currentTrackIndex + 1;
  
    if (nextTrackIndex >= 0 && nextTrackIndex < trackData.length) {
      const nextTrackLocation = trackData[nextTrackIndex].location.fileurl;
      setSelectedTrack(nextTrackLocation);
    }
  };
  
  
  

    return (
      <div className={styles.about}>
        <div className={styles.albumName}> 
          {album.albumname} 
        </div>
        <div className={styles.description}> 
          {album.description} 
        </div>
       
      </div>  
    );
  };

  export default AlbumAbout;


    {/* <div className={styles.genres}>
            Genres:
            {album.genres}
          </div>
          <div className={styles.tags}>
            tags:
            {album.tags}
          </div>
          <div className={styles.credits}>
            credits:
            {album.credits}
          </div> */}