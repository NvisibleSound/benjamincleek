import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './trackList.module.css';

const Video = (props) => (
  <tr>
    <td className={styles.title}>{props.track.title}</td>
    <td>{props.track.artistid}</td>
    <td>{props.track.releasedate}</td>
    <td>{props.track.albumid}</td>
    <td>{props.track.genres}</td>
    <td>{props.track.tags}</td>
    <td>{props.track.credits}</td>
    <td>
      <Link to={`/VideoEdit/${props.track.id}`}>EditVideo</Link> |{' '}
      <a href="#" onClick={() => props.deleteVideo(props.track.id)}>
        delete
      </a>
    </td>
  </tr>
);

export default function VideoList() {
  const [tracks, setVideos] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/videos/');
        setVideos(response.data);
        console.log
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect will only run once when the component mounts

  const deleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tracks/${id}`);
      setVideos((prevVideos) => prevVideos.filter((el) => el.id !== id));
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
            .filter((currentVideo) => currentVideo.artistid === '1') // Filter tracks by artistid
            .map((currentVideo) => (
              <Video
                track={currentVideo}
                artist={currentVideo.artist}
                album={currentVideo.album}
                deleteVideo={deleteVideo}
                key={currentVideo.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
