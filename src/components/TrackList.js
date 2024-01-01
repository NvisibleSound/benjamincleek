import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './trackList.module.css';

const Track = (props) => (
  <tr>
    <td className={styles.title}>{props.track.title}</td>
    <td>{props.track.artistid}</td>
    <td>{props.track.releasedate}</td>
    <td>{props.track.albumid}</td>
    <td>{props.track.genres}</td>
    <td>{props.track.tags}</td>
    <td>{props.track.credits}</td>
    <td>
      <Link to={`/TrackEdit/${props.track.id}`}>EditTrack</Link> |{' '}
      <a href="#" onClick={() => props.deleteTrack(props.track.id)}>
        delete
      </a>
    </td>
  </tr>
);

export default function TrackList() {
  const [tracks, setTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tracks/');
        setTracks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect will only run once when the component mounts

  const deleteTrack = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tracks/${id}`);
      setTracks((prevTracks) => prevTracks.filter((el) => el.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.trackList}>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th className={styles.title}>Title</th>
            <th>Artist</th>
            <th>Release Date</th>
            <th>Album</th>
            <th>Genres</th>
            <th>Tags</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {tracks
            .filter((currentTrack) => currentTrack.artistid === '1') // Filter tracks by artistid
            .map((currentTrack) => (
              <Track
                track={currentTrack}
                artist={currentTrack.artist}
                album={currentTrack.album}
                deleteTrack={deleteTrack}
                key={currentTrack.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
