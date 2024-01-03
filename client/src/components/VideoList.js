import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GenresFilter from './dropdowns/GenresFilter';
import TagsFilter from './dropdowns/TagsFilter';
import styles from './videoList.module.css';
import VideoUploader from './VideoUploader';
import VideoListCard from './VideoListCard';
import ReactPlayer from 'react-player'

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [videoName, setVideoName] = useState('');
  const reactPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    let url = 'http://localhost:5000/videos/';

    try {
      const response = await axios.get(url);
      setVideos(response.data);
    } catch (error) {
      console.log('Error while fetching videos:', error);
    }
  }

  const deleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/videos/${id}`);
      setVideos((prevVideos) => prevVideos.filter((el) => el.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectVideo = (location) => {
    console.log('Selected location URL:', location);
    setSelectedVideo(location);
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  return (
    <div className={styles.videos}>
      <div> 
        <VideoUploader
        onUploadSuccess={(name, location, key) => {
          // Handle the upload success here
          console.log('Uploaded successfully:', name, location, key);
        }}
        />

      </div>
      <ReactPlayer
        ref={reactPlayerRef}
        url={selectedVideo}
        controls
        playing={isPlaying}
        onPlay={() => {
          console.log('ReactPlayer is playing.'); 
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('ReactPlayer is paused.');
          setIsPlaying(false);
        }}
        onEnded={() => {
          const nextVideoIndex = videoData.findIndex((video) => video.location === selectedVideo) + 1;
          if (nextVideoIndex < videoData.length) {
            handleSelectVideo(videoData[nextVideoIndex].location);
          }
        }}
      />
      <div>
        {videos.map((currentVideo) => (
          <VideoListCard
            key={currentVideo.id}
            location={currentVideo.location}
            name={currentVideo.name}
            onSelectVideo={() => handleSelectVideo(currentVideo.location)}
            isSelected={selectedVideo === currentVideo.location}
          />
        ))}
      </div>
    </div>
  );
}
