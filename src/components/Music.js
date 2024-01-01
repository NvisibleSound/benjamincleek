import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Music.module.css';
import AlbumPage from './AlbumPage.js';

const Music = () => {
  const [albums, setAlbums] = useState([]);
  const [albumid, setAlbumid] = useState(null);


  console.log("!!!!! ALBUMS", albums)
  useEffect(() => {
    // Hardcode artistid to 1 for demonstration
    const artistid = 3;

    axios.get(`http://localhost:5000/albums/artistid/${artistid}`)
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.error("Error fetching albums:", error);
      });
  }, []); 

  const handleAlbumClick = (albumid) => {
    setAlbumid(albumid); // Set the selected album id in the state
  };

  console.log("MUSIC albumidd!!!!!!", albumid)


  return (
    <div>
      <div className={styles.Music}>
        <div className={styles.albumThumb}>
          {albums.map(album => (
            <div key={album.id} className={styles.row1} onClick={() => handleAlbumClick(album.id)}>
              <div className={styles.albumPhoto}>
                <img src={album.fileurl} alt={album.albumname} className={styles.customizeAlbumPhoto}/>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.player}>
          {albumid && <AlbumPage albumid={albumid} />}
        </div>
      </div>
      {/* <div className={styles.albums}>
        {albums.map(album => (
          <div key={album.id} className={styles.row1} onClick={() => handleAlbumClick(album.id)}>
            <div className={styles.fakeNewsCard}>
              <img src={album.fileurl} alt={album.albumname} />
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Music;
