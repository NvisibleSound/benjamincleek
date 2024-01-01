import React, { useState } from 'react';
import styles from './Composer.module.css';
import { IoPlay } from 'react-icons/io5';
import ReactPlayer from 'react-player';

const videos = [
  {
    id: 5,
    title: 'Lincoln City',
    fileurl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/008dc809-5fe8-46f7-9f22-e426a0257348-Lincoln%20City%20-%20Spring%20Break%202.png',
  },
  {
    id: 1,
    title: 'Two Funerals',
    fileurl: '',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/68243172-a636-4c65-9100-e7babbb55b81-Lincoln%20City%20Cultural%20Center%20Logo.png',
  },
  {
    id: 2,
    title: 'Antique Week',
    fileurl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/f9eaa8c4-b58c-43d3-a4c6-f3c0c0b6f828-Lincoln%20City%20-%20Antique%20Week%202.png',
  },
  {
    id: 3,
    title: 'Tailbiter',
    fileurl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/3827f034-7294-4cba-a59f-16668c407663-Tailbiter%20-%20Logo.png',
  },
  {
    id: 4,
    title: 'Buzzfeed',
    fileurl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/72370bb4-d638-4ce8-bdb4-7fa4ff1e82ea-Buzzfeed%20Presents%20-%20logo.png',
  },
  {
    id: 6,
    title: 'House of Greeting Cards',
    fileurl: '', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/a18dbe33-248c-4932-9aab-59426f31a2e2-adidas%20paris.png',
  },
];


const Commercial = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className={styles.composer}>
      <div className={styles.videoThumbs}>
        {videos.map((video) => (
          <div key={video.id} className={styles.videoCard} onClick={() => handleVideoClick(video)}>
            <IoPlay className={styles.playButton} />
            <img className={styles.videoImg} src={video.thumbnail} alt={video.title} />
          </div>
        ))}
      </div>
      {selectedVideo && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <ReactPlayer url={selectedVideo.fileurl} controls />
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commercial;
