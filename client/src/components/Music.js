import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Music.module.css';
import AlbumPage from './AlbumPage.js';
import AlbumAbout from './AlbumAbout.js'; // Assuming you have an AlbumAbout component

const Music = () => {
  const [albums, setAlbums] = useState([]);
  const [albumid, setAlbumid] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  useEffect(() => {
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
    setAlbumid(albumid);
    setHoveredAlbum(null); // Clear hover state when an album is clicked
  };

  const handleAlbumHover = (albumid) => {
    setHoveredAlbum(albumid);
  };

  const handleAlbumLeave = () => {
    setHoveredAlbum(null);
  };

  return (
    <div>
      <div className={styles.Music}>
        <div className={styles.albumThumb}>
          {albums.map(album => (
            <div
              key={album.id}
              className={styles.albumContainer}
              onMouseEnter={() => handleAlbumHover(album.id)}
              onMouseLeave={handleAlbumLeave}
              >
              <img
                src={album.fileurl}
                alt={album.albumname}
                className={`${styles.customizeAlbumPhoto} ${hoveredAlbum === album.id ? styles.hoveredAlbum : ''}`}
                onClick={() => handleAlbumClick(album.id)}
              />
                                                  

              {hoveredAlbum === album.id && (
                <div className={styles.hoverContent}>
                  <AlbumAbout albumid={album.id} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.player}>
          {albumid && <AlbumPage albumid={albumid} />}
        </div>
      </div>
    </div>
  );
};

export default Music;
