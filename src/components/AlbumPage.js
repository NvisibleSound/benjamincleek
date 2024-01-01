import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './albumPage.module.css';
import AlbumPageAlbumPhoto from './AlbumPageAlbumPhoto';
import { LuListMusic } from "react-icons/lu"
import { IoBookOutline } from "react-icons/io5"
import { LiaPhotoVideoSolid, LiaDonateSolid } from 'react-icons/lia'
import { GoBroadcast } from "react-icons/go"
import AlbumPageTrackCard from './AlbumPageTrackCard';
import ReactPlayer from 'react-player'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Container, Row, Col } from 'react-bootstrap'



const AlbumPage = ({ artistid, albumid }) => {
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
      <div className={styles.album}>
        <div className={styles.header}>
          <div className={styles.Playbar}>
            <AudioPlayer
              ref={audioPlayerRef}
              src={selectedTrack}
              className={styles.rhap_container}
              layout="horizontal-reverse"
              autoPlay
              customAdditionalControls={[]}
              customVolumeControls={[]}
              showJumpControls={false}            
              header={`${currentTitle}`}
              onEnded={() => {
                console.log('onEnded');
                handleNextTrack();
              }}
              onClickPrevious={() => {
                console.log('onClickPrevious');
                handleNextTrack();
              }}
              onClickNext={() => {
                console.log('onClickNext - selectedTrack:', selectedTrack);
                handleNextTrack();
              }}
            />
          </div>
        </div>

        <div className={styles.column1}>
          <div className={styles.albumCard}>
            <img src={album.fileurl} alt={album.albumname} className={styles.customizeAlbumPhoto}/>
            <div className={styles.albumInfo}>
              <div className={styles.albumName}> 
                {album.albumname} 
              </div>
              <div className={styles.info}>
                <div className={styles.releasedate}>
                  * {album.releasedate}
                </div>
                <div className={styles.trackCount}>
                  * 12 tracks
                </div>
                <div className={styles.runtime}>
                  * 38 min 40 sec
                </div>
              </div>
              <div className={styles.links}>             
                <div className={styles.linerNotes}>
                  <Link to={`/LinerNotes/${albumid}`}>
                    {/* <IoBookOutline/> */}
                  </Link>
                </div> 
              </div>
            </div>         
          </div>

        </div>
        
        <div className={styles.tracks}>
          {trackData.map((track, index) => (
            <AlbumPageTrackCard
              key={track.id}
              track={track}
              artistid={track.artistid}
              albumid={track.albumid}
              title={track.title}
              plays={track.plays}
              time={track.time}
              trackNumber={getTrackNumber(index)}
              isSelected={selectedTrack === (track.location.fileurl || track.location)}
              onSelectTrack={() => {
                handleSelectTrack(track.location, track.title);
              }}
            />
          ))}
        </div>
        <div className={styles.footer}>
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
        </div>
      </div>
    );
  };

  export default AlbumPage;