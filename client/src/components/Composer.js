import React, { useState } from 'react';
import styles from './Composer.module.css';
import { IoPlay } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import { v4 as uuidv4 } from 'uuid';
import { IoCloseOutline } from "react-icons/io5";


const videos = [
  {
    id: 1,
    title: 'Two Funerals',
    videoUrl: 'https://vimeo.com/856621282',
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/fd01a78b-5524-40d9-bcd8-c03d77a69616-TFAAF%20-%20Two%20Funerals%20poster.png',
    style: {
      width: '25vw',
      height: 'auto',
      backgroundColor: '',
    },
  },
  {
    id: 3,
    title: 'The Mad Ones',
    videoUrl: 'https://vimeo.com/685250353', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/bc2689f6-568e-4b4c-9558-c1ebf902ac4f-The%20Mad%20Ones.jpg',
    style: {
      width: '25vw',
      height: 'auto',
      backgroundColor: '',
    },
  },
  {
    id: 2,
    title: 'Common Threads',
    videoUrl: 'https://vimeo.com/14141165', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/41dadb8c-e0a6-4116-9592-c43d4a88da17-Common%20Threads.jpg',
    style: {
      width: '25vw',
      height: 'auto',
      backgroundColor: '',
    },
  },
  {
    id: 7,
    title: 'Evolution of Evil',
    videoUrl: 'https://www.youtube.com/watch?v=-CXvgPWSKdc', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/14fb56fe-f6ad-47aa-b990-237eab96ead9-Evolution%20of%20Evil.png',
    style: {
      width: '400px',
      height: 'auto',
      backgroundColor: '',
    },
  },
  {
    id: 5,
    title: 'Spring',
    videoUrl: 'https://www.youtube.com/watch?v=732w9e0MXzA&t=11s', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/c037d95b-2a81-462f-bd99-af673b7a1c76-Screen%20Shot%202021-10-13%20at%2012.15.54%20PM.png',
    style: {
      width: '45vw',
      height: '50vh',
      marginLeft: "3vw",
      backgroundColor: '',
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
    id: 11,
    title: 'Sliding Scale',
    videoUrl: 'https://www.youtube.com/watch?v=-YEDn6mSKJg', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/2e2fd6dc-9e34-426a-a578-265dff8cabde-Sliding%20Scale.png',
    style: {
      width: '35vw',
      height: 'auto',
      marginLeft:"2vw",
      backgroundColor: '',
    },
  },

  {
    id: 6,
    title: 'House of Greeting Cards',
    videoUrl: 'https://vimeo.com/130605743', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/246bc3d7-ce37-4171-8360-bccb2baee84c-Screen%2520Shot%25202020-08-09%2520at%252012.55_edited%20%281%29.jpg',
    style: {
      width: '35vw',
      height: 'auto',
      marginLeft:"13vw",
      backgroundColor: '',
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
    id: 8,
    title: 'ECT',
    videoUrl: 'https://www.youtube.com/watch?v=9iuB0r2UQvg', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/11fcef49-babe-420c-a350-45251df369ce-ECT%20Text.jpg',
  },
  {
    id: 9,
    title: 'ECT',
    videoUrl: 'https://www.youtube.com/watch?v=9iuB0r2UQvg', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/7cdf46f7-09bc-4e61-a71a-752534dfb392-ECT%20Machine.png'
  },
  {
    id: 10,
    title: 'ECT',
    videoUrl: 'https://www.youtube.com/watch?v=9iuB0r2UQvg', 
    thumbnail: 'https://benjamincleek.s3.us-west-2.amazonaws.com/photos/cf0823c9-6853-447c-92a5-f4f8075857b8-ECT%20-%20Electroconvulsive.jpg'
  },
  
];


// ... (other imports)

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const Composer = () => {
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
    <div className={styles.composer}>
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

export default Composer;
