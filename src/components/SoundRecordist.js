import React, { useState } from 'react';
import styles from './SoundRecordist.module.css';
import { IoPlay } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import { v4 as uuidv4 } from 'uuid';
import { IoCloseOutline } from "react-icons/io5";


const videos = [
  {
    id: 1,
    title: 'Hello Goodbye',
    videoUrl: 'https://www.youtube.com/watch?v=J0IuKPfL3Ag', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/49037eb2-a4dc-4823-983e-c2d4e1ccc62a-Hello%20Goodbye.png',
    style: {
      width: '30vw',
      height: '35vh',
      backgroundColor: '',
    },
  },
  {
    id: 2,
    title: 'Buzzfeed',
    website: 'https://www.youtube.com/watch?v=5YnLBGf2bQs', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/79587ef6-dfa6-4dab-821b-99a372cef033-Buzzfeed%20-%20Elana.png',
    style: {
      width: '30vw',
      height: '35vh',
      marginLeft:'8vw'

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
    id: 4,
    title: 'The way to the heart',
    videoUrl: 'https://www.youtube.com/watch?v=9_oEBKsvMKE', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/363d5813-2703-48b6-87e3-212002f59cac-The%20way%20to%20the%20heart.png',
    style: {
      width: '300px',
      height: 'auto',
    },
  },
  {
    id: 5,
    title: 'Slowly Quickly',
    videoUrl: 'https://vimeo.com/11598388',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/9d389432-1d25-4dfb-91bb-cc2083a246af-Screen%20Shot%202020-08-17%20at%207.42.00%20PM.png',
    style: {
      width: '35vw',
      height: '35vh',
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
    id: 25,
    title: 'Somatic Healing',
    videoUrl: 'https://www.youtube.com/watch?v=dJY-w6NbuSc',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/abf7159f-1820-4780-91d2-5fee920ab6c5-Screen%20Shot%202023-12-29%20at%2010.33.12%20AM.png',
    style: {
      width: '35vw',
      height: 'auto',
    },
  },
  {
    id: 3,
    title: 'John Sunshine JSLRNRT',
    videoUrl: 'https://vimeo.com/686909888',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/d8b7462a-8e83-4343-bd2a-eb29205dde00-John%20Sunshine%20JSLRNRT%20poster.png',
    style: {
      width: '20vw',
      height: 'auto',
      marginLeft: '14vw',
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
    id: 2,
    title: 'Agnes Addington',
    website: 'https://bencleek.wixsite.com/benjamincleek/agnes-addington', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/e2819682-d654-4384-bc9a-06f791265780-The%20Side%20Hustle%20of%20Agnes%20Addington%20%281%29.jpg',
    style: {
      width: '25vw',
      height: 'auto',
    },
  },

];

const SoundRecordist = () => {
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

export default SoundRecordist;
