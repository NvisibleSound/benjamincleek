import React, { useState } from 'react';
import styles from './SoundDesign.module.css';
import { IoPlay } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import { v4 as uuidv4 } from 'uuid';
import { IoCloseOutline } from "react-icons/io5";


const videos = [
  {
    id: 2,
    title: 'Agnes Addington',
    website: 'https://bencleek.wixsite.com/benjamincleek/agnes-addington', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/e2819682-d654-4384-bc9a-06f791265780-The%20Side%20Hustle%20of%20Agnes%20Addington%20%281%29.jpg',
    style: {
      width: '25vw',
      height: 'auto',
    },
  },
  {
    id: 3,
    title: 'John Sunshine JSLRNRT',
    videoUrl: 'https://vimeo.com/686909888',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/d8b7462a-8e83-4343-bd2a-eb29205dde00-John%20Sunshine%20JSLRNRT%20poster.png',
    style: {
      width: '25vw',
      height: 'auto',
    },
  },

  {
    id: 4,
    title: 'Hotel Brand',
    videoUrl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/061b60ab-882c-4424-a454-254059a8f439-Hotel%20Brand%20-%20shot.png',
    style: {
      width: '25vw',
      height: 'auto',
      marginLeft: ''
    },
  },
  {
    id: 6,
    title: 'High Octane',
    videoUrl: 'https://www.youtube.com/watch?v=GyO1MtLhyt0',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/8e35be06-1e39-4e9a-ac09-8a14863c952b-Screen%20Shot%202023-12-29%20at%2010.18.48%20AM.png',
    style: {
      width: '35vw',
      height: '35vh',
    },
  },
  {
    id: 5,
    title: 'Slowly Quickly',
    videoUrl: 'https://vimeo.com/11598388',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/9d389432-1d25-4dfb-91bb-cc2083a246af-Screen%20Shot%202020-08-17%20at%207.42.00%20PM.png',
    style: {
      width: '600px',
      height: 'auto',
      marginLeft: '10vw'
    },
  },
  {
    id: 12,
    title: 'SPACE',
    videoUrl: '', 
    thumbnail: '',
    style: {
      width: '35vw',
      height: '35vh',
      marginLeft: "50vw",
      backgroundColor: '',
      
    },
  },
  {
    id: 1,
    title: 'Hello Goodbye',
    videoUrl: 'https://www.youtube.com/watch?v=J0IuKPfL3Ag', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/49037eb2-a4dc-4823-983e-c2d4e1ccc62a-Hello%20Goodbye.png',
    style: {
      width: '35vw',
      height: 'auto',
      backgroundColor: '',
    },
  },
  {
    id: 7,
    title: 'Tailbiter',
    videoUrl: 'https://vimeo.com/11598388',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/e2ffeb0c-6ab3-4401-b5c2-319dbf76ef5c-Tailbiter%20-%20Logo.png',
    style: {
      width: '25vw',
      height: 'auto',
      marginLeft: '10vw'
    },
  },


];

const SoundDesign = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (video) => {
    if (video.website) {
      window.open(video.website, '_blank');
    } else {
      setSelectedVideo(video);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className={styles.soundRecordist}>
      <div className={styles.videoThumbs}>
        {videos.map((video) => (
          <div key={uuidv4()} className={styles.videoCard} style={video.style} onClick={() => handleVideoClick(video)}>
            <IoPlay className={styles.playButton} />
            <img
              controls
              className={styles.videoImg}
              src={video.thumbnail}
              alt={`Video Thumbnail`}
              style={{ width: '100%', height: 'auto' }} // Adjust styling as needed
            />
          </div>
        ))}
        {selectedVideo && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              {selectedVideo.website ? (
                <a href={selectedVideo.website} target="_blank" rel="noopener noreferrer">
                  Open Website
                </a>
              ) : (
                <ReactPlayer
                  url={selectedVideo.videoUrl}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  controls
                  playing
                />
              )}
              <button
                onClick={handleCloseModal}
                className={styles.button}
              >
                <IoCloseOutline />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundDesign;