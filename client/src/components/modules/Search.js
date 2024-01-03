import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { IoSearchOutline } from 'react-icons/io5';
import axios from 'axios';
import styles from './Search.module.css';
import LibraryTrackCard from '../LibraryTrackCard';
import ArtistPic from '../Artist/ArtistPic';
import AlbumPic from '../Artist/AlbumPic';
import { Link } from 'react-router-dom';

const Search = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [albumResults, setAlbumResults] = useState([]);

  const handleSelectTrack = (selectedTrack) => {
  };

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleInputChange = async (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    try {
      if (newQuery) {
        const tracksResponse = await axios.get('http://localhost:5000/tracks', { params: { query: newQuery } });
        const artistsResponse = await axios.get('http://localhost:5000/artist', { params: { query: newQuery } });
        const albumsResponse = await axios.get('http://localhost:5000/albums', { params: { query: newQuery } });

        console.log('Tracks Response:', tracksResponse.data);
        console.log('Artists Response:', artistsResponse.data);
        console.log('Albums Response:', albumsResponse.data);

        setTrackResults(tracksResponse.data);
        setArtistResults(artistsResponse.data);
        setAlbumResults(albumsResponse.data);
      } else {
        setTrackResults([]);
        setArtistResults([]);
        setAlbumResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchContainer}>
        <TextField
          variant="outlined"
          style={{ flex: 1 }}
          value={query}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <div className={styles.searchIcon} onClick={toggleInputVisibility}>
                <IoSearchOutline />
              </div>
            ),
          }}
        />
      </div>
      {trackResults.length > 0 && (
        <div>
          <h3>Tracks:</h3>
          <div>
            {trackResults.map((track) => (
              <div key={`track-${track.id}`}>
                {track.title && (
                    <LibraryTrackCard
                      track={track}
                      title={track.title}
                      artistId={track.artistId}
                      artistname={track.artistname}
                      albumId={track.albumId}
                      albumname={track.albumname}
                      onSelectTrack={handleSelectTrack}
                    />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.searchResults}>
        {artistResults.length > 0 && (
          <div className={styles.compartment}>
            <h3>Artists:</h3>
            <div className={styles.artist}>
              {artistResults.map((artist) => (
                <div key={`artist-${artist.id}`} className={styles.artistCard}>
                  <div className={styles.artistname}>
                    <Link to={`/artists/${artist.id}`}>
                      {artist.artistname} (ID: {artist.id})
                    </Link>
                  </div>
                  <ArtistPic fileurl={artist.fileurl} />
                </div>
              ))}
            </div>
          </div>
        )}
        {albumResults.length > 0 && (
          <div className={styles.compartment}>
            <h3>Albums:</h3>
            <div className={styles.albums}>
              {albumResults.map((album) => (
                <div key={`album-${album.id}`} className={styles.albumCard}>
                  <div className={styles.albumname}>
                    <Link to={`/albums/${album.id}`}>
                      {album.albumname} (ID: {album.id})
                    </Link>
                  </div>
                  <div className={styles.albumCard}>
                    <AlbumPic fileurl={album.fileurl} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
